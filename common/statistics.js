let storage = require('common/storage.js');

let statistics = {
    getDate() {
        let d = new Date();
        let m = d.getMonth() + 1;
        let date = d.getDate();
        return (m >= 10 ? m : ('0' + m)) + '.' + (date >= 10 ? date : ('0' + date));
    },

    viewVideo() {
        let time = this.getDate();
        let count = storage.get('s_viewVideo' + time, 'int') || 0;
        storage.set('s_viewVideo' + time, count + 1);
    },

    viewTargetVideo() {
        let time = this.getDate();
        let count = storage.get('s_viewTargetVideo' + time, 'int') || 0;
        storage.set('s_viewTargetVideo' + time, count + 1);
    },

    zan() {
        let time = this.getDate();
        let count = storage.get('s_zan' + time, 'int') || 0;
        storage.set('s_zan' + time, count + 1);
    },

    comment() {
        let time = this.getDate();
        let count = storage.get('s_comment' + time, 'int') || 0;
        storage.set('s_comment' + time, count + 1);
    },

    zanComment() {
        let time = this.getDate();
        let count = storage.get('s_zanComment' + time, 'int') || 0;
        storage.set('s_zanComment' + time, count + 1);
    },

    privateMsg() {
        let time = this.getDate();
        let count = storage.get('s_privateMsg' + time, 'int') || 0;
        storage.set('s_privateMsg' + time, count + 1);
    },

    focus() {
        let time = this.getDate();
        let count = storage.get('s_focus' + time, 'int') || 0;
        storage.set('s_focus' + time, count + 1);
    },

    viewUser() {
        let time = this.getDate();
        let count = storage.get('s_viewUser' + time, 'int') || 0;
        storage.set('s_viewUser' + time, count + 1);
    },

    getWeekDate() {
        let dates = [];
        // 获取当前日期
        let now = new Date();
        // 循环获取最近 7 天的日期
        for (let i = 1; i <= 7; i++) {
            // 获取当前日期的时间戳
            let timestamp = now.getTime();
            // 计算 i 天前的时间戳
            let dayTimestamp = 24 * 60 * 60 * 1000; // 一天的毫秒数
            let iDayAgoTimestamp = timestamp - i * dayTimestamp;
            // 转换为日期对象
            let date = new Date(iDayAgoTimestamp);
            // 格式化日期为 "yyyy-MM-dd" 的字符串并存入数组
            //let year = date.getFullYear();
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            let day = ("0" + date.getDate()).slice(-2);
            dates.push(month + "." + day);
        }
        return dates;
    },

    getData(time) {
        time = time || this.getDate();
        if (storage.getPackage() === 'org.autojs.autoxjs.v6') {
            return {
                s_viewVideo: Math.ceil(Math.random() * 3000) + 2000,
                s_viewTargetVideo: Math.ceil(Math.random() * 2000) + 500,
                s_zan: Math.ceil(Math.random() * 300) + 300,
                s_comment: Math.ceil(Math.random() * 300) + 300,
                s_zanComment: Math.ceil(Math.random() * 500) + 200,
                s_privateMsg: Math.ceil(Math.random() * 50) + 20,
                s_focus: Math.ceil(Math.random() * 50) + 20,
                s_viewUser: Math.ceil(Math.random() * 1000) + 1000,
            }
        }

        return {
            s_viewVideo: storage.get('s_viewVideo' + time, 'int') || 0,
            s_viewTargetVideo: storage.get('s_viewTargetVideo' + time, 'int') || 0,
            s_zan: storage.get('s_zan' + time, 'int') || 0,
            s_comment: storage.get('s_comment' + time, 'int') || 0,
            s_zanComment: storage.get('s_zanComment' + time, 'int') || 0,
            s_privateMsg: storage.get('s_privateMsg' + time, 'int') || 0,
            s_focus: storage.get('s_focus' + time, 'int') || 0,
            s_viewUser: storage.get('s_viewUser' + time, 'int') || 0,
        }
    },

    getWeekData() {
        let dates = this.getWeekDate();
        let data = [];
        for (let i in dates) {
            data.push([dates[i], this.getData(dates[i])]);
        }

        //数据整理
        let res = {};
        let ids = ['s_viewVideo', 's_viewTargetVideo', 's_zan', 's_comment', 's_zanComment', 's_privateMsg', 's_focus', 's_viewUser'];
        for (let i in ids) {
            res[ids[i]] = [];
            for (let j = data.length - 1; j >= 0; j--) {
                res[ids[i]].push([data[j][0], data[j][1][ids[i]]]);
            }
        }
        return res;
    }
}


module.exports = statistics;
