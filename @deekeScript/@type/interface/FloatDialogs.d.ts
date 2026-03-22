declare global {
    var FloatDialogs: FloatDialogs;
}

interface FloatDialogs {
    /**
     * 悬浮窗弹窗（需要开启悬浮窗权限）
     * @param title 弹窗标题
     * @param content 弹窗内容
     */
    public show(title: string, content: string): void;

    /**
     * 悬浮窗弹窗（需要开启悬浮窗权限）
     * @param content 弹窗内容
     */
    public show(content: string): void;

    /**
     * toast 吐司，与System.toast区别是，可以后台弹出消息
     */
    public toast(content: string): void;

    /**
     * toastLong 吐司（时间更长），与System.toast区别是，可以后台弹出消息
     */
    public toastLong(content: string): void;

    /**
     * 设置悬浮窗是否可点击
     * @param clickable 是否可点击
     */
    public setFloatWindowClickable(clickable: boolean): void;

    /**
     * 关闭FloatDialogs开启的所有弹窗
     */
    public closeAll(): void;

    /**
     * 设置悬浮窗显示/隐藏
     * @param visible 是否显示
     */
    public setFloatWindowVisible(visible: boolean): void;

    /**
     * 显示确认对话框，支持动态修改内容和回调函数
     * 此方法会阻塞当前线程，直到用户点击按钮或回调函数返回true
     * 注意：此方法需要在初始化FloatDialogs时传入scope参数才能使用
     * @param title 弹窗标题
     * @param content 弹窗内容
     * @param confirmText 确定按钮文字
     * @param cancelText 取消按钮文字
     * @param callback 回调函数，接收一个dialog对象作为参数，可以通过dialog.setContent()动态修改弹窗内容。如果回调函数返回true，则自动关闭对话框；返回false或不返回值，则继续等待用户点击按钮
     * @returns 如果用户点击了确定按钮返回true，点击了取消按钮返回false
     */
    public confirm(title: string, content: string, confirmText: string, cancelText: string, callback: (dialog: FloatDialog) => boolean | void): boolean;
}

/**
 * FloatDialog 接口，用于管理对话框状态
 */
interface FloatDialog {
    /**
     * 设置对话框内容
     * @param content 对话框内容
     */
    setContent(content: string): void;
}

export { };
