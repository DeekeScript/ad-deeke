export let config = {
    name: '嘀客',
    logo: 'dke',
    domain: 'https://dke.dkeapp.cn/',
    package: 'com.dke',
    weixin: ['dke_2019', 'dke2023'],
    dyVersion: 270301,//要求的抖音版本
    dyVersions: "27.3.1",//要求的抖音版本
    getDyVersion() {
        let manager = context.getPackageManager();
        let code = 0;
        try {
            let info = manager.getPackageInfo('com.ss.android.ugc.aweme', 0);
            code = info.versionCode;
        } catch (e) {
            return false;
        }
        return code;
    }
};
