let Common = {
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
            let homeTag = UiSelector().className('android.widget.ImageView').desc('菜单').isVisibleToUser(true).findOnce();
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

    backHomeOnly() {
        let i = 0;
        while (i++ < 5) {
            let homeTag = UiSelector().className('android.widget.ImageView').desc('菜单').isVisibleToUser(true).findOnce();
            if (!homeTag) {
                Log.log(UiSelector().className('android.widget.ImageView').desc('菜单').findOnce());
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

    gClick(x, y) {
        Log.log('点击位置：', x, y);
        Gesture.click(x, y);
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
            this.gClick(tag.bounds().left + tag.bounds().width() * Math.random(), (tag.bounds().top + 1) + (topY - 1) * Math.random());
            return true;
        }

        if (tag.bounds().top < bottom && tag.bounds().top + tag.bounds().height() >= bottom) {
            let topY = bottom - tag.bounds().top;
            this.gClick(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + (topY - 1) * Math.random());
            return true;
        }
        return false;
    },

    openApp() {
        App.launch('com.xingin.xhs');//打开app
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

    swipeRecommendListOp() {
        this.swipeFansListOpTarge = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
            return v.className() == 'androidx.recyclerview.widget.RecyclerView' && v.id() != null;
        }).findOne();

        if (this.swipeFansListOpTarge) {
            this.swipeFansListOpTarge.scrollForward();
        } else {
            Log.log('滑动失败');
        }
        //Log.log(this.swipeFansListOpTarge);
    },


    swipeFansListOp() {
        this.swipeFansListOpTarge = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
            return v.className() == 'androidx.recyclerview.widget.RecyclerView' && v.id() != null;
        }).findOne();

        if (this.swipeFansListOpTarge) {
            this.swipeFansListOpTarge.scrollForward();
        } else {
            Log.log('滑动失败');
        }
        //Log.log(this.swipeFansListOpTarge);
    },

    swipeSearchWorkResultOp() {
        let tag = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
            return v.className() == 'androidx.recyclerview.widget.RecyclerView' && v.id() != null;
        }).findOne();

        return tag.scrollForward();
    },

    //滑动用户作品列表
    swipeWorksOp() {
        let swipe = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
            return v.className() == 'androidx.recyclerview.widget.RecyclerView' && v.id() != null;
        }).findOne();

        if (swipe) {
            return swipe.scrollForward();
        } else {
            Common.log('滑动失败');
        }
        return false;
    },

    swipeFocusListOp() {
        this.swipeFocusListOpTarge = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
            return v.className() == 'androidx.recyclerview.widget.RecyclerView' && v.id() != null;
        }).findOne();
        if (this.swipeFocusListOpTarge) {
            this.swipeFocusListOpTarge.scrollForward();
        } else {
            Log.log('滑动失败');
        }
    },

    //搜索的图文列表滑动
    swipeWorkOp() {
        let tag = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
            return v.className() == 'androidx.recyclerview.widget.RecyclerView';
        }).findOne();
        if (tag) {
            return tag.scrollForward();
        } else {
            Log.log('滑动失败');
        }
        return false;
    },


    //关闭弹窗
    closeAlert(type) {
        if (type == undefined) {
            type = 0;
        }

        this.log('开启线程监听弹窗');

        while (true) {
            //检测是否只有当前的线程，是的话则关闭
            try {
                let a = this.id('aj3').textContains('稍后再说').isVisibleToUser(true).findOne();//免流量升级
                if (a) {
                    a.click();
                    Log.log(a);
                    Log.log("可能的弹窗点击了");
                }

                this.sleep(200);
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
            if (keyword[i] === '') {
                continue;
            }

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

    rgbToColorName(rgbaStr) {
        // 解析 rgba
        const match = rgbaStr.match(/rgba?\(([^)]+)\)/i);
        if (!match) return "其他";

        const parts = match[1].split(",").map(s => parseFloat(s.trim()));
        const [r, g, b] = parts;

        // 转 HSL
        const { h, s, l } = this.rgbToHsl(r, g, b);

        // ===== 先判断黑白灰 =====
        if (l <= 0.08) return "黑";
        if (l >= 0.92) return "白";
        if (s <= 0.1) return "灰";

        // ===== 再判断色相 =====
        if ((h >= 0 && h < 30) || (h >= 330 && h <= 360)) return "红";
        if (h >= 30 && h < 70) return "黄";
        if (h >= 70 && h < 170) return "绿";
        if (h >= 170 && h < 260) return "蓝";

        return "其他";
    },

    // RGB 转 HSL
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s;
        const l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h *= 60;
        }

        return {
            h: h || 0,
            s: s || 0,
            l: l || 0
        };
    }
}

module.exports = Common;
