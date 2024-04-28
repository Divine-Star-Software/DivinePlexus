import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { Vec3ComponentTrait } from "Tree/Traits/Data/Math/Vec3.data.trait";
import { ExposedObject } from "Tree/Traits/Data/Types/ExposedObject";
import { LogicArgumentComponentTrait } from "Tree/Traits/Logic/IO/LogicArgument";
import { LogicObjectConstructorComponentTrait } from "Tree/Traits/Logic/Variables/LogicObjectConstructor";
import { DataObjectReigster } from "../../DataObjectRegister";

export default function () {
  const object = new ExposedObject();
  DataObjectReigster.registerObject(Vec3ComponentTrait.Meta.id, object);
  object.setConstructor({
    data: LogicObjectConstructorComponentTrait.CreateNew({
      properties: {
        dataType: DataTypes.Vector,
        traitType: Vec3ComponentTrait.Meta.id,
      },
      traits: [
        LogicArgumentComponentTrait.CreateNew({
          permanent:true,
          properties: {
            name: "x",
            dataType: DataTypes.Number,
            genericTypes: [DataTypes.Number],
            traitTypes: [DataTypes.Number],
          },
        }),
        LogicArgumentComponentTrait.CreateNew({
          permanent:true,
          properties: {
            name: "y",
            dataType: DataTypes.Number,
            genericTypes: [DataTypes.Number],
            traitTypes: [DataTypes.Number],
          },
        }),
        LogicArgumentComponentTrait.CreateNew({
          permanent:true,
          properties: {
            name: "z",
            dataType: DataTypes.Number,
            genericTypes: [DataTypes.Number],
            traitTypes: [DataTypes.Number],
          },
        }),
      ],
    }),
  });
  object.addProperties(["x"], DataTypes.Number);
  object.addProperties(["y"], DataTypes.Number);
  object.addProperties(["z"], DataTypes.Number);
}
