import { LinkAll } from "./Link.js";
import { PublishAll } from "./Publishall.js";
import { UpdateVersions } from "./UpdateVersions.js";

const arags = process.argv;

const flag = arags[2];
(async () => {
  if (flag == "-link") {
    LinkAll();
  }
  if (flag == "-publish:all") {
    PublishAll();
  }
})();

console.log(flag);
