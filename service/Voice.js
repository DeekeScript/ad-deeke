let Voice = {
    isOpen() {
        let rate = AutomationVoice.getCommentProbability(); // number 0-100
        let generateRate = Math.random() * 100;
        Log.log('启用率：' + rate + ' 生成概率：' + generateRate);
        if (rate < generateRate) {
            return false;
        }

        //检测硬件是否插入
        if (!AutomationVoice.hasAudioOutput()) {
            FloatDialogs.show('提示', '请插入音频设备');
            System.exit();
            System.sleep(3000);
        }

        if (!AutomationVoice.isReady()) {
            FloatDialogs.show('提示', '激活失效或者未选择语音角色');
            System.exit();
            System.sleep(3000);
        }
        return true;
    },

    tts(tag, text) {
        // 合成
        let r = AutomationVoice.tts("", text);     // TtsResult { success, audioUrl, error }
        if (!r.success) {
            FloatDialogs.show('提示', '合成失败，原因：' + r.error);
            System.exit();
            System.sleep(3000);
        }

        AutomationVoice.load(r.audioUrl);
        let ms = AutomationVoice.getDuration();// 时长
        let res = AutomationVoice.playAndStop(r.audioUrl);// 播放
        this.enter(ms, tag);
        return res;
    },

    enter(ms, tag) {
        //按住语音  因为语音有500毫秒空白音
        let left = tag.bounds().left + tag.bounds().width() * (0.2 + 0.6 * Math.random());
        let top = tag.bounds().top + tag.bounds().height() * (0.2 + 0.6 * Math.random());
        Gesture.press(left, top, ms + 500);
        System.sleep(ms + 550);
    }
}


module.exports = Voice;
