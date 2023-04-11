#!/usr/bin/env node
const commander = require("commander");
const { cosmiconfigSync } = require("cosmiconfig");
const glob = require("glob");
const fsPromises = require("fs").promises;
const path = require("path");
const getResFromAi = require("./getTestCodeFromAi");
const { Configuration, OpenAIApi } = require('openai')

commander.option("--out-dir <outDir>", "输出目录");
commander.option("--watch", "监听文件变动");

if (process.argv.length <= 2) {
  commander.outputHelp();
  process.exit(0);
}

// 解析命令参数
commander.parse(process.argv);
const cliOpts = commander.opts();

if (!commander.args[0]) {
  console.error("没有指定待编译文件");
  commander.outputHelp();
  process.exit(1);
}
if (!cliOpts.outDir) {
  console.error("没有指定输出目录");
  commander.outputHelp();
  process.exit(1);
}

if (cliOpts.watch) {
  const chokidar = require("chokidar");

  // chokidar.watch支持glob匹配
  chokidar.watch(commander.args[0]).on("all", (event, path) => {
    console.log("检测到文件变动，编译：" + path);
    compile([path]);
  });
}

// 使用glob模糊匹配所有的文件
const filenames = glob.sync(commander.args[0]);

// 使用cosmiconfigSync读取配置
const explorerSync = cosmiconfigSync("my-compile");
const searchResult = explorerSync.search();

console.log("searchResult is", searchResult);

const options = {
  openaiConfig : {
    key : searchResult.config.OPENAI_API_KEY
  },
  cliOptions: {
    ...cliOpts,
    filenames,
  },
};


const openai = new OpenAIApi(new Configuration({
  apiKey : options.openaiConfig.key
}))


function compile(fileNames) {
  fileNames.forEach(async (filename) => {
    const fileContent = await fsPromises.readFile(filename, "utf-8");
    const baseFileName = path.basename(filename);
    const newFileName = baseFileName.replace(/(\w+)\.(\w+)/, `$1.test.$2`);

    // const { data: tempCode } = await axios
    //   .get("http://127.0.0.1:4523/m1/2502546-0-default/index")
    //   .then(function (response) {
    //     return response.data;
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   });

    const testCode = await getResFromAi(fileContent,openai);

    const distFilePath = path.join(options.cliOptions.outDir, newFileName);

    try {
      await fsPromises.access(options.cliOptions.outDir);
    } catch (e) {
      await fsPromises.mkdir(options.cliOptions.outDir);
    }
    await fsPromises.writeFile(distFilePath, testCode, {
      encoding: "utf-8",
    });
  });
}

compile(options.cliOptions.filenames);
