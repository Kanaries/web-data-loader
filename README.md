# web-data-loader
![](https://img.shields.io/github/license/kanaries/web-data-loader?color=%23FF7575)
![](https://img.shields.io/npm/v/@kanaries/web-data-loader?color=5BE7C6)
![](https://travis-ci.com/Kanaries/web-data-loader.svg?branch=master)

data loader for data analytic product in working in browser

web-data-loader allows you to load larget data files in browser. It supports stream data and runs in webworker which will not block the main thread while loading the data. web-data-loader also support stream data sampling, it now support `Reservoir Sampling` methods.

## Usage

### Install
```bash
npm i --save @kanaries/web-data-loader
```

### Examples
in your project file:

get user upload file
```html
<input type="file" id="#file" />
```

use web-data-loader to load the data with sampling.
```js
(document.querySelector("#file") as HTMLInputElement).onchange = (
  ev: Event
) => {
  const file = (ev.target as HTMLInputElement).files[0];
  FileReader.csvReader(
    file,
    {
      type: "reservoirSampling",
      size: 400
    },
    value => {
      console.log((value * 100).toFixed(2) + '%');
    }
  ).then(data => console.log(data));
  // FileReader.csvReader(file).then(data => console.log(data));
};

```

## Docs
documents can be found at [API Reference](https://kanaries.github.io/web-data-loader/)
