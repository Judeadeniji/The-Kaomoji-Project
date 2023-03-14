require("dotenv").config();
const fs = require("fs");
const axios = require("axios");

const size = "512x512";
const response_format = "url";
const description =
  "a ANSCII text art of a cute cat with a smile wearing a party hat and holding a slice of pizza";
const model_engine = "image-alpha-001";
const num_outputs = 5;

const generateKaomoji = async () => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: model_engine,
        prompt: `Generate an illustrative Kaomoji text art for "${description}"`,
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
        console.log(`Image ${index + 1}: ${image_url}`);

        const filename = `kaomoji-${Math.random() * 6}.png`;
        const filepath = "./generated/" + filename;

        const image_response = await axios({
          method: "get",
          url: image_url,
          responseType: "stream",
        });

        image_response.data.pipe(fs.createWriteStream(filepath));
        console.log(`Image saved as ${filepath}`);

        const kaomoji_text = response.data.choices[index].text.trim();
        return { image_url, kaomoji_text };
      })
    );

    console.log("Results:", results);
  } catch (error) {
    console.error(error);
  }
};

generateKaomoji();
