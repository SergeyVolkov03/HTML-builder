const path = require("path");
const { mkdir, readdir, copyFile } = require("fs/promises");

async function createDir() {
  const folderPath = path.join(__dirname, "files");
  const copyFolderPath = path.join(__dirname, "files-copy");
  await mkdir(copyFolderPath, { recursive: true });
  try {
    const files = await readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);
      await copyFile(filePath, copyFilePath);
    }
  } catch (err) {
    console.error(err);
  }
}
createDir();
