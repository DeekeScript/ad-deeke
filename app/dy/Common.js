
let cStorage = require('common/storage.js');
let V = require('version/V.js');

const Common = {
    //封装的方法
    logs: [],
    id(name) {
        return UiSelector().id('com.ss.android.ugc.aweme:id/' + name);
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
        return 'com.ss.android.ugc.aweme';
    },

    clickRange(tag, top, bottom) {
        if (tag.bounds().top + tag.bounds().height() <= top) {
            return false;
        }

        if (tag.bounds().top >= bottom) {
            return false;
        }

        if (tag.bounds().top > top && tag.bounds().top + tag.bounds().height() < bottom) {
            this.click(tag);
            return true;
        }

        //卡在top的上下
        if (tag.bounds().top <= top && tag.bounds().top + tag.bounds().height() > top) {
            let topY = tag.bounds().top + tag.bounds().height() - top;
            Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), (tag.bounds().top + 1) + (topY - 1) * Math.random());
            return true;
        }

        if (tag.bounds().top < bottom && tag.bounds().top + tag.bounds().height() >= bottom) {
            let topY = bottom - tag.bounds().top;
            Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + (topY - 1) * Math.random());
            return true;
        }
        return false;
    },

    backHome() {
        this.openApp();
        let i = 0;
        while (i++ < 5) {
            let homeTag = this.id(V.Common.backHome[0]).isVisibleToUser(true).findOnce();
            if (!homeTag) {
                Log.log(this.id(V.Common.backHome[0]).isVisibleToUser(true).findOnce());
                this.back();
                this.sleep(1000);
                continue;
            }
            Log.log("找到了homeTag");
            break;
        }
        return true;
    },

    backHomeOnly() {
        let i = 0;
        while (i++ < 5) {
            let homeTag = this.id(V.Common.backHome[0]).isVisibleToUser(true).findOnce();
            if (!homeTag) {
                Log.log(this.id(V.Common.backHome[0]).isVisibleToUser(true).findOnce());
                this.back();
                this.sleep(1000);
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

        App.launch('com.ss.android.ugc.aweme');//打开抖音
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
        text = /[\d\.\,]+[\w|万]*/.exec(text);
        if (!text) {
            return 0;
        }

        text[0] = text[0].replace(',', '').replace(',', '').replace(',', '');
        if (text[0].indexOf('w') !== -1 || text[0].indexOf('万') !== -1) {
            text[0] = text[0].replace('w', '').replace('万', '') * 10000;
        }
        Log.log('数字：', text[0]);
        return text[0] * 1;//可能存在多个逗号
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
        //Log.log(this.swipeFocusListOpTarge);

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

    swipeSearchTabToLeft() {
        let tag = this.id(V.C.userListTop).isVisibleToUser(true).findOne() || this.id(V.C.userListTop).findOne();
        if (tag) {
            tag.scrollForward();
        } else {
            Log.log('滑动列表');
        }
    },

    //粉丝群列表滑动
    swipeFansGroupListOp() {
        let tag = this.id(V.Message.fansSwipe[0]).scrollable(true).filter((v) => {
            return v && v.bounds() && v.bounds().top > 0 && v.bounds().left >= 0 && v.bounds().width() == Device.width() && v.bounds().top >= 0;
        }).findOnce();
        console.log(tag);
        if (tag) {
            tag.scrollForward();
        } else {
            Log.log('滑动失败');
        }
        //Log.log(this.swipeCommentListOpTarget);
    },

    //关闭弹窗
    closeAlert(type) {
        this.log('开启线程监听弹窗');
        let k = 0;

        while (true) {
            //检测是否只有当前的线程，是的话则关闭
            // console.log("---线程数量：" + Engines.getEngines());
            // if (Engines.getEngines() == 1) {
            //     Engines.close();
            // }

            if (!type) {
                this.sleep(10000);
                continue;
            }

            k++;
            if (k > 1000) {
                k = 0;
            }
            let f = function (v) {
                return v && v.bounds() && v.bounds().top > Device.height() / 5 && v.bounds().top + v.bounds().height() < Device.height() * 0.8 && v.bounds().left > Device.width() / 10 && v.bounds().left + v.bounds().width() < Device.width() * 0.9;//只有在中间的位置才是弹窗
            }

            try {
                let a = null;
                if (!a) {
                    a = UiSelector().text("稍后").clickable(true).filter(f).isVisibleToUser(true).findOne() || UiSelector().text("以后再说").clickable(true).isVisibleToUser(true).findOne() || UiSelector().text("我知道了").clickable(true).filter(f).isVisibleToUser(true).findOne() || UiSelector().text("直接退出").clickable(true).filter(f).isVisibleToUser(true).findOne();
                }
                if (!a) {
                    a = UiSelector().text("下次再说").clickable(true).isVisibleToUser(true).findOne() || UiSelector().text("满意").clickable(true).filter(f).isVisibleToUser(true).findOne() || UiSelector().text("不感兴趣").clickable(true).filter(f).isVisibleToUser(true).findOne();
                }

                if (!a) {
                    a = UiSelector().text("好的").clickable(true).filter(f).isVisibleToUser(true).findOne() || UiSelector().text("确定").clickable(true).filter(f).isVisibleToUser(true).findOne() || UiSelector().text("取消").clickable(true).filter(f).isVisibleToUser(true).findOne();
                }

                if (!a) {
                    a = UiSelector().text("拒绝").clickable(true).isVisibleToUser(true).findOne() || UiSelector().text("拒绝").desc('拒绝').clickable(true).filter(f).isVisibleToUser(true).findOne();
                }

                let ff = function (v) {
                    return v && v.bounds() && v.bounds().top > Device.height() / 5 && v.bounds().top + v.bounds().height() < Device.height() * 0.8 && v.bounds().left > Device.width() / 2 && v.bounds().left + v.bounds().width() < Device.width() * 0.9;//只有在中间的位置才是弹窗
                }
                let b = UiSelector().clickable(true).filter(ff).desc('关闭').isVisibleToUser(true).findOnce();
                //不是主页里面的“删除”关注其他用户
                if (b) {
                    b.click();
                    Log.log("关闭：b");
                }

                if (!a) {
                    a = UiSelector().text('暂不公开').clickable(true).filter(f).isVisibleToUser(true).findOnce() || UiSelector().text('忽略本次').clickable(true).filter(f).isVisibleToUser(true).findOnce() || UiSelector().descContains('不再提醒').clickable(true).filter(f).isVisibleToUser(true).findOne();
                }

                if (a) {
                    a.click();
                    Log.log(a);
                    Log.log("可能的弹窗点击了");
                }

                if (k % 50 == 0) {
                    Log.log("对象清理");
                    System.cleanUp();//清理线程垃圾
                }
            } catch (e) {
                this.log("close dialog 异常了");
                this.log(e);
            }

            if (type) {
                break;
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

    noContainsWord(noContain, title) {
        noContain = this.splitKeyword(noContain);
        for (let con of noContain) {
            if (typeof (con) === 'string' && title.indexOf(con) !== -1) {
                return false;
            }

            if (typeof (con) === 'object') {
                let len = 0;
                for (let i in con) {
                    if (title.indexOf(con[i]) !== -1) {
                        len++;
                    }
                }
                if (len === con.length) {
                    return false;
                }
            }
        }
        return noContain;
    },

    playAudio(file) {
        media.playMusic(file);
    },

    getRemark(remark) {
        return remark.indexOf('#') == 0 || remark.indexOf('＃') == 0;
    }
}

module.exports = Common;
