let storage = require('common/storage.js');
let mConfig = require('config/config.js');

let mHttp = {
    getConfig() {
        let config = {
            url: mConfig.domain,
        };

        //dev环境判断
        //Log.log('app.versionName', app.versionName);
        if (System.currentVersionName() == '6.3.5') {
            //config.url = 'http://192.168.10.57/';
            //config.url = 'http://192.168.43.146/';
            // config.url = 'http://192.168.43.38/';
            //config.url = 'http://192.168.119.38/';
        }
        return config;
    },

    post(controller, action, data, type) {
        let result = this.postBase(controller, action, data, type);
        if (result.code === 401) {
            return result;
        }
        return result;
    },

    postBase(controller, action, data, type) {
        let config = this.getConfig();
        if (type) {
            Log.log(config.url + controller + '/' + action);
        }
        //Log.log(controller + '/' + action);
        if (data.mobile) {
            config.mobile = data.mobile;
        }

        if (data.machine_id) {
            config.machine_id = data.machine_id;
        }

        let timestamp = Date.parse(new Date()) / 1000;
        let params = {
            timestamp: timestamp,
            machine_id: config.machine_id,
            mobile: config.mobile,
            secret: Security.md5(config.mobile + config.token + timestamp),
            data: data ? JSON.stringify(data) : '[]'
        };
        //{'contentType': "application/json"}
        let res = http.post(config.url + controller + '/' + action, params);
        let result = [];
        try {
            if (type === 1) {
                result = res.body.string();
                Log.log('服务器返回：', result);
            } else {
                result = res.body.json();
            }
        } catch (e) {
            Log.log(e);
        }
        if (result.code !== 0) {
            Log.log(controller + '/' + action, params, result);
        }

        if (action === 'getDateData') {
            Log.log(controller + '/' + action, params, result.length);
        } else {
            Log.log(controller + '/' + action, params, result);
        }

        return result;
    },

    postFile(controller, action, data, jsonParams) {
        let config = this.getConfig();
        if (!files) {
            files = 1;
        }
        let timestamp = Date.parse(new Date()) / 1000;
        let url = config.url;
        let content = JSON.stringify({
            timestamp: timestamp,
            machine_id: config.machine_id,
            mobile: config.mobile,
            secret: Security.md5(config.mobile + config.token + timestamp),
            data: data
        });

        let res;
        if (jsonParams.type == 2) {
            let params = {};
            for (let k in data.files) {
                let tmp = data.files[k].split('/');
                params['file' + k] = [tmp[tmp.length - 1] + '.' + jsonParams.ext, data.files[k]];
            }
            Log.log(params);
            params.content = Security.base64_encode(encodeURIComponent(content));
            res = http.postMultipart(url + controller + '/' + action, params);
        } else {
            res = http.postMultipart(url + controller + '/' + action, {
                content: Security.base64_encode(encodeURIComponent(content)),
                file: open(data.file)
            });
        }

        let result;
        if (jsonParams.string) {
            result = res.body.string();
        } else {
            result = res.body.json();
        }
        return result;
    },

    //没有更新的时候需要弹窗否 不填写则弹窗，填写则不弹窗
    is_alert: false,
    updateApp(noUpdateShow) {
        if (noUpdateShow && this.is_alert) {
            return false;
        }

        let config = this.getConfig();
        let timestamp = Date.parse(new Date()) / 1000;
        let params = {
            timestamp: timestamp,
            mobile: config.mobile,
            machine_id: config.machine_id,
            secret: Security.md5(config.mobile + config.token + timestamp),
            version: System.currentVersionCode(),
            appName: mConfig.name,
        };
        let _this = this;

        let str = '';
        for (let i in params) {
            str += '&' + i + '=' + params[i];
        }

        http.get(config.url + 'dke/checkAppVersion?data=' + JSON.stringify(params), {}, function (res) {
            //断网的情况下 更新已存在
            if (res === null) {
                let allFiles = files.listDir('/sdcard/dke/apk/');
                Log.log(allFiles);
                let maxFile = allFiles[0];
                for (let f in allFiles) {
                    if (allFiles[f] > maxFile) {
                        maxFile = allFiles[f];
                    }
                }
                return app.viewFile('/sdcard/dke/apk/' + maxFile);
            }
            res = res.body.json()
            if (noUpdateShow) {
                _this.is_alert = true;
            }
            Log.log(res);
            if (res.code == 0) {
                let newVersionApk = /[\d\.]+apk/.exec(res.data.url)[0];
                Dialogs.confirm("确定更新" + mConfig.name + "吗？", "", function (value) {
                    if (noUpdateShow) {
                        _this.is_alert = false;
                    }

                    if (value) {
                        //app.openUrl(res.data.url);
                        let fileDir = '/sdcard/dke/apk/' + newVersionApk;
                        files.ensureDir('/sdcard/dke/apk/');
                        Threads.start(function () {
                            //在新线程执行的代码

                            //首先查看本地 10分钟内文件是否存在，是的话直接安装
                            if (!files.exists(fileDir)) {
                                let re = http.get(res.data.url);
                                if (re.statusCode != 200) {
                                    return System.toast('下载失败');
                                }

                                System.toast('请耐心等待1-2分钟');
                                files.writeBytes(fileDir, re.body.bytes());
                                System.toast('下载完成');
                            }

                            app.viewFile(fileDir);
                        });
                    }
                });
            } else {
                if (!noUpdateShow) {
                    FloatDialogs.show(res.msg);
                }
            }
        });
    },
}

module.exports = mHttp;
