import RegisterAllComponents from "./Components/RegisterAllComponents";
import RegisterAllNodes from "./Nodes/RegisterAllNodes";
import RegisterAllTraits from "./Traits/RegisterAllTraits";

export default function () {
  RegisterAllTraits();
  RegisterAllNodes();
  RegisterAllComponents();
}
