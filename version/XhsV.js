let C8380 = require("version/xhs.8.38.0.js");

let VERSION = {
    "8380830": C8380,
}

let version = App.getAppVersionCode('com.xingin.xhs');
let value = undefined;
for (let key in VERSION) {
    console.log('版本号比较：', version, key);//版本号比较： 8380830 8.38.0
    if (version === parseInt(key)) {
        value = VERSION[key];
        break;
    }
}

if (!value) {
    //版本号不对，直接停止
    FloatDialogs.show('提示', '当前小红薯版本号不支持！')
    System.exit();
}

let XhsV = value;

module.exports = XhsV;
