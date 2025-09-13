let C2760 = require("version/wx/2760.js");
let C2841 = require("version/wx/2841.js");

let VERSION = {
    "2760": C2760,
    "2841": C2841,
}

let version = App.getAppVersionCode('com.tencent.mm');
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
    FloatDialogs.show('提示', '当前微信版本号不支持！')
    System.exit();
}

let WxV = value;

module.exports = WxV;
