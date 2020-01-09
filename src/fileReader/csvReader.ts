import Papa from 'papaparse';

import { DataSource, Record } from "../globalTypes";
interface ReservoirSamplingConfig {
  type: 'reservoirSampling',
  size: number
}

type SamplingConfig = ReservoirSamplingConfig | false | undefined;

const tickMode = 10000;

const maxWaitValue = 0.9999;

export function csvReader (file: File, config: SamplingConfig = false, onLoading?: (value: number) => void) {
  return new Promise((resolve, reject) => {
    if (!config) {
      pureSteamReader(file, resolve, reject, onLoading);
    } else {
      reservoirSampling(file, config.size, resolve, reject, onLoading);
    }
  })
}

function pureSteamReader (file: File, resolve: (value: any) => void, reject: (value: any) => void, onLoading?: (value: number) => void): void {
  const rows: any[] = [];
  let fields: string[] = [];
  let index = -1;
  let estimateRowNum = 1;
  Papa.parse(file, {
    worker: true,
    step (results) {
      if (index === -1) {
        fields = results.data;
        estimateRowNum = file.size / fields.join(',').length;
      } else {
        rows.push(results.data);
        onLoading && (index % tickMode === 0) && onLoading(Math.min(index / estimateRowNum, maxWaitValue))
      }
      index++;
    },
    complete () {
      const dataSource: DataSource = table2json(fields, rows);
      onLoading(1)
      resolve(dataSource)
    },
    error (err) {
      reject(err);
    }
  })
}

/**
 * todo reservoir sampling is better to support stream data
 * Algorithm R:
 * Vitter, Jeffrey S. (1 March 1985). "Random sampling with a reservoir" (PDF). ACM Transactions on Mathematical Software. 11 (1): 37–57. CiteSeerX 10.1.1.138.784. doi:10.1145/3147.3165.
 */
function reservoirSampling (file: File, size: number, resolve: (value: any) => void, reject: (value: any) => void, onLoading?: (value: number) => void): void {
  const rows: any[] = [];
  let fields: string[] = [];
  let index = -1;
  let estimateRowNum = 1;
  Papa.parse(file, {
    worker: true,
    step (results) {
      if (index === -1) {
        fields = results.data;
        estimateRowNum = file.size / fields.join(',').length;
      } else if (index < size) {
        rows.push(results.data);
      } else {
        let pos = Math.round(Math.random() * index);
        if (pos < size) {
          rows[pos] = results.data;
        }
      }
      onLoading && (index % tickMode === 0) && onLoading(Math.min(index / estimateRowNum, maxWaitValue))
      index++;
    },
    complete () {
      const dataSource: DataSource = table2json(fields, rows);
      onLoading(1)
      resolve(dataSource)
    },
    error (err) {
      reject(err);
    }
  })
}

function table2json (fieldNames: any[], rows: any[][]): DataSource {
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
