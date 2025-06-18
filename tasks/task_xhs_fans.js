let storage = require("common/storage.js");
let machine = require("common/machine.js");
let Common = require("app/xhs/Common.js");
let V = require("version/XhsV.js");
let User = require("app/xhs/User.js");
let Work = require("app/xhs/Work.js");
let baiduWenxin = require('service/baiduWenxin.js');

let task = {
    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-xhs-fans-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }

        //return { msg: ['厉害', '六六六', '666', '拍得很好', '不错哦', '关注你很久了', '学习了', '景色不错', '真的很不错', '太厉害了', '深表认同', '来过了', '茫茫人海遇见你', '太不容易了', '很好', '懂了', '我看到了', '可以的', '一起加油', '真好', '我的个乖乖'][Math.round(Math.random() * 20)] };
        return machine.getMsg(type) || false;//永远不会结束
    },

    run() {
        let config = {
            runCount: storage.get('task_xhs_fans_run_count', 'int'),
            interval: storage.get('task_xhs_fans_interval', 'int') * 1000,
            homeWait: storage.get('task_xhs_fans_home_wait', 'int') * 1000,
            workWait: storage.get('task_xhs_fans_work_wait', 'int') * 1000,
            minFans: storage.get('task_xhs_fans_min_fans', 'int'),
            maxFans: storage.get('task_xhs_fans_max_fans', 'int'),
            minWork: storage.get('task_xhs_fans_min_work', 'int'),
            op: storage.getArray('task_xhs_fans_op'),//0关注，1私信，2首作品点赞
        }

        Log.log('config', config);
        this.log();
        this.tokerFans(config);
    },

    tokerFans(config) {
        Common.id(V.User.fans[0]).descContains(V.User.fans[1]).isVisibleToUser(true).waitFindOne();//粉丝或者关注界面
        let nicknameErrorCount = 0;

        let selectedTag = Common.id(V.User.fans[0]).isVisibleToUser(true).descContains(V.User.fans[4]).findOne();
        Log.log("选择的内容", selectedTag);

        let selectText = selectedTag.desc().replace(V.User.fans[4], '');//根据内容 【关注、粉丝、推荐】选择对应的滑动
        let arr = [];
        let stopMarkCount = 0;
        Log.log('总数量：' + config.runCount);
        let showAll = false;//还没有点击 “查看全部”
        let minTop = selectedTag.bounds().top + selectedTag.bounds().height();
        Log.log('最低top是：', minTop);
        let containsCountError = 0;

        while (true) {
            try {
                let contains = Common.id(V.User.fans[5]).isVisibleToUser(true).find();
                Log.log('容器数量：' + contains.length);
                if (contains.length === 0) {
                    if (containsCountError++ >= 3) {
                        throw new Error('3次容器数量为0');
                    }
                }

                containsCountError = 0;
                for (let i in contains) {
                    let nicknameTag = contains[i].children().findOne(Common.id(V.User.fans[6]).filter(v => {
                        return v && v.bounds() && v.bounds().height() > 0 && v.bounds().top >= minTop;
                    }));
                    if (!nicknameTag) {
                        Log.log("找不到昵称", contains[i]);
                        if (nicknameErrorCount++ >= 3) {
                            return true;//完成
                        }
                        continue;
                    }

                    nicknameErrorCount = 0;
                    let nickname = nicknameTag.text();
                    Log.log('开始操作昵称', nickname, nicknameTag);
                    if (arr.indexOf(nickname) != -1) {
                        Log.log('重复昵称', nickname);
                        if (stopMarkCount++ >= 3) {
                            return true;
                        }
                        continue;
                    }

                    arr.push(nickname);
                    if (arr.length >= 20) {
                        arr.shift();
                    }

                    //作品数和粉丝数，仅仅针对“粉丝列表”
                    if (selectText == V.User.fans[2]) {
                        let countTag = contains[i].children().findOne(Common.id(V.User.fans[8]));
                        let workCount = User.getListWorkCount(countTag);
                        if (workCount < config.minWork) {
                            Log.log('作品数量不合格：', workCount, config.minWork);
                            continue;
                        }

                        let fansCount = User.getListFansCount(countTag);
                        if (fansCount < config.minFans || fansCount > config.maxFans) {
                            Log.log('粉丝数量不合格：', fansCount, config.minFans, config.maxFans);
                            continue;
                        }
                    }

                    Common.click(nicknameTag);
                    Common.sleep(2000 + 1000 * Math.random());//进入了主页
                    let fansCount = User.getFansCount();
                    if (fansCount < config.minFans || fansCount > config.maxFans) {
                        Log.log('作品:数量不合格：', fansCount, config.minFans, config.maxFans);
                        Common.back();
                        continue;
                    }

                    //首先进入视频，不管是关注，私信，还是首作品点赞； 进入视频主要是为了防止风控

                    if (User.intoVideo()) {
                        //有视频  进入了视频  假装休眠
                        Common.sleep(config.workWait * 0.7);
                        Common.swipe(0, 0.5);

                        //是否点赞  
                        if (config.op.indexOf('2') != -1) {
                            Log.log('点赞了');
                            Work.zan();
                        }

                        Common.sleep(config.workWait * 0.3);
                        Common.back();//有时候会出现不能返回的情况，小红薯的设计bug  比如点击关注之后，出现了 “关注他的人也关注了”的列表，返回之后，只是关闭了这个，而没有真正返回
                        Common.sleep(1000 + 1000 * Math.random());
                        Log.log('从视频页面返回到主页');
                    }

                    //这里防止视频页面没有进去，但是已经返回到了列表页
                    if (!Common.id(V.User.nickname[0]).findOne()) {
                        continue;
                    }

                    //正常情况下，在用户页，进行返回操作
                    Common.sleep(config.homeWait * 0.8);

                    if (config.op.indexOf('0') != -1) {
                        Log.log('准备关注');
                        User.focus();
                        Common.sleep(1500 + 1000 * Math.random());
                    }

                    if (config.op.indexOf('1') != -1) {
                        let ttt = this.getMsg(1, nickname);
                        let msg = ttt ? ttt.msg : '';
                        Log.log('准备私信', msg);
                        User.privateMsg(msg);
                        Common.sleep(1500 + 1000 * Math.random());
                    }

                    Log.log('剩余数量：' + config.runCount);

                    if (config.runCount-- <= 0) {
                        return true;
                    }

                    Common.sleep((config.interval || 1000) * 0.8);
                    Common.swipe(0, 0.2);
                    Common.sleep((config.interval || 1000) * 0.2);//假装滑动
                    Common.back();
                    Common.sleep(500);

                    if (Common.id(V.User.nickname[0]).findOne()) {
                        Common.back();//有时候会出现不能返回的情况，小红薯的设计bug
                    }
                    Log.log('返回到了主界面');
                }

                if (!showAll) {
                    let showAllTag = Common.id(V.User.showAllFans[0]).textContains(V.User.showAllFans[1]).isVisibleToUser(true).findOne();
                    if (showAllTag) {
                        Log.log('点击“查看全部”');
                        Common.click(showAllTag);
                        Common.sleep(2000 + 1000 * Math.random());
                        showAll = true;
                    }
                }

                let likeTag = Common.id(V.Work.like[0]).textContains(V.Work.like[1]).isVisibleToUser(true).findOne();
                if (likeTag) {
                    return true;//操作完成了，下面都是“你可能感兴趣的人”
                }

                User.swipeFans(selectText);
                Common.sleep(1000 + 1000 * Math.random());
            } catch (e) {
                Log.log('异常了~', e);
                if (Common.id(V.User.fans[0]).descContains(V.User.fans[1]).isVisibleToUser(true).findOne()) {
                    User.swipeFans(selectText);
                } else {
                    Common.back();
                }
                Common.sleep(1000 + 1000 * Math.random());
            }
        }
    }
}

if (task.run()) {
    FloatDialogs.show('提示', '已完成');
}
