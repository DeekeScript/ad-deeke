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

    intoShop(name) {
        let tag = UiSelector().clickable(true).descContains('团购').findOne();
        tag.click();
        tCommon.sleep(5000);

        tag = tCommon.id('et_search_kw').isVisibleToUser(true).findOne();
        tag.parent().click();
        tCommon.sleep(1500);

        tag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();
        tag.setText(name);
        tCommon.sleep(1000);

        tag = UiSelector().desc('搜索').isVisibleToUser(true).findOne();
        tCommon.click(tag);
        tCommon.sleep(4000);

        tag = UiSelector().descContains(name).isVisibleToUser(true).findOne();
        if (!tag) {
            tag = UiSelector().descContains(name.substring(0, 3)).isVisibleToUser(true).findOne();
        }
        if (!tag) {
            tag = UiSelector().className('android.view.ViewGroup').filter(v => {
                return !!v.desc();
            }).isVisibleToUser(true).findOne();
        }
        tCommon.click(tag);
        tCommon.sleep(4000);

        let imageFile = Images.capture();
        let arr = Images.findTextPosition(imageFile, "条评价");
        console.log(arr);
        if (arr.length == 0) {
            arr = Images.findTextPosition(imageFile, "条评");
        }
        Gesture.click(arr[0].left + 10 + 10 * Math.random(), arr[0].centerY());
        tCommon.sleep(4000);
        return true;
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
        let shopName = machine.get('task_dy_team_buy_name');
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

        this.intoShop(shopName);
        //System.setAccessibilityMode('!fast');//非快速模式
        while (true) {
            try {
                //底部分享评论部分，如果低于这个top，则不操作
                let parentTag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').isVisibleToUser(true).findOne();
                let tags = parentTag.children().find(UiSelector().className('android.widget.FrameLayout').isVisibleToUser(true));

                if (tags.length == 0) {
                    Log.log('无内容');
                    System.exit();
                    System.sleep(5000);
                    return true;
                }

                for (let i in tags) {
                    let textTag = tags[i].children().findOne(UiSelector().descMatches(/[\s\S]+/));
                    if (!textTag || !textTag.isVisibleToUser()) {
                        console.log('没有内容');
                        continue;
                    }

                    if (rpContainers.indexOf(textTag.desc()) != -1) {
                        Log.log('重复');
                        continue;
                    }

                    rpContainers.push(textTag.desc());
                    if (rpContainers.length > 20) {
                        rpContainers.shift();
                    }

                    Log.log('内容：', textTag.desc());

                    Log.log('进入用户中心', tags[i], tags[i].bounds().top, tags[i].bounds().height());

                    let x = tags[i].bounds().left + (textTag.bounds().left - tags[i].bounds().left) / 2;
                    let y = tags[i].bounds().top + (textTag.bounds().top - tags[i].bounds().top) / 2 * 0.6;
                    tCommon.click(x, y);

                    tCommon.sleep(3000 + 1000 * Math.random());
                    let intoUser = UiSelector().textContains('评价数').descContains('评价数').isVisibleToUser(true).findOne() ? true : false;
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

if (!machine.get('task_dy_team_buy_name')) {
    FloatDialogs.show('温馨提示', '团购商家名称不能为空');
    System.exit();
    tCommon.sleep(3000);
}

if (!Access.isMediaProjectionEnable()) {
    FloatDialogs.show('温馨提示', '请打开主界面侧边栏，开启“图色查找”权限');
    System.exit();
    tCommon.sleep(3000);
}

//开启线程  自动关闭弹窗
System.setAccessibilityMode('fast');//快速模式
Engines.executeScript("unit/dialogClose.js");

task.log();
while (true) {
    try {
        tCommon.openApp();
        if (task.run()) {
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