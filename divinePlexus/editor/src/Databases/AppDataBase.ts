import { DataBase, ObjectStore, ZeneithDB } from "@divinestar/indexdb";

export class AppDataBase {
  static db: DataBase;
  static metaData: ObjectStore<any>;
  static asssets: ObjectStore<any>;
  static levels: ObjectStore<any>;
  static async init() {
    await ZeneithDB.$INIT();
    const dbName = "ECD_APP";
    let db: DataBase;
    const existanceCheck = await ZeneithDB.databaseExists(dbName);
    if (!existanceCheck) {
      db = await ZeneithDB.createDatabase({
        databaseName: dbName,
        collections: [
          {
            name: "meta-data",
            schema: [],
          },
          {
            name: "assets",
            schema: [],
          },
          {
            name: "levels",
            schema: [],
          },
        ],
      });
      this.db = db;
    } else {
      db = await ZeneithDB.getDatabase(dbName);
      this.db = db;
    }
    await this.db.close();
    await this.db.open();
    this.metaData = await this.db.getCollection("meta-data");
    this.asssets = await this.db.getCollection("assets");
  }
}
