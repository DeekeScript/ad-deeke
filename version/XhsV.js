let C8380 = require("version/xhs.8.38.0.js");

let version = App.getAppVersionCode('com.xingin.xhs');
if (version < "8842121") {
    //版本号不对，直接停止
    FloatDialogs.show('提示', '请将小红薯升级到8.84.2以上版本')
    System.exit();
}

module.exports = C8380;
