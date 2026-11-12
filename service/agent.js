let storage = require('../common/storage.js');

let agentConfig = {
    getDefaults() {
        return {
            industry: '通用百搭',
            tone: '活泼幽默',
            length: '中等（10-30字）',
            direction: '夸夸型',
            goal: '提升互动',
            lengthMin: '',
            lengthMax: '',
            requiredWords: '',
            forbiddenWords: '',
        };
    },

    /**
     * 获取智能体训练配置，返回结构化对象
     * @returns {{industry: string, tone: string, length: string, direction: string, goal: string, lengthMin: string, lengthMax: string, requiredWords: string, forbiddenWords: string}}
     */
    get() {
        let defaults = this.getDefaults();

        let industry = storage.get('agent_industry') || defaults.industry;
        let tone = storage.get('agent_tone') || defaults.tone;
        let length = storage.get('agent_length') || defaults.length;
        let direction = storage.get('agent_direction') || defaults.direction;
        let goal = storage.get('agent_goal') || defaults.goal;
        let lengthMin = storage.get('agent_length_min') || defaults.lengthMin;
        let lengthMax = storage.get('agent_length_max') || defaults.lengthMax;
        let requiredWords = storage.get('agent_required_words') || defaults.requiredWords;
        let forbiddenWords = storage.get('agent_forbidden_words') || defaults.forbiddenWords;

        return {
            industry: industry,
            tone: tone,
            length: length,
            direction: direction,
            goal: goal,
            lengthMin: lengthMin,
            lengthMax: lengthMax,
            requiredWords: requiredWords,
            forbiddenWords: forbiddenWords,
        };
    },

    /**
     * 返回用于拼接到 prompt 的训练描述文本
     * @returns {string}
     */
    getPromptText() {
        let c = this.get();
        let parts = [];

        parts.push('行业定位：' + c.industry);
        parts.push('语气风格：' + c.tone);

        if (c.length === '自定义数字区间') {
            parts.push('评论长度：' + (c.lengthMin || '?') + '-' + (c.lengthMax || '?') + '字');
        } else {
            parts.push('评论长度：' + c.length);
        }

        parts.push('内容倾向：' + c.direction);
        parts.push('引导目标：' + c.goal);

        if (c.requiredWords) {
            parts.push('必带词：' + c.requiredWords);
        }
        if (c.forbiddenWords) {
            parts.push('禁用词：' + c.forbiddenWords);
        }

        return parts.join('\n');
    },
};

module.exports = agentConfig;
