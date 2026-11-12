let written = '';

let names = {
    'com.ss.android.ugc.aweme': '抖音',
    'com.xingin.xhs': '小红书',
    'com.smile.gifmaker': '快手',
    'com.tencent.mm': '微信'
};

function appVersion() {
    try {
        return App.currentVersionName() + '(' + App.currentVersionCode() + ')';
    } catch (e) {
        return '未知';
    }
}

function targetVersion(packageName) {
    let name = names[packageName] || packageName || '目标应用';
    try {
        return name + '版本 ' + App.getAppVersionName(packageName) + '(' + App.getAppVersionCode(packageName) + ')';
    } catch (e) {
        return name + '版本 未安装';
    }
}

function phone() {
    let text = Device.brand() + ' ' + Device.model() + ' Android ' + Device.androidVersion() + ' SDK ' + Device.sdkInt();
    try {
        text += ' 分辨率 ' + Device.width() + 'x' + Device.height();
    } catch (e) {
    }
    return text;
}

module.exports = {
    /**
     * 日志文件就绪后写入当前 App、对应应用和手机信息。同一轮任务只写一次。
     * @param {string} packageName 正在操作的应用包名
     */
    write(packageName) {
        if (written === packageName) {
            return;
        }
        written = packageName;
        try {
            Log.log('运行环境 App版本 ' + appVersion() + '；' + targetVersion(packageName) + '；手机 ' + phone());
        } catch (e) {
            try {
                Log.log('运行环境读取失败 ' + e);
            } catch (ignore) {
            }
        }
    }
};
