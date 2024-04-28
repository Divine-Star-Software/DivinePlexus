import { PlexusNodeRegister } from "../Classes/PlexusNodeRegister";
import { WeightedRandomPlexusTrait } from "./Traits/Randomness/WeightedRandom.plexus.trait";
import { ArrayPlexusTrait } from "./Traits/Data/Types/Array.plexus.trait";
import { RandomNumberPlexusTrait } from "./Traits/Randomness/RandomNumber.plexus.trait";
import { LogicPlexusTrait } from "./Traits/Logic/Logic.plexus.trait";
import { LogicBooleanOperationPlexusTrait } from "./Traits/Logic/Operations/LogicBooleanOperations.plexus.trait";
import { LogicGroupPlexusTrait } from "./Traits/Logic/Blocks/LogicGroup.plexus.trait";
import { LogicMathFunctionPlexusTrait } from "./Traits/Logic/Functions/LogicMathFunction.plexus.trait";
import { LogicOperationPlexusTrait } from "./Traits/Logic/Operations/LogicOperations.plexus.trait";
import { LogicComparePlexusTrait } from "./Traits/Logic/Operations/LogicCompare.plexus.trait";
import { LogicVariablesPlexusTrait } from "./Traits/Logic/Variables/LogicVariable.plexus.trait";
import { LogicImportPlexusTrait } from "./Traits/Logic/IO/LogicImport.plexus.trait";
import { LogicReturnPlexusTrait } from "./Traits/Logic/Blocks/LogicReturn.plexus.trait";
import { LogicImportsPlexusTrait } from "./Traits/Logic/IO/LogicImports.plexus.trait";
import { LogicVariableAssignPlexusTrait } from "./Traits/Logic/Variables/LogicVariableAssign.plexus.trait";
import { LogicVariableCreatePlexusTrait } from "./Traits/Logic/Variables/LogicVariableCreate.plexus.trait";
import { Vec2PlexusTrait } from "./Traits/Data/Math/Vec2.plexus.data.trait";
import { Vec3PlexusTrait } from "./Traits/Data/Math/Vec3.plexus.data.trait";
import { NumberPlexusTrait } from "./Traits/Data/Types/Number.plexus.trait";
import { BooleanPlexusTrait } from "./Traits/Data/Types/Boolean.plexus.trait";
import { LogicIfBlockPlexusTrait } from "./Traits/Logic/Blocks/LogicIfBlock.plexus.trait";
import { LogicRowPlexusTrait } from "./Traits/Logic/Blocks/LogicRow.plexus.trait";
import { LogicForLoopBlockPlexusTrait } from "./Traits/Logic/Blocks/LogicForLoopBlock.plexus.trait";
import { LogicWhileLoopBlockPlexusTrait } from "./Traits/Logic/Blocks/LogicWhileLoopBlock.plexus.trait";
import { StringPlexusTrait } from "./Traits/Data/Types/String.plexus.trait";
import { ObjectPlexusTrait } from "./Traits/Data/Types/Object.plexus.trait";
import { VectorPlexusTrait } from "./Traits/Data/Types/Vector.plexus.trait";
import { MatrixPlexusTrait } from "./Traits/Data/Types/Matrix.plexus.trait";
import { NullPlexusTrait } from "./Traits/Data/Types/Null.plexus.trait";
import { LogicArgumentPlexusTrait } from "./Traits/Logic/IO/LogicArgument.plexus.trait";
import { LogicArgumentsPlexusTrait } from "./Traits/Logic/IO/LogicArguments.plexus.trait";
import { LogicElseBlockPlexusTrait } from "./Traits/Logic/Blocks/LogicElseBlock.plexus.trait";
import { LogicElseIfBlockPlexusTrait } from "./Traits/Logic/Blocks/LogicElseIfBlock.plexus.trait";
import { LogicObjectConstructorPlexusTrait } from "./Traits/Logic/Variables/LogicObjectConstructor.plexus.trait";
import { LogicFunctionCallPlexusTrait } from "./Traits/Logic/LogicFunctionCall.plexus.trait";
import { ObjectImportPlexusTrait } from "./Traits/Objects/ObjectImport.plexus.trait";
import { LogicOutputPlexusTrait } from "./Traits/Logic/IO/LogicOutput.plexus.trait";
import { LogicIOPlexusTrait } from "./Traits/Logic/IO/LogicIO.plexus.trait";

export function RegisterAllBaseNodes() {
  PlexusNodeRegister.registerNode([]);
  PlexusNodeRegister.registerComponents([]);

  PlexusNodeRegister.registerTraits([
    //objects
    ObjectImportPlexusTrait,
    //data
    ArrayPlexusTrait,
    Vec3PlexusTrait,
    Vec2PlexusTrait,
    NumberPlexusTrait,
    BooleanPlexusTrait,
    StringPlexusTrait,
    ObjectPlexusTrait,
    VectorPlexusTrait,
    MatrixPlexusTrait,
    NullPlexusTrait,

    //randomness
    RandomNumberPlexusTrait,
    WeightedRandomPlexusTrait,
    //logic
    LogicFunctionCallPlexusTrait,
    LogicObjectConstructorPlexusTrait,
    LogicPlexusTrait,
    LogicComparePlexusTrait,
    LogicMathFunctionPlexusTrait,
    LogicOperationPlexusTrait,
    LogicBooleanOperationPlexusTrait,
    LogicGroupPlexusTrait,
    LogicVariablesPlexusTrait,
    LogicArgumentPlexusTrait,
    LogicArgumentsPlexusTrait,

    LogicReturnPlexusTrait,
    LogicImportsPlexusTrait,
    LogicVariableAssignPlexusTrait,
    LogicVariableCreatePlexusTrait,
    LogicImportPlexusTrait,
    LogicImportsPlexusTrait,
    LogicIfBlockPlexusTrait,
    LogicElseBlockPlexusTrait,
    LogicElseIfBlockPlexusTrait,
    LogicRowPlexusTrait,
    LogicForLoopBlockPlexusTrait,
    LogicWhileLoopBlockPlexusTrait,
    LogicOutputPlexusTrait,
    LogicIOPlexusTrait,
  ]);

  PlexusNodeRegister.initAll();
}
