(function (uuidFactory) {
  // node/commonjs
  if (typeof exports == "object") {
    exports.uuid = uuidFactory();
  } else if (typeof define == "function" && define.amd) {
    // amd
    define(uuidFactory); // don't call
  } else {
    var g;
    try {
      g = window; // browser
    } catch {
      g = self; // browser works
    }
    g.uuid = uuidFactory();
  }
  //
})(function () {
  function uuid() {
    const cryptoObj = window.crypto || window.msCrypto; // for IE 11
    if (!cryptoObj) {
      throw new Error("not support");
      return null;
    }
    const buffer = new Uint8Array(16);
    cryptoObj.getRandomValues(buffer);

    // Set the version (4) and variant (2) bits
    buffer[6] = (buffer[6] & 0x0f) | 0x40; // version 4
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // variant 2

    // Convert to hexadecimal representation
    const segments = [];
    for (let i = 0; i < 16; i++) {
      segments.push((buffer[i] + 0x100).toString(16).substring(1));
    }
    // Insert hyphens at the appropriate positions
    segments.splice(2, 0, "-");
    segments.splice(5, 0, "-");
    segments.splice(8, 0, "-");
    segments.splice(11, 0, "-");

    return segments.join("");
  }
  return {
    v4: uuid,
  };
});
