let C270301 = require("version/27.3.0.js");
let C290701 = require("version/29.7.0.js");
let C310701 = require("version/31.7.0.js");

let VERSION = {
    "270301": C270301,
    "290701": C290701,
    "310701": C310701,
}

let version = App.getAppVersionCode('com.ss.android.ugc.aweme');
let value = undefined;
for (let key in VERSION) {
    if (version === parseInt(key)) {
        value = VERSION[key];
        break;
    }
}

if (!value) {
    //版本号不对，直接停止
    FloatDialogs.show('提示', '当前抖音版本号不支持！')
    System.exit();
}

let V = value;

module.exports = V;
