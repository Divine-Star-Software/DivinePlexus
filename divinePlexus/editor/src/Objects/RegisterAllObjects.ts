import RegisterAllDataObjects from "./Data/RegisterAllDataObjects";
import RegisterAllGlobalObjects from "./Global/RegisterAllGlobalObjects";

export default function () {
  RegisterAllDataObjects();
  RegisterAllGlobalObjects();
}
