let storage = require('common/storage.js');

let baiduWenxin = {
    key: 'setting_baidu_wenxin_role',
    dataFrom: 'role',
    getToken(key, secret) {
        key = key || storage.get('setting_baidu_wenxin_key');
        secret = secret || storage.get('setting_baidu_wenxin_secret');

        //查看是否激活了
        let body = System.AiSpeechToken(key, secret);
        Log.log('body', body);
        let aiRes = JSON.parse(body);
        Log.log('aiRes[\'data\']', aiRes['data']);
        if (aiRes['code'] === 0) {
            //开始激活
            return aiRes['data'];
        } else if (aiRes['code'] === 1) {
            FloatDialogs.show('提示', aiRes.msg);
            System.sleep(360000 * 1000);
            return;
        } else {
            Log.log('网络异常了');
            return false;
        }
    },

    testChat(title) {
        let res = this.getToken();
        let access_token = res['access_token'];

        let params = {
            "messages": [
                {
                    "role": "user",
                    "content": title
                }
            ],
            "max_output_tokens": 60,//最大输出长度60
            "system": System.getDataFrom(this.key, this.dataFrom, 'content'),
            //"system_memory_id": access_token,
            //"enable_system_memory": true,
        }

        Log.log(params);
        res = Http.post('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=' + access_token, params);
        if (res == null) {
            return false;
        }
        let result = JSON.parse(res);
        Log.log(title, result['result']);
        if (result && result['result']) {
            if (result['result'].substring(0, 1) === '"' && result['result'].substring(result['result'].length - 1) === '"') {
                result['result'] = result['result'].substring(1, result['result'].length - 1);
            }
        }
        return result['result'] || false;
    },

    getComment(title) {
        let res = this.getToken();
        let access_token = res['access_token'];

        let len = 20 + Math.round(30 * Math.random());

        let tmp = '';
        if (title) {
            tmp = '请你根据短视频标题生成一个有趣的评论内容，标题是：' + title;
        }

        let params = {
            "messages": [
                {
                    "role": "user",
                    "content": "接下来，请你随机帮我生成一条评论，可以是夸别人的视频拍的好、也开始是写一条祝福语、也可以你最想告诉大众的想法"
                }
            ],
            "max_output_tokens": 60,//最大输出长度60
            "system": System.getDataFrom(this.key, this.dataFrom, 'content'),
        }

        if (title) {
            params = {
                "messages": [
                    {
                        "role": "user",
                        "content": "接下来，我会给你一条视频标题，请你帮我生成一条评论，评论内容一定要精简，尽可能能让人看了想和我互动，并且尽可能不要激怒别人；内容字数不要超过" + len + "字，这个很重要"
                    },
                    {
                        "role": "assistant",
                        "content": '好的，我会尽我所能，请给我一条视频标题吧！'
                    },
                    {
                        "role": "user",
                        "content": title
                    },
                ],
                "max_output_tokens": 60,//最大输出长度60
                "system": System.getDataFrom(this.key, this.dataFrom, 'content'),
            }
        }

        //console.log(System.getDataFrom(this.key, this.dataFrom, 'content'));

        res = Http.post('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=' + access_token, params);
        if (res == null) {
            return false;
        }
        let result = JSON.parse(res);
        Log.log('百度文心返回话术-1', title ? '视频的标题是“' + title + '”，请结合你的角色，写一条少于' + len + '字的吸引人的评论内容' : '请你写一条字数小于' + len + '字的吸引人的评论视频内容', result);
        if (result && result['result']) {
            if (result['result'].substring(0, 1) === '"' && result['result'].substring(result['result'].length - 1) === '"') {
                result['result'] = result['result'].substring(1, result['result'].length - 1);
            }
        }
        return result['result'] || false;
    },

    getChat(nickname, age, gender) {
        let res = this.getToken();
        let access_token = res['access_token'];

        let len = 20 + Math.round(20 * Math.random());
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
                    "content": "请你根据对方的账号昵称、年龄、性别等信息，随机帮我生成一条打招呼内容，注意：年龄和性别不一定有，但是昵称是一定有的；你可以是夸别人的视频拍的好、也开始是写一条祝福语、又可以是常用的打招呼，尽量能吸引到别人回复；内容字数限制在" + len + "字",
                },
                {
                    "role": "assistant",
                    "content": '好的，我会尽我所能，请给出对方的昵称、年龄、性别吧！'
                },
                {
                    "role": "user",
                    "content": content
                },
            ],
            "max_output_tokens": 60,//最大输出长度60
            "system": System.getDataFrom(this.key, this.dataFrom, 'content'),
        }

        res = Http.post('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=' + access_token, params);
        //res = Http.post('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant?access_token=' + access_token, params);
        if (res == null) {
            return false;
        }
        let result = JSON.parse(res);
        Log.log('百度文心返回话术', content + '请结合你的角色，写一条字数小于' + len + '字的吸引人的打招呼话术', result);
        if (result && result['result']) {
            if (result['result'].substring(0, 1) === '"' && result['result'].substring(result['result'].length - 1) === '"') {
                result['result'] = result['result'].substring(1, result['result'].length - 1);
            }
        }
        return result['result'] || false;
    }
}

module.exports = baiduWenxin;
