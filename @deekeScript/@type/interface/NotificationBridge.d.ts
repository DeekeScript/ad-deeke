
declare global {
    var NotificationBridge: notificationBridge;
}

interface notificationBridge {
    /**
     * 开启读取通知服务
     */
    public startService(): void;

    /**
     * 监听通知
     * @param onNotification 通知发起后执行 @argument packageName 包名 @argument title 标题 @argument text 内容
     * @param onNotificationRemoved 通知移除后执行 @argument packageName 包名 @argument title 标题 @argument text 内容
     */
    public startListening(
        onNotification: (packageName: string, title: string, text: string) => void,
        onNotificationRemoved: (packageName: string, title: string, text: string) => void
    ): void;

    /**
     * 关闭服务
     */
    public stopService(): void;
}

export { };
