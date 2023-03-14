require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const temperature = 0.8;
const max_tokens = 100;

const size = "512x512";
const response_format = "url";
const description =
  "a ANSCII text art of a cute cat with a smile wearing a party hat and holding a slice of pizza";
const model_engine = "image-alpha-001";
const num_outputs = 5;

axios
  .post(
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
  )
  .then((response) => {
    for (let i = 0; i < response.data.data .length; i++) {
      const image_url = response.data.data[i].url;
      console.log(`Image ${i + 1}: ${image_url}`);
      const filename = `kaomoji-${Math.random() * 6}.png`;
      const filepath = "./generated/" + filename;

     axios({
        method: "get",
        url: image_url,
        responseType: "stream",
      })
        .then(function (response) {
          response.data.pipe(fs.createWriteStream(filepath));
        /*  const kaomoji_text = response.data.choices[0].text.trim();
          console.log(kaomoji_text); */
          console.log(`Image saved as ${filepath}`);
        })
        .catch(function (error) {
          console.error(error);
        });

      const kaomoji_text = response.data;
      console.log(`Text Art ${i + 1}: ${JSON.stringify(kaomoji_text)}`);
    }
  });
