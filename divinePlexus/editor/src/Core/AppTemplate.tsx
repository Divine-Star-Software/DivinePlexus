import { AppMainContent } from "Core/AppMainContent";
import { AppLeftSideBar } from "Core/AppLeftSideBar";
import { AppTopTitle } from "Core/AppTopTitle";
import "./AppTemplate.css";
import { AppTopBar } from "Core/AppTopBar";
import { AppRightSideBar } from "./AppRightSideBar";
import { AppBottonContent } from "./AppBottonContent";

export function AppTemplate() {
  return (
    <div className="app-template">
      <div className="app-top-bar">
        <AppTopBar />
        <AppTopTitle />
      </div>

      <div className="app-main">

        <div className="app-left-content">
          <div className="app-left-content-main">
            <div className="app-left-side-bar">
              <AppLeftSideBar />
            </div>
            <div className="app-main-content">
              <AppMainContent />
            </div>
          </div>

          <div className="app-bottom-content">
            <AppBottonContent />
          </div>
        </div>

        <div className="app-right-content">
          <div className="app-right-side-bar">
            <AppRightSideBar />
          </div>
        </div>
      </div>
    </div>
  );
}
