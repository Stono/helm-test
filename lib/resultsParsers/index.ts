export type PhaseOneOptions = { result: { stdout: string } };
export interface IPhaseOneParser {
  parse(options: PhaseOneOptions): Promise<void>;
}

export type PhaseTwoOptions = PhaseOneOptions & { onDisk: string };
export interface IPhaseTwoParser {
  parse(options: PhaseTwoOptions): Promise<void>;
}
