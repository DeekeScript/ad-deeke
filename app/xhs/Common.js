import { storage as cStorage } from 'common/storage.js';
import { XhsV as V } from 'version/XhsV.js';

const Common = {
    //封装的方法
    logs: [],
    id(name) {
        return UiSelector().id('com.xingin.xhs:id/' + name);
    },

    aId(name) {
        //android:id/text1
        return UiSelector().id('android:id/' + name);
    },

    sleep(time) {
        time > 200 ? Log.log("js休眠时间：" + time) : null;
        System.sleep(time);
    },

    packageName() {
        return 'com.xingin.xhs';
    },

    backHome() {
        this.openApp();
        let i = 0;
        while (i++ < 5) {
            let homeTag = this.id(V.Common.backHome[0]).isVisibleToUser(true).findOnce();
            if (!homeTag) {
                this.back();
                this.sleep(2000);
                continue;
            }
            Log.log("找到了homeTag");
            break;
        }
        return true;
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

    openApp() {
        this.log('openApp', System.currentPackage(), cStorage.getPackage());
        if (cStorage.getPackage() && System.currentPackage() !== cStorage.getPackage() && cStorage.getPackage() !== 'top.deeke.script') {
            App.launch(cStorage.getPackage());
            this.sleep(2000);
        }

        App.launch('com.xingin.xhs');//打开抖音
        this.sleep(8000);
    },

    backApp() {
        App.backApp();
    },


    log() {
        //这里需要做日志记录处理
        Log.log(arguments);
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

    numDeal(text) {
        text = /[\d\.]+[\w|万]*/.exec(text);
        if (!text) {
            return 0;
        }

        if (text[0].indexOf('w') !== -1 || text[0].indexOf('W') !== -1 || text[0].indexOf('万') !== -1) {
            text[0] = text[0].replace('w', '').replace('W', '').replace('万', '') * 10000;
        }
        return text[0] * 1;
    },

    swipe(type, sensitivity) {
        let left = Math.random() * Device.width() * 0.8 + Device.width() * 0.2;
        let bottom = Device.height() * 2 / 3 * sensitivity + Device.height() / 6 * Math.random();
        let top = Device.height() / 12 + Device.height() / 12 * Math.random();
        if (!type) {
            Gesture.swipe(left, bottom, left, top, 200 + 100 * Math.random());//从下往上推，清除
            return true;
        }
        Gesture.swipe(left, top, left, bottom, 200 + 100 * Math.random());//从上往下滑
    },

    swipeSearchUserOp() {
        this.swipeSearchUserOpTarge = this.id(V.Common.swipeSearchUserOp[0]).scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == Device.width() && v.bounds().top >= 0;
        }).findOnce();

        if (this.swipeSearchUserOpTarge) {
            this.swipeSearchUserOpTarge.scrollForward();
        } else {
            Log.log('滑动失败');
        }
    },

    swipeRecommendListOp() {
        this.swipeFansListOpTarge = this.id(V.Common.swipeFansListOp[0]).scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == Device.width() && v.bounds().top >= 0;
        }).findOnce();

        if (this.swipeFansListOpTarge) {
            this.swipeFansListOpTarge.scrollForward();
        } else {
            Log.log('滑动失败');
        }
        //Log.log(this.swipeFansListOpTarge);
    },


    swipeFansListOp() {
        this.swipeFansListOpTarge = this.id(V.Common.swipeFansListOp[0]).scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == Device.width() && v.bounds().top >= 0;
        }).findOnce();

        if (this.swipeFansListOpTarge) {
            this.swipeFansListOpTarge.scrollForward();
        } else {
            Log.log('滑动失败');
        }
        //Log.log(this.swipeFansListOpTarge);
    },

    swipeFocusListOp() {
        this.swipeFocusListOpTarge = this.id(V.Common.swipeFocusListOp).scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == Device.width() && v.bounds().top >= 0;
        }).findOnce();
        if (this.swipeFocusListOpTarge) {
            this.swipeFocusListOpTarge.scrollForward();
        } else {
            Log.log('滑动失败');
        }
    },

    swipeCommentListOp() {
        this.swipeCommentListOpTarget = this.id(V.Common.swipeCommentListOp[0]).scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == Device.width() && v.bounds().top >= 0;
        }).findOnce();
        if (this.swipeCommentListOpTarget) {
            this.swipeCommentListOpTarget.scrollForward();
        } else {
            Log.log('滑动失败');
        }
        //Log.log(this.swipeCommentListOpTarget);
    },

    //关闭弹窗
    closeAlert() {
        this.log('开启线程监听弹窗');
        let k = 0;

        while (true) {
            //检测是否只有当前的线程，是的话则关闭
            try {
                let a = this.id('close').findOne();
                if (a) {
                    a.click();
                    Log.log(a);
                    Log.log("可能的弹窗点击了");
                }

                this.sleep(200);
                if (k % 50 == 0) {
                    Log.log("对象清理");
                    System.cleanUp();//清理线程垃圾
                    k = 0;
                }
                k++;
            } catch (e) {
                console.log("线程中断状态：", Engines.isInterrupted());
                if (Engines.isInterrupted()) {
                    Log.log("线程被外部中断");
                    break;
                }
                this.log("close dialog 异常了");
                this.log(e);
            }
        }
    },

    sleepFunc(func, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }
        func();
        this.sleep(time + randomTime * Math.random());
    },

    toast(msg, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }

        //toast(msg);
        this.log(msg);
        if (time) {
            this.sleep(time + randomTime * Math.random());
        }
    },

    showToast(msg) {
        System.toast(msg);
        Log.log(msg);
    },

    //关键词拆分
    splitKeyword(keyword) {
        keyword = keyword.replace(/，/g, ',');
        keyword = keyword.split(',');
        let ks = [];
        for (let i in keyword) {
            let tmp = keyword[i];
            if (keyword[i].indexOf('&') !== -1) {
                tmp = keyword[i].split('&');
            } else if (keyword[i].indexOf('+') !== -1) {
                tmp = keyword[i].split('+');
            }
            ks.push(tmp);
        }
        return ks;
    },

    containsWord(contain, title) {
        contain = this.splitKeyword(contain);
        for (let con of contain) {
            if (typeof (con) === 'string' && title.indexOf(con) !== -1) {
                return [con];
            }

            if (typeof (con) === 'object') {
                let _true = true;
                for (let i in con) {
                    if (title.indexOf(con[i]) === -1) {
                        _true = false;
                    }
                }
                if (_true) {
                    return con;
                }
            }
        }
        return false;
    },
}

module.exports = { Common };
