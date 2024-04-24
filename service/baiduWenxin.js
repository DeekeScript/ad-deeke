import { storage } from 'common/storage.js';

export let baiduWenxin = {
    getToken(key, secret) {
        key = key || storage.get('setting_baidu_wenxin_key');
        secret = secret || storage.get('setting_baidu_wenxin_secret');
        let url = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + key + '&client_secret=' + secret;
        let res = Http.get(url);
        if(res==null){
            return false;
        }
        console.log("获取token内容：");
        console.log(res);
        let result = JSON.parse(res);
        return result;
    },

    getComment(title) {
        if (title.length > 50) {
            title = title.substring(0, 50) + '..';
        }

        let res = storage.get('baidu_access_token');
        if (res) {
            res = JSON.parse(res);
        }

        let access_token;
        if (res && res['expire_in'] < Date.parse(new Date()) / 1000) {
            access_token = res['access_token'];
        } else {
            res = this.getToken();
            res['expires_in'] = Date.parse(new Date()) / 1000 + res['expires_in'] - 60;
            access_token = res['access_token'];
            storage.set('baidu_access_token', JSON.stringify(res));
        }

        let len = 15 + Math.round(15 * Math.random());

        let tmp = '';
        if(title){
            tmp = '请根据短视频标题生成一段小于30字的吸引人的评论，请直接给出一条评论内容！不要输出与评论无关的内容！短视频的标题是“' + title + '”';
        }
        let params = {
            "messages": [
                {
                    "role": "user",
                    "content": title ? tmp : '请你写一条长度小于' + len + '字的吸引人的视频评论，请直接给出一条评论内容！不要输出与评论无关的内容！'
                }
            ]
        }

        res = Http.post('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=' + access_token, params);
        if(res==null){
            return false;
        }
        let result = JSON.parse(res);
        Log.log('百度文心返回话术-1', title ? '别人抖音视频的标题是“' + title + '”，请你给这个视频写一条长度小于' + len + '字的吸引人的评论内容' : '请你写一条长度小于' + len + '字的吸引人的评论视频内容去评论别人的视频', result);
        if (result && result['result']) {
            if (result['result'].substring(0, 1) === '"' && result['result'].substring(result['result'].length - 1) === '"') {
                result['result'] = result['result'].substring(1, result['result'].length - 1);
            }
        }
        return result['result'] || false;
    },

    getChat(nickname, age, gender) {
        let res = storage.get('baidu_access_token');
        if (res) {
            res = JSON.parse(res);
        }

        let access_token;
        if (res && res['expire_in'] < Date.parse(new Date()) / 1000) {
            access_token = res['access_token'];
        } else {
            res = this.getToken();
            res['expires_in'] = Date.parse(new Date()) / 1000 + res['expires_in'] - 60;
            access_token = res['access_token'];
            storage.set('baidu_access_token', JSON.stringify(res));
        }

        let len = 15 + Math.round(10 * Math.random());
        let content = '对方的昵称是：' + nickname;
        if (age) {
            content += '，年龄是：' + age + '岁';
        }

        if (gender) {
            content += '，性别是：' + ['男性', '女性'][gender - 1];
        }

        let params = {
            "messages": [
                {
                    "role": "user",
                    "content": content + '，请帮我生成一条长度小于' + len + '字的吸引人的打招呼话术'
                }
            ]
        }
        res = Http.post('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=' + access_token, params);
        if(res==null){
            return false;
        }
        let result = JSON.parse(res);
        Log.log('百度文心返回话术', content + '，请帮我生成一条长度小于' + len + '字的吸引人的打招呼话术和他打招呼', result);
        if (result && result['result']) {
            if (result['result'].substring(0, 1) === '"' && result['result'].substring(result['result'].length - 1) === '"') {
                result['result'] = result['result'].substring(1, result['result'].length - 1);
            }
        }
        return result['result'] || false;
    }
}
