/**
 * opneai-key is not available because of free plan or net connect
 */

const { Configuration, OpenAIApi } = require('openai')
const {config} = require('dotenv')

config()

const options = {
  openaiConfig : {
    key : process.env.API_KEY
  }
};

const openai = new OpenAIApi(new Configuration({
  apiKey : options.openaiConfig.key
}))


openai.createChatCompletion({
  model : "gpt-3.5-turbo",
  messages : [{
    role : "user",
    content : "Hello GPT"
  }]
}).then(response => {
  console.log(response.data.choices[0].message)
})
