var axios = require("axios");
const getCodeFromText = require("./getCodeFromText");
const fs = require("fs");
const path = require("path");
module.exports = async function getResFromAi(code,openai) {
  var data = JSON.stringify({
    id: "99dc077f-8387-4bbb-994c-be5fb432e235",
    context: {
      type: "helpMeWrite",
      pageTitle: "React",
      previousContent: `\`\`\`js${code} \n\`\`\`\``,
      restContent: "",
      prompt:
        "You are a frontend developer working with React, please write out the test case code for code above, just output the code",
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
      Cookie:
        "token_v2=v02%3Auser_token_or_cookies%3AKruwnci1b1t_yKVVzzhH1O0R6uFb0fWWekwIWD87e_7qxYdaJj8voThj422ikFuDdcMM5L2DY73-Br-YnNeMw2YS5M3ZnLlulYINnLTKf3JX2c-Rjwl7Jc4HqhEQRvpdvrsh; notion_user_id=a0b772f0-fcc6-4666-b9be-e0dcd3ccc204; notion_cookie_consent={%22id%22:%223c71db6b-92f6-4e97-821d-42cea5034697%22%2C%22permission%22:{%22necessary%22:true%2C%22targeting%22:false%2C%22preference%22:false%2C%22performance%22:false}%2C%22policy_version%22:%22v7%22}; notion_experiment_device_id=c07c0d76-5c5d-4a0c-b505-7d1631d23c35; NEXT_LOCALE=en-US; notion_users=[%22a0b772f0-fcc6-4666-b9be-e0dcd3ccc204%22]; notion_check_cookie_consent=true; notion_locale=en-US/legacy; __cf_bm=bihvbW.UaLQACeAGaHBRHbH4A2LCKPKpkThltk2aj6U-1681113821-0-AQiYnKu9BWUCVwXH8fYN6UEBIyHAPQFbspFK+NDFCQ1O15u62zH8aX5+T6c8aYiY1KLM/7yXB8DOmksVOaIm/7c",
      "content-type": "application/json",
    },
    timeout: 40000,
    data: data,
  };

  const res = await axios(config)
    .then(function (response) {
      fs.writeFileSync(
        path.join(__dirname, "../assets/response"),
        response.data,
        { encoding: "utf-8" }
      );

      return getCodeFromText(
        fs.readFileSync(path.join(__dirname, "../assets/response"), {
          encoding: "utf-8",
        })
      );
    })
    .catch(function (error) {
      console.log(error);
    });

  return res;
};
