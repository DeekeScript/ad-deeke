let Common = require('app/dy/Common.js');
let Comment = require('app/dy/Comment.js');
let User = require('app/dy/User.js');
let Video = require('app/dy/Video.js');
let statistics = require('common/statistics');
let storage = require('common/storage.js');

let Message = {
    /**
     * 消息界面搜索用户
     * @param {string} account 
     */
    search(account) {
        //首次打开抖音进入消息，拿不到desc信息，目前这样尝试
        let searchTag = UiSelector().className('android.widget.Button').desc('搜索').isVisibleToUser(true).findOnce() || UiSelector().className('android.widget.Button').clickable(true).isVisibleToUser(true).filter(v => {
            return v.bounds().left > Device.width() / 2 && v.bounds().top < Device.height() / 5;
        }).findOne();
        searchTag.click();
        Common.sleep(1500 + 500 * Math.random());

        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOnce();

        iptTag.setText(account);
        Common.sleep(2000 + 1000 * Math.random());
        return true;
    },

    /**
     * 搜索进入粉丝群页面
     * @param {string} account 
     * @param {number} index
     */
    intoFansGroup(account, index) {
        this.search(account);
        let contents = [];

        let rpCount = 0;
        while (true) {
            let rp = 0;
            let allRp = 0;
            let groupTag = UiSelector().className('android.widget.TextView').text('群聊').isVisibleToUser(true).findOnce();
            if (!groupTag) {
                throw new Error('找不到群聊');
            }

            let contains = Common.id('content_container').descContains(account).isVisibleToUser(true).find();
            if (contains.length === 0) {
                throw new Error('找不到群聊-2');
            }

            for (let i in contains) {
                if (isNaN(i)) {
                    continue;
                }

                if (contains[i].bounds().top < groupTag.bounds().top) {
                    Log.log('非群聊');
                    continue;
                }

                allRp++;
                if (contents.includes(contains[i].desc())) {
                    rp++;
                    continue;
                }

                contents.push(contains[i].desc());
                if (contents.length === index) {
                    contains[i].click();
                    Common.sleep(3000 + 2000 * Math.random());
                    return true;
                }
            }

            if (allRp === rp) {
                rpCount++;
            } else {
                rpCount = 0;
            }

            if (rpCount >= 3) {
                return false;
            }
            Common.swipe(0, 0.5);
        }
    },

    /**
     * 进入粉丝群列表
     * @param {array} contents 
     * @param {function} getMsg 
     * @param {function} machineInclude 
     * @param {function} machineSet 
     * @returns 
     */
    intoGroupUserList(contents, getMsg, machineInclude, machineSet) {
        let tag = undefined;
        let config = {
            begin: storage.get('task_dy_fans_group_begin', 'int'),
            zanRate: storage.get('task_dy_fans_group_zan_rate', 'int'),
            commentRate: storage.get('task_dy_fans_group_comment_rate', 'int'),
            collectRate: storage.get('task_dy_fans_group_collect_rate', 'int'),
            focusRate: storage.get('task_dy_fans_group_focus_rate', 'int'),
            privateRate: storage.get('task_dy_fans_group_private_rate', 'int'),
            privateLanv: storage.get('task_dy_fans_group_private_lanv', 'bool'),

            zanWait: storage.get('task_dy_fans_group_zan_wait_', 'int') * 1000,
            commentWait: storage.get('task_dy_fans_group_comment_wait_', 'int') * 1000,
            collectWait: storage.get('task_dy_fans_group_collect_wait_', 'int') * 1000,
            privateWait: storage.get('task_dy_fans_group_private_wait_', 'int') * 1000,
            focusWait: storage.get('task_dy_fans_group_focus_wait_', 'int') * 1000,
            accountWait: storage.get('task_dy_fans_group_account_wait_', 'int') * 1000,
        };

        let base = Math.random();
        let iBase = 1 - base;

        Log.log('config', config);
        //每进入这个界面，50%概率控件的“更多”没有出来，暂时这样补救
        let moreTag = UiSelector().className('android.widget.Button').desc('更多').clickable(true).isVisibleToUser(true).findOne() || UiSelector().className('android.widget.Button').clickable(true).filter(v => {
            return v.bounds().top < Device.height() / 5 && v.bounds().left > Device.width() * 0.75 && v.children().findOne(UiSelector().className('android.widget.ImageView').isVisibleToUser(true));
        }).isVisibleToUser(true).findOne();

        moreTag.click();
        Common.sleep(2000 + 1000 * Math.random());

        let intoGroupListTag = UiSelector().className('android.widget.TextView').text('群聊成员').isVisibleToUser(true).findOne();
        Common.click(intoGroupListTag);
        Common.sleep(2000 + 1000 * Math.random());
        Log.log(tag);

        let rpCount = 0;
        let rpContains = [];
        let runIndex = 0;
        while (true) {
            let contains = UiSelector().id('com.ss.android.ugc.aweme:id/content').clickable(true).isVisibleToUser(true).find();
            if (0 == contains.length) {
                return true;
            }

            for (let i in contains) {
                Log.log('第几个：' + i);
                rpContains.push(contains[i].desc());
                if (rpContains[0] == rpContains[1]) {
                    rpCount++;
                } else {
                    rpCount = 0;
                }

                if (rpContains.length >= 2) {
                    rpContains.shift();
                }
                Log.log('rpContains', rpContains, rpCount);

                runIndex++;
                if (contents.includes(contains[i].desc()) || machineInclude(contains[i].desc())) {
                    FloatDialogs.toast('昵称重复，不操作');
                    continue;
                }

                if (config.begin >= runIndex) {
                    Log.log('前多少名不操作', runIndex);
                    continue;
                }

                Log.log('点击元素，准备进入个人中心');
                contains = UiSelector().id('com.ss.android.ugc.aweme:id/content').clickable(true).isVisibleToUser(true).find();
                contains[i].click();
                Common.sleep(3000 + 2000 * Math.random());
                statistics.viewUser();
                let isPrivateAccount = User.isPrivate();
                if (isPrivateAccount) {
                    Common.back();
                    machineSet(contains[i].desc());
                    contents.push(contains[i].desc());
                    continue;
                }
                Log.log('是否是私密账号：' + isPrivateAccount);

                Log.log('即将进入视频');
                if (Video.intoUserVideo()) {
                    //点赞
                    try {
                        if (Math.random() * 100 <= config.zanRate) {
                            Common.sleep(base * config.zanWait);
                            Video.clickZan();
                            Log.log('点赞了');
                            Common.sleep(iBase * config.zanWait);
                        }

                        if (Math.random() * 100 <= config.collectRate && !User.isFocus()) {
                            Common.sleep(base * config.collectWait);
                            Video.collect();
                            Log.log('收藏了');
                            Common.sleep(iBase * config.collectWait);
                        }

                        if (Math.random() * 100 <= config.commentRate) {
                            let msg = getMsg(0, Video.getContent());
                            if (msg) {
                                Common.sleep(base * config.commentWait);
                                Video.openComment(!!Video.getCommentCount());
                                Log.log('开启评论窗口');
                                Comment.commentMsg(msg.msg);///////////////////////////////////操作  评论视频
                                Log.log('评论了');
                                Common.sleep(iBase * config.commentWait);
                                Common.back(2, 800);
                            } else {
                                Common.back();//从视频页面到用户页面
                            }
                        } else {
                            Common.back();//返回
                        }
                    } catch (e) {
                        Log.log('错误', e);
                        User.backHome();
                    }
                } else {
                    Log.log('未进入视频');
                }

                Common.sleep(500);
                Common.swipe(1, 1, 0.3);
                Common.sleep(1000);
                if (Math.random() * 100 <= config.focusRate) {
                    Common.sleep(base * config.focusWait);
                    User.focus();
                    Common.sleep(iBase * config.focusWait);
                }

                if (Math.random() * 100 <= config.privateRate) {
                    Common.sleep(base * config.privateWait);
                    if (config.privateLanv) {
                        Log.log('私信卡片');
                        User.privateMsgCard();
                        Common.sleep(500);
                    } else {
                        User.privateMsg(getMsg(1, contains[i].desc()).msg);
                    }
                    Common.sleep(iBase * config.privateWait);
                }
                Log.log('设置已经操作的账号：' + contains[i].desc());
                machineSet(contains[i].desc());
                contents.push(contains[i].desc());
                Common.sleep(300);
                Common.back();
                Common.sleep(config.accountWait);
            }

            if (rpCount >= 3) {
                return true;
            }
            Common.swipeFansGroupListOp();
            Log.log('滑动');
            Common.sleep(1000 + 1000 * Math.random());
        }
    }
}

module.exports = Message;
