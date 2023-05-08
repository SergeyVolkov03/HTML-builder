const path = require("path");
const {
  readdir,
  readFile,
  writeFile,
  mkdir,
  copyFile,
  stat,
} = require("fs/promises");

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
    const bundlePath = path.join(__dirname, "project-dist");
    const filePath = path.join(bundlePath, "style.css");
    await mkdir(bundlePath, { recursive: true });
    await writeFile(filePath, allData);
  } catch (err) {
    console.error(err);
  }
}

async function createHtml() {
  const htmlPath = path.join(__dirname, "template.html");
  const htmlBundlePath = path.join(__dirname, "project-dist", "index.html");
  let data = await readFile(htmlPath, { encoding: "utf-8" });
  const templateStrings = [...data.matchAll(/{{[a-z0-9]+}}/gi)];
  for (let i = 0; i < templateStrings.length; i++) {
    const templateName = templateStrings[i][0].slice(
      2,
      templateStrings[i][0].length - 2
    );
    const componentsPath = path.join(
      __dirname,
      "components",
      `${templateName}.html`
    );
    const componentsData = await readFile(componentsPath, {
      encoding: "utf-8",
    });
    data = data.replaceAll(templateStrings[i][0], componentsData);
  }
  await writeFile(htmlBundlePath, data);
}

async function createDir() {
  const folderPath = path.join(__dirname, "assets");
  const copyBaseFolderPath = path.join(__dirname, "project-dist", "assets");
  try {
    const folderArray = [folderPath];
    while (folderArray.length > 0) {
      const currentFolder = folderArray.pop();
      const arrayPath = currentFolder.split("\\");
      const newPathPart = arrayPath.slice(arrayPath.indexOf("assets") + 1);
      const copyFolderPath = path.join(
        copyBaseFolderPath,
        newPathPart.join("\\")
      );
      await mkdir(copyFolderPath, { recursive: true });
      const files = await readdir(currentFolder);
      for (const file of files) {
        const statFile = await stat(path.join(currentFolder, file));
        if (statFile.isFile()) {
          const filePath = path.join(folderPath, newPathPart.join("\\"), file);
          const copyFilePath = path.join(copyFolderPath, file);
          await copyFile(filePath, copyFilePath);
        } else {
          folderArray.push(path.join(currentFolder, file));
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

createCssBundle();
createHtml();
createDir();
