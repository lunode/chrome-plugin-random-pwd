(function (shaFactory) {
  // node/commonjs
  if (typeof exports == "object") {
    exports.sha = shaFactory();
  } else if (typeof define == "function" && define.amd) {
    // amd
    define(shaFactory); // don't call
  } else {
    var g;
    try {
      g = window; // browser
    } catch {
      g = self; // browser works
    }
    g.sha = shaFactory();
  }
  //
})(function () {
  async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // 将散列结果转换为十六进制字符串
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }
  async function sha1(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // 将散列结果转换为十六进制字符串
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }
  return {
    sha256,
    sha1,
  };
});
