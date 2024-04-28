export enum LogicBooleanOperations {
  And = "&&",
  Or = "||",
}
export enum LogicCompareOperations {
  GreaterThan = ">",
  GreaterThanEqualTo = ">=",
  LessThan = "<",
  LessThanEqualTo = "<=",
  EqualTo = "==",
}

export enum LogicVariablesTypes  {
  Argument = "Argument",
  Global = "Gloabl",
  Local = "Local",
  Import = "Import"
}

export enum LogicOperations {
  Add = "+",
  Subtract = "-",
  Multiply = "*",
  Divide = "/",
  Modulo = "%",
  LeftShift = "<<",
  LeftShiftUnSigned = "<<<",
  RightShift = ">>",
  AND = "&",
  OR = "|",
  XOR = "^",
  NOT = "~",
}

export enum LogicAssignOperations {
  Equals = "=",
  MultiplyEqual = "*=",
  DivideEqual = "/=",
  PlusEqual = "+=",
  ModuloEqual = "%=",
  LeftShiftEqual = "<<=",
  LeftShiftUnSignedEqual = "<<<=",
  RightShiftEqual = ">>=",
  ANDEqual = "&=",
  OREqual = "|=",
  XOREqual = "^=",
  NOTEqual = "~=",
}

export enum LogicNumberFunctions {
  Abs = "abs",
  Acos = "acos",
  Acosh = "acosh",
  Asin = "asin",
  Asinh = "asinh",
  Atan = "atan",
  Atanh = "atanh",
  Atan2 = "atan2",
  Cbrt = "cbrt",
  Ceil = "ceil",
  Cos = "cos",
  Cosh = "cosh",
  Exp = "exp",
  Expm1 = "expm1",
  Floor = "floor",
  Log = "log",
  Log10 = "log10",
  Log1p = "log1p",
  Log2 = "log2",
  Max = "max",
  Min = "min",
  Pow = "pow",
  Random = "random", // Note: Handling this might require special considerations.
  Round = "round",
  Sign = "sign",
  Sin = "sin",
  Sinh = "sinh",
  Sqrt = "sqrt",
  SquareRoot = "√", // Duplicate of Sqrt for compatibility
  Tan = "tan",
  Tanh = "tanh",
  Trunc = "trunc",
}
