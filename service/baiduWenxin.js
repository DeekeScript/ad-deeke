let storage = require('../common/storage.js');
let machine = require('../common/machine.js');

let baiduWenxin = {
    key: 'setting_baidu_wenxin_role',
    dataFrom: 'role',
    getToken() {
        let secret = storage.get('setting_baidu_wenxin_secret');
        let bot_id = storage.get('setting_baidu_wenxin_bot');

        return {
            access_token: secret,
            role: storage.get('setting_baidu_wenxin_role_text'),
            bot_id: bot_id,
        }
    },

    /**
     * 
     * @param {string|null} res 
     * @returns 
     */
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

    /**
     * 
     * @param {string} [title] 
     * @returns 
     */
    getComment(title) {
        let res = this.getToken();
        let params = {
            "bot_id": res.bot_id,
            "user_id": '' + Date.now(),
            "stream": true,
            "auto_save_history": true,
            "additional_messages": [
                {
                    "role": "assistant",
                    "content_type": "text",
                    "type": "answer",
                    "content": res.role
                },
                {
                    "role": "user",
                    "content_type": "text",
                    "type": "question",
                    "content": '接下来，我会给你输入抖音平台的视频标题，请根据标题内容写一个最好的评论'
                },
                {
                    "role": "assistant",
                    "content_type": "text",
                    "type": "answer",
                    "content": "好的，请输入你的标题内容，如果接下来你提供的标题为空，我则随机生成一条最好的评论内容，内容长度会在30字左右"
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

        let result = Http.post('https://api.coze.cn/v3/chat', params, {
            Authorization: 'Bearer ' + res.access_token,
        });

        Log.log('返回内容', params, result);
        return this.getResultContent(result);
    },

    getChat(nickname, age, gender) {
        if (storage.get('setting_baidu_wenxin_private_switch', 'bool')) {
            let res = machine.getMsg(1);
            return res ? res.msg : false;//永远不会结束
        }

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
            "user_id": '' + Date.now(),
            "stream": true,
            "auto_save_history": true,
            "additional_messages": [
                {
                    "role": "assistant",
                    "content_type": "text",
                    "type": "answer",
                    "content": res.role
                },
                {
                    "role": "user",
                    "content_type": "text",
                    "type": "question",
                    "content": '接下来我可以给你提供对方的昵称、年龄、性别等部分信息，请根据这些信息生成一个最好的打招呼私信内容'
                },
                {
                    "role": "assistant",
                    "content_type": "text",
                    "type": "answer",
                    "content": "好的，请输入对方的信息，以json的格式给我，我将会生成一个最好的打招呼内容；如果对方信息为空，我则随机生成一个最好的私信内容，内容长度会在30字左右"
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

        let result = Http.post('https://api.coze.cn/v3/chat', params, {
            Authorization: 'Bearer ' + res.access_token,
        });

        Log.log('chat返回', params, result);
        return this.getResultContent(result);
    },

    //type为1表示评论，0私信
    /**
     * 
     * @param {number} type 
     * @param {string} msg 
     * @param {number} [platform] 
     * @returns 
     */
    getChatByMsg(type, msg, platform) {
        if (type == 0 && storage.get('setting_baidu_wenxin_private_switch', 'bool')) {
            let res = machine.getMsg(1);
            return res ? res.msg : false;
        }

        let res = this.getToken();
        if (platform === undefined || platform === null) {
            platform = 0;
        }

        let platforms = ['抖音', '小红书', '快手', '视频号'];
        let messages = [];

        // 🔥 核心：伪 system prompt（最重要）
        messages.push({
            "role": "assistant",
            "content_type": "text",
            "type": "answer",
            "content": `你是一个${platforms[platform]}私信/评论回复助手。

你的唯一任务：根据用户提供的内容，生成一个最自然的回复。

严格规则：
1. 只能输出一条回复
2. 不允许提供多个选项
3. 不允许解释说明
4. 不允许分点、分类、换行
5. 不允许出现“比如、例如、可以这样”等引导词
6. 必须像真人聊天，简短自然
7. 控制在30字以内
8. 如果违规（输出多条或解释），视为错误答案`
        });

        // 🔥 输入数据（只给内容，不再解释任务）
        if (msg) {
            messages.push({
                "role": "user",
                "content_type": "text",
                "type": "question",
                "content": (type === 0 ? "私信内容：" : "评论内容：") + msg
            });
        } else {
            // 无输入 → 随机话术
            messages.push({
                "role": "user",
                "content_type": "text",
                "type": "question",
                "content": type === 0
                    ? "生成一个自然的私信打招呼话术"
                    : "生成一个自然的评论回复话术"
            });
        }

        let params = {
            "bot_id": res.bot_id,
            "user_id": Date.now().toString(),
            "stream": true, // ⚠️ 建议先关掉流式，稳定性更高
            "auto_save_history": true, // ⚠️ 防止上下文污染
            "additional_messages": messages,
            "parameters": {}
        };

        let result = Http.post(
            'https://api.coze.cn/v3/chat',
            params,
            {
                Authorization: 'Bearer ' + res.access_token,
            }
        );

        Log.log('chat内容', params, result);

        // 🔥 二次兜底（防AI抽风）
        let content = this.getResultContent(result);

        if (!content) return '';

        // 只取第一行（防多段）
        content = content.split('\n')[0];

        // 去掉序号/符号（防“1. xxx”）
        content = content.replace(/^\d+[\.\、]\s*/, '');

        // 限制长度（防超出）
        if (content.length > 40) {
            content = content.slice(0, 40);
        }

        return content.trim();
    }
}

module.exports = baiduWenxin;
