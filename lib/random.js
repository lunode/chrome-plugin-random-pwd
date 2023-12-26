(function (randomFactory) {
  // node/commonjs
  if (typeof exports == "object") {
    exports.random = randomFactory();
  } else if (typeof define == "function" && define.amd) {
    // amd
    define(randomFactory); // don't call
  } else {
    var g;
    try {
      g = window; // browser
    } catch {
      g = self; // browser works
    }
    g.random = randomFactory();
  }
  //
})(function () {
  function genRandomCharacters(config) {
    let characters = "";
    if (config.number) {
      characters += "0123456789";
    }
    if (config.lowercase) {
      characters += "abcdefghijklmnopqrstuvwxyz";
    }
    if (config.uppercase) {
      characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (config.bang) {
      characters += "!";
    }
    if (config.at) {
      characters += "@";
    }
    if (config.sharp) {
      characters += "#";
    }
    if (config.dollar) {
      characters += "$";
    }
    if (config.percent) {
      characters += "%";
    }
    if (config.caret) {
      characters += "^";
    }
    if (config.and) {
      characters += "&";
    }
    if (config.wildcard) {
      characters += "*";
    }
    if (config.underscore) {
      characters += "_";
    }
    if (config.others) {
      characters += "()+[]{}|;:,.<>?";
    }
    return characters;
  }
  function genStr(config) {
    const allCharacters = genRandomCharacters(config);
    console.log(allCharacters);
    const length = config.length;
    let str = "";
    // Generate the remaining characters randomly
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      str += allCharacters.charAt(randomIndex);
    }
    // Shuffle the characters to make the password more random
    str = str
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return str;
  }
  function getRandomCharacter(characters) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
  }
  /**
   * @param {number} length 生成密码长度
   * @param {string} specCharacters 自定义特殊符号, 默认 !@#$%^&*()_+[]{}|;:,.<>?
   */
  function genPwd(length, specCharacters = "!@#$%^&*()_+[]{}|;:,.<>?") {
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    let allCharacters = uppercaseLetters + lowercaseLetters + numbers;
    // 如果用户选择包含特殊字符，则将其加入字符集
    if (specCharacters) {
      allCharacters += specCharacters;
    }
    let password = "";
    // Ensure at least one character from each category
    password += getRandomCharacter(uppercaseLetters);
    password += getRandomCharacter(lowercaseLetters);
    password += getRandomCharacter(numbers);

    // 如果包含特殊字符，添加一个特殊字符
    if (specCharacters) {
      password += getRandomCharacter(specCharacters);
    }
    // 生成其余字符
    for (let i = password.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      password += allCharacters.charAt(randomIndex);
    }
    // 打乱字符顺序，增加随机性
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    return password;
  }
  return {
    genStr,
    genPwd,
  };
});
