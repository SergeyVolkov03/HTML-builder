const path = require("path");
const { mkdir, readdir, copyFile, access, rm } = require("fs/promises");

async function createDir() {
  const folderPath = path.join(__dirname, "files");
  const copyFolderPath = path.join(__dirname, "files-copy");
  try {
    await access(copyFolderPath);
    await rm(copyFolderPath, { recursive: true });
  } catch (err) {}
  await mkdir(copyFolderPath, { recursive: true });
  try {
    const files = await readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);
      await copyFile(filePath, copyFilePath);
    }
  } catch (err) {}
}
createDir();
