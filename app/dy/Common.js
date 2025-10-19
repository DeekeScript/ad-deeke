const Common = {
    /**
     * 通过ID获取控件
     * @param {string} name 
     * @returns Object
     */
    id(name) {
        return UiSelector().id(this.packageName() + ':id/' + name);
    },

    /**
     * 通过android:id获取控件
     * @param {string} name 
     * @returns Object
     */
    aId(name) {
        return UiSelector().id('android:id/' + name);
    },

    /**
     * 休眠
     * @param {number} time 
     */
    sleep(time) {
        Log.log("js休眠时间：" + time);
        System.sleep(time);
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

    /**
     * 获取包名
     * @returns string
     */
    packageName() {
        return 'com.ss.android.ugc.aweme';
    },

    /**
     * 返回主页
     * @returns boolean
     */
    backHome() {
        this.openApp();
        this.backHomeOnly();
        return true;
    },

    /**
     * 仅返回主页
     * @returns boolean
     */
    backHomeOnly() {
        let i = 0;
        while (i++ < 5) {
            let homeTag = UiSelector().descContains('首页').isVisibleToUser(true).findOne();
            if (!homeTag) {
                this.back();
                this.sleep(1000);
                continue;
            }
            Log.log("找到了homeTag");
            break;
        }
        return true;
    },

    /**
     * 点击控件
     * @param {Object} tag 
     * @param {number} rate 
     * @returns boolean
     */
    click(tag, rate) {
        if (!rate) {
            rate = 0.05;
        }

        let p = 1 - rate * 2;
        let width = tag.bounds().width() * (rate + Math.random() * p);
        let height = tag.bounds().height() * (rate + Math.random() * p);

        try {
            return Gesture.click(tag.bounds().left + Math.floor(width), tag.bounds().top + Math.floor(height));
        } catch (e) {
            Log.log(e);
            try {
                return Gesture.click(tag.bounds().left + Math.floor(width), tag.bounds().top + 1);
            } catch (e) {
                Log.log(e);
                return false;
            }
        }
    },

    /**
     * 打开抖音
     * @returns {boolean}
     */
    openApp() {
        this.log('打开应用');
        let tag = UiSelector().isVisibleToUser(true).findOne();
        if (tag && tag.getPackageName() == this.packageName()) {
            return true;
        }
        App.launch(this.packageName());//打开抖音
        this.sleep(8000);
        this.log('进入应用');
        return true;
    },

    /**
     * 返回app
     */
    backApp() {
        App.backApp();
    },


    /**
     * 打印日志
     */
    log() {
        //这里需要做日志记录处理
        Log.log(arguments);
        if (arguments.length == 1) {
            FloatDialogs.toast(arguments[0]);
        }
    },

    /**
     * 模拟返回
     * @param i
     * @param time
     * @param randTime
     */
    back(i, time, randTime) {
        if (i === undefined) {
            i = 1;
        }

        if (time == undefined) {
            time = 700;
        }

        this.log('返回次数： ' + i);
        while (i--) {
            Gesture.back();
            if (randTime) {
                this.sleep(time + randTime * Math.random());
                continue;
            }
            this.sleep(time);
        }
    },

    /**
     * 提取字符串中的数字
     * @param {string} text 
     * @returns {string}
     */
    numDeal(text) {
        text = /[\d\.]+[\w|万]*/.exec(text);
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

    /**
     * 向上滑或者下滑 【这个方法稳定性可能不太好，不太推荐使用】
     * @param {number} type 0表示向上滑
     * @param {number} sensitivity 
     * @param {number} rate 
     * @returns 
     */
    swipe(type, sensitivity, rate) {
        let left = Math.random() * Device.width() * 0.8 + Device.width() * 0.2;
        let bottom = Device.height() * 2 / 3 * sensitivity + Device.height() / 6 * Math.random();
        if (!rate) {
            rate = 12;
        } else {
            rate = 1 / rate;
        }
        let top = Device.height() / rate + Device.height() / rate * Math.random();
        if (!type) {
            Gesture.swipe(left, bottom, left, top, 200 + 100 * Math.random());//从下往上推，清除
            return true;
        }
        Gesture.swipe(left, top, left, bottom, 200 + 100 * Math.random());//从上往下滑
    },

    /**
     * 滑动搜索用户列表
     * @returns boolean
     */
    swipeSearchUserOp(filterRootLayout) {
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').scrollable(true).filter(v => {
            if (filterRootLayout) {
                return v.children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/root_layout').isVisibleToUser(true));
            }
            return true;
        }).isVisibleToUser(true).findOne();
        if (!tag) {
            Log.log('滑动失败');
            return 0;
        }

        if (tag.scrollForward()) {
            Log.log('滑动成功');
            return true;
        }
        Log.log('滑动到底了');
        return false;
    },

    /**
     * 滑动粉丝列表
     * @returns {boolean}
     */
    swipeFansListOp() {
        return this.swipeSearchUserOp(true);
    },

    /**
     * 滑动关注列表
     * @returns {boolean}
     */
    swipeFocusListOp() {
        return this.swipeSearchUserOp(true);
    },

    /**
     * 滑动评论列表
     * @returns {boolean}
     */
    swipeCommentListOp() {
        return this.swipeSearchUserOp();
    },

    /**
     * 搜索列表滑动到左侧
     * @returns {boolean}
     */
    swipeSearchTabToLeft() {
        let tag = UiSelector().scrollable(true).className('android.widget.HorizontalScrollView').isVisibleToUser(true).findOne();
        if (!tag) {
            Log.log('滑动失败');
            return 0;
        }
        if (tag.scrollForward()) {
            Log.log('滑动成功');
            return true;
        }
        Log.log('滑动失败');
        return false;
    },

    /**
     * 粉丝群列表滑动
     * @returns {boolean}
     */
    swipeFansGroupListOp() {
        return this.swipeSearchUserOp();
    },

    /**
     * 消息列表滑动
     * @param type {boolean}
     * @returns {boolean}
     */
    swipeMessageList(type) {
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').scrollable(true).filter(v => {
            return v.bounds().height() > Device.height() / 2;
        }).isVisibleToUser(true).findOne();
        if (type == true) {
            return tag.scrollBackward();
        }
        return tag.scrollForward();
    },

    /**
     * 互动消息列表滑动
     * @returns {boolean}
     */
    swipeMessageDetailsList() {
        return this.swipeSearchUserOp();
    },

     /**
     * 作品赞列表滑动
     * @returns {boolean}
     */
    swipeWorkZanList() {
        return this.swipeSearchUserOp();
    },

    /**
     * 关闭弹窗
     * @param type
     */
    closeAlert(type) {
        this.log('开启线程监听弹窗');
        let k = 0;

        while (true) {
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

                if (!a) {
                    a = UiSelector().descContains('暂不使用').filter(f).isVisibleToUser(true).clickable(true).findOne();
                }

                if (a) {
                    a.click();
                    Log.log(a);
                    Log.log("可能的弹窗点击了");
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

    /**
     * 执行方法后修复
     * @param func
     * @param time
     * @param randomTime
     */
    sleepFunc(func, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }
        func();
        this.sleep(time + randomTime * Math.random());
    },

    /**
     * 显示提示
     * @param msg
     * @param time
     * @param randomTime
     */
    toast(msg, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }

        FloatDialogs.toast(msg);
        this.log(msg);
        if (time) {
            this.sleep(time + randomTime * Math.random());
        }
    },

    /**
     * 显示提示
     * @param msg
     */
    showToast(msg) {
        FloatDialogs.toast(msg);
        Log.log(msg);
    },

    /**
     * 切分关键词
     * @param msg
     */
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

    /**
     * 检测标题是否包含关键词
     * @param contain
     * @param title
     * @returns {boolean}
     */
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

    /**
     * 获取标题中是否不包含的关键字
     * @param contain
     * @param title
     * @returns {boolean}
     */
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

    /**
     * 判断是否有备注
     * @param remark
     * @returns {boolean}
     */
    getRemark(remark) {
        return remark.indexOf('#') == 0 || remark.indexOf('＃') == 0;
    }
}

module.exports = Common;
