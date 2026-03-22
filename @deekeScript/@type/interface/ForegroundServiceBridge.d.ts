
declare global {
    var ForegroundServiceBridge: foregroundServiceBridge;
}

interface foregroundServiceBridge {
    /**
     * 开启前台服务
     */
    public startService(): void;

    /**
     * 注册执行的方法（启动服务前设置）
     * @param register 注册监听
     */
    public register(func: Function): void;

    /**
     * 前台服务标题和内容设置（启动服务前设置）
     * @param title 前台服务标题
     * @param content 前台服务内容
     */
    public setContent(title: string, content: string):void;

    /**
     * 关闭服务
     */
    public stopService(): void;
}

export { };
