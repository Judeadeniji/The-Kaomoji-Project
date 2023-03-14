require("dotenv").config();
const fs = require("fs");
const axios = require("axios");

const size = "512x512";
const response_format = "url";
const description =
  "any random human reactions";
const model_engine = "image-alpha-001";
const num_outputs = 5;

const generateKaomoji = async () => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: model_engine,
        prompt: ` "${'Kaomoji'}"`,
        size: size,
        response_format: response_format,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        },
      }
    );

    const results = await Promise.all(
      response.data.data.map(async (data, index) => {
        const image_url = data.url;
        const filename = `kaomoji-${Math.ceil(Math.random() * 1024*32)}-65.png`;
        const filepath = "./generated/" + filename;

        const image_response = await axios({
          method: "get",
          url: image_url,
          responseType: "stream",
        });

        image_response.data.pipe(fs.createWriteStream(filepath));
        console.log(`Image saved as ${filepath}`);

        return { filename};
      })
    );

    console.log("Results:", results);
  } catch (error) {
    console.error(error);
  }
};

for (let i = 0; i < num_outputs; i++) {
  generateKaomoji();
}
