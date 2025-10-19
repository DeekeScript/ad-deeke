let Common = require("app/xhs/Common.js");
let statistics = require("common/statistics.js");

let User = {
    swipeFans(selectText) {
        if (selectText.indexOf('关注') !== -1) {
            Common.swipeFocusListOp();
        } else if (selectText.indexOf('粉丝') !== -1) {
            Common.swipeFansListOp();
        } else if (selectText.indexOf('推荐') !== -1) {
            Common.swipeRecommendListOp();
        }
        Log.log("滑动异常：" + selectText);
    },

    isPrivate() {
        return UiSelector().className('').text('私密账号').findOne() ? true : false;
    },

    getNickname() {
        let nicknameTag = UiSelector().className('android.widget.TextView').findOne();
        return nicknameTag.text();
    },

    intoVideo() {
        let videoTag = UiSelector().className('android.widget.FrameLayout').filter(v => {
            return v.desc() && (v.desc().indexOf('视频') === 0 || v.desc().indexOf('笔记') === 0);
        }).findOne();

        if (!videoTag) {
            return false;
        }

        //Common.click(videoTag, 0.3);//点击中间的60%
        Gesture.click(videoTag.bounds().left + videoTag.bounds().width() * 0.7, videoTag.bounds().top + videoTag.bounds().height() * 0.6);
        statistics.viewVideo();
        statistics.viewTargetVideo();
        Common.sleep(4000 + 3000 * Math.random());
        return true;
    },

    intoVideoX(ignoreTitles, opCount) {
        let contents = [];
        if (!ignoreTitles) {
            ignoreTitles = [];
        }

        let swipeCount = 0;
        while (true) {
            let videoTags = UiSelector().className('android.widget.FrameLayout').filter(v => {
                return v.desc() && (v.desc().indexOf('视频') === 0 || v.desc().indexOf('笔记') === 0);
            }).find();

            if (!videoTags || videoTags.length === 0) {
                return false;
            }

            if (swipeCount >= 2 && videoTags.length < opCount) {
                return -1;//视频操作完了
            }

            for (let i in videoTags) {
                let content = videoTags[i].desc();
                contents.push(content);
                if (contents.length >= 3) {
                    if (contents[0] == contents[1] && contents[1] == contents[2]) {
                        throw new Error('已经没有图文了');
                    }

                    contents.unshift();
                }
                if (ignoreTitles.indexOf(content) !== -1) {
                    continue;
                }
                ignoreTitles.push(content);
                Common.click(videoTags[i], 0.15);
                Common.sleep(4000 + 3000 * Math.random());
                statistics.viewVideo();
                statistics.viewTargetVideo();
                return true;
            }

            Common.swipeWorksOp();
            swipeCount++;
            Common.sleep(1500 + 1000 * Math.random());
        }
    },

    privateMsg(msg) {
        let sendTag = UiSelector().className('android.widget.TextView').text('私信').filter(v => {
            return v.text() == '私信';
        }).findOne() || UiSelector().className('android.widget.TextView').text('发消息').filter(v => {
            return v.text() == '发消息';
        }).findOne();
        if (!sendTag) {
            Log.log('找不到私信按钮');
            return true;
        }
        Common.click(sendTag, 0.3);
        Common.sleep(2000 + 1000 * Math.random());

        this.privateMsgTwo(msg);
        Common.back();
    },

    privateMsgTwo(msg) {
        let sendIptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).findOne();
        Common.click(sendIptTag, 0.2);
        Common.sleep(1000 + 1000 * Math.random());

        sendIptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).findOne();
        Log.log('开始设置私信', msg);
        sendIptTag.setText(msg);
        Common.sleep(1500 + 1200 * Math.random());

        //发送
        let sendBtnTags = UiSelector().className('android.widget.TextView').isVisibleToUser(true).text('发送').find();
        Common.click(sendBtnTags[sendBtnTags.length - 1], 0.2);
        Log.log('点击发送', sendBtnTags[sendBtnTags.length - 1]);
        statistics.privateMsg();
        Common.sleep(1500 + 500 * Math.random());
        Common.back();
        Common.sleep(500 + 500 * Math.random());
    },

    //注意，粉丝关注有两种模式，一种是横版的，一种是关注和发私信两个按钮占据一行
    isFocus() {
        let focusTag = UiSelector().filter(v => {
            return (v.className() == 'android.widget.TextView' && v.parent().className() == 'android.widget.FrameLayout') || v.className() == 'android.widget.Button';
        }).isVisibleToUser(true).textContains('关注').findOne();
        if (focusTag && focusTag.text() != '关注') {
            Log.log('已经关注过了');
            return true;
        }
        return false;
    },

    focus() {
        if (this.isFocus()) {
            return true;
        }

        let focusTag = UiSelector().filter(v => {
            return (v.className() == 'android.widget.TextView' && v.parent().className() == 'android.view.ViewGroup') || v.className() == 'android.widget.Button';
        }).isVisibleToUser(true).textContains('关注').findOne();
        Common.click(focusTag, 0.2);
        statistics.focus();
        return true;
    },

    dealNum(str) {
        if (str.indexOf('万') !== -1) {
            str = str.replace('万', '') * 10000;
        } else if (str.indexOf('W') !== -1) {
            str = str.replace('W', '') * 10000;
        } else if (str.indexOf('w') !== -1) {
            str = str.replace('w', '') * 10000;
        }

        return str * 1 || 0;
    },

    getListWorkCount(tag) {
        if (!tag) {
            return 0;//笔记 42 | 粉丝 7
        }

        let text = tag.text();
        if (text.indexOf('笔记') == -1) {
            return 0;
        }

        let workCount;
        Log.log('text', text);
        if (text.indexOf('|') != -1) {
            workCount = tag.text().split('|')[0].replace('笔记', '').replace('·', '').replace(' ', '');
        } else {
            workCount = tag.text().replace('笔记', '').replace('·', '').replace(' ', '');
        }
        Log.log('workCount', workCount);
        return this.dealNum(workCount);
    },

    getListFansCount(tag) {
        if (!tag) {
            return 0;//笔记 42 | 粉丝 7
        }

        let text = tag.text();
        let fansCount;
        if (text.indexOf('粉丝') == -1) {
            return 0;
        }

        if (text.indexOf('|') != -1) {
            fansCount = tag.text().split('|')[1].replace('粉丝', '').replace('·', '').replace(' ', '');
        } else {
            fansCount = tag.text().replace('粉丝', '').replace('·', '').replace(' ', '');
        }

        return this.dealNum(fansCount);
    },

    getFansCount() {
        let fansCountTag = UiSelector().className('android.widget.Button').descContains('粉丝').findOne();
        if (!fansCountTag) {
            return 0;
        }

        let fansCount = fansCountTag.desc();
        return this.dealNum(fansCount);
    }
}

module.exports = User;
