let tCommon = require("app/dy/Common");
let DyUser = require("app/dy/User");
let DyVideo = require("app/dy/Video");
let DyComment = require("app/dy/Comment");
let storage = require("common/storage");
let machine = require("common/machine");
let baiduWenxin = require("service/baiduWenxin");

let task = {
    index: -1,
    nicknames: [],
    contents: [],
    run() {
        return this.testTask();
    },

    getMsg(type, title, age, gender) {
        gender = ['女', '男', '未知'][gender];
        if (type == 1 && machine.get('task_dy_team_buy_private_share_rate', 'bool')) {
            return { msg: '' };
        }

        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-team-buy-" + file + ".txt";
        Log.setFile(allFile);
    },

    includesKw(str, kw) {
        for (let i in kw) {
            if (str.includes(kw[i])) {
                return true;
            }
        }
        return false;
    },

    testTask() {
        let zanRate = machine.get('task_dy_team_buy_zan_rate', 'int');
        let privateRate = machine.get('task_dy_team_buy_private_rate', 'int');
        let commentRate = machine.get('task_dy_team_buy_comment_rate', 'int');
        let opCount = machine.get('task_dy_team_buy_op_count') * 1;
        let waitSecond = machine.get('task_dy_team_buy_wait', 'int');

        Log.log([
            zanRate, privateRate, commentRate, opCount, waitSecond
        ]);

        let containers = [];
        let rpContainers = [];

        while (true) {
            try {
                //底部分享评论部分，如果低于这个top，则不操作
                let bottomCommentTag = UiSelector().className('com.lynx.tasm.behavior.ui.LynxFlattenUI').descContains('分享真实体验').findOne();
                Log.log('bottomCommentTag', bottomCommentTag);
                let bottom = Device.height();
                if (bottomCommentTag) {
                    bottom = bottomCommentTag.bounds().top;
                }

                let tags = UiSelector().className('com.lynx.tasm.behavior.ui.view.UIView').textMatches("[\\s\\S]+").clickable(true).filter(v => {
                    return v && v.bounds() && v.bounds().width() == Device.width() && v.bounds().height() > 0 && v.bounds().left == 0 && v.bounds().top + 250 < Device.height();
                }).find();

                if (tags.length == 0) {
                    Log.log('无内容');
                    System.exit();
                    System.sleep(5000);
                    return true;
                }

                if (containers.length >= 3) {
                    if (tags[0].text() == containers[0] && tags[0].text() == containers[1]) {
                        Log.log('完成');
                        return true;
                    }

                    containers.shift();
                }

                containers.push(tags[0].text());

                for (let i in tags) {
                    if (rpContainers.indexOf(tags[i].text()) != -1) {
                        Log.log('重复');
                        continue;
                    }

                    rpContainers.push(tags[i].text());
                    if (rpContainers.length > 20) {
                        rpContainers.shift();
                    }

                    Log.log('内容：', tags[i].text());
                    if (tags[i].text() && (tags[i].text().indexOf('**') !== -1 || tags[i].text().indexOf('帮助更多用户决策') !== -1) || !tags[i].desc()) {
                        Log.log('隐私或者底部');
                        continue;
                    }

                    Log.log('进入用户中心', tags[i], tags[i].bounds().top, tags[i].bounds().height());
                    // Gesture.click(tags[i].bounds().left + 20 * Math.random(), tags[i].bounds().top + 20 * Math.random());
                    let intoHeader = UiSelector().className('com.lynx.tasm.ui.image.FlattenUIImage').filter(v => {
                        return v && v.bounds().left > tags[i].bounds().left && v.bounds().top > tags[i].bounds().top && v.bounds().left < Device.width() / 2;
                    }).findOne();

                    if (intoHeader.bounds().top + intoHeader.bounds().height() >= bottom) {
                        Log.log('头像位置不对，滑动一下');
                        continue;
                    }

                    tCommon.click(intoHeader);
                    tCommon.sleep(3000 + 1000 * Math.random());
                    intoUser = UiSelector().textContains('评价数').descContains('评价数').isVisibleToUser(true).findOne() ? true : false;
                    if (!intoUser) {
                        Log.log('没有进入到主页，可能是设置隐私了-1');
                        continue;
                    }

                    let commentDetailHead = UiSelector().className('com.lynx.tasm.ui.image.FlattenUIImage').clickable(false).filter(v => {
                        return v && v.bounds() && v.bounds().left > Device.width() * 0.5 && v.bounds().height() == v.bounds().width();
                    }).findOne();

                    if (!commentDetailHead) {
                        Log.log('没有头像，返回');
                        tCommon.back();
                        tCommon.sleep(600);
                        continue;
                    }

                    tCommon.click(commentDetailHead);
                    tCommon.sleep(3000 + 1000 * Math.random());

                    Log.log('进入主页留痕了');
                    let currentCommentRate = Math.random() * 100;
                    let currentPrivateRate = Math.random() * 100;
                    let currentZanRate = Math.random() * 100;

                    if (zanRate >= currentZanRate || commentRate >= currentCommentRate || privateRate >= currentPrivateRate) {
                        let douyin = DyUser.getDouyin();
                        if (!douyin) {
                            tCommon.back(1);
                            tCommon.sleep(1000);
                            if (!this.backList()) {
                                Log.log('没有回到列表页面');
                                break;
                            }
                            Log.log('返回到列表');
                            continue;
                        }
                        if (rpContainers.indexOf(douyin) != -1) {
                            throw new Error('可能已经出问题了');
                        }

                        rpContainers.push(douyin);
                        if (!DyVideo.intoUserVideo()) {
                            tCommon.back(2);
                            tCommon.sleep(1000);
                            Log.log('没有进入视频，返回2次')
                            continue;
                        }
                        Log.log('进入视频');

                        let opC = 0;
                        tCommon.sleep(5000 + 5000 * Math.random());
                        if (zanRate >= currentZanRate) {
                            DyVideo.clickZan();
                            tCommon.sleep(1500 + Math.random() * 2000);
                            opC = 1;
                        }

                        if (commentRate >= currentCommentRate) {
                            let title = DyVideo.getContent();
                            DyVideo.openComment(!!DyVideo.getCommentCount());
                            DyComment.commentMsg(this.getMsg(0, title).msg);
                            tCommon.back(1);//返回到用户界面
                            tCommon.sleep(1000 + Math.random() * 3000);
                            opC = 1;
                        }

                        if (opC) {
                            Log.log('返回到用户界面');
                            tCommon.back(1);//返回到用户界面
                        }

                        if (privateRate >= currentPrivateRate) {
                            tCommon.sleep(1000);
                            Log.log('滑动');
                            tCommon.swipe(1, 0.8);
                            tCommon.sleep(1000 + 500 * Math.random());
                            DyUser.privateMsg(this.getMsg(1, DyUser.getNickname()).msg);
                            opC = 1;
                        }

                        opCount -= opC;
                        Log.log('opCount', opCount);
                        if (opCount <= 0) {
                            Log.log('opCount', opCount);
                            return true;
                        }

                        tCommon.sleep(waitSecond * 1000);
                        Log.log('操作完了，返回')
                        tCommon.back(2);//用户评论主页，再返回一次，才是列表页
                        tCommon.sleep(1000 + 1000 * Math.random());
                    }

                    //返回到列表页面
                    if (!this.backList()) {
                        Log.log('没有回到列表页面');
                        break;
                    } else {
                        Log.log('回到列表页面');
                    }
                }

                Log.log('下一页评论');
                let l = 300 * Math.random();
                let rd = Device.height() * 0.1;
                Log.log('滑动灵敏度：', machine.get('task_dy_team_buy_swipe', 'int') / 100);
                Gesture.swipe(l + 200, Device.height() * machine.get('task_dy_team_buy_swipe', 'int') / 100 + rd, l + 200, Device.height() * (0.2 + 0.1 * Math.random()), 200);
                tCommon.sleep(1500 + 500 * Math.random());
            } catch (e) {
                Log.log('报错了', e);
                if (!this.backList()) {
                    throw new Error('5次没有解决异常');
                }
            }
        }
    },

    backList() {
        let runTimes = 5;
        let resolve = false;
        do {
            let bottomTag = UiSelector().className('com.lynx.tasm.behavior.ui.text.FlattenUIText').text('好评').desc('好评').isVisibleToUser(true).findOne();//底部栏
            if (bottomTag) {
                resolve = true;
                break;
            }

            if (runTimes-- > 0) {
                tCommon.back();
                tCommon.sleep(500);
                Log.log('尝试返回');
                continue;
            }
            break;
        } while (true);
        return resolve;
    }
}

//开启线程  自动关闭弹窗
System.setAccessibilityMode('!fast');//非快速模式
Engines.executeScript("unit/dialogClose.js");

task.log();
try {
    task.run();
    tCommon.sleep(3000);
} catch (e) {
    Log.log(e);
    tCommon.closeAlert(1);
    tCommon.backHome(10);
}
FloatDialogs.show('提示', '已完成');