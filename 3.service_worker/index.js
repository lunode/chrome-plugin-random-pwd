console.log("index.js");
// create方法返回promise实例, 这是一个异步函数

chrome.tabs.create({ url: "https://www.baidu.com" });
