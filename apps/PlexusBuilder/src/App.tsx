import Home from "Pages/Home/Home";
import { useProject } from "./Hooks/useProject";
import { useEffect } from "react";

export function App() {
  const {} = useProject();

  useEffect(() => {}, []);

  return (
    <>
      <Home />
    </>
  );
}
