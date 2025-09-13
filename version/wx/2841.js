let C = {
    text: 'text1',
    backHome: ['icon_tv', '微信'],//已处理
    swipeCommentListOp: ['androidx.recyclerview.widget.RecyclerView'],
    swipeSearchUserOp: ['android.webkit.WebView'],//
    //userList: ['user_root_layout', 'avatar', 'name']
}

const C2760 = {
    Common: C,
    Index: {
        top: ['androidx.appcompat.app.a', '关注', '朋友', '推荐'],
        home: ['微信', '通讯录', '发现', '我', 'icon_tv'],//
        local: ['title', '附近', 'ebv'],//'live_cover_icon_text', 'recycler_view'
        intoSearchPage: ['r0l', '搜索', 'd98', 'mdx', '搜索'],
        search: ['账号,按钮', '账号'],
        intoVideo: ['title', '视频号', 'o58', 'pnq', 'kts'],// 视频号id，视频号入口，视频号消息数量，进入视频默认的窗口关闭按钮，视频号进入后视频页面右上角账号图标
    },

    Account: {
        interact: ['qck', '视频号消息', 'qci', 'hhj', 'kbq', 'jt2', 'lz3', 'c6v', 't3h', '回复'], //视频号消息入口id，视频号消息入口text，视频号消息数量，视频号消息列表，昵称，消息内容，回复按钮，输入框，回复按钮id，回复按钮text
        privateDeal: ['视频号私信', 'qch', 'civ', '打招呼消息', 'eb8', 'o_4', 'civ', '视频号团队', 'bkl', 'bkk', 'bql', '发送'], //视频号私信入口，私信数量，打招呼入口id，打招呼入口，私信列表每个消息数，昵称，视频号团队内容（需要过滤），最后一次消息内容，输入框，发送按钮，发送按钮text
        privateDealT: ['qci'],//真正的私信消息
        comment: ['nuw', '评论', 'nuu'],
    },

    User: {
        getNickname: ['fzn', 'fzm'],//
        //getDouyin: ['profile_user_kwai_id', '快手号：', 'header_vip_tv'],
        //getZanCount: ['like'],
        //getFocusCount: ['following'],
        //getFansCount: ['follower'],
        getIntroduce: ['fy8'],//
        getIp: ['ov9'],//
        getAge: ['ov9', '岁'],//
        getGender: ['ov9', '女', '男'],//
        getWorksTag: ['fzr', '作品'],//
        isPrivate: ['私密', '注销', '封禁'],//
        isFocus: ['fyl', '关注', '已关注', '互相关注'],//
        cancelFocus: ['obc', '不再关注'],//
        privateMsg: ['g03', '私信', 'bkk', 'bql'],//
    },

    Video: {
        ad: ['广告详情页'],//暂未发现广告，后续补充
        viewDetail: ['广告详情页'],//暂未发现广告，后续补充
        getZanTag: ['h6s', 'ng3'],//
        getCommentTag: ['h6b', 'c6s'],//
        getCollectTag: ['h6i', 'i1g'],//
        getShareTag: ['h6p', 'msm'],//
        getContentTag: ['o45'],//
        getTitleTag: ['a8p', 'che'],//
        //getTimeTag: ['create_date_tv'],
        isLiving: ['exc', '进入直播间'],//轻触进入直播间
        getAvatar: ['a_4'],//注意只能点击头像上部分的60%，否则可能会点击到关注
        getNickname: ['a8p', 'che'], //
        getDistanceTag: ['edj'],//
        getIpTag: ['edj', ' · '],//
        intoUserVideo: ['fz0'],//暂时没有使用
        close: ['b1k', '我知道了'],
    },

    Comment: {
        getList: ['dz_'],//
        closeCommentWindow: ['gxy'],//
        getIpTag: ['hgh'],//
        getTimeTag: ['c85'],//
        isAuthor: ['a8r', '作者'],//
        getAvatarTag: ['a_4', '头像'],//
        getNicknameTag: ['kbf'],//
        getZanTag: ['a_z'],//
        getZanCountTag: ['aa0'],//
        getContentTag: ['c1_'],//
        isVideoAccount: ['ehq'],
        //commentMsg: ['text', 'editor', 'finish_button'],
        commentMsg: ['c6v', 'c6v', 't3h'],//
        commentImage: ['n0r', 'n0v', '自定义表情', 'a50'],//
        commentIptContainer: ['eat'],
    }
}

module.exports = C2760;
