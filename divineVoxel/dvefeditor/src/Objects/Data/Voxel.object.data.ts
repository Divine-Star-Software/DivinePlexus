

import { DataTypes } from "@divineplexus/core/Base/Traits/Data/Types/Data.types";
import { ImportedObjectRegister } from "@divineplexus/editor/Objects/Imported/ImportedObjectRegister";
import { ExposedObject } from "@divineplexus/editor/Tree/Traits/Data/Types/ExposedObject";
import { VoxelComponentTrait } from "Tree/Traits/Voxels/Data/Voxel.trait";

export default function(){
    const object = new ExposedObject();
    ImportedObjectRegister.registerObject(VoxelComponentTrait.Meta.id, object);
    object.addProperties(["state"], DataTypes.Number);
    object.addProperties(["level"], DataTypes.Number);
    object.addProperties(["levelState"], DataTypes.Number);
    object.addProperties(["shapeState"], DataTypes.Number);
    
}


