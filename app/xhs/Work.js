let Common = require("app/xhs/Common.js");
let statistics = require("common/statistics.js");

let Work = {
    getZanTag() {
        return UiSelector().className('android.widget.Button').descContains('点赞').isVisibleToUser(true).findOne();
    },

    getCommentTag() {
        return UiSelector().className('android.widget.Button').descContains('评论').isVisibleToUser(true).findOne();
    },

    zan() {
        if (this.isZan()) {
            Log.log('已经点过赞了');
            return;
        }

        let zanTag = this.getZanTag();
        if (zanTag) {
            Common.click(zanTag, 0.25);
            statistics.zan();
            Log.log('点赞成功');
        }
    },

    isZan() {
        return UiSelector().className('android.widget.Button').descContains('已点赞').isVisibleToUser(true).findOne();
    },

    getCollectTag() {
        return UiSelector().className('android.widget.Button').descContains('收藏').isVisibleToUser(true).findOne();
    },

    collect() {
        if (this.isCollect()) {
            Log.log('已经点过赞了');
            return;
        }

        let collectTag = this.getCollectTag();
        if (collectTag) {
            Common.click(collectTag);
            Log.log('点赞成功');
        }
    },

    isCollect() {
        return UiSelector().className('android.widget.Button').descContains('已收藏').isVisibleToUser(true).findOne();
    },

    zanUserListSwipe() {
        let tag = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
            console.log(v.id());
            return v.className() == 'androidx.recyclerview.widget.RecyclerView' && v.id() != null;
        }).findOne();

        if (tag) {
            tag.scrollForward();
            return true;
        }
        return false;
    },

    getCommentCount(type) {
        let tag = this.getCommentTag();
        return Common.numDeal(tag ? tag.desc() : 0);//部分企业类图文没有评论标识，直接过滤（比如：有巢公寓武汉青年城）
    },

    msg(type, msg) {
        let inputTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).findOne() || UiSelector().className('android.widget.TextView').desc('评论框').findOne();

        if (!inputTag) {
            Log.log('没有找到输入框');
            return false;
        }

        Common.click(inputTag, 0.15);
        Common.sleep(1500 + 1000 * Math.random());

        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isFocused();
        }).isVisibleToUser(true).findOne();
        if (!iptTag) {
            Log.log('输入框没有');
            return false;
        }

        iptTag.setText(msg);
        Common.sleep(1500 + 500 * Math.random());
        let sendTag = UiSelector().className('android.widget.TextView').text('发送').isVisibleToUser(true).findOne();
        if (!sendTag) {
            return false;
        }

        sendTag.click();
        statistics.comment();
        Log.log('发送了');
        Common.sleep(500 + 500 * Math.random());
    },

    commentListSwipe(type) {
        let tag = UiSelector().scrollable(true).isVisibleToUser(true).findOne();
        if (!tag) {
            Log.log('赞评论列表滑动失败');
        }
        return tag.scrollForward();
    },

    //在视频或者图文页面检测是不是视频
    isVideo() {
        let tag = Common.id('matrixNickNameView').isVisibleToUser(true).findOne();
        return tag ? true : false;
    },

    intoBottom() {
        let tag = UiSelector().className('android.widget.FrameLayout').isVisibleToUser(true).desc('已到底').findOne();
        return tag ? true : false;
    },

    openComment() {
        //视频需要打开评论窗口，图文也需要点击，让窗口滑动到评论区域
        let commentTag = this.getCommentTag();
        if (!commentTag) {
            return false;
        }
        Common.click(commentTag, 0.25);
        Common.sleep(2000 + 1000 * Math.random());
    },
    getCommenList() {
        //通过评论内容，反向找到昵称（通过昵称进入用户主页）
        let tags = UiSelector().className('android.widget.TextView').filter(v => {
            return v.text().indexOf('回复') != -1 && v.parent().parent().bounds().left <= 1;
        }).isVisibleToUser(true).find();
        if (tags.length == 0) {
            return tags;
        }

        //苏州可以吗[害羞R]  2小时前 江苏 回复
        //粉丝宝宝优先哈～ \n昨天 22:31 广东 回复
        //太假，滤镜太夸张了 2天前 广东 回复
        let childs = [];
        for (let i in tags) {
            let index = tags[i].text().lastIndexOf('\n');
            if (index == -1) {
                index = tags[i].text().lastIndexOf('  ');//怎么做 02-17  回复
            }
            if (index == -1) {
                Log.log('过滤了', tags[i].text());
                continue;
            }

            let arr = tags[i].text().split(' ');
            Log.log('评论内容', tags[i].text(), index, arr);
            childs.push({
                content: tags[i].text().substring(0, index),
                ip: arr[arr.length - 2] || '-',
                zanTag: tags[i].parent().parent().children().findOne(UiSelector().className('android.widget.ImageView')),
                nicknameTag: tags[i].parent().findOne(UiSelector().className('android.widget.TextView')),
            });
        }
        return childs;
    },

    zanComment(type, count) {
        if (type == 1) {
            let commentTag = this.getCommentTag();
            if (!commentTag) {
                return false;
            }
            Common.click(commentTag, 0.25);
            Common.sleep(2000 + 1000 * Math.random());
        }

        let rp = 0;
        let arr = [];
        while (true) {
            let tags = UiSelector().className('android.widget.LinearLayout').filter(v => {
                let childs = v.children();
                if (childs.length() != 2) {
                    return false;
                }

                if (childs.getChildren(0).className() != "android.widget.ImageView") {
                    return false;
                }

                if (childs.getChildren(1).className() != "android.widget.TextView") {
                    return false;
                }
                return true;
            }).isVisibleToUser(true).find();

            let top = 0;
            if (type == 0) {
                let tag = UiSelector().desc('评论框').isVisibleToUser(true).findOne();
                if (tag) {
                    top = tag.bounds().top;
                }
            } else {
                let tag = Common.id('commentLayout').isVisibleToUser(true).findOne();
                if (tag) {
                    top = tag.bounds().top
                }
            }
            Log.log('评论框上边距', top);

            if (tags.length == 0) {
                break;
            }

            for (let i in tags) {
                if (arr.indexOf(tags[i]._addr) != -1) {
                    if (rp++) {
                        Common.back();
                        break;//操作完了
                    }
                    continue;
                }

                if (top > 0 && tags[i].bounds().top + tags[i].bounds().height >= top) {
                    Log.log('超出范围');
                    continue;
                }
                rp = 0;
                arr.push(tags[i]._addr);
                if (arr.length >= 20) {
                    arr.shift()
                }

                Common.click(tags[i], 0.25);
                statistics.zanComment();
                Common.sleep(1000 + 1000 * Math.random());
                if (count-- <= 0) {
                    break;
                }
            }

            if (this.intoBottom() || count <= 0) {
                Log.log('到底了', count);
                break;
            }

            this.commentListSwipe(type);
            Common.sleep(2000 + 1000 * Math.random());
        }

        if (type == 1) {
            Common.back();//视频需要关闭评论窗口
            Log.log('视频，关闭窗口');
            Common.sleep(2000 + 1000 * Math.random());
        }
        return count;
    },

    isFocus(type) {
        if (type == 0) {
            let tag = UiSelector().className('android.widget.TextView').text('已关注').isVisibleToUser(true).findOne() || UiSelector().className('android.widget.TextView').text('互相关注').isVisibleToUser(true).findOne();
            return tag ? true : false;
        }

        let tag = UiSelector().desc('关注').className('android.widget.Button').isVisibleToUser(true).findOne();
        return tag && tag.isSelected();
    },

    focus(type) {
        if (type == 0) {
            let tag = UiSelector().className('android.widget.TextView').text('已关注').isVisibleToUser(true).findOne() || UiSelector().className('android.widget.TextView').text('互相关注').isVisibleToUser(true).findOne();
            if (tag) {
                Log.log('已关注');
                return true;
            }
            tag = UiSelector().className('android.widget.TextView').text('关注').isVisibleToUser(true).findOne();
            if (tag) {
                Common.click(tag);
                statistics.focus();
                return true;
            }
            return false;
        }

        let tag = UiSelector().textContains('关注').className('android.widget.Button').isVisibleToUser(true).findOne();
        if (tag && tag.isSelected()) {
            Log.log('已关注');
            return true;
        }

        Common.click(tag);
        return true;
    },

    getNickname() {
        let tag = Common.id('nickNameTV').isVisibleToUser(true).findOne();
        return tag ? tag.text() : '';
    },

    getContent() {
        let type = this.getType();
        Log.log('type', type);
        if (type == 1) {
            let tag = Common.id("noteContentLayout").isVisibleToUser(true).findOne();
            if (tag) {
                return tag.desc();
            }
            return false;
        }

        //图文
        if (type == 0) {
            let textTags = UiSelector().className('android.widget.TextView').filter(v => {
                if (v.parent() != null && v.parent().className() == 'android.widget.LinearLayout') {
                    return true;
                }
                return false;
            }).isVisibleToUser(true).find();
            Log.log('textTags', textTags);
            let text = '';
            for (let i in textTags) {
                text += textTags[i].text() + "\n";
            }
            return text;
        }
        return false;
    },

    getType() {
        if (Common.id('nickNameTV').isVisibleToUser(true).findOne()) {
            return 0;//笔记
        }

        if (Common.id('matrixNickNameView').isVisibleToUser(true).findOne()) {
            return 1;//视频
        }

        return -1;
    }
}

module.exports = Work;
