const isChromeExtension = !!(
  typeof chrome !== "undefined" &&
  chrome.runtime &&
  chrome.runtime.id
);
console.log("isChromeExtension: ", isChromeExtension);
if (!isChromeExtension) {
  window.chrome = {
    runtime: {},
    storage: {
      local: {
        get: (keys, callback) => {
          const result = {};
          if (!keys) {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              let value = localStorage.getItem(key);
              try {
                let obj = JSON.parse(value);
                value = obj;
              } catch (err) {}
              console.log(key, value);
              result[key] = value;
            }
            callback && callback(result);
            return Promise.resolve(result);
          }
          if (Array.isArray(keys)) {
            keys.forEach((key) => {
              result[key] = localStorage.getItem(key);
            });
          } else if (typeof keys === "string") {
            result[keys] = localStorage.getItem(keys);
          } else if (typeof keys === "object") {
            Object.keys(keys).forEach((key) => {
              result[key] = localStorage.getItem(key) || keys[key];
            });
          }
          callback && callback(result);
          return Promise.resolve(result);
        },
        set: (items, callback) => {
          Object.keys(items).forEach((key) => {
            const v = items[key];
            const value = typeof v == "string" ? v : JSON.stringify(v);
            localStorage.setItem(key, value);
          });
          if (callback) callback();
          return Promise.resolve(true);
        },
        remove: (keys, callback) => {
          if (Array.isArray(keys)) {
            keys.forEach((key) => {
              localStorage.removeItem(key);
            });
          } else {
            localStorage.removeItem(keys);
          }
          if (callback) callback();
          return Promise.resolve(true);
        },
        clear: (callback) => {
          localStorage.clear();
          if (callback) callback();
          return Promise.resolve(true);
        },
      },
    },
  };
}
