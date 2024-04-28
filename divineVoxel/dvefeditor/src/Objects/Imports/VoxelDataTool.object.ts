import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { Vec3ComponentTrait } from "@divineplexus/editor/Tree/Traits/Data/Math/Vec3.data.trait";
import { LogicArgumentComponentTrait } from "@divineplexus/editor/Tree/Traits/Logic/IO/LogicArgument";
import { ImportedObjectRegister } from "@divineplexus/editor/Objects/Imported/ImportedObjectRegister";
import { ExposedObject } from "@divineplexus/editor/Tree/Traits/Data/Types/ExposedObject";

export default function () {
  const object = new ExposedObject();

  ImportedObjectRegister.registerObject("voxelDataTool", object);

  object.addProperties(["x"], DataTypes.Number);
  object.addProperties(["y"], DataTypes.Number);
  object.addProperties(["z"], DataTypes.Number);

  object.addFunction(["loadIn"], {
    output: DataTypes.Boolean,
    args: [],
  });

  object.addFunction(["loadInAt"], {
    output: DataTypes.Boolean,
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

  object.addFunction(["loadInVec3"], {
    output: DataTypes.Boolean,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "vec3",
          dataType: DataTypes.Vector,
          genericTypes: [Vec3ComponentTrait.Meta.id],
        },
      }),
    ],
  });

  object.addFunction(["commit"], {
    output: DataTypes.Boolean,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "heightMapUpdate",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });

  object.addFunction(["hasRGBLight"], {
    output: DataTypes.Boolean,
    args: [],
  });
  object.addFunction(["hasSunLight"], {
    output: DataTypes.Boolean,
    args: [],
  });

  object.addFunction(["getLight"], {
    output: DataTypes.Number,
    args: [],
  });
  object.addFunction(["setLight"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });

  object.addFunction(["isRenderable"], {
    output: DataTypes.Boolean,
    args: [],
  });
  object.addFunction(["isOpaque"], {
    output: DataTypes.Boolean,
    args: [],
  });
  object.addFunction(["hasSecondaryVoxel"], {
    output: DataTypes.Boolean,
    args: [],
  });

  object.addFunction(["isAir"], {
    output: DataTypes.Boolean,
    args: [],
  });
  object.addFunction(["setAir"], {
    output: DataTypes.Null,
    args: [],
  });

  object.addFunction(["getSubstance"], {
    output: DataTypes.String,
    args: [],
  });
  object.addFunction(["getTemplateSubstance"], {
    output: DataTypes.String,
    args: [],
  });
  object.addFunction(["getState"], {
    output: DataTypes.Number,
    args: [],
  });

  object.addFunction(["getLevel"], {
    output: DataTypes.Number,
    args: [],
  });
  object.addFunction(["setLevel"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });

  object.addFunction(["getLevelState"], {
    output: DataTypes.Number,
    args: [],
  });
  object.addFunction(["setLevelState"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });

  object.addFunction(["getShapeState"], {
    output: DataTypes.Number,
    args: [],
  });
  object.addFunction(["setShapeState"], {
    output: DataTypes.Number,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "value",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });

  object.addFunction(["getId"], {
    output: DataTypes.Number,
    args: [],
  });
  object.addFunction(["setId"], {
    output: DataTypes.Null,
    args: [
      LogicArgumentComponentTrait.CreateNew({
        permanent: true,
        properties: {
          name: "id",
          dataType: DataTypes.Number,
        },
      }),
    ],
  });

  object.addFunction(["getStringId"], {
    output: DataTypes.String,
    args: [],
  });
  object.addFunction(["setStringId"], {
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
  object.addFunction(["isSameVoxel"], {
    output: DataTypes.Boolean,
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
