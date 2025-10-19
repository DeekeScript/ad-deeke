let storage = require("common/storage.js");
let Common = require("app/xhs/Common.js");
let User = require("app/xhs/User.js");

let Work = require("app/xhs/Work.js");

let task = {
    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-xhs-zan-back-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        gender = ['女', '男', '未知'][gender];
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }

        //return { msg: ['厉害', '六六六', '666', '拍得很好', '不错哦', '关注你很久了', '学习了', '景色不错', '真的很不错', '太厉害了', '深表认同', '来过了', '茫茫人海遇见你', '太不容易了', '很好', '懂了', '我看到了', '可以的', '一起加油', '真好', '我的个乖乖'][Math.round(Math.random() * 20)] };
        return machine.getMsg(type) || false;//永远不会结束
    },

    run() {
        let config = {
            runCount: storage.get('task_xhs_zan_back_run_count', 'int'),
            interval: 5 * 1000,
            homeWait: 5 * 1000,
            workWait: 5 * 1000
        }

        return this.zanBack(config);
    },

    zanBack(config) {
        Log.log('开始');
        UiSelector().className('android.view.ViewGroup').descContains('已选定赞和收藏').isVisibleToUser(true).waitFindOne();
        Log.log('进入');

        let noNicknameTagCount = 0;
        let arr = [];
        let repeatNicknameCount = 0;
        Log.log('操作总次数：' + config.runCount);

        while (true) {
            try {
                let containers = UiSelector().className('android.view.ViewGroup').isVisibleToUser(true).filter(v => {
                    let childs = v.children();
                    if (!childs.findOne(Common.id('avatarLayout'))) {
                        return false;
                    }

                    if (!childs.findOne(Common.id('nickNameTV'))) {
                        return false;
                    }

                    if (!childs.findOne(Common.id('followTV'))) {
                        return false;
                    }
                    return true;
                }).find();//获取列表外层
                Log.log('内容：', containers.length);
                if (containers.length == 0) {
                    return true;
                }

                let baseChilds = [];
                for (let i in containers) {
                    baseChilds.push(containers[i].children());//保存对象
                }

                for (let i in containers) {
                    let childs = baseChilds[i];
                    let nicknameTag = childs.findOne(Common.id('nickNameTV'));
                    if (!nicknameTag) {
                        if (noNicknameTagCount++ >= 3) {
                            throw new Error('3次找不到昵称');
                        }
                    }

                    noNicknameTagCount = 0;
                    let nickname = nicknameTag.text();
                    Log.log('准备操作昵称：' + nickname);

                    if (arr.indexOf(nickname) != -1) {
                        if (repeatNicknameCount++ >= 3) {
                            Log.log('重复3次，都是同一个昵称');
                            return true;//完成了
                        }
                        continue;
                    }

                    repeatNicknameCount = 0;
                    arr.push(nickname);
                    if (arr.length >= 20) {
                        arr.shift();
                    }

                    Common.click(nicknameTag);
                    Common.sleep(2000 + 2000 * Math.random());

                    Log.log('即将进入视频');
                    let intoVideo = false;
                    if (User.intoVideo()) {
                        Log.log('进入视频');
                        Common.sleep(config.workWait * 0.9);
                        Work.zan();
                        if (config.runCount-- <= 0) {
                            Log.log('剩余数量：' + config.runCount);
                            return true;
                        }

                        intoVideo = true;
                        Common.sleep(config.workWait * 0.1);
                        Common.back();
                    }

                    //判断是否在用户页面  有作品的才操作，没有作品
                    if (intoVideo) {
                        if (UiSelector().className('android.view.View').descContains('头像').findOne()) {
                            Common.sleep(config.homeWait * 0.8);
                            Common.swipe(0, 0.5);
                            Common.sleep(config.homeWait * 0.2);
                            Common.back();
                            Log.log('返回列表');
                        } else {
                            Log.log('问题');
                            //可能是列表页面  不做任何返回操作
                        }
                    } else {
                        Common.sleep(config.homeWait * 0.2);
                        Common.back();
                    }

                    Common.sleep(config.interval);
                }

                Work.zanUserListSwipe();
            } catch (e) {
                let a = UiSelector().className('android.view.ViewGroup').descContains('已选定赞和收藏').isVisibleToUser(true).findOne();
                if (a) {
                    Log.log(a);
                    Work.zanUserListSwipe();
                } else {
                    Log.log('其他页面，返回');
                    Common.back();//其他页面，则返回
                }
                Log.log('异常了~', e);
            }
        }
    }
}

if (task.run()) {
    FloatDialogs.show('提示', '已完成');
}
