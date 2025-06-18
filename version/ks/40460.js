let C = {
    labelName: 'label_name',
    text: 'text1',
    backHome: ['kwai_image_view'],//左上角的三条杠
    swipeCommentListOp: ['recycler_view'],
    swipeSearchUserOp: ['recycler_view'],
    userList: ['user_root_layout', 'avatar', 'name']
}

const C40460 = {
    Common: C,
    Index: {
        home: ['首页', '精选', '消息', '我', 'androidx.appcompat.app.ActionBar$c'],
        local: ['follow_tab_text', '同城', 'container', 'live_cover_icon_text', 'recycler_view'],//live_mark 换成了 live_cover_icon_text
    },

    User: {
        getNickname: ['user_name_tv'],
        getDouyin: ['profile_user_kwai_id', '快手号：', 'header_vip_tv'],
        getZanCount: ['like'],
        getFocusCount: ['following'],
        getFansCount: ['follower'],
        getIntroduce: ['user_text'],
        getIp: [C.labelName, 'IP：'],
        getAge: [C.labelName, '岁'],
        getGender: [C.labelName, '女', '男'],
        getWorksTag: ['tab_text', '作品'],
        isPrivate: ['私密', '注销', '封禁'],
        isFocus: ['header_follow_button', 'i 关注', 'header_follow_status_button'],
        cancelFocus: ['qlist_alert_dialog_item_text', '取消关注'],
        privateMsg: ['more_btn', '更多', 'top_operation_item_text', '发私信', 'editor', 'send_btn'],
    },

    Video: {
        scroll: ['nasa_groot_view_pager'],
        ad: ['广告详情页'],
        viewDetail: ['广告详情页'],
        getZanTag: ['like_icon', 'like_count_view'],
        getCommentTag: ['comment_icon', 'comment_count_view'],
        getCollectTag: ['collect_icon', 'collect_text'],
        getShareTag: ['forward_icon', 'forward_count'],
        getContentTag: ['element_caption_label'],
        getTitleTag: ['user_name_text_view'],
        getAtNickname: ['@'],
        getTimeTag: ['create_date_tv'],
        isLiving: ['slide_play_cdn_living_tip', 'live_simple_play_swipe_text', '点击进入直播间'],
        getAvatar: ['slide_play_avatar_click_area', '作者头像'],//注意只能点击头像上部分的60%，否则可能会点击到关注
        getDistanceTag: ['label_text', '距你'],
        intoUserVideo: ['tab_text', '作品', 'player_cover_container', 'profilegrid_showTop'],
    },

    Comment: {
        getList: ['comment_frame'],
        closeCommentWindow: ['tabs_panel_close', '关闭评论区'],
        getIpTag: ['comment_created_time_and_loc'],
        getTimeTag: ['comment_created_time_and_loc'],
        isAuthor: ['comment_author_tag', '作者'],
        getAvatarTag: ['avatar', '头像'],
        getNicknameTag: ['name'],
        getZanTag: ['cl_like'],
        getZanCountTag: ['tv_like_count'],
        getContentTag: ['comment'],
        //commentMsg: ['text', 'editor', 'finish_button'],
        commentMsg: ['editor_holder_text', 'editor', 'finish_button'],
        commentImage: ['emotion_button', 'tabIndicator', 'emotion_img', '表情'],
    }
}

module.exports = C40460;
