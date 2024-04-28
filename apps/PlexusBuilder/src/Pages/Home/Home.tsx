import { Logo } from "Components/Logo/Logo";
import "./Home.css";
import { Button } from "Components/Button/Button";
import { useProject } from "Hooks/useProject";
import { useEffect } from "react";
export default function () {
  const { observers } = useProject();

  useEffect(() => {
    observers.projectLoaded.subscribe("home", (project) => {
      console.log("GOT THE PROJECT YO",project);
      
    });
  }, []);
  return (
    <div className="homepage">
      <div>
        <Logo />
        <h1>Plexus Editor</h1>
        <div className="buttons">
          <Button
            onClick={() => {
              observers.findProject.notify();
            }}
          >
            Open Project
          </Button>
          <Button>New Project</Button>
        </div>
      </div>
    </div>
  );
}
