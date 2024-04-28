import { ReactElement } from "react";

export function DisplaySwitch({
  active,
  elements,
}: {
  active: string;
  elements: [id: string, element: ReactElement][];
}) {
  return (
    <>
      {elements.map(([id, Element], index) => (
        <div
          key={`${id}-${index}`}
          style={{
            display: active == id ? "flex" : "none",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {Element}
        </div>
      ))}
    </>
  );
}
