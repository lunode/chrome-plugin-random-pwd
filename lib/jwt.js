(function (jwtFactory) {
  // node/commonjs
  if (typeof exports == "object") {
    exports.jwt = jwtFactory();
  } else if (typeof define == "function" && define.amd) {
    // amd
    define(jwtFactory); // don't call
  } else {
    var g;
    try {
      g = window; // browser
    } catch {
      g = self; // browser works
    }
    g.jwt = jwtFactory();
  }
  //
})(function () {
  function genToken(payload, secretOrPrivateKey, algorithm = "HS256") {
    const base64UrlEncode = (input) =>
      btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const encodedHeader = base64UrlEncode(
      JSON.stringify({ alg: algorithm, typ: "JWT" })
    );
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    let signature;
    switch (algorithm) {
      case "HS256":
      case "HS384":
      case "HS512":
        signature = generateHMACSignature(
          `${encodedHeader}.${encodedPayload}`,
          secretOrPrivateKey,
          algorithm
        );
        break;
      case "RS256":
      case "RS384":
      case "RS512":
      case "ES256":
      case "ES384":
      case "ES512":
        signature = generateRSASignature(
          `${encodedHeader}.${encodedPayload}`,
          secretOrPrivateKey,
          algorithm
        );
        break;
      // Add support for other algorithms as needed
      default:
        throw new Error("Unsupported algorithm");
    }

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  function generateHMACSignature(message, secret, algorithm) {
    const encoder = new TextEncoder();
    const key = encoder.encode(secret);

    return crypto.subtle
      .importKey(
        "raw",
        key,
        { name: "HMAC", hash: { name: algorithm } },
        false,
        ["sign"]
      )
      .then((key) => crypto.subtle.sign("HMAC", key, encoder.encode(message)))
      .then((signature) => {
        const signatureArray = new Uint8Array(signature);
        return btoa(String.fromCharCode(...signatureArray))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      });
  }

  function generateRSASignature(message, privateKey, algorithm) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(privateKey);

    return crypto.subtle
      .importKey(
        "pkcs8",
        keyData,
        { name: "RSASSA-PKCS1-v1_5", hash: { name: algorithm } },
        false,
        ["sign"]
      )
      .then((privateKey) =>
        crypto.subtle.sign(
          "RSASSA-PKCS1-v1_5",
          privateKey,
          encoder.encode(message)
        )
      )
      .then((signature) => {
        const signatureArray = new Uint8Array(signature);
        return btoa(String.fromCharCode(...signatureArray))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      });
  }
  return {
    genToken,
    // decodeToken,
  };
});
