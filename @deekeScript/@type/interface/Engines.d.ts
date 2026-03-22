declare global {
    var Engines: Engines;
}

interface Engines {
    /**
     * 执行脚本
     * @param file 文件路径，相对根目录的路径
     */
    public executeScript(file: string): void;

    /**
     * 执行脚本
     * @param content 脚本内容
     */
    public executeScriptStr(name: string, content: string): void;

    /**
     * 关闭当前线程和子线程所有脚本（包含定时器、socket、Hid等；不会关闭hooks脚本）
     */
    public closeAll(): void;

    /**
     * 关闭当前线程之外的其他线程和子线程（包含定时器、socket、Hid等；不会关闭hooks脚本）
     */
    public closeOther(): void;

    /**
     * 关闭hooks脚本
     */
    public closeHook(): void;

    /**
     * 返回所有子脚本的数量
     */
    public childScriptCount(): number;
}

export { };
