const FileManager = require("../helpers/FileManager");

beforeEach(() => {
    this.fileManager = new FileManager();
});

test('Successfully import file from command folder', () => {
    const commands = this.fileManager.importScriptFromFolder("commands");
    expect(commands.includes("ping.js")).toBeTruthy();
});

test('Successfully import file from command folder', () => {
    const commands = this.fileManager.importScriptFromFolder("events");
    expect(commands.includes("message.js")).toBeTruthy();
});

