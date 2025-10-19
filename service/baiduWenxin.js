let storage = require('common/storage.js');

let baiduWenxin = {
    key: 'setting_baidu_wenxin_role',
    dataFrom: 'role',
    getToken(key, secret) {
        secret = secret || storage.get('setting_baidu_wenxin_secret');
        bot_id = storage.get('setting_baidu_wenxin_bot');

        return {
            access_token: secret,
            role: storage.get('setting_baidu_wenxin_role_text'),
            bot_id: bot_id,
        }
    },

    getResultContent(res) {
        if (res == null) {
            return false;
        }
        let data = res.split("\n\n");
        for (let i in data) {
            if (data[i].indexOf('event:conversation.message.completed') == 0) {
                let temp = JSON.parse(data[i].substring("event:conversation.message.completed\ndata:".length));
                Log.log('完成的', temp);
                if (temp.type == 'answer') {
                    Log.log('回复', temp);
                    return temp.content;
                }
            }
        }
        return false;
    },

    getComment(title) {
        let res = this.getToken();
        let params = {
            "bot_id": res.bot_id,
            "user_id": Date.parse(new Date()).toString(),
            "stream": true,
            "auto_save_history": true,
            "additional_messages": [
                {
                    "role": "user",
                    "content_type": "text",
                    "type": "question",
                    "content": res.role
                },
                {
                    "role": "user",
                    "content_type": "text",
                    "type": "question",
                    "content": '接下来，我会给你输入抖音平台的视频标题，请根据标题内容写一个评论'
                },
                {
                    "role": "assistant",
                    "content_type": "text",
                    "type": "answer",
                    "content": "好的，请输入你的标题内容，如果接下来你提供的标题为空，我则随机生成一条评论内容"
                },
                {
                    "content": title || '标题为空',
                    "content_type": "text",
                    "role": "user",
                    "type": "question"
                }
            ],
            "parameters": {}
        }

        let result = Http.postHeaders('https://api.coze.cn/v3/chat', params, {
            Authorization: 'Bearer ' + res.access_token,
        });

        Log.log('返回内容', params, result);
        return this.getResultContent(result);
    },

    getChat(nickname, age, gender) {
        let res = this.getToken();
        let json = {};
        if (nickname) {
            json.nickname = nickname;
        }

        if (age) {
            json.age = age;
        }

        if (gender) {
            json.gender = gender;
        }
        let params = {
            "bot_id": res.bot_id,
            "user_id": Date.parse(new Date()).toString(),
            "stream": true,
            "auto_save_history": true,
            "additional_messages": [
                {
                    "role": "user",
                    "content_type": "text",
                    "type": "question",
                    "content": res.role
                },
                {
                    "role": "user",
                    "content_type": "text",
                    "type": "question",
                    "content": '接下来我可以给你提供对方的昵称、年龄、性别等部分信息，请根据这些信息生成一个打招呼的私信内容'
                },
                {
                    "role": "assistant",
                    "content_type": "text",
                    "type": "answer",
                    "content": "好的，请输入对方的信息，以json的格式给我，我将会生成一个你要求的打招呼内容；如果对方信息为空，我则随机生成一个私信内容"
                },
                {
                    "content": json.length == 0 ? '打招呼内容为空' : JSON.stringify(json),
                    "content_type": "text",
                    "role": "user",
                    "type": "question"
                }
            ],
            "parameters": {}
        }

        let result = Http.postHeaders('https://api.coze.cn/v3/chat', params, {
            Authorization: 'Bearer ' + res.access_token,
        });

        Log.log('chat返回', params, result);
        return this.getResultContent(result);
    },

    //type为1表示评论，0私信
    getChatByMsg(type, msg, platform) {
        let res = this.getToken();
        if (!platform) {
            platform = 0;
        }
        let platforms = ['抖音', '小红书', '快手', '视频号'];
        let params = {
            "bot_id": res.bot_id,
            "user_id": Date.parse(new Date()).toString(),
            "stream": true,
            "auto_save_history": true,
            "additional_messages": [
                {
                    "role": "user",
                    "content_type": "text",
                    "type": "question",
                    "content": res.role
                },
                {
                    "role": "user",
                    "content_type": "text",
                    "type": "question",
                    "content": type == 0 ? '请根据对方给我的聊天内容，生成一个私信回复。另外，我现在操作的平台是' + platforms[platform] + '，请按照这个平台的特点生成内容' : '请根据对方给我作品的评论内容，生成一个回复。另外，我现在操作的平台是' + platforms[platform] + '，请按照这个平台的特点生成内容'
                },
                {
                    "role": "assistant",
                    "content_type": "text",
                    "type": "answer",
                    "content": "好的，请输入对方的" + ['私信', '评论'][type] + "内容给我，我将自动给你生成一个" + ['私信', '评论'][type] + "回复",
                },
                {
                    "content": msg,
                    "content_type": "text",
                    "role": "user",
                    "type": "question"
                }
            ],
            "parameters": {}
        }

        let result = Http.postHeaders('https://api.coze.cn/v3/chat', params, {
            Authorization: 'Bearer ' + res.access_token,
        });

        Log.log('chat内容', params, result);
        return this.getResultContent(result);
    }
}

module.exports = baiduWenxin;
