import { storage } from 'common/storage.js';
export let machine = {
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

    addDouyinConfig(account) {
        let db = this.db();
        let key = 'privateClose_' + account;
        db.put(key, {
            timestamp: Date.parse(new Date()) / 1000,
        });
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
        let res = this.db().get('douyinExist_' + account, 'bool');
        if (res) {
            return true;
        }
        this.db().put('douyinExist_' + account, true);
        return false;
    },

    videoExist(nickname, title) {
        let res = this.db().get('videoExist_' + nickname + '_' + title);
        if (res) {
            return true;
        }
        this.db().put('videoExist_' + nickname, true);
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

    //let types = { 'zanVideo': 0, 'zanComment': 1, 'comment': 2, 'focus': 3, 'privateMsg': 4, 'viewUserPage': 5, 'refreshVideo': 6 };
    op(index, type) {
        let db = this.db();
        let current = Date.parse(new Date()) / 1000;
        if (type === 6) {
            let res = db.get('config_' + index + '_videoTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_videoTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 0) {
            let res = db.get('config_' + index + '_zanVideoTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_zanVideoTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 1) {
            let res = db.get('config_' + index + '_zanCommentTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_zanCommentTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 2) {
            let res = db.get('config_' + index + '_commentTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_commentTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 3) {
            let res = db.get('config_' + index + '_focusTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_focusTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 4) {
            let res = db.get('config_' + index + '_privateMsgTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_privateMsgTimestamp_' + this.getDate(), JSON.stringify(res));
        } else if (type === 5) {
            let res = db.get('config_' + index + '_viewUserPageTimestamp_' + this.getDate()) || '[]';
            res = JSON.parse(res);
            res.push(current);
            db.put('config_' + index + '_viewUserPageTimestamp_' + this.getDate(), JSON.stringify(res));
        }
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
            task_dy_fans_inc_account: this.get("task_dy_fans_inc_account") || "95448698248,58750165149,38881966964,94758877668,92447212883,68126855345,61699752775,71395667132,75142410816,889256509,395884542288,66578272648,169732746,87455571449,47194470908,32644724711,23187788634,62510783289,69223680672,96559110830,79005535521,88799238805,895625215,77363968851,55217137528,54622933772,37437482688,48352073886,76908371782,38640136098,40456270246,98424754311,35818992365,96759008218,65221746903,76624998351,98305400525,24960970462,69244897030,75685568264,85532304608,81363075786,96075763758,2246367608,23067498754,45111336856,42885218405,76689548008,67205394933,88962987158,69719995846,42818130984,46282922894,75298522313,72604960726,69871128004,63592002784,54846140779,32388171981,55723218866,35749719069,36537826537,79463954521,84474997814,50431204320,42061882164,37166306794,68599155804,39263028799,31886238669,23157543024,44012618457,29563170032,28299323774,56416830940,64506637557,78870241551,48526777093,24876415948,89408353473,96539996331,936476675,89957893782,34572776530,92395004509,97344880844,37922724907,45531367850,45744197922,95791428263,91213830582,64584170675,87848495482,70863532958,75402323381,33777722078,21870652822,55476237990,70351088381,65026526521,42698001513,23802956189,39588454228,82301202960,31378632368,52111285916,97147471316,89423632858,88591002525,90059730444,94597858923,85726685665,92118626390,32388028850,90166424348,95083742969,81513762732,84903176304,83632618320,67912093054,158429800,97041911019,44470985369,52384977465,27359079074,37647703624,68483129852,26973719491,26095825044,36514652748,67896511190,87927348300,78768278304,90280584550,33055446816,60868933832,21855860437,56241533261,68668816385,62213741333,2175832856,59060487184,37503636816,89858990850,85321761615,38322383217,30591990979,64680579392,75946503526,66414381472,69376551175,52673069280,42484456260,77079260519,54381291881,62145675388,39065033624,20127226665,79430769320,86211094786,34015597930,68450894086,85946916017,62174862151,33008215614,44836317668,53050413966,59820605725,2194007165,22134321918,37723146157,65108802891,85523640615,43317117423,59139428846,91827246644,38914989360,64746155764,66627939316,80804316279,72907749899,66565888957,87772529698,55454795916,47145585472,24800193566,36913812765,73137166987,48643824711,31909045905,55196300609,68199805575,20283350687,81562472957,46136323673,87136403907,28514222882,73199869765,404562702465,227632044135,54228512456,52936694827,68678273893,231275712045,68469408408,72671115108,86027468523,77298829198,562339186595,44311099572,90936310434,70494211453,929634987315,43141608431,27240998586,84275354579,57275028977,52593974019,32642537469,70335428329,97112022294,27896818599,84436815315,51610018133,91276940375,50468599848,91515681050,73598809368,206019269,35710454738,53157771146,89216074723,27914282999,34854026483,428181309845,22638146246,72391363090,94306065597,95978575346,98029311634,53672229175,55346084685,93679528985,98658571072,81571383599,87650762334,42624561769,26704301808,95551165144,69687938635,91776336482,54471764323,23127571204,68558522036,37828435111,44030025432,68639048072,32362386757,29510188307,81375201152,34727642669,56233918659,52717110047,20858754929,90326988020,28667805730,25670861510,483520738868,937531915628,55755189275,67848133766,39227926439,88781869853,61459254906,64599313314,1124607785,70906367584,40476441875,32744216673,836326183208,590604871848,230165851448,73973310514,28765571071,42331821886,26131405437,53024297183,56124976548",
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
    get(key, type = "string") {
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
        db.put(key, value);
        return true;
    }
};

