const fs = require("fs/promises");
import type pfs from "fs/promises";
const { dialog, ipcRenderer } = require("electron");
export class PlexusFileSystem {
  static fs = fs;

  static pickFolder() {
    return new Promise<null | string>((resolve) => {
      ipcRenderer.send("open-folder-dialog");
      // Listen for the "folder-selected" message from the main process
      ipcRenderer.on("folder-selected", (event: any, path: string) => {
        console.log("Selected folder:", path);
        resolve(path);
        // Perform actions with the selected folder path, such as initializing a new project
      });
    });
  }

  static writeFile = (fs as typeof pfs).writeFile;
  static readFile = (fs as typeof pfs).readFile;
  static mkdir = (fs as typeof pfs).mkdir;
  static readdir = (fs as typeof pfs).readdir;
  static async readDirectory(path: string) {
    const result = await this.readdir(path);
    return result;
  }
  static writeJSON(
    path: string,
    name: string,
    data: string | Object,
    pretty?: boolean
  ) {
    let output =
      typeof data == "string"
        ? data
        : JSON.stringify(data, undefined, pretty ? 2 : undefined);
    return this.writeFile(`${path}/${name}.json`, output, {
      encoding: "utf8",
    });
  }
  static async readJSON(path: string, name: string) {
    const file = await this.readFile(`${path}/${name}.json`, {
      encoding: "utf8",
    });
    return JSON.parse(file);
  }
  static writeDBO(
    path: string,
    name: string,
    data: ArrayBuffer | SharedArrayBuffer
  ) {
    return this.writeFile(`${path}/${name}.dbo`, Buffer.from(data));
  }
  static async readDBO(path: string, name: string) {
    const buffer = await this.readFile(`${path}/${name}.dbo`);
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
  }
}
