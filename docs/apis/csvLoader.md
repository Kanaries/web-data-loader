## csvLoader

## SamplingConfig
+ `ReservoirSamplingConfig` | `false` | `undefined`;

+ ReservoirSamplingConfig
  + type: 'reservoirSampling'
  + size: number, sample size(number of records left)

## csvReader
csvReader. load, parse and sampling for csv file in stream.
+ @param file File Type
+ @param config 
+ @param onLoading loading process callback

## table2json
table to json
+ @param fieldNames list of field name, normally the first row of csv.
+ @param rows data rows. the rest rows of csv.