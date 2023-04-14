#!/usr/bin/env node
const commander = require("commander");
const { cosmiconfigSync } = require("cosmiconfig");
const glob = require("glob");
const fsPromises = require("fs").promises;
const path = require("path");
const getResFromAi = require("./getTestCodeFromAi");
const WaitForTimer = require("./waitTimer");
const mkdirsSync = require("../generator/mkdir");
const { config } = require("dotenv");

config();

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
const filenames = glob.sync(path.join(process.cwd(), commander.args[0]));

const root = path.join(process.cwd(), /^(\w+)/.exec(commander.args[0])[1]);
// 使用cosmiconfigSync读取配置
const explorerSync = cosmiconfigSync("my-compile");
const searchResult = explorerSync.search();

const options = {
  openaiConfig: {
    key: process.env.OWN_AI_COOKIE,
  },
  cliOptions: {
    ...cliOpts,
    filenames,
  },
};

(async function compile(fileNames, root, cwd) {
  for (filename of fileNames) {
    const fileContent = await fsPromises.readFile(filename, "utf-8");
    const baseFileName = path.basename(filename);
    const newFileName = baseFileName.replace(/(\w+)\.(\w+)/, `$1.test.$2`);
    let newFileDir = path.join(root, newFileName);
    const reg = new RegExp(`${root}/(.*?)/${baseFileName}`);
    const relative = reg.exec(filename);
    if (relative && relative[1]) {
      newFileDir = path.join(root, relative[1], newFileName);
    }
    const distFilePath = path.join(options.cliOptions.outDir, newFileDir);
    const targetReg = new RegExp(`${options.cliOptions.outDir}(${cwd})/(.*)`);
    const targetRelative = targetReg.exec(distFilePath)[2];
    const targetPath = path.join(
      options.cliOptions.outDir,
      "/",
      targetRelative
    );

    const generatedCode = await getResFromAi(fileContent, {
      cookie: options.openaiConfig.key,
    });

    await WaitForTimer(30000);

    const fPath = path.dirname(targetPath);
    try {
      await fsPromises.access(fPath);
    } catch (e) {
      mkdirsSync(fPath);
    }


    await fsPromises.writeFile(targetPath, generatedCode, {
      encoding: "utf-8",
    });

    // await fsPromises.writeFile(distFilePath, testCode, {
    //   encoding: "utf-8",
    // });
  }
})(options.cliOptions.filenames,root,process.cwd())
