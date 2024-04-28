import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { Vec3ComponentTrait } from "@divineplexus/editor/Tree/Traits/Data/Math/Vec3.data.trait";
import { LogicArgumentComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicArgument";
import { ImportedObjectRegister } from "@divineplexus/editor/Objects/Imported/ImportedObjectRegister";
import { ExposedObject } from "@divineplexus/editor/Tree/Traits/Data/Types/ExposedObject";

export default function(){
  const object = new ExposedObject();
  ImportedObjectRegister.registerObject("voxelBrush", object);
  object.addProperties(["x"], DataTypes.Number);
  object.addProperties(["y"], DataTypes.Number);
  object.addProperties(["z"], DataTypes.Number);
  object.addFunction(["setId"], {
    output: DataTypes.Null,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "id",
          dataType: DataTypes.String,
        },
      }),
    ],
  });
  object.addFunction(["setState"], {
    output: DataTypes.Null,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "state",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  object.addFunction(["setLevel"], {
    output: DataTypes.Null,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "level",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  object.addFunction(["setShapeState"], {
    output: DataTypes.Null,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "shapeState",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  object.addFunction(["setLevelState"], {
    output: DataTypes.Null,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "levelState",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  object.addFunction(["setXYZ"], {
    output: DataTypes.Null,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "x",
          dataType: DataTypes.Number,
        },
      }),
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "y",
          dataType: DataTypes.Number,
        },
      }),
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "z",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  
}
