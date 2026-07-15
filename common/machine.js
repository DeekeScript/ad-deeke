let storage = require('./storage.js');
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

    /**
     * 
     * @param {number} type 0 评论，1私信
     * @returns 
     */
    getMsg(type) {
        let speechs = storage.getSpeech();
        if (!speechs || speechs.length === 0) {
            return undefined;
        }

        let tmp = [];
        // type 为0 则是评论，为1是私信；只取启用的话术（enabled 不为 false，兼容老数据无 enabled）
        for (let i in speechs) {
            if (speechs[i]['type'] === type && speechs[i]['enabled'] !== false) {
                tmp.push(speechs[i].content);
            }
        }

        if (tmp.length === 0) {
            return undefined;
        }

        let rd = Math.round(Math.random() * (tmp.length - 1));
        return { msg: tmp[rd] };
    },

    /**
     * 
     * @param {string} account 
     * @returns 
     */
    douyinExist(account) {
        let res = this.db().getBoolean('douyinExist_' + account);
        if (res) {
            return true;
        }
        return false;
    },

    /**
     * 
     * @param {string} account 
     * @returns 
     */
    douyinExistUpdate(account) {
        return this.db().putBoolean('douyinExist_' + account, true);
    },

    /**
     * 
     * @param {string} nickname 
     * @param {string} title 
     * @returns 
     */
    videoExist(nickname, title) {
        let res = this.db().get('videoExist_' + nickname + '_' + title);
        if (res) {
            return true;
        }
        this.db().putBoolean('videoExist_' + nickname, true);
        return false;
    },

    //存一个月的内容
    /**
     * 
     * @param {string} nickname 
     * @returns 
     */
    accountFreGt(nickname) {
        let key = 'accountFreGt_' + nickname;
        let result = this.db().get(key);
        let current = Math.floor(Date.now()) / 1000;
        if (!result) {
            this.db().put(key, JSON.stringify([current]));
            return { code: 1 };
        }

        let res = JSON.parse(result);//存的时间戳
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

    getKsSearchUserSettingRate() {
        return {
            privateRate: this.get('ks_searchUserSetting_privateRate', "int"),
            focusRate: this.get('ks_searchUserSetting_focusRate', "int"),
            zanRate: this.get('ks_searchUserSetting_zanRate', "int"),
            commentRate: this.get('ks_searchUserSetting_commentRate', "int"),
            fansMinCount: this.get('ks_searchUserSetting_fansMinCount', "int"),
            fansMaxCount: this.get('ks_searchUserSetting_fansMaxCount', "int"),
            worksMinCount: this.get('ks_searchUserSetting_worksMinCount', "int"),
            worksMaxCount: this.get('ks_searchUserSetting_worksMaxCount', "int"),
            opCount: this.get('ks_searchUserSetting_opCount', "int"),
            keyword: this.get('ks_searchUserSetting_keyword'),
        }
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
            }
        }

        if (!type) {
            return {
                toker_view_video_second: this.get('toker_view_video_second', 'int'),
                toker_view_video_keywords: this.get('toker_view_video_keywords'),
                toker_view_video_ip: this.get('toker_view_video_ip'),
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
            toker_view_video_ip: this.get('toker_city_view_video_ip'),
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

    /**
     * 
     * @param {boolean} [type]
     * @returns 
     */
    getKsTokerData(type) {
        if (!type) {
            return {
                toker_view_video_second: this.get('toker_ks_view_video_second', 'int'),
                toker_view_video_keywords: this.get('toker_ks_view_video_keywords'),
                toker_view_video_ip: this.get('toker_ks_view_video_ip'),
                toker_zan_rate: this.get('toker_ks_zan_rate', 'int'),
                toker_comment_rate: this.get('toker_ks_comment_rate', 'int'),
                toker_focus_rate: this.get('toker_ks_focus_rate', 'int'),
                toker_private_msg_rate: this.get('toker_ks_private_msg_rate', 'int'),
                toker_comment_area_zan_rate: this.get('toker_ks_comment_area_zan_rate', 'int'),
                toker_run_hour: this.getArray('toker_ks_run_hour'),
                toker_run_sex: this.getArray('toker_ks_run_sex'),//0,1,2分别表示  女，男，未知
                toker_run_min_age: this.get('toker_ks_run_min_age', 'int'),
                toker_run_max_age: this.get('toker_ks_run_max_age', 'int'),
            }
        }

        return {
            toker_view_video_second: this.get('toker_ks_city_view_video_second', 'int'),
            toker_view_video_keywords: this.get('toker_ks_city_view_video_keywords'),
            toker_view_video_ip: this.get('toker_ks_city_view_video_ip'),
            toker_zan_rate: this.get('toker_ks_city_zan_rate', 'int'),
            toker_comment_rate: this.get('toker_ks_city_comment_rate', 'int'),
            toker_focus_rate: this.get('toker_ks_city_focus_rate', 'int'),
            toker_private_msg_rate: this.get('toker_ks_city_private_msg_rate', 'int'),
            toker_comment_area_zan_rate: this.get('toker_ks_city_comment_area_zan_rate', 'int'),
            toker_run_hour: this.getArray('toker_ks_city_run_hour'),
            toker_distance: this.get('toker_ks_city_distance', 'int'),
            toker_run_sex: this.getArray('toker_ks_city_run_sex'),//0,1,2分别表示  女，男，未知
            toker_run_min_age: this.get('toker_ks_city_run_min_age', 'int'),
            toker_run_max_age: this.get('toker_ks_city_run_max_age', 'int'),
        }
    },

    /**
     * 
     * @param {boolean} [type] 
     * @returns 
     */
    getWxTokerData(type) {
        if (!type) {
            return {
                toker_view_video_second: this.get('toker_wx_view_video_second', 'int'),
                toker_view_video_keywords: this.get('toker_wx_view_video_keywords'),
                toker_view_video_ip: this.get('toker_wx_view_video_ip'),
                toker_zan_rate: this.get('toker_wx_zan_rate', 'int'),
                toker_comment_rate: this.get('toker_wx_comment_rate', 'int'),
                toker_focus_rate: this.get('toker_wx_focus_rate', 'int'),
                toker_private_msg_rate: this.get('toker_wx_private_msg_rate', 'int'),
                toker_comment_area_zan_rate: this.get('toker_wx_comment_area_zan_rate', 'int'),
                toker_run_hour: this.getArray('toker_wx_run_hour'),
                toker_run_sex: this.getArray('toker_wx_run_sex'),//0,1,2分别表示  女，男，未知
                toker_run_min_age: this.get('toker_wx_run_min_age', 'int'),
                toker_run_max_age: this.get('toker_wx_run_max_age', 'int'),
            }
        }

        return {
            toker_view_video_second: this.get('toker_wx_city_view_video_second', 'int'),
            toker_view_video_keywords: this.get('toker_wx_city_view_video_keywords'),
            toker_view_video_ip: this.get('toker_wx_city_view_video_ip'),
            toker_zan_rate: this.get('toker_wx_city_zan_rate', 'int'),
            toker_comment_rate: this.get('toker_wx_city_comment_rate', 'int'),
            toker_focus_rate: this.get('toker_wx_city_focus_rate', 'int'),
            toker_private_msg_rate: this.get('toker_wx_city_private_msg_rate', 'int'),
            toker_comment_area_zan_rate: this.get('toker_wx_city_comment_area_zan_rate', 'int'),
            toker_run_hour: this.getArray('toker_wx_city_run_hour'),
            toker_distance: this.get('toker_wx_city_distance', 'int'),
            toker_run_sex: this.getArray('toker_wx_city_run_sex'),//0,1,2分别表示  女，男，未知
            toker_run_min_age: this.get('toker_wx_city_run_min_age', 'int'),
            toker_run_max_age: this.get('toker_wx_city_run_max_age', 'int'),
        }
    },

    //尽量 文件名 + key的模式
    /**
     * 
     * @param {string} key 
     * @param {string|undefined} [type]
     * @returns {any}
     */
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
            return db.getObj(key);
        } else if (type == 'bool') {
            return db.getBoolean(key);
        }

        return undefined;
    },

    /**
     * 
     * @param {string} key 
     * @returns 
     */
    getArray(key) {
        let db = this.db();
        return db.getArray(key);
    },

    /**
     * 
     * @param {number} num 
     * @returns 
     */
    isFloat(num) {
        return num % 1 !== 0;
    },

    //尽量 文件名 + key的模式
    /**
     * 
     * @param {string} key 
     * @param {any} value 
     * @returns {boolean}
     */
    set(key, value) {
        let db = this.db();
        if (typeof value == 'string') {
            db.put(key, value);
        } else if (typeof value == 'boolean') {
            db.putBoolean(key, value);
        } else if (typeof value == 'object') {
            db.putDouble(key, value);
        } else if (typeof value == 'undefined' || value == null) {
            db.putObj(key, value);
        } else if (Number.isInteger(value)) {
            db.putInteger(key, value);
        } else if (this.isFloat(value)) {
            db.putDouble(key, value);
        } else {
            db.putObj(key, value);
        }

        return true;
    }
};

module.exports = machine;
