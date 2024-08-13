const fs = require("fs");
const path = require("path");
const uploadCongig = require("../configs/upload");

class DiskStorage {
    async saveFile(file) {
        await fs.promises.rename(
            path.resolve(uploadCongig.TMP_FOLDER, file),
            path.resolve(uploadCongig.UPLOADS_FOLDER, file)
        );
        return file;
    }

    async deleteFile(file) {
        const filePath = path.resolve(uploadCongig.UPLOADS_FOLDER, file);

        try {
            await fs.promises.stat(filePath);
        } catch {
            return;
        }

        await fs.promises.unlink(filePath);
    }
}

module.exports = DiskStorage;