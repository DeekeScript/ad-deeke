let C = {
    labelName: 'label_name',
    text: 'text1',
    backHome: ['icon_tv', '微信'],//已处理
    swipeCommentListOp: ['androidx.recyclerview.widget.RecyclerView'],
    swipeSearchUserOp: ['recycler_view'],
    userList: ['user_root_layout', 'avatar', 'name']
}

const C2760 = {
    Common: C,
    Index: {
        home: ['微信', '通讯录', '发现', '我', 'icon_tv'],//
        local: ['title', '附近', 'ebv'],//'live_cover_icon_text', 'recycler_view'
        intoVideo: ['title', '视频号'],//
    },

    User: {
        getNickname: ['fzn'],//
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
        getTitleTag: ['a8p'],//
        //getTimeTag: ['create_date_tv'],
        isLiving: ['exc', '进入直播间'],//轻触进入直播间
        getAvatar: ['a_4'],//注意只能点击头像上部分的60%，否则可能会点击到关注
        getNickname: ['a8p'], //
        getDistanceTag: ['edj', ' · '],//
        intoUserVideo: ['tab_text', '作品', 'player_cover_container', 'profilegrid_showTop'],//暂时没有使用
    },

    Comment: {
        getList: ['dz_'],//
        closeCommentWindow: ['gxy'],//
        getIpTag: ['hgh'],//
        getTimeTag: ['cgp'],//
        isAuthor: ['a8r', '作者'],//
        getAvatarTag: ['a_4', '头像'],//
        getNicknameTag: ['kbf'],//
        getZanTag: ['a_z'],//
        getZanCountTag: ['aa0'],//
        getContentTag: ['c1_'],//
        //commentMsg: ['text', 'editor', 'finish_button'],
        commentMsg: ['c6v', 'c6v', 'lz3'],//
        commentImage: ['n0r', 'n0v', '自定义表情', 'a50'],//
    }
}

module.exports = C2760;
