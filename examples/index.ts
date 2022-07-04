import { FileReader } from "../src/index";

const progressEle: HTMLDivElement = document.querySelector('#progress')!;
progressEle.style.width = '0%';

(document.querySelector("#file") as HTMLInputElement).onchange = (
  ev: Event
) => {
  const file = (ev.target as HTMLInputElement).files![0];
  FileReader.csvReader({
    file,
    // encoding: 'GB2312',
    config: {
      type: "reservoirSampling",
      size: 400
    },
    onLoading: value => {
      console.log((value * 100).toFixed(2) + '%');
      const progressEle: HTMLDivElement = document.querySelector('#progress')!
      progressEle.style.width =(value * 100).toFixed(2) + '%'
    }
  }).then(data => console.log(data));
  // FileReader.csvReader(file).then(data => console.log(data));
};

// (document.querySelector("#file") as HTMLInputElement).onchange = (
//   ev: Event
// ) => {
//   const file = (ev.target as HTMLInputElement).files![0];
//   FileReader.netCDFReader({
//     file,
//     // encoding: 'binary'
//     encoding: 'NC_CHAR'
//   }).then(data => console.log(data));
//   // FileReader.csvReader(file).then(data => console.log(data));
// };

// fetch("http://localhost:1234/").then((response) => {
//   const reader = response.body!.getReader();
//   const stream = new ReadableStream({
//     start(controller) {
//       // 下面的函数处理每个数据块
//       function push() {
//         // "done"是一个布尔型，"value"是一个Unit8Array
//         reader.read().then(({ done, value }) => {
//           console.log(value);
//           // 判断是否还有可读的数据？
//           if (done) {
//             // 告诉浏览器已经结束数据发送。
//             controller.close();
//             return;
//           }

//           // 取得数据并将它通过controller发送给浏览器。
//           controller.enqueue(value);
//           push();
//         });
//       }

//       push();
//     },
//   });

//   return new Response(stream, { headers: { "Content-Type": "text/html" } });
// });