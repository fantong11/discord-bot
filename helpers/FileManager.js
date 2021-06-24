const fs = require("fs");

class FileManager {
    constructor() {

    }

    importScriptFromFolder(folderName) {
        return fs.readdirSync("./" + folderName).filter(file => file.endsWith('.js'));
    }
}

module.exports = FileManager;