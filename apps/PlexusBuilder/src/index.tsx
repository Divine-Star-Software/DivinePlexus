//import { Approutes } from "Routes";
import { createRoot } from "react-dom/client";
import "./core.css";
import { App } from "./App";
(async () => {
  console.log("render app rooot");
  const appRoot = createRoot(document.getElementById("root")!);
  appRoot.render(
    <>
      <App />
    </>
  );
  /* 
  //@ts-ignore
  const { App,AppWindows,ContextMenu } = await import("./plexus/bundle.js");
  
  const windowRoot = createRoot(document.getElementById("window-root")!);
  windowRoot.render(
    <>
      <AppWindows />
    </>
  );
  const contextRoot = createRoot(document.getElementById("context-menu-root")!);
  contextRoot.render(
    <>
      <ContextMenu />
    </>
  );
 */
})();
