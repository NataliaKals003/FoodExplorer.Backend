const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  async saveFile(file) {
    const filename = file.filename;

    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, filename),
      path.resolve(uploadConfig.UPLOADS_FOLDER, filename)
    );

    return filename;
  }

  async deleteFile(fileName) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, fileName);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }
    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
