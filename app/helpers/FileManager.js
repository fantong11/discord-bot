const fs = require("fs");

class FileManager {
    constructor() {

    }

    importScriptFromFolder(folderName) {
        return fs.readdirSync("./app/" + folderName).filter(file => file.endsWith('.js'));
    }
}

module.exports = FileManager;