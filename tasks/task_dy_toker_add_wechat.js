let tCommon = {
    openApp() {
        App.launch('com.tencent.mm');//打开抖音
        this.sleep(8000);
    },

    sleep(time) {
        time > 200 ? Log.log("js休眠时间：" + time) : null;
        System.sleep(time);
    },

    back(i, time, randTime) {
        if (i === undefined) {
            i = 1;
        }
        while (i--) {
            Gesture.back();
            if (!time) {
                this.sleep(700 + Math.random() * 200);
                continue;
            }

            if (randTime) {
                this.sleep(time + randTime * Math.random());
                continue;
            }
            this.sleep(time);
        }
        this.log('back ' + i);
    },

    click(tag, rate) {
        if (!rate) {
            rate = 0.05;
        }

        let p = 1 - rate * 2;
        let width = tag.bounds().width() * rate + Math.random() * (tag.bounds().width() * p);
        let height = tag.bounds().height() * rate + Math.random() * (tag.bounds().height() * p);

        try {
            Gesture.click(tag.bounds().left + Math.round(width), tag.bounds().top + Math.round(height));
        } catch (e) {
            this.log(e);
            try {
                Gesture.click(tag.bounds().left + Math.round(width), tag.bounds().top);
            } catch (e) {
                this.log(e);
                return false;
            }
        }

        this.sleep(500);
        return true;
    },

    showToast(msg) {
        System.toast(msg);
        Log.log(msg);
    },

    log() {
        //这里需要做日志记录处理
        Log.log(arguments);
    },
};

let storage = require("common/storage");

let task = {
    backHome() {
        tCommon.openApp();
        let i = 0;
        while (i++ < 5) {
            let homeTag = UiSelector().text("微信").findOnce();
            if (!homeTag || !homeTag.parent() || !homeTag.parent().isVisibleToUser()) {
                Log.log(UiSelector().text('微信').findOnce());
                tCommon.back();
                tCommon.sleep(1000);
                continue;
            }
            Log.log("找到了homeTag");
            break;
        }
        return true;
    },
    run(mobiles, second) {
        for (let mobile of mobiles) {
            this.intoHome();
            try {
                if (storage.get('task_dy_toker_add_wechat_' + mobile, 'bool')) {
                    Log.log('已经添加了：' + mobile);
                    continue;
                }
                this.runTask(mobile);
                storage.set('task_dy_toker_add_wechat_' + mobile, true);
                tCommon.sleep(second * 1000 + second * 1000 * Math.random());
            } catch (e) {
                Log.log(e);
            }
            this.backHome();
        }
        return true;
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-dy-toker-add-wechat-" + file + ".txt";
        Log.setFile(allFile);
    },

    intoHome() {
        let wechatTag = UiSelector().text('微信').findOne();
        if (!wechatTag.isSelected()) {
            tCommon.click(wechatTag);
            System.sleep(1000 + 1000 * Math.random());
        }
    },

    runTask(mobile) {
        let addTag = UiSelector().className('android.widget.Button').desc('更多功能').findOne();
        if (!addTag) {
            throw new Error('找不到添加入口');
        }

        tCommon.click(addTag);
        System.sleep(1000 + 1000 * Math.random());

        let addWechatTag = UiSelector().text('添加朋友').findOne();
        if (!addWechatTag) {
            throw new Error('找不到添加朋友入口');
        }

        tCommon.click(addWechatTag.parent().parent());
        System.sleep(1000 + 1000 * Math.random());

        let tag = UiSelector().className('android.widget.ListView').id('android:id/list').isVisibleToUser(true).findOne();

        let inputTag = tag.children().getChildren(0);
        Gesture.click(inputTag.bounds().left + inputTag.bounds().width() * (0.6 * Math.random() + 0.2), inputTag.bounds().top + inputTag.bounds().height() * (0.6 * Math.random() + 0.2));

        System.sleep(1000 + 1000 * Math.random());

        let input = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).findOne();
        if (!input) {
            throw new Error('找不到输入框');
        }
        System.setClip(mobile);
        input.paste();
        System.sleep(1000 + 1000 * Math.random());

        let btn = UiSelector().text('搜索:' + mobile).findOne();
        if (!btn) {
            throw new Error('找不到btn');
        }
        tCommon.click(btn);
        System.sleep(3000 + 3000 * Math.random());


        let btnAdd = UiSelector().text('添加到通讯录').findOne();
        if (!btnAdd) {
            if (UiSelector().text('该用户不存在').findOne()) {
                Log.log('找不到账号：' + mobile);
                tCommon.back(2);
                return true;
            }
            throw new Error('找不到btnAdd');
        }
        tCommon.click(btnAdd);
        System.sleep(2000 + 2000 * Math.random());

        let sendTag = UiSelector().text('发送').findOne();
        if (!sendTag) {
            throw new Error('找不到sendTag');
        }
        tCommon.click(sendTag);
        System.sleep(4000 + 3000 * Math.random());
        tCommon.back(3);
    }
}


let accounts = storage.get('task_dy_toker_add_wechat_mobile');
Log.log('accounts', accounts);
if (!accounts) {
    tCommon.showToast('你取消了执行');
    //console.hide();();
    System.exit();
}
accounts = accounts.split("\n");

tCommon.openApp();//兜底，防止跑到外面去了

while (true) {
    task.log();
    try {
        //开启线程  自动关闭弹窗
        if (task.run(accounts, 5)) {
            FloatDialogs.show('提示', '执行完成');
            break;
        }
        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e, '遇到错误，即将自动重启');
        try {
            tCommon.showToast("遇到错误，即将自动重启");
            tCommon.sleep(3000);
            task.backHome();
        } catch (e) {
            Log.log('启停bug', e);
        }
    }
}
