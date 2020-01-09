export interface Record {
  [key: string]: any
}

export type DataSource = Record[];

/**
 * value is percentage of the loading process, it's an estimate value.
 */
export type ProgressCallback = (value: number) => void;