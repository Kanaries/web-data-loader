import { FileReader } from "../src/index";

const progressEle: HTMLDivElement = document.querySelector('#progress');
progressEle.style.width = '0%';

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
      const progressEle: HTMLDivElement = document.querySelector('#progress')
      progressEle.style.width =(value * 100).toFixed(2) + '%'
    }
  ).then(data => console.log(data));
  // FileReader.csvReader(file).then(data => console.log(data));
};
