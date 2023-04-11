#!/usr/bin/env node
const commander = require("commander");
const { cosmiconfigSync } = require("cosmiconfig");
const glob = require("glob");
const fsPromises = require("fs").promises;
const path = require("path");
const getResFromAi = require("./getTestCodeFromAi");
const { config } = require('dotenv')

config()

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


const options = {
  openaiConfig : {
    key : process.env.OWN_AI_COOKIE
  },
  cliOptions: {
    ...cliOpts,
    filenames,
  },
};


function compile(fileNames) {
  fileNames.forEach(async (filename) => {
    const fileContent = await fsPromises.readFile(filename, "utf-8");
    const baseFileName = path.basename(filename);
    const newFileName = baseFileName.replace(/(\w+)\.(\w+)/, `$1.test.$2`);

    console.log('generate test for', filename,'new Filename is',newFileName)
    console.count('generate test')

    const testCode = await getResFromAi(fileContent,{
      cookie : options.openaiConfig.key
    });

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
