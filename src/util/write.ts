import fs from "fs";
import chalk from "chalk";

/**
 * Create file
 * @param {string} content
 */
export function writeFile(content: string, fileName: string) {
  fileName = fileName.replaceAll(" ", "_");
  fileName = fileName + ".md";
  let folder = fileName.replace(/\/[^\/]+\/?$/, "");

  writeDirectory(folder);

  fs.writeFile(fileName, content, (err) => {
    if (err) {
      console.error(chalk.red(`Error when writing file ${fileName}`));
      console.error(err);
      throw err;
    }
    console.log(chalk.green(`File was created correctly ${fileName}`));
  });
}

/**
 * Create a directory recursively
 * @param {string} dirpath
 */

export function writeDirectory(dirpath: fs.PathLike) {
  console.log(dirpath);
  if (fs.existsSync(dirpath)) return;

  fs.mkdirSync(dirpath, {
    recursive: true,
  });
}

export default {
  writeFile,
  writeDirectory,
};
