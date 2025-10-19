let DyCommon = require('app/dy/Common.js');
let DyUser = require('app/dy/User.js');
let DyVideo = require('app/dy/Video.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');
let baiduWenxin = require('service/baiduWenxin.js');
let statistics = require('common/statistics');

let task = {
    contents: [],
    run() {
        return this.testTask();
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-dy-qingsong-tuoke-" + file + ".txt";
        Log.setFile(allFile);
    },

    //type 0 评论，1私信
    getMsg(type, title, age, gender) {
        gender = ['女', '男', '未知'][gender];
        if (storage.get('setting_baidu_wenxin_switch', 'bool')) {
            return { msg: type === 1 ? baiduWenxin.getChat(title, age, gender) : baiduWenxin.getComment(title) };
        }
        return machine.getMsg(type) || false;//永远不会结束
    },

    getConfig() {
        return {
            runTimes: machine.get('task_dy_qingsong_tuoke_run_count', 'int'),//运行次数
            intevalSecond: machine.get('task_dy_qingsong_tuoke_interval', 'int'),//操作间隔
            homeWait: machine.get('task_dy_qingsong_tuoke_home_wait', 'int') || 5,//主页停留时间
            workWait: machine.get('task_dy_qingsong_tuoke_work_wait', 'int') || 5,//作品停留时间
            fansMin: machine.get('task_dy_qingsong_tuoke_min_fans', 'int') || 0, //最小粉丝数
            fansMax: machine.get('task_dy_qingsong_tuoke_max_fans', 'int') || 1000000000,//最大粉丝数
            workMin: machine.get('task_dy_qingsong_tuoke_min_work', 'int') || 1,//最小作品数
            gender: ['0', '1', '2'],
            op: ["2"],//machine.getArray('task_dy_qingsong_tuoke_op'), // "0"，"1"，"2" 分别是 关注、私信、点赞
            privateType: machine.getArray('task_dy_qingsong_tuoke_private_type') || [],
        }
    },


    testTask() {
        //查看是不是进入了指定页面，是的话才开始运行
        let config = this.getConfig();
        Log.log("配置信息：", config);
        let count = 0;
        let errorContainsCount = 0;
        while (true) {
            try {
                DyCommon.sleep(3000);
                System.toast('开始执行，剩余数量：' + (config.runTimes - count));
                let contains = DyCommon.id('root_layout').isVisibleToUser(true).find();
                Log.log("找到的内容数量：", contains.length);
                if (contains.length == 0) {
                    if (errorContainsCount++ >= 3) {
                        errorCount = 0;
                        throw new Error("3次找不到container内容");
                    }
                    continue;
                }
                errorContainsCount = 0;
                for (let i in contains) {
                    DyCommon.sleep(config.intevalSecond * 1000);
                    Log.log(contains[i]);

                    contains = DyCommon.id('root_layout').isVisibleToUser(true).find();
                    contains[i].click();
                    DyCommon.sleep(2000 + 1000 * Math.random());
                    statistics.viewUser();
                    let nickname = contains[i].desc();

                    if (count >= config.runTimes) {
                        FloatDialogs.toast('运行次数达到了');
                        return true;
                    }

                    if (DyUser.isPrivate()) {
                        DyCommon.back();
                        FloatDialogs.toast('私密账号');
                        continue;
                    }

                    let account = DyUser.getDouyin();
                    if (machine.get("task_dy_friend_change_" + account, 'bool')) {
                        DyCommon.back();
                        FloatDialogs.toast('已经操作过了');
                        continue;
                    }

                    Log.log("抖音号：", account);
                    let gender = DyUser.getGender();
                    Log.log('性别', gender, config.gender);
                    if (!config.gender.includes(gender)) {
                        DyCommon.back();
                        FloatDialogs.toast('性别不符合要求');
                        Log.log('性别不符合要求');
                        continue;
                    }

                    machine.set("task_dy_friend_change_" + account, true);
                    let fansCount = DyUser.getFansCount();
                    Log.log("粉丝数量：", fansCount);
                    if (fansCount < config.fansMin || fansCount > config.fansMax) {
                        DyCommon.back();
                        FloatDialogs.toast('粉丝数不符合要求');
                        continue;
                    }

                    let workCount = DyUser.getWorksCount();
                    Log.log("作品数量：", workCount);
                    if (workCount < config.workMin) {
                        DyCommon.back();
                        FloatDialogs.toast('作品数不符合要求');
                        continue;
                    }

                    let isOp = false;
                    if (config.op.includes("2") && DyVideo.intoUserVideo()) {
                        Log.log("执行进入视频");
                        DyCommon.sleep(config.workWait * 1000);
                        if (DyVideo.isZan()) {
                            FloatDialogs.toast('已经点赞了');
                        } else {
                            DyVideo.clickZan();
                            isOp = true;
                            DyCommon.sleep(2000 + 1000 * Math.random());
                        }
                        DyCommon.back();
                        DyCommon.sleep(1000 + 500 * Math.random());

                        let bottom = Device.height() - 200 - Math.random() * 300;
                        let top = bottom - 400 - Math.random() * 200;
                        let left = Device.width() * 0.1 + Math.random() * (Device.width() * 0.8);
                        Gesture.swipe(left, top, left, bottom, 300);
                        DyCommon.sleep(500 + 500 * Math.random());
                    }

                    //查看是否关注
                    if (config.op.includes("0")) {
                        Log.log("执行关注");
                        if (DyUser.isFocus()) {
                            FloatDialogs.toast('已关注，不操作');
                        } else {
                            DyUser.focus();
                            isOp = true;
                            DyCommon.sleep(1000 + Math.random() * 1000);
                        }
                    }

                    if (config.op.includes("1")) {
                        Log.log("执行私信");
                        //如果
                        if (config.privateType.includes("0") && config.privateType.includes("1")) {
                            DyUser.privateMsg(this.getMsg(1, nickname).msg);
                            isOp = true;
                        } else if (config.privateType.includes("0") && !DyUser.isCompany()) {
                            DyUser.privateMsg(this.getMsg(1, nickname).msg);
                            isOp = true;
                        } else if (config.privateType.includes("1") && DyUser.isCompany()) {
                            DyUser.privateMsg(this.getMsg(1, nickname).msg);
                            isOp = true;
                        }
                    }

                    if (isOp) {
                        count++;
                        Log.log('操作次数：' + count + "/" + config.runTimes);
                    }

                    DyCommon.sleep(config.homeWait * 1000);//主页停留
                    DyCommon.back();
                    DyCommon.sleep(500, 500);
                    if (DyCommon.aId('text1').descContains('粉丝').isVisibleToUser(true).findOne()) {
                        Log.log("在列表页面了");
                    } else {
                        DyCommon.back();
                    }
                }

                DyCommon.sleep(1000);
                Log.log("执行滑动");
                //判断是粉丝还是关注
                if (!task.swipe()) {
                    Log.log('滑动到底了');
                    return true;
                }
            } catch (e) {
                if (!DyCommon.aId('text1').descContains('粉丝').isVisibleToUser(true).findOne()) {
                    Log.log("找不到标签，返回了");
                    DyCommon.back();
                    DyCommon.sleep(2000);
                }
                Log.log(e);
            }
        }
    },


    swipe() {
        return DyCommon.swipeFansListOp();
    }
}

//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");

while (true) {
    task.log();
    try {
        let res = task.run();
        if (res) {
            DyCommon.sleep(3000);
            FloatDialogs.show('提示', '已完成');
            break;
        }

        DyCommon.sleep(3000);
    } catch (e) {
        Log.log(e);
    }
}
