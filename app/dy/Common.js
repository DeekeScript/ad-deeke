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
        this.log("js休眠时间：" + time);
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
     * 仅返回主页  需要简单模式下执行
     * @returns boolean
     */
    backHomeOnly() {
        let i = 0;
        while (i++ < 5) {
            let homeTag = UiSelector().text('首页').filter(v => {
                return v.parent().isVisibleToUser() && v.bounds().width() > 0;//滑动到用户页面，也能看到首页，但是width是负数
            }).findOne() || UiSelector().desc('首页，按钮').filter(v => {
                return v.parent().isVisibleToUser() && v.bounds().width() > 0;
            }).findOne();

            if (!homeTag) {
                this.log("没有找到homeTag，返回一次");
                this.back();
                this.sleep(1000);
                continue;
            }
            this.log("找到了homeTag");
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
    click(tag, rate = 0.05) {
        if (!rate) {
            rate = 0.05;
        }

        let p = 1 - rate * 2;
        let width = tag.bounds().width() * (rate + Math.random() * p);
        let height = tag.bounds().height() * (rate + Math.random() * p);

        try {
            return Gesture.click(tag.bounds().left + Math.floor(width), tag.bounds().top + Math.floor(height));
        } catch (e) {
            this.log(e);
            try {
                return Gesture.click(tag.bounds().left + Math.floor(width), tag.bounds().top + 1);
            } catch (e) {
                this.log(e);
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
        App.launch(this.packageName());//打开抖音

        let i = 5;
        while (i-- > 0) {
            this.sleep(2000);
            let homeTag = UiSelector().text('首页').filter(v => {
                return v.parent().isVisibleToUser();
            }).findOne() || UiSelector().desc('首页，按钮').filter(v => {
                return v.parent().isVisibleToUser();
            }).findOne();

            if (homeTag) {
                this.log('进入应用');
                return true;
            }
        }

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
        console.log(arguments);
    },

    /**
     * 模拟返回操作
     * @param {number} [i] - 返回次数，默认 1 次
     * @param {number} [time] - 每次返回的间隔时间（毫秒），默认 700ms
     * @param {number} [randTime] - 随机波动时间范围（毫秒），传入后会生成 time + randTime * random() 的随机间隔
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
     * @param {string} content 
     * @returns {number}
     */
    numDeal(content) {
        let text = /[\d\.]+[\w|万]*/.exec(content);
        this.log('数字：', content, text);
        let num = 0;
        if (!text) {
            return num;
        }

        text[0] = text[0].replace(',', '').replace(',', '').replace(',', '');
        if (text[0].indexOf('w') !== -1 || text[0].indexOf('万') !== -1) {
            num = parseFloat(text[0].replace('w', '').replace('万', '')) * 10000;
        } else {
            num = parseInt(text[0]);
        }

        this.log('数字：', num);
        return num;//可能存在多个逗号
    },

    /**
     * 向上滑或者下滑 【这个方法稳定性可能不太好，不太推荐使用】
     * @param {number} type 0表示向上滑
     * @param {number} sensitivity 
     * @param {number} rate 
     * @returns 
     */
    swipe(type = 0, sensitivity = 1, rate = 12) {
        const width = Device.width();
        const height = Device.height();

        // 横坐标随机化，避免死板
        const x = width * (0.3 + Math.random() * 0.4); // 30%~70%屏幕宽

        // rate 控制滑动距离，避免原来的 1/rate 逻辑不直观
        const distance = height / rate;

        let startY, endY;

        if (type === 0) { // 向上滑动
            startY = height * 0.7 * sensitivity + height * 0.1 * Math.random(); // 底部偏移
            endY = startY - distance;
            if (endY < 0) endY = 0;
        } else if (type === 1) { // 向下滑动
            startY = height * 0.3 * sensitivity + height * 0.1 * Math.random(); // 顶部偏移
            endY = startY + distance;
            if (endY > height) endY = height;
        } else {
            console.warn("swipe: type 只能是 0（上）或 1（下）");
            return false;
        }

        // duration 随机化，200~300ms 左右
        const duration = 200 + 100 * Math.random();
        Gesture.swipe(x, startY, x, endY, duration);
        return true;
    },

    /**
     * 滑动搜索用户列表
     * @param {boolean} [filterRootLayout] - 是否过滤掉根布局，默认为 false
     * @returns {boolean|null}  默认用户页面
     */
    swipeSearchUserOp(filterRootLayout = false) {
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').scrollable(true).filter(v => {
            if (filterRootLayout) {
                return !!v.children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/root_layout').isVisibleToUser(true));
            }
            return true;
        }).isVisibleToUser(true).findOne();
        if (!tag) {
            this.log('滑动失败');
            return null;
        }

        if (tag.scrollForward()) {
            this.log('滑动成功');
            return true;
        }
        this.log('滑动到底了');
        return false;
    },

    /**
     * 滑动粉丝列表
     * @returns {boolean|null}
     */
    swipeFansListOp() {
        return this.swipeSearchUserOp(true);
    },

    /**
     * 滑动关注列表
     * @returns {boolean|null}
     */
    swipeFocusListOp() {
        return this.swipeSearchUserOp(true);
    },

    /**
     * 滑动评论列表
     * @returns {boolean|null}
     */
    swipeCommentListOp() {
        return this.swipeSearchUserOp();
    },

    /**
     * 搜索列表滑动到左侧
     * @returns {boolean|null}
     */
    swipeSearchTabToLeft() {
        let tag = UiSelector().scrollable(true).className('android.widget.HorizontalScrollView').isVisibleToUser(true).findOne();
        if (!tag) {
            this.log('滑动失败');
            return null;
        }
        if (tag.scrollForward()) {
            this.log('滑动成功');
            return true;
        }
        this.log('滑动失败');
        return false;
    },

    /**
     * 粉丝群列表滑动
     * @returns {boolean|null}
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
     * @returns {boolean|null}
     */
    swipeMessageDetailsList() {
        return this.swipeSearchUserOp();
    },

    /**
    * 作品赞列表滑动
    * @returns {boolean|null}
    */
    swipeWorkZanList() {
        return this.swipeSearchUserOp();
    },

    /**
     * 关闭弹窗
     * @param [type] {number}
     */
    closeAlert(type) {
        if (!type) {
            return;
        }

        this.log('开启线程监听弹窗');
        let f = function (v) {
            return v && v.bounds() && v.bounds().top > Device.height() / 5 && v.bounds().top + v.bounds().height() < Device.height() * 0.8 && v.bounds().left > Device.width() / 10 && v.bounds().left + v.bounds().width() < Device.width() * 0.9;//只有在中间的位置才是弹窗
        }

        try {
            let cancelTexts = ['不再提醒', '稍后', '以后再说', '我知道了', '直接退出', '不多', '下次再说', '满意', '不感兴趣', '好的', '确定', '取消', '拒绝', '关闭', '暂不隔开', '忽略本次', '暂不使用'];
            for (let i = 0; i < cancelTexts.length; i++) {
                let cancelTag = UiSelector().text(cancelTexts[i]).clickable(true).filter(f).isVisibleToUser(true).findOne();
                if (cancelTag) {
                    cancelTag.click();
                    this.log('点击了取消按钮', cancelTag);
                    return;
                }
            }
        } catch (e) {
            this.log("close dialog 异常了");
            this.log(e);
        }
    },

    /**
     * 执行方法后修复
     * @param {function} func
     * @param {number} time
     * @param {number} [randomTime]
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
     * @param {string} msg
     */
    showToast(msg) {
        FloatDialogs.toast(msg);
        this.log(msg);
    },

    /**
     * 切分关键词
     * @param {string} keyword
     */
    splitKeyword(keyword) {
        keyword = keyword.replace(/，/g, ',');
        let keywords = keyword.split(',');
        let ks = [];
        for (let i in keywords) {
            if (keywords[i] === '') {
                continue;
            }

            ks.push(keywords[i]);
        }
        return ks;
    },

    /**
     * 检测标题是否包含关键词
     * @param {string} contain
     * @param {string} title
     * @returns {Array<string>|null}
     */
    containsWord(contain, title) {
        let contains = this.splitKeyword(contain);
        for (let con of contains) {
            if (typeof (con) === 'string' && title.indexOf(con) !== -1) {
                return [con];
            }
        }
        return null;
    },

    /**
     * 判断是否有备注
     * @param {string} remark
     * @returns {boolean}
     */
    getRemark(remark) {
        return remark.indexOf('#') == 0 || remark.indexOf('＃') == 0;
    }
}

module.exports = Common;
