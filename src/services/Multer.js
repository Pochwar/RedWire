const multer  = require('multer')

class Multer {
    constructor(conf) {
        this._conf = conf;

        /*
        Set destination and filename
        destination : avatar path from config file
        filename : rename file with fieldname + unique string + file extension
         */
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this._conf.site.default.avatarPath)
            },
            filename: (req, file, cb) => {
                const ext = file.mimetype.replace("image/", "");
                cb(null, file.fieldname + '-' + Date.now() + "." + ext)
            }
        });

        /*
         Set limits and file filter
         limits : prevent uploading files > maxSize from config
         file filter : prevent uploading files != authExt from config
         */
        return multer({
            // storage: this.storage,
            storage: this.storage,
            limits: {fileSize: this._conf.site.image.maxSize},
            fileFilter: (req, file, cb) => {
                const ext = file.originalname.substring(file.originalname.lastIndexOf("."));
                if (this._conf.site.image.authExt.indexOf(ext) === -1){
                    return cb(new Error('wrong file extension'))
                }

                cb(null, true)
            },
        })
    }
}

module.exports = Multer;
