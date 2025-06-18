const C = {//G表示全局的，比如弹窗
    iptTag: 'dg0',  //A0000
    submitTag: 'dj2', //A0010
    swipeWindow: '1',//A0020
    indexBottomMenu: 'u+h',//A0030
    text1: 'android:id/text1',//A0040
    text1a: 'text1',//A0040A
    container: 'container',//A0050
    indexTopMenu: 'yic',//A0060
    searchTag: 'et_search_kw',//A0070
    focusTag: ['q1y', 'q1z'],//A0080  A0081
    userTag: 'pgx',//A0090
    focusText: ['已关注', '互相关注', '取消关注', '关注'],//A0100  A0101  A0102  A0103
    userMainTag: ['y=3', 'y=7'],//关注数量，粉丝数量 tag  // A0110   A0111
    fansNickTag: 'yq3',//很多地方使用   // A0120
    rootLayout: 'root_layout',  //A0130
    privateAccount: '私密账号',//  A0140
    userListTop: 'u-o', //粉丝、关注、用户列表头部，防止列表滑动超出
    userListHead: 'bj',
}

const C270301 = {
    C: C,
    Index: {
        //首页
        intoHome: [C.indexBottomMenu, '首页'],  //B0000  B0001
        intoMyMessage: [C.indexBottomMenu, '消息'],//B0010  B0011
        intoMyPage: [C.indexBottomMenu, '我'],//B0020  B0021
        intoMyLikeVideo: [C.text1, '喜欢', C.container],//B0030  B0031  B0032
        intoLocal: [C.indexTopMenu, 'close', C.indexBottomMenu],//B0040  B0041  B0042
        intoRecommend: [C.indexTopMenu, '推荐'],//B0050  B0051
        getMsgCount: ['u_z', '[\\d]+'],//B0060  B0061
        intoSearchPage: ['hfr'],//B0070
        inRecommend: ['yic', '推荐', '已选中，推荐，按钮']//B0080  B0081  B0082
    },

    Message: {
        //消息页面
        showAll: ['text', '查看全部'], //C0000  C0001
        ////C0010  C0011  C0012  C0013  C0014  C0015  C0016 // C0017  C0018  C0019  C0010A  C0010B 
        backMsg: ['red_tips_count_view', '未读消息', 'tv_title', '互动消息', 'jf', 'android.view.ViewGroup', 'c2s', '赞', 'c5f', '回复评论', C.iptTag, 'ti6'],
        search: ['k0t', '搜索', C.searchTag],//C0020  C0021
        intoFansGroup: ['c6k', '群聊', 'content_container', 'ojv'],//C0030  C0031  C0032  C0033
        intoGroupUserList: ['r=7', '更多', '群成员按钮', '查看群成员', 'content', 'tv_name', 'ojv'],//C0040  C0041  C0042  C0043 // C0044  C0045  C0046
        fansSwipe: ['nrj'],
    },

    User: {
        //用户页面
        //D0000  D0001  D0002  D0003  D0004 // D0005  D0006  D0007  D0008
        privateMsg: ['title', C.privateAccount, 'v0f', '更多', 'desc', '发私信', 'n-v', 'j2', '私信功能已被封禁'],
        getNickname: ['oth', '，复制名字'],// D0010  D0011
        getDouyin: ['y1j', '抖音号：', 'y_7'],//D0020  D0021  D0022
        getZanCount: ['y=0'],//D0030
        getFocusCount: [C.userMainTag[0]],//D0040
        getFansCount: [C.userMainTag[1]],//D0050
        getIntroduce: [C.userTag],//D0060
        getIp: [C.userTag],//D0070
        getAge: [C.userTag],//D0080
        getWorksTag: ['作品', C.text1a],//D0090
        isPrivate: [C.privateAccount, '封禁', '账号已经注销'],//D0100  D0101  D0102
        isFocus: [C.focusTag[1], C.focusText[0], C.focusText[1]],//D0110  D0111  D0112
        focus: [C.focusTag[0], C.focusTag[1], C.focusText[0], C.focusText[1]],//D0120  D0121  D0122  D0123
        cancelFocus: [C.focusTag[1], 'l2+', C.focusText[2], C.focusTag[0]],//D0130  D0131  D0132  D0133
        ////D0140  D0141  D0142  D0143  //D0144  D0145  D0146  D0147  //D0148  D0149  D0140A  D0140B
        cancelFocusList: [C.userMainTag[1], 'yp-', C.rootLayout, C.fansNickTag, 'title_bar', 'br+', 'n=y', 'title', C.focusText[2], C.focusText[1], C.focusText[3], C.focusText[0]],
        ////D0150  D0151  D0152  D0153  //D0154  D0155  D0156  D0157
        fansIncList: [C.userMainTag[1], 'u-o', C.rootLayout, C.fansNickTag, 'r94', 'pgn', 'l_f', '点赞'],
        ////D0160  D0161  D0162  D0163  //D0164  D0165  D0166
        focusUserList: [C.userMainTag[0], C.userMainTag[1], 'u-o', C.rootLayout, C.fansNickTag, 'r94', 'v0f'],
        intoFocusList: [C.userMainTag[1], 'yp-'],//D0170 D0171
        focusListSearch: ['gly', C.fansNickTag, 'txt_desc'],//搜索框，昵称 ，账号 //D0180   D0181   D0182
        viewFansList: ['y=w', 'xcr', C.rootLayout, C.fansNickTag, 'title_bar'], //D0190   D0191   D0192  D0193   D0194
        hasAlertInput: ['n-v'], //D0200
    },

    Comment: {
        //评论页面
        getAvatarTag: ['avatar'],//E0000
        getNicknameTag: ['title'],//E0010
        getTimeTag: ['dls'],//E0030
        getIpTag: ['did'],//E0040
        getZanTag: ['e3b', 'lo+'],//E0050 E0051
        isAuthor: ['d6s', '作者'],//E0060  E0061
        getContent: [',,,,'],//E0070
        isZan: ['已选中'],//E0080
        swipeTop: [C.swipeWindow],//E0090
        getList: ['d6s'],//E0100
        closeCommentWindow: ['back_btn', '关闭'],//E0110  E0111
        backMsg: [C.iptTag, C.submitTag],//E0120  E0121
        commentMsg: [C.iptTag, C.submitTag],//E0130  E0131
        iptEmoj: ['gbx', 'gbi'],//E0140  E0141
        commentAtUser: [C.iptTag, 'at', 'tv_name', '最近@', C.submitTag],//E0150  E0151  E0152  E0153  E0154
        commentImage: ['o-8', '表情', 'u-n', '自定义表情', C.swipeWindow],//E0160  E0161  E0162  E0163  E0164
        zanComment: ['title', '评论'],//E0170  E0171
    },

    Search: {
        //搜索页面
        intoSearchList: [C.searchTag, 'x=2', '搜索', '视频', '用户', C.text1a],//F0000  F0001  F0002  F0003  F0004  F0005
        intoSearchLinkVideo: [C.searchTag, 'x=2', '搜索'],//F0010  F0011  F0012
        intoSearchVideo: ['desc', 'sg6', 'j='],//F0020  F0021  F0022
        intoSeachUser: ['抖音号：', '抖音号'],//F0030  F0031
        intoLiveRoom: ['抖音号：', '抖音号'],//F0040  F0041
        intoUserLiveRoom: ['直播', '抖音号'],//F0050
        userList: ['u-o', 'android.widget.FrameLayout', '粉丝', '抖音号：', 'v0f'] //F0060  F0061  F0062  F0063
    },

    Live: {
        //直播页面
        getUserCountTag: ['o4u'], //  G0000
        getUserTags: ['ah0', '[\\s\\S]+'], // G0010  G0011
        intoFansPage: ['opq'],// G0020
        listenBarrage: ['text', 'android.widget.TextView'], // G0030  G0031
        loopClick: ['关闭'], // G0040
        // G0050  G0051   G0052  G0053  //  G0054   G0055   G0056
        comment: ['f9h', 'android.widget.EditText', 'x_9', '发送', 'd+g', 'list', 'android.widget.FrameLayout'],
    },

    Common: {
        backHome: [C.indexBottomMenu],//H0000
        swipeSearchUserOp: ['l_a'],//H0010
        swipeFansListOp: ['l5'],//H0020
        swipeFocusListOp: ['l5'],//H0030
        swipeCommentListOp: [C.swipeWindow],//H0040
    },

    Video: {
        //视频页面  主页视频、用户视频、搜索视频。 用户视频和搜索视频一致
        getZanTag: ['e3z'],//I0000
        isZan: ['已点赞'],//I0010
        getCommentTag: ['dms'],//I0020
        getCollectTag: ['dcx'],//I0030
        isCollect: ['未选中'],//I0040
        getShareTag: ['tu3'],//I0050
        getContentTag: ['desc'],//I0060
        getTitleTag: ['title'],//I0070
        getAtNickname: ['@'],//I0080
        getTimeTag: ['a=6'],//I0090
        isLiving: ['mdo', '点击进入直播间', 'yz4', '直播中'],//I0110  I0111  I0112  I0113
        getAvatar: ['user_avatar'],// I0120
        getLivingAvatarTag: ['yz4', '直播中'],//I0130  I0131
        getLivingNickname: ['直播中'],//I0140
        viewDetail: ['查看详情'],//I0150
        getDistanceTag: ['p_j', 'qj3'],//I0160  I0161
        getInTimeTag: ['x19'],//I0170
        intoUserVideo: ['android:id/text1', '作品', 'container', 'yh1'],//I0180  I0181  I0182
        isFocus: ['hrg'],//I0190
        zanList: ['yj6'],
    },
}


module.exports = C270301;
