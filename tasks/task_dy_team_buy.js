let tCommon = require("app/dy/Common");
let DyIndex = require("app/dy/Index");
let DyUser = require("app/dy/User");
let DyVideo = require("app/dy/Video");
let DyComment = require("app/dy/Comment");
let storage = require("common/storage");
let machine = require("common/machine");
let baiduWenxin = require("service/baiduWenxin");
let V = require('version/V.js');

let task = {
    index: -1,
    nicknames: [],
    contents: [],
    run() {
        return this.testTask();
    },

    getMsg(type, title, age, gender) {
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
        let allFile = "log/log-comment-" + file + ".txt";
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

    search(keyword) {
        let inputTag = tCommon.id(V.Search.intoSearchList[0]).isVisibleToUser(true).findOne();
        if (!inputTag) {
            Log.log('没有input');
            return false;
        }

        tCommon.click(inputTag);
        tCommon.sleep(2000);

        inputTag = tCommon.id(V.Search.intoSearchList[0]).findOne();
        if (!inputTag) {
            tCommon.sleep(2000);
            inputTag = tCommon.id(V.Search.intoSearchList[0]).findOne();
        }

        inputTag.setText(keyword);
        tCommon.sleep(2000);

        let submitTag = tCommon.id(V.Search.intoSearchList[1]).textContains(V.Search.intoSearchList[2]).isVisibleToUser(true).findOne();
        if (!submitTag) {
            Log.log('没有搜索button');
            return false;
        }
        tCommon.click(submitTag);
        tCommon.sleep(5000);

        let containerTag = UiSelector().textContains(keyword).className('com.lynx.tasm.behavior.ui.text.FlattenUIText').isVisibleToUser(true).findOne();

        Log.log('神器：', containerTag);

        if (!containerTag) {
            containerTag = UiSelector().textContains(keyword.substring(0, 6)).className('com.lynx.tasm.behavior.ui.text.FlattenUIText').isVisibleToUser(true).findOne();
            if (!containerTag) {
                Log.log('没有找到店铺');
                FloatDialogs.show('提示', '没有找到门店，请确保名称完全一致~');
                return -1;
            }
        }

        Log.log(containerTag);

        Gesture.click(containerTag.bounds().left + 5 + Math.random() * 20, containerTag.bounds().top + 5 + Math.random() * 20);
        tCommon.sleep(3000 + 3000 * Math.random());

        let i = 12;
        let commentTag;
        while (i-- > 0) {
            commentTag = UiSelector().textContains(V.GroupBuy.shopContainer[2]).isVisibleToUser(true).filter(v => {
                return v && v.bounds() && v.bounds().left > Device.width() * 0.6 && v.bounds().top + v.bounds().height() < Device.height() - 150;
            }).findOne();
            Log.log('评论内容：', commentTag);
            if (commentTag) {
                break;
            }

            let shopContainer = tCommon.id(V.GroupBuy.shopContainer[0]).isVisibleToUser(true).filter(v => {
                return v && v.bounds() && v.bounds().top > Device.height() - v.bounds().height();
            }).findOne();
            if (!shopContainer) {
                Log.log('滑动灵敏度：', machine.get('task_dy_team_buy_swipe', 'int') / 100);
                tCommon.swipe(0, machine.get('task_dy_team_buy_swipe', 'int') / 100);//慢慢滑动
                tCommon.sleep(1500 + 500 * Math.random());
            } else {
                Log.log('没有找到shopContainer');
            }
        }

        if (!commentTag) {
            FloatDialogs.show('提示', '没有找到评论列表~');
            return -1;
        }

        tCommon.click(commentTag);
        tCommon.sleep(3000 + 2000 * Math.random());

        //最新点击
        let newTag = new UiSelector().textContains('最新').className('com.lynx.tasm.behavior.ui.text.UIText').findOne() || new UiSelector().textContains('最新').className('com.lynx.tasm.behavior.ui.text.FlattenUIText').findOne() || new UiSelector().textContains('最新').className('com.lynx.tasm.behavior.ui.LynxFlattenUI').findOne();
        if (newTag) {
            tCommon.click(newTag);
            tCommon.sleep(3000 + 2000 * Math.random());
        }

        return true;
    },

    testTask() {
        let keyword = machine.get('task_dy_team_buy_text');
        let zanRate = machine.get('task_dy_team_buy_zan_rate', 'int');
        let privateRate = machine.get('task_dy_team_buy_private_rate', 'int');
        let commentRate = machine.get('task_dy_team_buy_comment_rate', 'int');
        let opCount = machine.get('task_dy_team_buy_op_count') * 1;
        let waitSecond = machine.get('task_dy_team_buy_wait', 'int');

        Log.log([
            keyword, zanRate, privateRate, commentRate, opCount, waitSecond
        ]);

        //首先进入页面
        let res = DyIndex.intoGroupBuy(keyword);
        if (!res) {
            return res;
        }

        tCommon.sleep(3000);
        res = this.search(keyword);
        if (true !== res) {
            return res;
        }

        let containers = [];
        let rpContainers = [];

        while (true) {
            try {
                // ntoUser = UiSelector().textContains('帮助更多用户决策').isVisibleToUser(true).findOne() ? false : true;
                let tags = UiSelector().textMatches("[\\s\\S]+").clickable(true).filter(v => {
                    return v && v.bounds() && v.bounds().width() == Device.width() && v.bounds().height() > 0 && v.bounds().left == 0 && v.bounds().top + v.bounds().height() < Device.height();
                }).find();

                if (tags.length == 0) {
                    Log.log('无内容');
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
                    //tags[i].click();
                    let tops = tags[i].bounds().top;
                    if (tops < 0) {
                        tops = tags[i].bounds().top + tags[i].bounds().height() - 10 * Math.random();
                    } else {
                        tops += 20 * Math.random();
                    }

                    Gesture.click(tags[i].bounds().left + 20 * Math.random(), tops);
                    tCommon.sleep(3000 + 1000 * Math.random());

                    let commentDetailHead = UiSelector().className('com.lynx.tasm.ui.image.FlattenUIImage').clickable(false).filter(v => {
                        return v && v.bounds() && v.bounds().left < Device.width() * 0.3 && v.bounds().height() == v.bounds().width();
                    }).findOne();

                    if (!commentDetailHead) {
                        Log.log('没有头像，返回');
                        tCommon.back();
                        continue;
                    }

                    tCommon.click(commentDetailHead);
                    tCommon.sleep(3000 + 1000 * Math.random());
                    if (UiSelector().textContains('用户评价').descContains('用户评价').isVisibleToUser(true).findOne()) {
                        Log.log('点击失效');
                        continue;
                    }

                    intoUser = UiSelector().textContains('评价数').descContains('评价数').isVisibleToUser(true).findOne() ? true : false;
                    if (!intoUser) {
                        tCommon.back();
                        Log.log('没有进入到主页，可能是设置隐私了-1');
                        continue;
                    }

                    let currentCommentRate = Math.random() * 100;
                    let currentPrivateRate = Math.random() * 100;
                    let currentZanRate = Math.random() * 100;

                    if (zanRate >= currentZanRate || commentRate >= currentCommentRate || privateRate >= currentPrivateRate) {
                        Log.log('进入主页留痕了');
                        let header = UiSelector().className('com.lynx.tasm.ui.image.FlattenUIImage').clickable(false).filter(v => {
                            return v && v.bounds() && v.bounds().left > Device.width() * 0.6 && v.bounds().height() == v.bounds().width();
                        }).findOne();

                        Log.log('头像', header);
                        if (!header) {
                            tCommon.back();
                            Log.log('没有看见头，返回');
                            continue;
                        }

                        tCommon.click(header);
                        tCommon.sleep(3000 + 1000 * Math.random());

                        let douyin = DyUser.getDouyin();
                        if (rpContainers.indexOf(douyin) != -1) {
                            tCommon.back(2);
                            tCommon.sleep(1000);
                            Log.log('重复');
                            continue;
                        }

                        rpContainers.push(douyin);

                        if (!DyVideo.intoUserVideo()) {
                            tCommon.back(3);
                            tCommon.sleep(1000);
                            Log.log('没有进入视频，返回3次')
                            continue;
                        }

                        let opC = 0;
                        tCommon.sleep(5000 + 5000 * Math.random());
                        if (zanRate >= currentZanRate) {
                            DyVideo.clickZan();
                            tCommon.sleep(1000 + Math.random() * 3000);
                            opC = 1;
                        }

                        if (commentRate >= currentCommentRate) {
                            DyComment.commentMsg(this.getMsg(0, DyVideo.getContent()).msg);
                            tCommon.sleep(1000 + Math.random() * 3000);
                            opC = 1;
                        }

                        tCommon.back();//返回到用户界面

                        if (privateRate >= currentPrivateRate) {
                            tCommon.sleep(500);
                            Log.log('滑动');
                            tCommon.swipe(1, 0.8);
                            //Gesture.swipe(200, Device.height() * 0.3, 200, Device.height() * 0.7, 100);
                            tCommon.sleep(500);
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
                        tCommon.back(3);//用户评论主页，再返回一次，才是列表页
                    }

                    //用户评论页，回到列表页
                    if (intoUser) {
                        Log.log('进入了用户-');
                        let isTrueIntoUserTag = UiSelector().textContains('评价数').descContains('评价数').isVisibleToUser(true).findOne();
                        if (isTrueIntoUserTag) {
                            tCommon.back(2);
                            tCommon.sleep(1000);
                        }
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
                let runTimes = 5;
                let resolve = false;
                do {
                    let bottomTag = UiSelector().textContains('用户评价').descContains('用户评价').isVisibleToUser(true).findOne();//底部栏
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

                if (!resolve) {
                    throw new Error('5次没有解决异常');
                }
            }
        }
    },
}

tCommon.openApp();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        let r = task.run();
        if (r == -1 || r == false) {
            break;//异常的情况
        }

        if (r) {
            break;
        }

        tCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
        tCommon.closeAlert(1);
        tCommon.backHome(10);
    }
}
FloatDialogs.show('提示', '已完成');