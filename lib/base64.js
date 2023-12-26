(function (base64Factory) {
  // node/commonjs
  if (typeof exports == "object") {
    exports.base64 = base64Factory();
  } else if (typeof define == "function" && define.amd) {
    // amd
    define(base64Factory); // don't call
  } else {
    var g;
    try {
      g = window; // browser
    } catch {
      g = self; // browser works
    }
    g.base64 = base64Factory();
  }
  //
})(function () {
  // Base64 编码
  function encode(str) {
    const encoder = new TextEncoder("utf-8");
    bytes = encoder.encode(str);
    return btoa(String.fromCharCode.apply(null, bytes));
  }

  // Base64 解码
  function decode(str) {
    const binaryString = atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
  }
  return {
    encode,
    decode,
  };
});
