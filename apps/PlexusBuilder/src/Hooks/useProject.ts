const fs = require("fs/promises");
import type pfs from "fs/promises";
import { useEffect, useRef } from "react";
import { Observable } from "@divinestar/utils/Observers/";
const { dialog, ipcRenderer } = require("electron");
export class PlexusFileSystem {
  static fs = fs;
  static pickFolder() {
    return new Promise<null | string>((resolve) => {
      ipcRenderer.send("open-folder-dialog");
      ipcRenderer.on("folder-selected", (event: any, path: string) => {
        console.log("Selected folder:", path);
        resolve(path);
      });
    });
  }
  static openProject(path:string) {
    return new Promise<null | string>((resolve) => {
      ipcRenderer.send("open-project",path);

    });
  }
  static writeFile = (fs as typeof pfs).writeFile;
  static readFile = (fs as typeof pfs).readFile;
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
}

class ProjectData {
  constructor(public path: string, public data: any) {}
}

class ProjectObservers {
  findProject = new Observable();
  projectLoaded = new Observable<ProjectData>();
  newProject = new Observable();
}

export const useProject = () => {
  const observers = useRef(new ProjectObservers());

  useEffect(() => {
    observers.current.findProject.subscribe(useProject, async () => {
      const path = await PlexusFileSystem.pickFolder();
      if (!path) return;
      const plexusJSON = await PlexusFileSystem.readJSON(
        path,
        "plexus-project"
      );
      const data = new ProjectData(path, plexusJSON);
      PlexusFileSystem.openProject(data.path);
      observers.current.projectLoaded.notify(data);
    });
  }, []);

  return {
    observers: observers.current,
  };
};
