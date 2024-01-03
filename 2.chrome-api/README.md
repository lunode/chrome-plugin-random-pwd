## chrome extension api

和纯粹的 web 开发不一样, 在 chrome 插件的 web 代码中还可以使用 chrome extension 的特有 api, 以完成各种不同的插件特性.

**添加 js**:

按照 web 开发的惯性, 我们需要给 html 页面添加 js 来执行各种功能, 如果插件切换了目录, 则需要重新从本地导入插件, 如果插件的文件被修改, 则还需要 refresh 插件. (可以删除 1.start 的插件)

不过, chrome 插件有一个`Content Scurity Policy`, 通过 script 标签的内嵌脚本是不允许执行的, 只能通过 scirpt 标签引入外部 js 文件.

新建 index.js, 引入到 html 页面中

```js
// index.js
console.log("index.js");
// create方法返回promise实例, 这是一个异步函数
chrome.tabs.create({ url: "https://www.baidu.com" }); // 新建tab页, 打开百度
```

**风险**:

chrome 提供了很多 api, 方便插件调用, 但是通过`chrome-extension://`协议访问插件不是很便捷, 而且和其他站点一样, 用户可以同事打开 10 个插件的`index.html`, 这样页面引入的 js 代码也会执行 10 遍, 如果此时在调用了监听 api 或者其它监听事件, 则每个页面都会调用回调函数执行 10 遍, 这不是插件正确的使用方式.

除了通过 web 形式访问插件外, chrome 还提供了另外的方式

- service_worker
  通过在后台执行脚本, 来完成插件功能, service_worker 在 chrome 浏览器是单例后台线程, 不论开启多少 tabs 页, window 窗口, 都只有一个 service_worker 在执行.
- popup.html
  chrome 浏览器插件栏会显示用的插件, 点击插件则会打开 popup.html 页面, 如果 manifest.json 没有定义 popup.html, 则会跳出 chrome 提供的默认插件操作(如卸载插件等菜单).
