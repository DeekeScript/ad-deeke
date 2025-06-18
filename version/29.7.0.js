const C = {//G表示全局的，比如弹窗
    iptTag: 'c4g',  //A0000
    submitTag: 'c7u', //A0010
    swipeWindow: '1',//A0020
    indexBottomMenu: 'wl0',//A0030
    text1: 'android:id/text1',//A0040
    text1a: 'text1',//A0040A
    container: 'container',//A0050
    indexTopMenu: 'z5+',//A0060
    searchTag: 'et_search_kw',//A0070
    focusTag: ['ryd', 'rye'],//A0080  A0081
    userTag: 'p=u',//A0090  用户承载年龄、IP等标签的容器
    focusText: ['已关注', '互相关注', '取消关注', '关注'],//A0100  A0101  A0102  A0103
    userMainTag: ['0xh', '0xl'],//关注数量，粉丝数量 tag  // A0110   A0111
    fansNickTag: '0bq',//很多地方使用   // A0120
    rootLayout: 'root_layout',  //A0130
    privateAccount: '私密账号',//  A0140
    userListTop: 'wk5', //粉丝、关注、用户列表头部，防止列表滑动超出
    userListHead: 'v9f',
}

const C290701 = {
    C: C,
    Index: {
        //首页
        intoHome: [C.indexBottomMenu, '首页'],  //B0000  B0001
        intoMyMessage: [C.indexBottomMenu, '消息'],//B0010  B0011
        intoMyPage: [C.indexBottomMenu, '我'],//B0020  B0021
        intoMyLikeVideo: [C.text1, '喜欢', C.container],//B0030  B0031  B0032
        intoLocal: [C.indexTopMenu, 'close', C.indexBottomMenu],//B0040  B0041  B0042
        intoRecommend: [C.indexTopMenu, '推荐', '团购'],//B0050  B0051
        getMsgCount: ['wj+', '[\\d]+'],//B0060  B0061
        intoSearchPage: ['hcm'],//B0070
        inRecommend: [C.indexTopMenu, '推荐', '已选中，推荐，按钮']//B0080  B0081  B0082
    },

    Message: {
        //消息页面
        showAll: ['text', '查看全部'], //C0000  C0001
        ////C0010  C0011  C0012  C0013  C0014  C0015  C0016 // C0017  C0018  C0019  C0010A  C0010B  目前无相关功能模块，暂时不用处理
        backMsg: ['red_tips_count_view', '未读消息', 'tv_title', '互动消息', 'jf', 'android.view.ViewGroup', 'c2s', '赞', 'c5f', '回复评论', C.iptTag, 'ti6'],
        search: ['lb8', '搜索', C.searchTag],//C0020  C0021
        intoFansGroup: ['cok', '群聊', 'content_container', 'o-l'],//C0030  C0031  C0032  C0033
        //tv_name未发现在哪，貌似不存在了
        intoGroupUserList: ['s-s', '更多', '群成员按钮', '查看群成员', 'content', 'tv_name', 'o-l'],//C0040  C0041  C0042  C0043 // C0044  C0045  C0046
        fansSwipe: ['oc8'],
    },

    User: {
        //用户页面
        //D0000  D0001  D0002  D0003  D0004 // D0005  D0006  D0007  D0008
        privateMsg: ['title', C.privateAccount, 'xct', '更多', 'desc', '发私信', 'o0x', 'ji-', '私信功能已被封禁'],//1094474339私密账号
        getNickname: ['pi9'],// D0010
        getDouyin: ['0m7', '抖音号：', '0yf'],//D0020  D0021  D0022
        getZanCount: ['0xe'],//D0030
        getFocusCount: [C.userMainTag[0]],//D0040
        getFansCount: [C.userMainTag[1]],//D0050
        getIntroduce: [C.userTag],//D0060
        getIp: [C.userTag],//D0070
        getAge: [C.userTag],//D0080 
        getWorksTag: ['作品', C.text1a],//D0090  D0091
        isPrivate: [C.privateAccount, '封禁', '账号已经注销'],//D0100  D0101  D0102
        isFocus: [C.focusTag[1], C.focusText[0], C.focusText[1]],//D0110  D0111  D0112
        focus: [C.focusTag[0], C.focusTag[1], C.focusText[0], C.focusText[1]],//D0120  D0121  D0122  D0123
        cancelFocus: [C.focusTag[1], 'lx4', C.focusText[2], C.focusTag[0]],//D0130  D0131  D0132  D0133
        ////D0140  D0141  D0142  D0143  //D0144  D0145  D0146  D0147  //D0148  D0149  D0140A  D0140B
        cancelFocusList: [C.userMainTag[1], '0a0', C.rootLayout, C.fansNickTag, 'title_bar', '0az', 'n-2', 'title', C.focusText[2], C.focusText[1], C.focusText[3], C.focusText[0]],
        ////D0150  D0151  D0152  D0153  //D0154  D0155  D0156  D0157
        fansIncList: [C.userMainTag[1], 'wk5', C.rootLayout, C.fansNickTag, 'XXX', 'p=k', 'mnj', '点赞'],//XXX表示不再使用，只是占位
        ////D0160  D0161  D0162  D0163  //D0164  D0165  D0166
        focusUserList: [C.userMainTag[0], C.userMainTag[1], 'wk5', C.rootLayout, C.fansNickTag, 'XXX', 'xct'],
        intoFocusList: [C.userMainTag[1], '0a0'],//D0170 D0171
        focusListSearch: ['fwe', C.fansNickTag, 'txt_desc'],//搜索框，昵称 ，账号 //D0180   D0181   D0182
        viewFansList: ['0w+', 'yxj', C.rootLayout, C.fansNickTag, 'title_bar'], //D0190   D0191   D0192  D0193   D0194
        hasAlertInput: ['YYY'], //D0200  //YYY 表示暂未发现对应内容
        head: ['p=k', 'mnj', '点赞'],//
        more: ['jzz', '更多面板', 'y7y', '经营工具', '高级在线预约', '预览', '发送'],
    },

    Comment: {
        //评论页面
        getAvatarTag: ['avatar'],//E0000
        getNicknameTag: ['title'],//E0010
        getTimeTag: ['c9s'],//E0030
        getIpTag: ['dsc'],//E0040
        getZanTag: ['ero'],//E0050 E0051（第二个已被移除，后续发现再补充）
        isAuthor: ['dsc', ',作者,'],//E0060  E0061
        getContent: [','],//E0070
        isZan: ['已选中'],//E0080
        //swipeTop: [C.swipeWindow],//E0090
        getList: ['dsc'],//E0100
        closeCommentWindow: ['back_btn', '关闭'],//E0110  E0111
        backMsg: [C.iptTag, C.submitTag],//E0120  E0121
        commentMsg: [C.iptTag, C.submitTag],//E0130  E0131
        iptEmoj: ['gbx', 'gbi'],//E0140  E0141   暂未使用，忽略掉了
        commentAtUser: [C.iptTag, 'at', 'tv_name', '最近@', C.submitTag],//E0150  E0151  E0152  E0153  E0154
        commentImage: ['i7r', '表情', 'wk3', '自定义表情', 'rw3'],//E0160  E0161  E0162  E0163  E0164
        zanComment: ['title', '评论'],//E0170  E0171
        getBackMsg: ['s4y']
    },

    Search: {
        //搜索页面
        intoSearchList: [C.searchTag, 'zt0', '搜索', '视频', '用户', C.text1a],//F0000  F0001  F0002  F0003  F0004  F0005
        intoSearchLinkVideo: [C.searchTag, 'zt0', '搜索'],//F0010  F0011  F0012
        intoSearchVideo: ['desc', 'ti=', 'aj6'],//F0020  F0021  F0022
        intoSeachUser: ['抖音号：', '抖音号'],//F0030  F0031
        intoLiveRoom: ['抖音号：', '抖音号'],//F0040  F0041
        intoUserLiveRoom: ['直播', '抖音号'],//F0050
        userList: ['wk5', 'android.widget.FrameLayout', '粉丝', '抖音号：', 'xct'], //F0060  F0061  F0062  F0063
        searchFilter: ['g5z', '筛选',]
    },

    Live: {
        //直播页面
        getUserCountTag: ['puh'], //  G0000
        getUserTags: ['_a', '[\\s\\S]+', 'android.widget.FrameLayout'], // G0010  G0011    列表元素，列表元素点击后的昵称控件
        intoFansPage: ['pes'],// G0020
        listenBarrage: ['text', 'android.widget.TextView'], // G0030  G0031
        loopClick: ['关闭'], // G0040
        // G0050  G0051   G0052  G0053  //  G0054   G0055   G0056
        comment: ['fz0', 'android.widget.EditText', 'zu6', '发送', 'f50', 'list', 'android.widget.FrameLayout'],
    },

    Common: {
        backHome: [C.indexBottomMenu],//H0000
        swipeSearchUserOp: ['mne'],//H0010
        swipeFansListOp: ['syq'],//H0020
        swipeFocusListOp: ['syq'],//H0030
        swipeCommentListOp: ['rw3'],//H0040
    },

    Video: {
        //视频页面  主页视频、用户视频、搜索视频。 用户视频和搜索视频一致
        getZanTag: ['er-'],//I0000
        isZan: ['已点赞'],//I0010
        getCommentTag: ['c=t'],//I0020
        getCollectTag: ['c0e'],//I0030
        isCollect: ['未选中'],//I0040
        getShareTag: ['u25'],//I0050
        getContentTag: ['desc'],//I0060
        getTitleTag: ['title'],//I0070
        getAtNickname: ['@'],//I0080
        getTimeTag: ['a4y'],//I0090  当前版本不准确，包含了IP信息：“2024-04-09 01:33 IP属地：湖北”
        isLiving: ['nqn', '点击进入直播间', '0lo', '直播中'],//I0110  I0111  I0112  I0113
        getAvatar: ['user_avatar'],// I0120
        getLivingAvatarTag: ['0lo', '直播中'],//I0130  I0131
        getLivingNickname: ['直播中'],//I0140
        viewDetail: ['查看详情'],//I0150
        getDistanceTag: ['reh', 'q43'],//I0160  I0161
        getInTimeTag: ['zkh'],//I0170
        intoUserVideo: ['android:id/text1', '作品', 'container', 'z5t'],//I0180  I0181  I0182
        isFocus: ['hpt'],//I0190
        zanList: ['z7+']  //点赞列表昵称
    },

    GroupBuy: {
        shopContainer: ['eu=', '用户评价', '查看全部'],
    }
}

module.exports = C290701;
