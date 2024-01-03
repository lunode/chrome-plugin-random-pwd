chrome.tabs.onCreated.addListener(function (tab) {
  console.log("打开新tab", tab);
});
