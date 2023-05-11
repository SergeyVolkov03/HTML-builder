const path = require("path");
const {
  readdir,
  readFile,
  writeFile,
  mkdir,
  copyFile,
  stat,
  access,
  rm,
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

async function copyFolders(folder, copyFolder) {
  const files = await readdir(folder);
  for (let file of files) {
    const fileStat = await stat(path.join(folder, file));
    if (fileStat.isFile()) {
      await copyFile(path.join(folder, file), path.join(copyFolder, file));
    } else {
      await mkdir(path.join(copyFolder, file));
      await copyFolders(path.join(folder, file), path.join(copyFolder, file));
    }
  }
}

async function createDir() {
  const folderPath = path.join(__dirname, "assets");
  const copyBaseFolderPath = path.join(__dirname, "project-dist", "assets");
  const distPath = path.join(__dirname, "project-dist");
  try {
    await access(distPath);
  } catch (err) {
    await mkdir(distPath);
  }
  try {
    await access(copyBaseFolderPath);
    await rm(copyBaseFolderPath, { recursive: true });
  } catch (err) {}
  await mkdir(copyBaseFolderPath);
  copyFolders(folderPath, copyBaseFolderPath);
}

createCssBundle();
createHtml();
createDir();
