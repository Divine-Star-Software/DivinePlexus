export enum RandomnessTypes {
  StandardRandom = "Standard Random",
  SeededRandom = "Seeded Random",
}
export type RandomData<Data extends {} = {}> = {
  scale: number;
  add: number;
} & Data;
export type StandardRandomData = RandomData<{
  type: RandomnessTypes.StandardRandom;
}>;
export type SeededRandomData = RandomData<{
  type: RandomnessTypes.SeededRandom;
  seed: number;
}>;
