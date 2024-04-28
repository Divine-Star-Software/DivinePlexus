import { LogicComponentInterface } from "../Interfaces/LogicComponent.interface";
import { StatusIndicator, StatusIndicatorTypes } from "./LogicEditor";
import { DataTypeIndicator } from "../../Data/Components/DataTypeIndicator";
import { useState } from "react";
import { TreeNodeComponentTraitBase } from "Classes/Tree/TreeNodeComponentTraitBase";

export function LogicErrorCheckComponent({
  trait,
}: {
  trait: 
    TreeNodeComponentTraitBase &
    LogicComponentInterface;
}) {
  const [type, setType] = useState(trait.logicErrorCheck!.evulatedType);
  trait.logicErrorCheck!.evaled.subscribe(LogicErrorCheckComponent, (type) => {
    setType(type);
  });
  return (
    <>
      <StatusIndicator
        status={
          !type.error ? StatusIndicatorTypes.Green : StatusIndicatorTypes.Red
        }
        title={type.errorMessage ? type.errorMessage : "All Good"}
      />
      <DataTypeIndicator traitType={type.traitType} dataType={type.dataType} />
    </>
  );
}
