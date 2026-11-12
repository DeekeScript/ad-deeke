let storage = require('../common/storage.js');
let machine = require('../common/machine.js');

let baiduWenxin = {
    key: 'setting_baidu_wenxin_role',
    dataFrom: 'role',
    /** @type {null|object} */
    _kouziCache: null,

    defaultDomain(provider) {
        if (provider === 'doubao') return 'https://ark.cn-beijing.volces.com/api/v3';
        if (provider === 'deepseek') return 'https://api.deepseek.com';
        if (provider === 'openai') return 'https://api.openai.com/v1';
        return 'https://api.coze.cn';
    },

    getKouziConfig() {
        if (this._kouziCache) return this._kouziCache;

        try {
            let configStr = storage.get('DeekeConfig');
            Log.log('baiduWenxin: DeekeConfig raw', configStr);
            if (configStr) {
                let config = JSON.parse(configStr);
                let kouzi = config && config.kouzi;
                if (!kouzi) {
                    Log.log('baiduWenxin: DeekeConfig 中无 kouzi 配置');
                    return null;
                }
                let provider = kouzi.provider || 'coze';
                if (provider !== 'coze') {
                    let model = kouzi.model || (provider === 'deepseek' ? 'deepseek-flash' : '');
                    this._kouziCache = {
                        provider: provider,
                        domain: kouzi.domain || this.defaultDomain(provider),
                        model: model,
                        api_key: kouzi.api_key || '',
                        bot_id: '',
                        access_token: '',
                    };
                    Log.log('baiduWenxin: 使用大模型配置', provider, model);
                    return this._kouziCache;
                }
                if (kouzi.bot_id && kouzi.access_token) {
                    this._kouziCache = {
                        provider: 'coze',
                        bot_id: kouzi.bot_id,
                        access_token: kouzi.access_token,
                        domain: kouzi.domain || 'https://api.coze.cn',
                        model: '',
                        api_key: '',
                    };
                    Log.log('baiduWenxin: 使用 DeekeConfig kouzi 配置', this._kouziCache.bot_id);
                    return this._kouziCache;
                }
                Log.log('baiduWenxin: DeekeConfig 中无 kouzi 配置');
            }
        } catch (e) {
            Log.log('baiduWenxin: DeekeConfig 解析失败', e);
        }

        return null;
    },

    getToken() {
        let kouzi = this.getKouziConfig();
        let secret, bot_id;

        if (kouzi) {
            secret = kouzi.access_token;
            bot_id = kouzi.bot_id;
        } else {
            secret = storage.get('setting_baidu_wenxin_secret');
            bot_id = storage.get('setting_baidu_wenxin_bot');
        }

        if (bot_id == '7654034161191845929') {
            storage.set('setting_baidu_wenxin_bot_test', storage.get('setting_baidu_wenxin_bot_test', 'int') + 1);
            if (storage.get('setting_baidu_wenxin_bot_test', 'int') > 10) {
            }
        }

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
    getApiUrl() {
        let kouzi = this.getKouziConfig();
        let domain = (kouzi && kouzi.domain) ? kouzi.domain : 'https://api.coze.cn';
        if (!domain.startsWith('http')) domain = 'https://' + domain;
        if (domain.endsWith('/')) domain = domain.slice(0, -1);
        return domain + '/v3/chat';
    },

    getChatCompletionsUrl(cfg) {
        let domain = (cfg && cfg.domain) ? cfg.domain : this.defaultDomain(cfg ? cfg.provider : '');
        if (!domain.startsWith('http')) domain = 'https://' + domain;
        if (domain.endsWith('/')) domain = domain.slice(0, -1);
        if (domain.endsWith('/chat/completions')) return domain;
        return domain + '/chat/completions';
    },

    /**
     * 解析 OpenAI 兼容接口的回复，豆包和 DeepSeek 都是这个格式
     * @param {string|null} res
     * @returns {string|false}
     */
    getOpenAIContent(res) {
        if (!res) {
            return false;
        }
        let data;
        try {
            data = JSON.parse(res);
        } catch (e) {
            Log.log('baiduWenxin: 大模型响应解析失败', e);
            return false;
        }
        if (data.error) {
            Log.log('baiduWenxin: 大模型错误', data.error);
            return false;
        }
        let choice = data.choices && data.choices[0];
        if (!choice) {
            return false;
        }
        let message = choice.message || {};
        let content = message.content;
        if (!content && choice.text) {
            content = choice.text;
        }
        if (typeof content === 'string') {
            return content;
        }
        if (content && content.length) {
            let texts = [];
            for (let i = 0; i < content.length; i++) {
                let part = content[i];
                if (typeof part === 'string') {
                    texts.push(part);
                } else if (part && part.text) {
                    texts.push(part.text);
                }
            }
            if (texts.length) {
                return texts.join('\n');
            }
        }
        return false;
    },

    /**
     * 豆包、DeepSeek、自定义模型走 chat/completions
     * @param {string} question
     * @param {object} cfg
     * @returns {string|false}
     */
    requestOpenAI(question, cfg) {
        let params = {
            model: cfg.model,
            messages: [{
                role: 'user',
                content: question
            }],
            stream: false
        };
        let result = Http.post(this.getChatCompletionsUrl(cfg), params, {
            Authorization: 'Bearer ' + cfg.api_key,
        });
        Log.log('大模型请求', cfg.provider, cfg.model, result);
        return this.cleanContent(this.getOpenAIContent(result));
    },

    /**
     * 性别只保留能直接说出口的「女 / 男」
     * @param {string|number} gender
     * @returns {string}
     */
    normalizeGender(gender) {
        if (gender === 0 || gender === '0' || gender === '女') {
            return '女';
        }
        if (gender === 1 || gender === '1' || gender === '男') {
            return '男';
        }
        return '';
    },

    /**
     * 去掉模型多带的引号、前缀和换行，只留一条能直接发出去的话
     * @param {string|false} content
     * @returns {string|false}
     */
    cleanContent(content) {
        if (!content) {
            return content;
        }
        let text = String(content).trim();
        text = text.replace(/^["“「『]+|["”」』]+$/g, '');
        text = text.replace(/^(回复|评论|私信)\s*[:：]\s*/, '');
        let lines = text.split(/\r?\n/);
        let line = '';
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim()) {
                line = lines[i].trim();
                break;
            }
        }
        return line;
    },

    /**
     * @param {string} scene comment | dm | reply-comment | reply-dm
     * @returns {string}
     */
    getSceneTask(scene) {
        if (scene === 'dm') {
            return '任务：给对方写一条主动私信开场。对方还没说话，这不是在回复某句话。不要评论年龄和性别。没有资料时，只写一句普通打招呼。';
        }
        if (scene === 'reply-dm') {
            return '任务：回复下面这条私信。先接住对方刚刚说的那件事，再考虑引导目标。';
        }
        if (scene === 'reply-comment') {
            return '任务：回复下面这条评论。先接住这条评论在说的内容，写成一条能直接发出去的评论回复。';
        }
        return '任务：根据下面的原文写一条公开评论。原文是视频文案时，评论这条视频；原文是别人的评论时，回复这条评论。不要写成私信。';
    },

    /**
     * 组装本次生成的任务说明。风格设置只作参考，必须以原文为准。
     * @param {string} scene
     * @returns {string}
     */
    getSystemPrompt(scene) {
        let role = storage.get('setting_baidu_wenxin_role_text');
        let industry = storage.get('agent_industry') || '通用百搭';
        let tone = storage.get('agent_tone') || '活泼幽默';
        let length = storage.get('agent_length') || '中等（10-30字）';
        let direction = storage.get('agent_direction') || '';
        let goal = storage.get('agent_goal') || '提升互动';
        let requiredWords = storage.get('agent_required_words') || '';
        let forbiddenWords = storage.get('agent_forbidden_words') || '';
        let lengthMin = storage.get('agent_length_min') || '';
        let lengthMax = storage.get('agent_length_max') || '';
        let isPrivate = scene === 'dm' || scene === 'reply-dm';

        let prompt = '';
        if (role) {
            prompt += '角色：' + role + '。话术要符合这个身份，不要自报身份。\n';
        }
        if (industry && industry !== '通用百搭') {
            prompt += '行业：' + industry + '。用这个行业里真人会说的话，不要写行业介绍。\n';
        }
        if (tone) {
            prompt += '语言风格：' + tone + '\n';
        }
        if (direction === '夸夸型') {
            prompt += '内容倾向：夸夸型。只在原文适合夸的时候夸；原文是提问、吐槽、咨询或求助时，先回应原文，不要强行夸。\n';
        } else if (direction) {
            prompt += '内容倾向：' + direction + '。这只决定语气，原文情绪不同时以原文为准。\n';
        }
        if (goal) {
            prompt += '引导目标：' + goal + '。只能在贴合原文之后轻轻带一下，不能脱离原文硬广。\n';
        }

        let lengthLabel = isPrivate ? '私信字数' : '评论字数';
        if (length === '自定义数字区间' && lengthMin && lengthMax) {
            prompt += lengthLabel + '：' + lengthMin + '-' + lengthMax + '字\n';
        } else if (length) {
            prompt += lengthLabel + '：' + length + '\n';
        }

        if (requiredWords) {
            prompt += '必带词：' + requiredWords + '。整句里自然带上其中至少一个，不要单独罗列。\n';
        }
        if (forbiddenWords) {
            prompt += '禁用词：' + forbiddenWords + '。绝对不能出现。\n';
        }

        prompt += '\n' + this.getSceneTask(scene) + '\n';
        prompt += '内容规则：\n';
        prompt += '1. 只根据下面给出的原文来写，不编造原文里没有的价格、功效、地址、库存和承诺\n';
        prompt += '2. 对方没问的事情不要主动答复\n';
        prompt += '3. 不要复述“原文为空、资料为空”这类提示\n';
        prompt += '输出规则：\n';
        prompt += '1. 只输出一条可以直接发出去的话\n';
        prompt += '2. 不要选项、解释、分点、换行\n';
        prompt += '3. 不要出现“比如、例如、可以这样、回复：、评论：”\n';
        prompt += '4. 像真人随手打的字，简短自然';
        return prompt;
    },

    /**
     * 任务说明和原文放在同一条用户消息里，避免被当成上一轮已经说过的话
     * @param {string} question
     * @returns {string|false}
     */
    requestSpeech(question) {
        let cfg = this.getKouziConfig();
        if (cfg && cfg.provider && cfg.provider !== 'coze') {
            if (!cfg.api_key || !cfg.model) {
                Log.log('baiduWenxin: 大模型配置不完整', cfg.provider);
                return false;
            }
            return this.requestOpenAI(question, cfg);
        }

        let res = this.getToken();
        let messages = [{
            "role": "user",
            "content_type": "text",
            "type": "question",
            "content": question
        }];

        let params = {
            "bot_id": res.bot_id,
            "user_id": '' + Date.now(),
            "stream": true,
            "auto_save_history": true,
            "additional_messages": messages,
            "parameters": {}
        };

        let result = Http.post(this.getApiUrl(), params, {
            Authorization: 'Bearer ' + res.access_token,
        });

        Log.log('话术请求', params, result);
        return this.cleanContent(this.getResultContent(result));
    },

    getComment(title) {
        let material = title
            ? ('原文：' + title)
            : '原文：（空）。写一条简短自然的公开评论，不要提及原文是空的。';
        return this.requestSpeech(this.getSystemPrompt('comment') + '\n\n' + material);
    },

    getChat(nickname, age, gender) {
        if (storage.get('setting_baidu_wenxin_private_switch', 'bool')) {
            let res = machine.getMsg(1);
            return res ? res.msg : false;
        }

        let lines = [];
        if (nickname) {
            lines.push('对方昵称：' + nickname);
        }
        if (age) {
            lines.push('年龄：' + age);
        }
        let genderText = this.normalizeGender(gender);
        if (genderText) {
            lines.push('性别：' + genderText);
        }
        let material = lines.length
            ? lines.join('\n')
            : '对方资料：（空）。写一句普通打招呼，不要提及资料是空的。';
        return this.requestSpeech(this.getSystemPrompt('dm') + '\n\n' + material);
    },

    //type为1表示评论，0私信
    /**
     *
     * @param {number} type
     * @param {string} [msg]
     * @param {number} [platform]
     * @returns
     */
    getChatByMsg(type, msg, platform) {
        if (type == 0 && storage.get('setting_baidu_wenxin_private_switch', 'bool')) {
            let res = machine.getMsg(1);
            return res ? res.msg : false;
        }

        if (platform === undefined || platform === null) {
            platform = 0;
        }

        let platforms = ['抖音', '小红书', '快手', '视频号'];
        let scene = type === 0 ? 'reply-dm' : 'reply-comment';
        let material;
        if (msg) {
            material = (type === 0 ? '私信原文：' : '评论原文：') + msg;
        } else if (type === 0) {
            material = '私信原文：（空）。写一条自然的打招呼，不要提及原文是空的。';
        } else {
            material = '评论原文：（空）。写一条自然的评论，不要提及原文是空的。';
        }

        let question = this.getSystemPrompt(scene) + '\n当前平台：' + platforms[platform] + '\n\n' + material;
        let content = this.requestSpeech(question);
        return content ? content : '';
    }
}

module.exports = baiduWenxin;
