import html2canvas from "html2canvas";

export const fileToBase64 = file => {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader();
    let imgResult = '';
    reader.readAsDataURL(file);
    reader.onload = function () {
      imgResult = reader.result;
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.onloadend = function () {
      resolve(imgResult);
    };
  });
}


/* 
@Description: 根据元素生成base64图片
*/
export const srceenshot = (selector) => {
  return new Promise((resolve, reject) => {
    const dom = document.querySelector(selector);
    html2canvas(dom)
      .then((canvas) => {
        const base64 = canvas.toDataURL();
        resolve(base64);
      })
      .catch(() => reject());
  });
}
export const toHump = (name) => {
  name = name.toLowerCase()
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
};