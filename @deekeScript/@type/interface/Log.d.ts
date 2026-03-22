global {
    var Log: log;
}

interface log {
    /**
     * 全局设置日志输出文件
     */
    public setFile(filename: string): boolean;
    /**
     * 输出日志内容
     */
    public log(...obj: object): void;
}

export { };
