const path = require("path");
const { readdir, readFile, writeFile } = require("fs/promises");

async function createCssBundle() {
  const folderPath = path.join(__dirname, "styles");
  try {
    const files = await readdir(folderPath);
    let allData = "";
    for (const file of files) {
      fileExtension = file.split(".").pop();
      if (fileExtension !== "css") continue;
      const filePath = path.join(folderPath, file);
      const fileData = await readFile(filePath, { encoding: "utf-8" });
      allData += fileData;
    }
    const bundlePath = path.join(__dirname, "project-dist", "bundle.css");
    await writeFile(bundlePath, allData);
  } catch (err) {
    console.error(err);
  }
}
createCssBundle();