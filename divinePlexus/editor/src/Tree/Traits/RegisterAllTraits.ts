import { TreeNodeRegister } from "Classes/Tree/TreeNodeRegister";
import { RandomnNumberTrait } from "./Randomness/RandomNumber.trait";
import { WeightedRandomComponentTrait } from "./Randomness/WeightedRandom.trait";
import { ArrayComponentTrait } from "./Data/Types/Array.trait";
import { LogicComponentTrait } from "./Logic/Logic.trait";
import { LogicGroupComponentTrait } from "./Logic/Blocks/LogicGroup.trait";
import { LogicOperationComponentTrait } from "./Logic/Operations/LogicOperations.trait";
import { LogicCompareComponentTrait } from "./Logic/Operations/LogicCompare.trait";
import { LogicVariableComponentTrait } from "./Logic/Variables/LogicVariables";
import { LogicReturnComponentTrait } from "./Logic/Blocks/LogicReturn.trait";
import { LogicIfBlockComponentTrait } from "./Logic/Blocks/LogicIfBlock.trait";
import { LogicVariableCreateComponentTrait } from "./Logic/Variables/LogicVariablesCreate";
import { LogicVariableAssignComponentTrait } from "./Logic/Variables/LogicVariablesAssign";
import { LogicImportComponentTrait } from "./Logic/IO/LogicImport";
import { LogicImportsComponentTrait } from "./Logic/IO/LogicImports";
import { NumberComponentTrait } from "./Data/Types/Number.trait";
import { BooleanComponentTrait } from "./Data/Types/Boolean.trait";
import { Vec3ComponentTrait } from "./Data/Math/Vec3.data.trait";
import { Vec2ComponentTrait } from "./Data/Math/Vec2.data.trait";
import { LogicBooleanOperationsComponentTrait } from "./Logic/Operations/LogicBooleanOperations.trait";
import { LogicRowComponentTrait } from "./Logic/Blocks/LogicRow.trait";
import { LogicWhileLoopComponentTrait } from "./Logic/Blocks/LogicWhileLoop.trait";
import { LogicForLoopComponentTrait } from "./Logic/Blocks/LogicForLoop.trait";
import { StringComponentTrait } from "./Data/Types/String.trait";
import { ObjectComponentTrait } from "./Data/Types/Object.trait";
import { NullComponentTrait } from "./Data/Types/Null.trait";
import { LogicArgumentComponentTrait } from "./Logic/IO/LogicArgument";
import { LogicArgumentsComponentTrait } from "./Logic/IO/LogicArguments";
import { VectorComponentTrait } from "./Data/Types/Vector.trait";
import { MatrixComponentTrait } from "./Data/Types/Matrix.trait";
import { LogicObjectConstructorComponentTrait } from "./Logic/Variables/LogicObjectConstructor";
import { LogicFunctionCallComponentTrait } from "./Logic/LogicFunctionCall.trait";
import { ObjectImportTrait } from "./Objects/ObjectImport.trait";
import { LogicIOComponentTrait } from "./Logic/IO/LogicIO";
import { LogicOutputComponentTrait } from "./Logic/IO/LogicOutputs";
import { LogicElseComponentTrait } from "./Logic/Blocks/LogicElseBlock.trait";
import { LogicIfElseComponentTrait } from "./Logic/Blocks/LogicIfElseBlock.trait";

export function RegisterAllTraits() {
  TreeNodeRegister.registerComponentTraits([
    RandomnNumberTrait,
    WeightedRandomComponentTrait,


    //logic
    LogicObjectConstructorComponentTrait,
    LogicComponentTrait,
    LogicOperationComponentTrait,
    LogicBooleanOperationsComponentTrait,
    LogicCompareComponentTrait,
    LogicVariableComponentTrait,
    LogicGroupComponentTrait,
    LogicReturnComponentTrait,
    LogicIfBlockComponentTrait,
    LogicVariableCreateComponentTrait,
    LogicVariableAssignComponentTrait,
    LogicImportComponentTrait,
    LogicImportsComponentTrait,
    LogicArgumentComponentTrait,
    LogicArgumentsComponentTrait,
    LogicRowComponentTrait,
    LogicIfBlockComponentTrait,
    LogicElseComponentTrait,
    LogicIfElseComponentTrait,
    LogicWhileLoopComponentTrait,
    LogicForLoopComponentTrait,
    LogicFunctionCallComponentTrait,
    LogicIOComponentTrait,
    LogicOutputComponentTrait,

    //data
    ArrayComponentTrait,
    ObjectComponentTrait,
    NullComponentTrait,
    ObjectImportTrait,
    
    VectorComponentTrait,
    MatrixComponentTrait,
    Vec3ComponentTrait,
    Vec2ComponentTrait,
    NumberComponentTrait,
    StringComponentTrait,
    BooleanComponentTrait,
  ]);
}
