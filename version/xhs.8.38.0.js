const C8380 = {
    Common: {
        backHome: ['iqq', '首页'],
        swipeSearchUserOp: ['暂时无相关逻辑'],
        swipeFansListOp: ['k11'],
        swipeCommentListOp: ['gdo'],
        swipeFocusListOp: ['g5d'],
        swipeRecommendListOp: ['hf5'],
    },

    User: {
        fans: ['iqg', '关注', '粉丝', '推荐', '已选定', 'cms', 'jqy', 'as2', 'jnz'],//粉丝列表
        account: ['h5g'],
        nickname: ['h5e'],
        focus: ['jz0', '关注', '发消息'], //关注按钮  和 发消息按钮，两者ID是一样的，关注之后，关注按钮变为发消息
        sendMsg: ['jz1', '发消息'],//没有关注的时候，关注按钮右侧的“发消息”按钮
        msgBtn: ['awc'],
        sendBtn: ['f7c'],//消息发送按钮
        fansText: ['ccd'],
        showAllFans: ['ixu', '查看全部'], //粉丝页面 ，需要点击才能查看全部
        back: ['h45', '返回'],
    },

    Work: {
        zan: ['gef', 'fpp'],//图文赞，视频赞
        collect: ['gcm', 'fpk'],
        zanCollectionHead: ['iqg', '赞和收藏'], //赞和收藏12
        zanUserList: ['jq', 'android.view.ViewGroup', 'nickNameTV', 'jm8', '作者'],//我的作品下面的赞用户列表
        head: ['ejz'],//ejz是nickNameTV外层的标签，用于判断是否进入了笔记页面
        zanCount: ['gcr'],
        commentCount: ['gcx'],
        zanCommentList: ['gdo', 'ezl'],//评论赞列表，第一个是滑动容器，第二是赞控件
        intoBottom: ['f0_', '到底了'],
        comment: ['e1d', 'f9d'],//初始的输入框，最下面的，不是笔记内的；第二个是点击输入框之后的输入框元素
        sendBtn: ['fif', '发送'],
        videoComment: ['commentLayout', 'b98'],//评论按钮；评论区滑动
        videoCommentOpen: ['e1c'],
        like: ['g1_', '你可能感兴趣的人'],
        videoNickname: ['matrixNickNameView'],
        videoFocus: ['matrixFollowView'],
        focus: ['followTV'],
        nickname: 'nickNameTV',
        VideoNickname: 'jzg',//desc：作者 XXX
        title: 'gfd',
        videoTitle: 'noteContentText',
    },

    Index: {
        intoIndex: ['发现'],
        container: ['fcc', '视频  ', '笔记  ', '赞'], // 【视频  南阳知府衙门：一镜到底沉浸式体验明清地牢 来自安西承宣布政使 7663赞】
        containerCity: ['f09'],
        zan: ['ecs'],//主页笔记视频点赞
        swipe: ['fcc', 'f09'], //分别是“发现”、“武汉” 两个类目中的滑动
        intoSearchPage: ['hw4', '搜索'],
    },

    Search: {
        container: 'fhj',//可滑动
        intoSearchList: ['fhw', 'fi1', '搜索'],
        intoSearchVideo: ['gfb', 'ge2', 'a8t'],//标题，封面，昵称和头像整体
        searchTop: 'fgz',
    }
}

module.exports = C8380;
