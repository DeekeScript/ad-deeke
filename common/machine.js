let storage = require('common/storage.js');
let machine = {
    db() {
        return Storage;
    },

    clear() {
        this.db().clear();
        System.toast('成功');
    },

    getDate() {
        let d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    },

    getTask(params) {
        let task = storage.getTask();
        if (!task || !task.length) {
            return [];
        }

        let t = [];
        for (let i in task) {
            //Log.log(task[i]);
            if (task[i].state !== true) {
                continue;
            }

            let detail = storage.getTaskDetail(task[i].index);
            //Log.log(detail);
            if (params.isCity !== undefined && !!detail.taskRule.is_city * 1 !== params.isCity) {
                continue;
            }

            t.push({
                id: task[i].index,
                name: task[i].title,
            });
        }
        return t;
    },

    getTaskConfig(province, index) {
        let detail = storage.getTaskDetail(index);
        let res = detail['taskRule'] || {};
        res.hour = [];
        for (let i in res.time) {
            if (res.time[i]) {
                res.hour.push(i * 1);
            }
        }
        res.hour = JSON.stringify(res.hour);
        res.end_type = 0;//结束类型，不限制
        res.comment_zan_fre = res.zan_comment_fre || 0;
        res.video_zan_fre = res.zan_video_fre || 0;
        res.comment_fre = res.comment_video_fre || 0;
        res.comment_back_fre = res.comment_back_fre || 0;
        res.private_fre = res.private_msg_fre || 0;
        res.private_author_fre = res.private_msg_author_fre || 0;
        res.focus_fre = res.focus_fre || 0;
        res.focus_author_fre = res.focus_author_fre || 0;
        res.refresh_video_fre = res.video_fre || 1;//刷视频频率默认1起步

        //规则都是多维的，这里进行处理
        res.userRules = [detail['talentRule']];
        if (res.userRules[0].ip) {
            res.userRules[0].ip = res.userRules[0].ip.replace(/，/g, ',');
            res.userRules[0].ip = res.userRules[0].ip.split(',');
            res.userRules[0].province_id = [];
            for (let i in res.userRules[0].ip) {
                for (let j in province) {
                    if (province[j].name.indexOf(res.userRules[0].ip[i]) !== -1) {
                        res.userRules[0].province_id.push(province[j].id);
                    }
                }
            }
        } else {
            res.userRules[0].province_id = [0];
        }

        res.videoRules = [detail['videoRule']];
        res.videoRules[0].distance = detail['taskRule'].distance;
        res.videoRules[0].in_time = 6;//15天内

        res.commentRules = [detail['commentRule']];
        res.commentRules[0].in_time = 5;//7天内
        res.commentRules[0].nickname_type = [0];
        if (res.commentRules[0].ip) {
            res.commentRules[0].province_id = [];
            res.commentRules[0].ip = res.commentRules[0].ip.replace(/，/g, ',');
            res.commentRules[0].ip = res.commentRules[0].ip.split(',');
            for (let i in res.commentRules[0].ip) {
                for (let j in province) {
                    if (province[j].name.indexOf(res.commentRules[0].ip[i]) !== -1) {
                        res.commentRules[0].province_id.push(province[j].id);
                    }
                }
            }
        } else {
            res.commentRules[0].province_id = [0];
        }

        res.commentUserRules = [detail['userRule']];
        if (res.commentUserRules[0].ip) {
            res.commentUserRules[0].ip = res.commentUserRules[0].ip.replace(/，/g, ',');
            res.commentUserRules[0].ip = res.commentUserRules[0].ip.split(',');
            res.commentUserRules[0].province_id = [];
            for (let i in res.commentUserRules[0].ip) {
                for (let j in province) {
                    if (province[j].name.indexOf(res.commentUserRules[0].ip[i]) !== -1) {
                        res.commentUserRules[0].province_id.push(province[j].id);
                    }
                }
            }
        } else {
            res.commentUserRules[0].province_id = [0];
        }

        return res;
    },

    getConfig(index) {
        let db = this.db();
        return {
            videoTimestamp: JSON.parse(db.get('config_' + index + '_videoTimestamp_' + this.getDate()) || '[]'),
            zanVideoTimestamp: JSON.parse(db.get('config_' + index + '_zanVideoTimestamp_' + this.getDate()) || '[]'),
            zanCommentTimestamp: JSON.parse(db.get('config_' + index + '_zanCommentTimestamp_' + this.getDate()) || '[]'),
            commentTimestamp: JSON.parse(db.get('config_' + index + '_commentTimestamp_' + this.getDate()) || '[]'),
            focusTimestamp: JSON.parse(db.get('config_' + index + '_focusTimestamp_' + this.getDate()) || '[]'),
            privateMsgTimestamp: JSON.parse(db.get('config_' + index + '_privateMsgTimestamp_' + this.getDate()) || '[]'),
            viewUserPageTimestamp: JSON.parse(db.get('config_' + index + '_viewUserPageTimestamp_' + this.getDate()) || '[]'),
            privateClose: false,
        }
    },

    getDouyinConfig(account) {
        let db = this.db();
        let key = 'privateClose_' + account;
        let res = db.get(key);
        if (!res) {
            return { privateClose: false };
        }

        if (typeof (res) !== 'object') {
            res = JSON.parse(res);
        }

        if (Date.parse(new Date()) / 1000 - res.timestamp > 86400) {
            return { privateClose: false };
        }
        db.remove(key);
        return { privateClose: true };
    },

    getMsg(type) {
        let speechs = storage.getSpeech();
        if (speechs.length === 0) {
            return undefined;
        }

        let tmp = [];
        //let types = ["评\n论", "私\n信"];
        //type 为0 则是评论，为1是私信
        for (let i in speechs) {
            if (speechs[i]['type'] === type) {
                tmp.push(speechs[i].content);
            }
        }

        if (tmp.length === 0) {
            return undefined;
        }

        let rd = Math.round(Math.random() * (tmp.length - 1));
        return { msg: tmp[rd] };
    },

    douyinExist(account) {
        let res = this.db().getBoolean('douyinExist_' + account);
        if (res) {
            return true;
        }
        this.db().putBool('douyinExist_' + account, true);
        return false;
    },

    videoExist(nickname, title) {
        let res = this.db().get('videoExist_' + nickname + '_' + title);
        if (res) {
            return true;
        }
        this.db().putBool('videoExist_' + nickname, true);
        return false;
    },

    //存一个月的内容
    accountFreGt(nickname) {
        let key = 'accountFreGt_' + nickname;
        let res = this.db().get(key);
        let current = Date.parse(new Date()) / 1000;
        if (!res) {
            this.db().put(key, JSON.stringify([current]));
            return { code: 1 };
        }

        res = JSON.parse(res);//存的时间戳
        if (res.length === 0) {
            this.db().put(key, JSON.stringify([current]));
            return { code: 1 };
        }


        while (res.length && current - res[0] * 1 > 30 * 86400) {
            res.splice(0, 1);
        }

        if (res.length >= 5) {
            return { code: 0 };
        }

        let k = 0;
        for (let i in res) {
            if (current - res[i] * 1 < 86400) {
                k++;
            }
        }

        if (k >= 2) {
            return { code: 0 };
        }
        this.db().put(key, JSON.stringify([current]));
        return { code: 1 };
    },

    getProvinces() {
        return [
            { id: 1, name: '北京市' },
            { id: 2, name: '天津市' },
            { id: 3, name: '河北省' },
            { id: 4, name: '山西省' },
            { id: 5, name: '内蒙古自治区' },
            { id: 6, name: '辽宁省' },
            { id: 7, name: '吉林省' },
            { id: 8, name: '黑龙江省' },
            { id: 9, name: '上海市' },
            { id: 10, name: '江苏省' },
            { id: 11, name: '浙江省' },
            { id: 12, name: '安徽省' },
            { id: 13, name: '福建省' },
            { id: 14, name: '江西省' },
            { id: 15, name: '山东省' },
            { id: 16, name: '河南省' },
            { id: 17, name: '湖北省' },
            { id: 18, name: '湖南省' },
            { id: 19, name: '广东省' },
            { id: 20, name: '广西壮族自治区' },
            { id: 21, name: '海南省' },
            { id: 22, name: '重庆市' },
            { id: 23, name: '四川省' },
            { id: 24, name: '贵州省' },
            { id: 25, name: '云南省' },
            { id: 26, name: '西藏自治区' },
            { id: 27, name: '陕西省' },
            { id: 28, name: '甘肃省' },
            { id: 29, name: '青海省' },
            { id: 30, name: '宁夏回族自治区' },
            { id: 31, name: '新疆' },
            { id: 32, name: '台湾省' },
            { id: 33, name: '香港' },
            { id: 34, name: '澳门' }
        ];
    },

    getFansSettingRate() {
        return {
            privateRate: this.get('fansSetting_privateRate', "int"),
            focusRate: this.get('fansSetting_focusRate', "int"),
            zanRate: this.get('fansSetting_zanRate', "int"),
            commentRate: this.get('fansSetting_commentRate', "int"),
            fansMinCount: this.get('fansSetting_fansMinCount', "int"),
            fansMaxCount: this.get('fansSetting_fansMaxCount', "int"),
            worksMinCount: this.get('fansSetting_worksMinCount', "int"),
            worksMaxCount: this.get('fansSetting_worksMaxCount', "int"),
            opCount: this.get('fansSetting_opCount', "int"),
            account: this.get('fansSetting_account'),
        }
    },

    getFocusSettingRate() {
        return {
            privateRate: this.get('focusSetting_privateRate', "int"),
            focusRate: this.get('focusSetting_focusRate', "int"),
            zanRate: this.get('focusSetting_zanRate', "int"),
            commentRate: this.get('focusSetting_commentRate', "int"),
            fansMinCount: this.get('focusSetting_fansMinCount', "int"),
            fansMaxCount: this.get('focusSetting_fansMaxCount', "int"),
            worksMinCount: this.get('focusSetting_worksMinCount', "int"),
            worksMaxCount: this.get('focusSetting_worksMaxCount', "int"),
            opCount: this.get('focusSetting_opCount', "int"),
            account: this.get('focusSetting_account'),
        }
    },

    getFansIncSettingRate() {
        return {
            task_dy_fans_inc_accounts: this.get("task_dy_fans_inc_accounts") || '',
            task_dy_fans_inc_head_zan_rate: this.get("task_dy_fans_inc_head_zan_rate", "int") || 0,
            task_dy_fans_inc_video_zan_rate: this.get("task_dy_fans_inc_video_zan_rate", "int") || 0,
            task_dy_fans_inc_comment_rate: this.get("task_dy_fans_inc_comment_rate", "int") || 0,
            task_dy_fans_inc_collection_rate: this.get("task_dy_fans_inc_collection_rate", "int") || 0,
            task_dy_fans_inc_user_page_wait: this.get("task_dy_fans_inc_user_page_wait", "int") || 0,
            task_dy_fans_inc_user_video_wait: this.get("task_dy_fans_inc_user_video_wait", "int") || 0,
            task_dy_fans_inc_comment_zan_count: 5,//5连赞
        }
    },

    getSearchUserSettingRate() {
        return {
            privateRate: this.get('searchUserSetting_privateRate', "int"),
            focusRate: this.get('searchUserSetting_focusRate', "int"),
            zanRate: this.get('searchUserSetting_zanRate', "int"),
            commentRate: this.get('searchUserSetting_commentRate', "int"),
            fansMinCount: this.get('searchUserSetting_fansMinCount', "int"),
            fansMaxCount: this.get('searchUserSetting_fansMaxCount', "int"),
            worksMinCount: this.get('searchUserSetting_worksMinCount', "int"),
            worksMaxCount: this.get('searchUserSetting_worksMaxCount', "int"),
            opCount: this.get('searchUserSetting_opCount', "int"),
            keyword: this.get('searchUserSetting_keyword'),
        }
    },

    setSearchUserSettingRate(item) {
        return this.set('searchUserSetting_privateRate', item.privateRate)
            && this.set('searchUserSetting_focusRate', item.focusRate)
            && this.set('searchUserSetting_zanRate', item.zanRate)
            && this.set('searchUserSetting_commentRate', item.commentRate)
            && this.set('searchUserSetting_fansMinCount', item.fansMinCount)
            && this.set('searchUserSetting_fansMaxCount', item.fansMaxCount)
            && this.set('searchUserSetting_worksMinCount', item.worksMinCount)
            && this.set('searchUserSetting_worksMaxCount', item.worksMaxCount)
            && this.set('searchUserSetting_opCount', item.opCount)
            && this.set('searchUserSetting_keyword', item.keyword)
    },

    //这里返回的字段要一直，只是值不一致
    getTokerData(type) {
        //type 2 轻松拓客， 默认设置参数
        if (type == 2) {
            return {
                toker_view_video_second: this.get('task_dy_qingsong_tuoke_interval', 'int'),
                toker_view_video_keywords: "",
                toker_zan_rate: 70,
                toker_comment_rate: 60,
                toker_focus_rate: 5,
                toker_comment_area_zan_rate: 80,
                toker_run_hour: [
                    '0', '1', '2', '3', '4',
                    '5', '6', '7', '8', '9',
                    '10', '11', '12', '13', '14',
                    '15', '16', '17', '18', '19',
                    '20', '21', '22', '23'
                ],
                toker_run_sex: ["0", "1", "2"],//0,1,2分别表示  女，男，未知
                toker_run_min_age: 0,
                toker_run_max_age: 120,
                runTimes: this.get('task_dy_qingsong_tuoke_run_times', 'int'),
            }
        }

        if (!type) {
            return {
                toker_view_video_second: this.get('toker_view_video_second', 'int'),
                toker_view_video_keywords: this.get('toker_view_video_keywords'),
                toker_zan_rate: this.get('toker_zan_rate', 'int'),
                toker_comment_rate: this.get('toker_comment_rate', 'int'),
                toker_focus_rate: this.get('toker_focus_rate', 'int'),
                toker_private_msg_rate: this.get('toker_private_msg_rate', 'int'),
                toker_comment_area_zan_rate: this.get('toker_comment_area_zan_rate', 'int'),
                toker_run_hour: this.getArray('toker_run_hour'),
                toker_run_sex: this.getArray('toker_run_sex'),//0,1,2分别表示  女，男，未知
                toker_run_min_age: this.get('toker_run_min_age', 'int'),
                toker_run_max_age: this.get('toker_run_max_age', 'int'),
            }
        }

        return {
            toker_view_video_second: this.get('toker_city_view_video_second', 'int'),
            toker_view_video_keywords: this.get('toker_city_view_video_keywords'),
            toker_zan_rate: this.get('toker_city_zan_rate', 'int'),
            toker_comment_rate: this.get('toker_city_comment_rate', 'int'),
            toker_focus_rate: this.get('toker_city_focus_rate', 'int'),
            toker_private_msg_rate: this.get('toker_city_private_msg_rate', 'int'),
            toker_comment_area_zan_rate: this.get('toker_city_comment_area_zan_rate', 'int'),
            toker_run_hour: this.getArray('toker_city_run_hour'),
            toker_distance: this.get('toker_city_distance', 'int'),
            toker_run_sex: this.getArray('toker_city_run_sex'),//0,1,2分别表示  女，男，未知
            toker_run_min_age: this.get('toker_city_run_min_age', 'int'),
            toker_run_max_age: this.get('toker_city_run_max_age', 'int'),
        }
    },

    getFansIncPageRate() {
        return {
            //keyword: this.get('fansIncPage_keyword') || '',
            videoOpRate: this.get('fansIncPage_videoOpRate') || 100,
            commentRate: this.get('fansIncPage_commentRate') || 100,
            zanRate: this.get('fansIncPage_zanRate') || 100,
            zanCommentRate: this.get('fansIncPage_zanCommentRate') || 100,
            zanCount: this.get('fansIncPage_zanCount') || 5,
        }
    },

    setFansIncPageRate(item) {
        //this.set('fansIncPage_keyword', item.keyword)
        return this.set('fansIncPage_videoOpRate', item.videoOpRate)
            && this.set('fansIncPage_commentRate', item.commentRate)
            && this.set('fansIncPage_zanRate', item.zanRate)
            && this.set('fansIncPage_zanCommentRate', item.zanCommentRate)
            && this.set('fansIncPage_zanCount', item.zanCount)
    },

    //尽量 文件名 + key的模式
    get(key, type) {
        if (type == undefined) {
            type = "string";
        }
        let db = this.db();
        Log.log("key:" + key + ":type:" + type);
        if (type == "string") {
            return db.get(key);
        } else if (type == 'int') {
            return db.getInteger(key);
        } else if (type == 'float') {
            return db.getDouble(key);
        } else if (type == 'object') {
            return db.getObject(key);
        } else if (type == 'bool') {
            return db.getBoolean(key);
        }

        return undefined;
    },

    getArray(key) {
        let db = this.db();
        return db.getArray(key);
    },

    //尽量 文件名 + key的模式
    set(key, value) {
        let db = this.db();
        if (typeof value == 'string') {
            db.put(key, value);
        } else if (typeof value == 'boolean') {
            db.putBool(key, value);
        } else if (typeof value == 'object') {
            db.putDouble(key, value);
        } else if (typeof value == 'undefined' || typeof value == 'null') {
            db.putObj(key, value);
        } else if (Number.isInteger(value)) {
            db.putInteger(key, value);
        } else if (Number.isFloat(value)) {
            db.putDouble(key, value);
        } else {
            db.putObj(key, value);
        }

        return true;
    }
};

module.exports = machine;
