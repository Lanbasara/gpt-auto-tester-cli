var axios = require("axios");
const { getPlantCode } = require("./getCodeFromText");
module.exports = async function getResFromAi(code,{
  cookie,
  prompt = 'You are a frontend developer working with React, please write out the test case code for code above, just output the code'
}) {
  var data = JSON.stringify({
    id: "99dc077f-8387-4bbb-994c-be5fb432e235",
    context: {
      type: "helpMeWrite",
      pageTitle: "React",
      previousContent: `\`\`\`js${code} \n\`\`\`\``,
      restContent: "",
      prompt
    },
    model: "openai-3",
    spaceId: "2a70c789-c71f-4e8f-bc49-1ddd6c28cc3b",
    isSpacePermission: false,
  });

  var config = {
    method: "post",
    url: "https://www.notion.so/api/v3/getCompletion",
    headers: {
      authority: "www.notion.so",
      accept: "application/x-ndjson",
      "accept-language": "zh-CN,zh;q=0.6",
      "notion-audit-log-platform": "web",
      "notion-client-version": "23.12.0.59",
      origin: "https://www.notion.so",
      referer:
        "https://www.notion.so/eri-guo/React-1dd4d2fbd93143afbdb1cff54d98b9b4",
      "sec-ch-ua": '"Chromium";v="112", "Brave";v="112", "Not:A-Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      "x-notion-active-user-header": "a0b772f0-fcc6-4666-b9be-e0dcd3ccc204",
      Cookie: cookie,
      "content-type": "application/json",
    },
    timeout: 40000,
    data: data,
  };

  const res = await axios(config)
    .then(function (response) {
      // fs.writeFileSync(
      //   path.join(__dirname, "../assets/response"),
      //   response.data,
      //   { encoding: "utf-8" }
      // );

      return getPlantCode(response.data)
    })
    .catch(function (error) {
      console.log('Get code from ai api error',error);
    });

  return res;
};
