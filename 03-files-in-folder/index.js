const { readdir, stat } = require("fs/promises");
const path = require("path");

const folderPath = path.join(__dirname, "secret-folder");
async function readFiles() {
  try {
    const files = await readdir(folderPath);
    console.log(files);
    for (const file of files) {
      const [fileName, fileExtention] = file.split(".");
      const fileStat = await stat(path.join(folderPath, file));
      if (fileStat.isFile()) {
        console.log(`${fileName} - ${fileExtention} - ${fileStat.size}b`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
readFiles();
