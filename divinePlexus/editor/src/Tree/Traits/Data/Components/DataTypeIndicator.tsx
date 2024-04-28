import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { TreeNodeRegister } from "Classes/Tree/TreeNodeRegister";
import "./DataTypeIndicator.css";
import { Icon } from "Components/Icon";
export function DataTypeIndicator(props: {
  dataType: DataTypes;
  traitType: string;
}) {
  const dataTypeTrait = TreeNodeRegister._componentTraits.get(props.dataType);
  return (
    <div
      className="data-type-indicator"
      title={`Data type: [ ${props.dataType} ] Trait type: [ ${props.traitType} ]`}
    >
      <Icon
        icon={(dataTypeTrait?.Meta.icon as any) || (props.dataType as any)}
        stroke={dataTypeTrait?.Meta.color}
        fill={dataTypeTrait?.Meta.color}
      />
    </div>
  );
}
