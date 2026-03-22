declare global {
    var WebSocket: {
        new (url: string): webSocket;
        closeAll(): void;
    };
}

interface webSocket {
    constructor(url: string);
    /** 静态关闭所有连接 */
    static closeAll(): void;

    /**
     * 连接成功
     */
    public onOpen(): void;

    /**
     * 消息通知
     * @param data 
     */
    public onMessage(data: string): void;

    /**
     * 连接关闭
     * @param code 
     * @param reason 
     */
    public onClose(code: number, reason: string): void;

    /**
     * 连接出错
     * @param errorMsg 
     */
    public onError(errorMsg: string): void;

    /**
     * 发送数据
     * @param data 
     */
    public send(data: string): void;

    /**
     * 关闭当前连接
     */
    public close(): void;
}

export { };
