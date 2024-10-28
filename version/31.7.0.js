const C = {//G表示全局的，比如弹窗
    iptTag: 'dmi',  //A0000
    submitTag: 'dqm', //A0010  注意需要可以被点击
    swipeWindow: '1',//A0020
    indexBottomMenu: 'x_t',//A0030
    text1: 'android:id/text1',//A0040
    text1a: 'text1',//A0040A
    container: 'container',//A0050
    indexTopMenu: '1yk',//A0060
    searchTag: 'et_search_kw',//A0070
    focusTag: ['tde', 'tdf'],//A0080  A0081
    userTag: 'rkz',//A0090  用户承载年龄、IP等标签的容器
    focusText: ['已关注', '互相关注', '取消关注', '关注'],//A0100  A0101  A0102  A0103
    userMainTag: ['2p7', '2p_'],//关注数量，粉丝数量 tag  // A0110   A0111
    fansNickTag: '179',//很多地方使用   // A0120
    rootLayout: 'root_layout',  //A0130
    privateAccount: '私密账号',//  A0140
    userListTop: 'wsi', //  A0150  粉丝、关注、用户列表头部，防止列表滑动超出
    userListHead: 'v4o', // A0160
}

const C310701 = {
    C: C,
    Index: {
        //首页
        intoHome: [C.indexBottomMenu, '首页'],  //B0000  B0001
        intoMyMessage: [C.indexBottomMenu, '消息'],//B0010  B0011
        intoMyPage: [C.indexBottomMenu, '我'],//B0020  B0021
        intoMyLikeVideo: [C.text1, '喜欢', C.container],//B0030  B0031  B0032
        intoLocal: [C.indexTopMenu, 'close', C.indexBottomMenu],//B0040  B0041  B0042
        intoRecommend: [C.indexTopMenu, '推荐', '团购'],//B0050  B0051
        getMsgCount: ['x90', '[\\d]+'],//B0060  B0061
        intoSearchPage: ['y+1'],//B0070
        inRecommend: [C.indexTopMenu, '推荐', '已选中，推荐，按钮']//B0080  B0081  B0082
    },

    Message: {
        //消息页面
        showAll: ['text', '查看全部'], //C0000  C0001
        ////C0010  C0011  C0012  C0013  C0014  C0015  C0016 // C0017  C0018  C0019  C0010A  C0010B  目前无相关功能模块，暂时不用处理
        backMsg: ['red_tips_count_view', '未读消息', 'tv_title', '互动消息', 'jf', 'android.view.ViewGroup', 'c2s', '赞', 'c5f', '回复评论', C.iptTag, 'ti6'],
        search: ['kcn', '搜索', C.searchTag],//C0020  C0021
        intoFansGroup: ['c=a', '群聊', 'content_container', 'qki'],//C0030  C0031  C0032  C0033
        //tv_name未发现在哪，貌似不存在了
        intoGroupUserList: ['android.widget.Button', '更多', 'title', '群聊成员', 'content', 'tv_name', 'qki'],//C0040  C0041  C0042  C0043 // C0044  C0045  C0046
        fansSwipe: ['pnn'],//C0050
        intoGroupUserListAdd: ['voi', '搜索'], //C0060  C0061
    },

    User: {
        //用户页面
        //D0000  D0001  D0002  D0003  D0004 // D0005  D0006  D0007  D0008
        privateMsg: ['title', C.privateAccount, 'android.view.ViewGroup', '更多', 'desc', '发私信', 'msg_et', 'jgb', '私信功能已被封禁'],//1094474339私密账号
        getNickname: ['qv-'],// D0010
        getDouyin: ['2fs', '抖音号：', 'igz'],//D0020  D0021  D0022
        getZanCount: ['2p4'],//D0030
        getFocusCount: [C.userMainTag[0]],//D0040
        getFansCount: [C.userMainTag[1]],//D0050
        getIntroduce: [C.userTag],//D0060
        getIp: [C.userTag],//D0070
        getAge: [C.userTag],//D0080 
        getWorksTag: ['作品', C.text1a],//D0090  D0091
        isPrivate: [C.privateAccount, '封禁', '账号已经注销'],//D0100  D0101  D0102
        isFocus: [C.focusTag[1], C.focusText[0], C.focusText[1]],//D0110  D0111  D0112
        focus: [C.focusTag[0], C.focusTag[1], C.focusText[0], C.focusText[1]],//D0120  D0121  D0122  D0123
        cancelFocus: [C.focusTag[1], 'ls5', C.focusText[2], C.focusTag[0]],//D0130  D0131  D0132  D0133
        ////D0140  D0141  D0142  D0143  //D0144  D0145  D0146  D0147  //D0148  D0149  D0140A  D0140B
        cancelFocusList: [C.userMainTag[1], '17e', C.rootLayout, C.fansNickTag, 'title_bar', '17d', 'n7_', 'title', C.focusText[2], C.focusText[1], C.focusText[3], C.focusText[0]],
        ////D0150  D0151  D0152  D0153  //D0154  D0155  D0156  D0157
        fansIncList: [C.userMainTag[1], C.userListTop, C.rootLayout, C.fansNickTag, 'tj8', 'rkr', 'XXX', 'XXX'],//XXX表示不再使用，只是占位
        ////D0160  D0161  D0162  D0163  //D0164  D0165  D0166
        focusUserList: [C.userMainTag[0], C.userMainTag[1], C.userListTop, C.rootLayout, C.fansNickTag, 'XXX', 'xct'],
        intoFocusList: [C.userMainTag[1], '17e'],//D0170 D0171
        focusListSearch: ['fsa', C.fansNickTag, 'txt_desc'],//搜索框，昵称 ，账号 //D0180   D0181   D0182
        viewFansList: ['2pz', '0o0', C.rootLayout, C.fansNickTag, 'title_bar'], //D0190   D0191   D0192  D0193   D0194
        hasAlertInput: ['YYY'], //D0200  //YYY 表示暂未发现对应内容
        head: ['rkr', 'XXX', 'XXX'],//D0210  D0211 D0212
        more: ['ct9', '更多面板', '0zw', '经营工具', '高级在线预约', '预览', '发送'],
    },

    Comment: {
        //评论页面
        getAvatarTag: ['avatar'],//E00000
        getNicknameTag: ['title'],//E0010
        getTimeTag: ['dsu'],//E0030
        getIpTag: ['dos'],//E0040
        getZanTag: ['fdo'],//E0050 E0051（第二个已被移除，后续发现再补充）
        isAuthor: ['dr=', ',作者,'],//E0060  E0061
        getContent: [','],//E0070
        isZan: ['已选中'],//E0080
        //swipeTop: [C.swipeWindow],//E0090
        getList: ['ebl'],//E0100
        closeCommentWindow: ['back_btn', '关闭'],//E0110  E0111
        backMsg: [C.iptTag, C.submitTag],//E0120  E0121
        commentMsg: [C.iptTag, C.submitTag],//E0130  E0131
        iptEmoj: ['gbx', 'gbi'],//E0140  E0141   暂未使用，忽略掉了
        commentAtUser: [C.iptTag, 'at', 'tv_name', '最近@', C.submitTag],//E0150  E0151  E0152  E0153  E0154
        commentImage: ['j8y', '表情', 'x=u', '自定义表情', 'rst'],//E0160  E0161  E0162  E0163  E0164
        zanComment: ['ixt', '放大评论区'],//E0170  E0171
        getBackMsg: ['ukr'], //E0180  评论回复
    },

    Search: {
        //搜索页面
        intoSearchList: [C.searchTag, '1mm', '搜索', '视频', '用户', C.text1a],//F0000  F0001  F0002  F0003  F0004  F0005
        intoSearchLinkVideo: [C.searchTag, 'zt0', '搜索'],//F0010  F0011  F0012  暂时未使用
        intoSearchVideo: ['desc', 'cj7', 'aaz'],//F0020  F0021  F0022
        intoSeachUser: ['抖音号：', '抖音号'],//F0030  F0031
        intoLiveRoom: ['抖音号：', '抖音号'],//F0040  F0041
        intoUserLiveRoom: ['直播', '抖音号'],//F0050
        userList: [C.userListTop, 'android.widget.FrameLayout', '粉丝', '抖音号：', 'ixg'], //F0060  F0061  F0062  F0063  F0064（用户主页右上角 三个点）
    },

    Live: {
        //直播页面
        getUserCountTag: ['oq2'], //  G0000
        getUserTags: ['j4z', 'XXX', 'android.widget.FrameLayout'], // G0010  G0011    列表元素，列表元素点击后的昵称控件
        intoFansPage: ['qro'],// G0020
        listenBarrage: ['text', 'android.widget.TextView'], // G0030  G0031    未使用，暂不处理
        loopClick: ['关闭'], // G0040
        // G0050  G0051   G0052  G0053  //  G0054   G0055   G0056
        comment: ['gre', 'android.widget.EditText', '1nt', '发送', 'gxp', 'list', 'android.widget.FrameLayout'],
    },

    Common: {
        backHome: [C.indexBottomMenu],//H0000
        swipeSearchUserOp: ['cy'],//H0010
        swipeFansListOp: ['sui'],//H0020
        swipeFocusListOp: ['sui'],//H0030
        swipeCommentListOp: ['rst'],//H0040
    },

    Video: {
        //视频页面  主页视频、用户视频、搜索视频。 用户视频和搜索视频一致
        getZanTag: ['fd9'],//I0000
        isZan: ['已点赞'],//I0010
        getCommentTag: ['dob'],//I0020
        getCollectTag: ['dih'],//I0030
        isCollect: ['未选中'],//I0040
        getShareTag: ['wl3'],//I0050
        getContentTag: ['desc'],//I0060
        getTitleTag: ['title'],//I0070
        getAtNickname: ['@'],//I0080
        getTimeTag: ['bg5'],//I0090  当前版本不准确，包含了IP信息：“2024-04-09 01:33 IP属地：湖北”
        isLiving: ['qy9', '点击进入直播间', '2d-', '直播中'],//I0110  I0111  I0112  I0113
        getAvatar: ['user_avatar'],// I0120
        getLivingAvatarTag: ['2d-', '直播中'],//I0130  I0131
        getLivingNickname: ['直播中'],//I0140
        viewDetail: ['查看详情'],//I0150
        getDistanceTag: ['svf', 'sg0'],//I0160  I0161
        getInTimeTag: ['1c7'],//I0170
        intoUserVideo: ['android:id/text1', '作品', 'container', '1x3'],//I0180  I0181  I0182
        isFocus: ['XXX'],//I0190  暂未使用
        zanList: ['10n']  //点赞列表昵称
    },

    GroupBuy: {
        shopContainer: ['fg4', '用户评价', '查看全部'],
    }
}

module.exports = C310701;
