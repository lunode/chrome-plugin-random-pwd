/**
 * @type {HTMLDivElement}
 */
const input = document.querySelector(".input");
const output = document.querySelector(".output");
const md5en = document.querySelector("#md5en");
const b64en = document.querySelector("#b64en");
const b64de = document.querySelector("#b64de");
const sha1en = document.querySelector("#sha1en");
const sha256en = document.querySelector("#sha256en");
const uuidgen = document.querySelector("#uuidgen");
const checkboxParent = document.querySelector(".checkbox-parent");
const lengthInput = document.querySelector("#length");
const randomStr = document.querySelector("#randomstr");
const randowPwd = document.querySelector("#randowPwd");
const publicKey = document.querySelector("#publicKey");
const privateKey = document.querySelector("#privateKey");
const algorithm = document.querySelector("#algorithm");
const jwten = document.querySelector("#jwten");
const jwtde = document.querySelector("#jwtde");
const urien = document.querySelector("#urien");
const uride = document.querySelector("#uride");
const urlen = document.querySelector("#urlen");
const urlde = document.querySelector("#urlde");
const timestamp = document.querySelector("#timestamp");
const timestampTransform = document.querySelector("#timestamp-transform");

// read cache to view
const checkboxArr = [
  "number",
  "lowercase",
  "uppercase",
  "bang",
  "at",
  "sharp",
  "dollar",
  "percent",
  "caret",
  "and",
  "wildcard",
  "underscore",
  "others",
];
chrome.storage.local
  .get([
    "inputCache",
    "outputCache",
    ...checkboxArr,
    "length",
    "publicKey",
    "privateKey",
    "algorithm",
  ])
  .then((res) => {
    console.log(res);
    input.textContent = res.inputCache || "";
    output.textContent = res.outputCache || "";
    lengthInput.value = res.length || 12;
    // publicKey.textContent = res.publicKey || "";
    // privateKey.textContent = res.privateKey || "";
    // algorithm.value = res.algorithm || "";
    checkboxArr.forEach((item) => {
      if (res[item] == undefined) return;
      const ele = document.querySelector("#" + item);
      ele.checked = res[item] === "true" ? true : false;
    });
  });
document.addEventListener("change", async (e) => {
  console.log("change event:", e, e.target.value);
  if (e.target.type == "checkbox") {
    console.log("checkbox");
    await chrome.storage.local.set({
      [e.target.id]: e.target.checked ? "true" : "false",
    });
  } else if (e.target.type.indexOf("input") > -1) {
    console.log("input");
    await chrome.storage.local.set({
      [e.target.id]: e.target.value,
    });
  } else if (e.target.type.indexOf("select") > -1) {
    console.log("select");
    await chrome.storage.local.set({
      [e.target.id]: e.target.value,
    });
  } else if (e.target.type.indexOf("number" > -1)) {
    console.log("number");
    await chrome.storage.local.set({
      [e.target.id]: e.target.value,
    });
  }
});
// handle chinese input, cache input for next browser
document.addEventListener("compositionstart", (e) => {
  const key = e.target.dataset.key;
  if (!key) {
    return;
  }
  e.target._isInput = true;
});
document.addEventListener("compositionend", (e) => {
  const key = e.target.dataset.key;
  if (!key) {
    return;
  }
  e.target._isInput = false;
});
document.addEventListener("keyup", async (e) => {
  const key = e.target.dataset.key;
  if (!key) {
    return;
  }
  if (e.target._isInput) {
    return;
  }
  await chrome.storage.local.set({ [key]: e.target.textContent });
});
document.addEventListener("paste", async (e) => {
  const key = e.target.dataset.key;
  if (!key) {
    return;
  }
  await chrome.storage.local.set({ [key]: e.target.textContent });
});
// output to view
function render(value) {
  if (value instanceof Error) {
    output.classList.add("error");
    output.textContent = value.message;
    chrome.storage.local.set({ outputCache: value.message });
  } else {
    output.classList.remove("error");
    output.textContent = value;
    chrome.storage.local.set({ outputCache: value });
  }
}

var encryptCurried = (fn) => () => {
  try {
    if (!input.textContent) {
      return render(new Error("检测到输入为空"));
    }
    render(fn(input.textContent));
  } catch (err) {
    render(new Error(err.message || "生成错误"));
  }
};
var asyncEncryptCurried = (fn) => async () => {
  try {
    if (!input.textContent) {
      return render(new Error("检测到输入为空"));
    }
    render(await fn(input.textContent));
  } catch (err) {
    render(new Error(err.message || "生成错误"));
  }
};
var genCurried =
  (fn, message = "生成失败,您的浏览器可能版本过低,不支持最新的Crypto Api") =>
  () => {
    try {
      render(fn(input.textContent));
    } catch (err) {
      render(new Error(message));
    }
  };
var uuidGenerator = genCurried(uuid.v4);
var randomPassword = genCurried(random.genPwd.bind(null, 12, "@#$"));
var md5encrypt = encryptCurried(SparkMD5.hash);
var base64encrypt = encryptCurried(base64.encode);
var sha1encrypt = asyncEncryptCurried(sha.sha1);
var sha256encrypt = asyncEncryptCurried(sha.sha256);
var base64decrypt = encryptCurried(base64.decode);
var uriEncode = encryptCurried(encodeURI);
var uriDecode = encryptCurried(decodeURI);
var urlEncode = encryptCurried(encodeURIComponent);
var urlDecode = encryptCurried(decodeURIComponent);
var timestampHandle = genCurried(Date.now, "生成时间戳失败");
var timestampTransformHandle = encryptCurried(function (content) {
  console.log(content);
  if (Number.isNaN(Number(content))) {
    const timestamp = Date.parse(content);
    return Number.isNaN(timestamp)
      ? new Error("时间或时间戳格式不正确")
      : timestamp;
  } else {
    console.log(false);
    const dateString = new Date(Number(content)).toLocaleString();
    return dateString == "Invalid Date"
      ? new Error("时间或时间戳格式不正确")
      : dateString;
  }
});
async function randomStrByConfig() {
  try {
    const res = await chrome.storage.local.get([...checkboxArr, "length"]);
    const config = {};
    checkboxArr.forEach((item) => {
      if (res[item] == undefined) {
        const ele = document.querySelector("#" + item);
        config[item] = ele.checked;
        return;
      }
      config[item] = res[item] === "true" ? true : false;
    });
    config.length = Number(res.length || lengthInput.value);
    const randomStr = random.genStr(config);
    render(randomStr);
  } catch (err) {
    render(new Error("生成失败"));
  }
}
// async function jwtEncrypt() {
//   const res = await chrome.storage.local.get([
//     "publicKey",
//     "privateKey",
//     "algorithm",
//   ]);
//   const payload = input.textContent;
//   const header = {
//     alg: res.algorithm,
//     typ: "JWT",
//   };
//   const jwtToken = encryptCurried(jwt.genToken.bind(null, payload));
// }
// function jwtDecrypt() {}

md5en.addEventListener("click", md5encrypt);
b64en.addEventListener("click", base64encrypt);
b64de.addEventListener("click", base64decrypt);
// jwtde.addEventListener("click", jwtdecrypt);
sha1en.addEventListener("click", sha1encrypt);
sha256en.addEventListener("click", sha256encrypt);
uuidgen.addEventListener("click", uuidGenerator);
randomStr.addEventListener("click", randomStrByConfig);
randowPwd.addEventListener("click", randomPassword);
urien.addEventListener("click", uriEncode);
uride.addEventListener("click", uriDecode);
urlen.addEventListener("click", urlEncode);
urlde.addEventListener("click", urlDecode);
timestamp.addEventListener("click", timestampHandle);
timestampTransform.addEventListener("click", timestampTransformHandle);
// jwten.addEventListener("click", jwtEncrypt);
// jwtde.addEventListener("click", jwtDecrypt);
