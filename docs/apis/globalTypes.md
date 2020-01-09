# global types

## Record / DataSource
```js
interface Record {
  [key: string]: any
}

type DataSource = Record[];
```

## ProgressCallback

value is percentage of the loading process, it's an estimate value.

```js
type ProgressCallback = (value: number) => void;
```