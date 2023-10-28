const path = require("path");
const { writeFile } = require("fs");

class FileUtils {
  static async writeFileSync(fileName, content, callback) {
    return writeFile(fileName, content, callback);
  }

  static async isZipFile(filePath) {
    const fileExtension = path.extname(filePath);
    return fileExtension.toLowerCase() === ".zip";
  }
}

module.exports = FileUtils;
