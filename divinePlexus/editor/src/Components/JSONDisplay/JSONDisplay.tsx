import { useState } from "react";
import "./JSONDisplay.css";

interface JSONNodeProps {
  data: any;
  keyName?: string;
}

const JSONNode: React.FC<JSONNodeProps> = ({ data, keyName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const isObject = data !== null && typeof data === "object";
  const isArray = Array.isArray(data);

  let displayData = "";
  let dataType = typeof data;
  if (dataType === "number") {
    displayData = data.toString();
  } else if (dataType === "string") {
    displayData = `"${data}"`;
  } else if (dataType === "boolean") {
    displayData = data ? "true" : "false";
  }

  return (
    <div>
      {keyName && (
        <span
          className={`json-key ${isObject ? "clickable" : ""}`}
          onClick={toggleOpen}
        >
          {keyName}:{" "}
        </span>
      )}
      {isObject ? (
        <span className="json-object" onClick={toggleOpen}>
          {isArray ? `[${isOpen ? "" : "..."}]` : `{${isOpen ? "" : "..."}}`}
        </span>
      ) : (
        <span className={`json-value json-${dataType}`}>{displayData}</span>
      )}
      {isOpen && isObject && (
        <div className="json-children">
          {Object.keys(data).map((key, index) => (
            <JSONNode key={index} data={data[key]} keyName={key} />
          ))}
        </div>
      )}
    </div>
  );
};

export const JSONTreeDisplay: React.FC<{ object: any }> = ({ object }) => {
  return (
    <div className="json-tree">
      <JSONNode data={object} />
    </div>
  );
};
