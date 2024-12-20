const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
console.log('TMP_FOLDER:', TMP_FOLDER);
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MULTER = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, TMP_FOLDER);
        },
        filename(request, file, callback) {
            const fileHash = crypto.pseudoRandomBytes(10).toLocaleString("hex");
            const filename = `${fileHash}-${file.originalname}`;

            return callback(null, filename);
        },
    }),
};

module.exports = {
    TMP_FOLDER,
    UPLOADS_FOLDER,
    MULTER
}
