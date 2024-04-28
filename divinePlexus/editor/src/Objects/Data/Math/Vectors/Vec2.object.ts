import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { ExposedObject } from "Tree/Traits/Data/Types/ExposedObject";
import { LogicArgumentComponentTrait } from "Tree/Traits/Logic/IO/LogicArgument";
import { LogicObjectConstructorComponentTrait } from "Tree/Traits/Logic/Variables/LogicObjectConstructor";
import { DataObjectReigster } from "../../DataObjectRegister";
import { Vec2ComponentTrait } from "Tree/Traits/Data/Math/Vec2.data.trait";

export default function () {
  const object = new ExposedObject();
  DataObjectReigster.registerObject(Vec2ComponentTrait.Meta.id, object);
  object.setConstructor({
    data: LogicObjectConstructorComponentTrait.CreateNew({
      properties: {
        dataType: DataTypes.Vector,
        traitType: Vec2ComponentTrait.Meta.id,
      },
      traits: [
        LogicArgumentComponentTrait.CreateNew({
          properties: {
            name: "x",
            dataType: DataTypes.Number,
            genericTypes: [DataTypes.Number],
            traitTypes: [DataTypes.Number],
          },
        }),
        LogicArgumentComponentTrait.CreateNew({
          properties: {
            name: "y",
            dataType: DataTypes.Number,
            genericTypes: [DataTypes.Number],
            traitTypes: [DataTypes.Number],
          },
        }),
        LogicArgumentComponentTrait.CreateNew({
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
