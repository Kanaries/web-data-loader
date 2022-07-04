import * as Papa from 'papaparse';

import { DataSource, Record } from "../globalTypes";

interface ReservoirSamplingConfig {
  type: 'reservoirSampling',
  /**
   * sample size(number of records left)
   */
  size: number
}

type SamplingConfig = ReservoirSamplingConfig | false | undefined;

const tickMode = 10000;

const maxWaitValue = 0.9999;


interface IcsvReaderProps {
  file: File;
  config?: SamplingConfig;
  encoding?: string;
  /**
   * loading process callback
   */
  onLoading?: (value: number) => void;
}
/**
 * csvReader. load, parse and sampling for csv file in stream.
 * @param file File Type
 * @param config 
 * @param onLoading loading process callback
 */
export function csvReader (props: IcsvReaderProps) {
  const {
    file,
    config,
    onLoading,
    encoding = 'utf-8'
  } = props;
  return new Promise((resolve, reject) => {
    if (!config) {
      pureSteamReader(file, encoding, resolve, reject, onLoading);
    } else {
      reservoirSampling(file, encoding, config.size, resolve, reject, onLoading);
    }
  })
}

/**
 * 
 * @param file File Type
 * @param resolve 
 * @param reject 
 * @param onLoading loading process callback
 */
function pureSteamReader (file: File, encoding: string, resolve: (value: any) => void, reject: (value: any) => void, onLoading?: (value: number) => void): void {
  const rows: any[] = [];
  let fields: string[] = [];
  let index = -1;
  let loadedSize = 0;
  Papa.parse(file, {
    worker: true,
    encoding,
    step (results) {
      if (index === -1) {
        fields = results.data as string[];
        loadedSize += fields.join(',').length;
      } else {
        if (results.data as string[] && (results.data as string[]).length && (results.data as string[]).length === fields.length) {
          rows.push(results.data);
        }
        onLoading && onLoading(loadedSize / file.size)
      }
      index++;
    },
    complete () {
      const dataSource: DataSource = table2json(fields, rows);
      onLoading && onLoading(1)
      resolve(dataSource)
    },
    error (err) {
      reject(err);
    }
  })
}

/**
 * Reservoir Sampling
 * Algorithm R:
 * Vitter, Jeffrey S. (1 March 1985). "Random sampling with a reservoir" (PDF). ACM Transactions on Mathematical Software. 11 (1): 37–57. CiteSeerX 10.1.1.138.784. doi:10.1145/3147.3165.
 * @param file 
 * @param size sample size
 * @param resolve 
 * @param reject 
 * @param onLoading loading process callback
 */
function reservoirSampling (file: File, encoding: string, size: number, resolve: (value: any) => void, reject: (value: any) => void, onLoading?: (value: number) => void): void {
  const rows: any[] = [];
  let fields: string[] = [];
  let index = -1;
  let estimateRowNum = 1;
  Papa.parse(file, {
    worker: true,
    encoding,
    step (results) {
      if (index === -1) {
        fields = results.data as string[];
        estimateRowNum = file.size / fields.join(',').length;
      } else if (results.data as string[] && (results.data as string[]).length && (results.data as string[]).length === fields.length) {
        if (index < size) {
          rows.push(results.data);
        } else {
          let pos = Math.round(Math.random() * index);
          if (pos < size) {
            rows[pos] = results.data;
          }
        }
      }
      onLoading && (index % tickMode === 0) && onLoading(Math.min(index / estimateRowNum, maxWaitValue))
      index++;
    },
    complete () {
      const dataSource: DataSource = table2json(fields, rows);
      onLoading && onLoading(1)
      resolve(dataSource)
    },
    error (err) {
      reject(err);
    }
  })
}

/**
 * table to json
 * @param fieldNames list of field name, normally the first row of csv.
 * @param rows data rows. the rest rows of csv.
 */
export function table2json (fieldNames: any[], rows: any[][]): DataSource {
  const dataSource: DataSource = [];
  for (let i = 0; i < rows.length; i++) {
    let record: Record = {};
    for (let j = 0; j < fieldNames.length; j++) {
      record[fieldNames[j]] = rows[i][j];
    }
    dataSource.push(record)
  }
  return dataSource
}
