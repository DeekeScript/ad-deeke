const C = {//G表示全局的，比如弹窗
    iptTag: 'd3f',  //A0000
    submitTag: 'd7v', //A0010  注意需要可以被点击
    indexBottomMenu: '0wi',//A0030
    text1: 'android:id/text1',//A0040
    text1a: 'text1',//A0040A
    container: 'container',//A0050
    indexTopMenu: '30m',//A0060
    searchTag: 'et_search_kw',//A0070
    focusTag: ['u2i', 'u2j'],//A0080  A0081
    userTag: 'wu9',//A0090  用户承载年龄、IP等标签的容器
    focusText: ['已关注', '互相关注', '取消关注', '关注'],//A0100  A0101  A0102  A0103
    userMainTag: ['4ts', '4tw'],//关注数量，粉丝数量 tag  // A0110   A0111
    fansNickTag: '3=b',//很多地方使用   // A0120
    rootLayout: 'root_layout',  //A0130
    privateAccount: '私密账号',//  A0140
    userListTop: 'woe', //  A0150  粉丝、关注、用户列表头部，防止列表滑动超出
    userListHead: 'oj3', // A0160
}

const C310701 = {
    C: C,
    Index: {
        //首页
        intoHome: [C.indexBottomMenu, '首页'],  //B0000  B0001
        refresh: ['ura', '刷新'],
        intoMyMessage: [C.indexBottomMenu, '消息'],//B0010  B0011
        intoMyPage: [C.indexBottomMenu, '我'],//B0020  B0021
        intoMyLikeVideo: [C.text1, '喜欢', C.container],//B0030  B0031  B0032
        intoLocal: [C.indexTopMenu, 'close', C.indexBottomMenu],//B0040  B0041  B0042
        intoRecommend: [C.indexTopMenu, '推荐', '团购'],//B0050  B0051
        getMsgCount: ['z7p', '[\\d]+'],//B0060  B0061
        intoSearchPage: ['0-z'],//B0070
        inRecommend: [C.indexTopMenu, '推荐', '已选中，推荐，按钮']//B0080  B0081  B0082
    },

    Message: {
        //消息页面
        ////C0010  C0011  C0012  C0013  C0014  C0015  C0016 // C0017  C0018  C0019  C0010A  C0010B  目前无相关功能模块，暂时不用处理
        backMsg: ['red_tips_count_view', 'xxx', 'tv_title', '互动消息', 'si6', 'android.view.ViewGroup', 'sh+', '赞', 'sia', '回复评论', C.iptTag, 'd7v'],
        search: ['ka-', '搜索', C.searchTag],//C0020  C0021
        intoFansGroup: ['dlb', '群聊', 'content_container', 'sjv'],//C0030  C0031  C0032  C0033
        //tv_name未发现在哪，貌似不存在了
        intoGroupUserList: ['wiv', 'xxx', 'title', '群聊成员', 'content', 'tv_name', 'sjv'],//C0040  C0041  C0042  C0043 // C0044  C0045  C0046
        fansSwipe: ['qsh'],//C0050
        intoGroupUserListAdd: ['xe_', '搜索'], //C0060  C0061

        //消息和私信回复相关控件信息
        hasMessage: ['z7p'],
        scroll: ['x7q'], //消息页面滑动
        chat: ['content_layout'], //用户聊天页面，消息内容
        stranger: ['zlh', 'v0d', '陌生人消息', 'x7x', 'user_name', 'c_b'], //陌生人消息列表滚动控件
        interact: ['si6', 'sjf', 'sim', '回复: ', '评论了你: ', 'sh+', C.iptTag, 'd7v', 'si4'],//互动消息页面
        readMessage: ['x7x', 'tv_title', 'v2p', 'red_tips_count_view', 'red_tips_dot_view'],
        tag: ['钱包通知', '新关注我的', '服务通知', '互动消息', '陌生人消息'],//消息页的消息类型
    },

    User: {
        //用户页面
        //D0000  D0001  D0002  D0003  D0004 // D0005  D0006  D0007  D0008
        privateMsg: ['title', C.privateAccount, 'android.view.ViewGroup', '更多', 'desc', '发私信', 'msg_et', 'jde', '私信功能已被封禁'],//1094474339私密账号
        getNickname: ['sbr'],// D0010
        getDouyin: ['4ij', '抖音号：', 'i8r'],//D0020  D0021  D0022
        getZanCount: ['4tp'],//D0030
        getFocusCount: [C.userMainTag[0]],//D0040
        getFansCount: [C.userMainTag[1]],//D0050
        getIntroduce: [C.userTag],//D0060
        getIp: [C.userTag],//D0070
        getAge: [C.userTag],//D0080 
        getWorksTag: ['作品', C.text1a],//D0090  D0091
        isPrivate: [C.privateAccount, '封禁', '账号已经注销'],//D0100  D0101  D0102
        isFocus: [C.focusTag[1], C.focusText[0], C.focusText[1]],//D0110  D0111  D0112
        focus: [C.focusTag[0], C.focusTag[1], C.focusText[0], C.focusText[1]],//D0120  D0121  D0122  D0123
        cancelFocus: [C.focusTag[1], 'lpa', C.focusText[2], C.focusTag[0]],//D0130  D0131  D0132  D0133
        ////D0140  D0141  D0142  D0143  //D0144  D0145  D0146  D0147  //D0148  D0149  D0140A  D0140B
        cancelFocusList: [C.userMainTag[1], '39j', C.rootLayout, C.fansNickTag, 'title_bar', 'cb6', 'n3z', 'title', C.focusText[2], C.focusText[1], C.focusText[3], C.focusText[0]],
        ////D0150  D0151  D0152  D0153  //D0154  D0155  D0156  D0157
        fansIncList: [C.userMainTag[1], C.userListTop, C.rootLayout, C.fansNickTag, 'tgr', 'xxx', 'XXX', 'XXX'],//XXX表示不再使用，只是占位
        ////D0160  D0161  D0162  D0163  //D0164  D0165  D0166
        focusUserList: [C.userMainTag[0], C.userMainTag[1], C.userListTop, C.rootLayout, C.fansNickTag, 'tgr', 'xxx'],
        intoFocusList: [C.userMainTag[1], '39j'],//D0170 D0171
        focusListSearch: ['fpv', C.fansNickTag, 'txt_desc'],//搜索框，昵称 ，账号 //D0180   D0181   D0182
        viewFansList: ['4ti', '2pi', C.rootLayout, C.fansNickTag, 'title_bar'], //D0190   D0191   D0192  D0193   D0194
        hasAlertInput: ['YYY'], //D0200  //YYY 表示暂未发现对应内容
        head: ['kkm', 'XXX', 'XXX'],//D0210  D0211 D0212
        more: ['c86', '更多面板', '20o', '经营工具', '高级在线预约', '预览', '发送'],
        bgGroundClose: ['cancel_btn'],
    },

    Comment: {
        //评论页面
        getAvatarTag: ['avatar'],//E00000
        getNicknameTag: ['title'],//E0010
        getTimeTag: ['d9r'],//E0030
        getIpTag: ['d5u'],//E0040
        getZanTag: ['fzb'],//E0050 E0051（第二个已被移除，后续发现再补充）
        isAuthor: ['d8_', '作者'],//E0060  E0061
        getContent: [','],//E0070
        isZan: ['已选中'],//E0080
        getList: ['esx'],//E0100
        closeCommentWindow: ['back_btn', '关闭'],//E0110  E0111
        backMsg: [C.iptTag, C.submitTag],//E0120  E0121
        commentMsg: [C.iptTag, C.submitTag],//E0130  E0131
        iptEmoj: ['gbx', 'gbi'],//E0140  E0141   暂未使用，忽略掉了
        commentAtUser: [C.iptTag, 'at', 'tv_name', '最近@', C.submitTag],//E0150  E0151  E0152  E0153  E0154
        commentImage: ['k0e', '表情', 'z8g', '自定义表情', 'ro+'],//E0160  E0161  E0162  E0163  E0164
        zanComment: ['jl9', '放大评论区'],//E0170  E0171
        getBackMsg: ['v-u'], //E0180  评论回复
    },

    Search: {
        //搜索页面
        intoSearchList: [C.searchTag, '3n8', '搜索', '视频', '用户', C.text1a],//F0000  F0001  F0002  F0003  F0004  F0005
        intoSearchLinkVideo: [C.searchTag, '3n8', '搜索'],//F0010  F0011  F0012  暂时未使用
        intoSearchVideo: ['desc', 'p6g', '+t'],//F0020  F0021  F0022
        intoSeachUser: ['抖音号：', '抖音号'],//F0030  F0031
        intoLiveRoom: ['抖音号：', '抖音号'],//F0040  F0041
        intoUserLiveRoom: ['直播', '抖音号'],//F0050
        userList: [C.userListTop, 'android.widget.FrameLayout', '按钮', '抖音号：', 'jly'], //F0060  F0061  F0062  F0063  F0064（用户主页右上角 三个点）
    },

    Live: {
        //直播页面
        getUserCountTag: ['omn'], //  G0000
        getUserTags: ['androidx.recyclerview.widget.RecyclerView', 'XXX', 'android.widget.FrameLayout'], // G0010  G0011    列表元素，列表元素点击后的昵称控件
        intoFansPage: ['r=c'],// G0020
        listenBarrage: ['text', 'android.widget.TextView'], // G0030  G0031    未使用，暂不处理
        loopClick: ['关闭'], // G0040
        // G0050  G0051   G0052  G0053  //  G0054   G0055   G0056
        comment: ['hay', 'android.widget.EditText', '3pg', '发送', 'e1e', 'list', 'android.widget.FrameLayout'],
    },

    Common: {
        backHome: [C.indexBottomMenu],//H0000
        swipeSearchUserOp: ['ci'],//H0010
        swipeFansListOp: ['spx'],//H0020
        swipeFocusListOp: ['spx'],//H0030
        swipeCommentListOp: ['ro+'],//H0040
    },

    Video: {
        //视频页面  主页视频、用户视频、搜索视频。 用户视频和搜索视频一致
        getZanTag: ['fzz'],//I0000
        isZan: ['已点赞'],//I0010
        getCommentTag: ['d=q'],//I0020
        getCollectTag: ['dy7'],//I0030
        isCollect: ['未选中'],//I0040
        getShareTag: ['yfa'],//I0050
        getContentTag: ['desc'],//I0060
        getTitleTag: ['title'],//I0070
        getAtNickname: ['@'],//I0080
        getTimeTag: ['bpq', '  IP属地'],//I0090  当前版本不准确，包含了IP信息：“2025-01-31 18:16  IP属地：河南”
        isLiving: ['sew', '点击进入直播间', '4gz', '直播中'],//I0110  I0111  I0112  I0113
        getAvatar: ['user_avatar', 'mh0'],// I0120  mh0广告头像下面的小图标
        getLivingAvatarTag: ['4gz', '直播中'],//I0130  I0131
        getLivingNickname: ['直播中'],//I0140
        viewDetail: ['查看详情'],//I0150
        getDistanceTag: ['t4j', '2dl'],//I0160  I0161
        getInTimeTag: ['3ec'],//I0170
        intoUserVideo: ['android:id/text1', '作品', 'container', '3z6'],//I0180  I0181  I0182
        isFocus: ['XXX'],//I0190  暂未使用
        zanList: ['32o'],  //点赞列表昵称
        header: ['3nq', '搜索'], //视频搜索页的视频最上面的 搜索按钮
    },

    GroupBuy: {
        shopContainer: ['xxx', 'xxx', '查看全部'],
    }
}

module.exports = C310701;
