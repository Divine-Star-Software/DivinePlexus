import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { LogicArgumentComponentTrait } from "Tree/Traits/Logic/IO/LogicArgument";
import { ObjectRegister } from "../ObjectRegister";
import { ExposedObject } from "Tree/Traits/Data/Types/ExposedObject";

export default function (reigster: ObjectRegister) {
  const object = new ExposedObject();
  reigster.registerObject("Math", object);
  object.addProperties(["PI"], DataTypes.Number);
  object.addFunction(["sqrt"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  object.addFunction(["floor"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  object.addFunction(["ceil"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  object.addFunction(["round"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  object.addFunction(["sin"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  object.addFunction(["cos"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
  object.addFunction(["tan"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });
}
