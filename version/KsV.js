let C40460 = require("version/ks/40460.js");

let VERSION = {
    "40460": C40460,
}

let version = App.getAppVersionCode('com.smile.gifmaker');
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
    FloatDialogs.show('提示', '当前快手版本号不支持！')
    System.exit();
}

let KsV = value;

module.exports = KsV;
