let CommentNew = {
    /** @type {any} */
    currentComment: {},
    /**
     * 针对childs有多重情况
     * 第1种：只有一个昵称（可能有“朋友”、“相互关注”等内容），都是同一行
     * 第2种：无昵称的情况（其他内容都有）
     *      2.1：有内容
     *      2.2：有内容、有首评
     *      2.3：无内容
     *      2.4：无内容、无首评
     * 第3种：有昵称（可能携带“朋友”等标签）、文字评论（可能带“首评”）
     * 第4种：有昵称（可能携带“朋友”等标签）、图评论（可能带“首评”）
     * 第5种：时间、ip、回复
     * 第6种：全部内容（昵称有多重情况、内容也是）
     * 昵称的clickable是true、时间/ip/回复位置可以很好地利用
     * @param {UiObject[]} childs 
     * @param {number} index
     * @returns {any}
     */
    streamComment(childs, index = 0) {
        if (index > childs.length - 1) {
            return this.currentComment;//这里拿到的基本都是残缺的部分
        }

        //昵称
        if (childs[index].isClickable()) {
            this.currentComment = {};//遇到昵称自动清理
            this.currentComment.nickname = childs[index].text();
            for (let i = index + 1; i < childs.length; i++) {
                if (childs[i].bounds().centerY() > childs[index].bounds().top && childs[i].bounds().centerY() < childs[index].bounds().bottom) {
                    index++;
                }
            }
            return this.streamComment(childs, ++index);
        }

        //时间
        if (childs.length > index + 1 && childs[index + 1].text().indexOf(' · ') == 0) {
            this.currentComment.date = childs[index].text();
            this.currentComment.ip = childs[index + 1].text();
            let tmp = this.currentComment;
            this.currentComment = {};
            return tmp;
        }

        //排除“首评”的情况
        if (childs[index].text() == '首评' && childs.length > index + 2 && childs[index + 2].text().indexOf(' · ') == 0) {
            return this.streamComment(childs, ++index);
        }

        //评论内容开头
        this.currentComment.content = childs[index].text();
        return this.streamComment(childs, ++index);
    },

    getList() {
        let contains = UiSelector().className('android.view.View').filter(v => {
            return v.getChildCount() > 3 && v.parent().className() == 'android.view.View';
        }).isVisibleToUser(true).find();

        Log.log("数量：", contains.length);
        let contents = [];
        for (let i in contains) {
            let childs = contains[i].children().find(UiSelector().className('android.widget.TextView'));
            let data = this.streamComment(childs, 0);
            data.container = contains[i]; //容器
            if (!data.nickname || !data.date || !data.ip) {
                continue;//如果长度小于3，说明是残缺的。完整的必须有“昵称、ip、日期”
            }
            contents.push(data);
        }
        return contents;
    }
}


module.exports = CommentNew;
