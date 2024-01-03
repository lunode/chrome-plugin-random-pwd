## service worker

service worker 是插件运行在后台的单例线程, 可以通过 service worker 来处理插件的功能需求.

**修改 manifest.json, 引入 service worker**:

```json
{
  "manifest_version": 3,
  "version": "0.0.1",
  "description": "test",
  "name": "测试插件",
  "background": {
    "service_worker": "service_worker.js"
  }
}
```

**新建 service_worker.js**

```js
chrome.tabs.onCreated.addListener(function (tab) {
  console.log("打开新tab", tab);
});
```

这个脚本不需要从 html 文件引入, chrome 会自动运行这个脚本, 但这样就无法和页面一样调试脚本, 打开`chrome extension`的`开发者`模式后, 回出现一个`Service Worker`链接, 点解链接就可以打开 chrome 控制台进行调试`service_worker.js`了.

<img src='../\_img/service_worker_debug.png' width="320px" />

关于插件的功能, 基本都可以在`service_worker.js`里面调用 chorme 的 api 来完成, 除了`service_worker`外, 还有一个`popup.html`也是 chrome 插件常用的功能
