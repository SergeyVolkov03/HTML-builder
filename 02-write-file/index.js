const fs = require("fs");
const { stdin, stdout } = process;
const path = require("path");

const exit = () => {
  stdout.write("запись завершена");
  process.exit(1);
};
const filePath = path.join(__dirname, "text.txt");
let writeableStream = fs.createWriteStream(filePath);
stdout.write("Введите текст пожалуйста\n");
stdin.on("data", (data) => {
  if (data.toString().trim() === "exit") {
    exit();
  }
  writeableStream.write(data);
});
process.on("SIGINT", () => exit());
