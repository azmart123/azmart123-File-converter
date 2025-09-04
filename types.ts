
export enum ConversionState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  CONVERTING = 'CONVERTING',
  DONE = 'DONE',
  ERROR = 'ERROR'
}

export interface Format {
  value: string;
  label: string;
}

export interface FormatCategory {
  name: string;
  formats: Format[];
}
