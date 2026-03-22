// TypeScript 类型定义文件，用于给 Rhino 的 console 函数提供代码提示

declare global {
    // Rhino 中的 console 对象
    var console: Console;
}

interface Console {
    /**
     * 记录普通日志信息
     * @param message 要记录的消息
     */
    log(...message: any[]): void;

    /**
     * 记录警告信息
     * @param message 要记录的警告消息
     */
    warn(...message: any[]): void;

    /**
     * 记录错误信息
     * @param message 要记录的错误消息
     */
    error(...message: any[]): void;

    /**
     * 记录信息，通常用于调试目的
     * @param message 要记录的信息
     */
    info(...message: any[]): void;

    /**
     * 记录调试信息
     * @param message 要记录的调试信息
     */
    debug(...message: any[]): void;

    /**
     * 打印堆栈追踪
     * @param message 堆栈追踪信息
     */
    trace(...message: any[]): void;

    /**
     * 显示日志窗口
     */
    show(): void;

    /**
     * 隐藏日志窗口
     */
    hide(): void;

    /**
     * 设置日志窗口的大小
     * @param width 窗口宽度（像素）
     * @param height 窗口高度（像素）
     */
    setWindowSize(width: number, height: number): void;

    /**
     * 设置日志窗口的位置
     * @param x 窗口左上角X坐标（像素）
     * @param y 窗口左上角Y坐标（像素）
     */
    setWindowPosition(x: number, y: number): void;

    /**
     * 设置日志窗口的背景颜色
     * @param color 颜色值（ARGB格式，如 0xFF000000 表示黑色）
     */
    setBackgroundColor(color: number): void;

    /**
     * 设置日志文本的颜色
     * @param color 颜色值（ARGB格式，如 0xFFFFFFFF 表示白色）
     */
    setTextColor(color: number): void;

    /**
     * 设置日志文本的字体大小
     * @param size 字体大小（像素）
     */
    setTextSize(size: number): void;

    /**
     * 设置日志文本的行高
     * @param lineHeight 行高（像素）
     */
    setLineHeight(lineHeight: number): void;

    /**
     * 一次性设置两个按钮的颜色（关闭按钮、调整大小按钮）
     * @param closeColor 关闭按钮颜色（ARGB格式）
     * @param resizeColor 调整大小按钮颜色（ARGB格式）
     */
    setButtonColors(closeColor: number, resizeColor: number): void;

    /**
     * 设置标题栏文字的颜色
     * @param color 颜色值（ARGB格式，如 0xFFFFFFFF 表示白色）
     */
    setTitleTextColor(color: number): void;

    /**
     * 设置标题栏文字的字体大小
     * @param size 字体大小（sp）
     */
    setTitleTextSize(size: number): void;

    /**
     * 设置标题栏的文字内容
     * @param text 标题文字内容。如果传入 null 或空字符串，将使用应用名称作为默认标题
     */
    setTitleText(text: string | null): void;

    /**
     * 设置标题栏的背景颜色
     * @param color 颜色值（ARGB格式，-1表示自动计算，比背景色深20%）
     */
    setTitleBarColor(color: number): void;

    /**
     * 设置是否允许窗口移动到顶部
     * @param allow 是否允许移动到顶部
     */
    setAllowMoveToTop(allow: boolean): void;

    /**
     * 设置是否允许窗口移动到底部
     * @param allow 是否允许移动到底部
     */
    setAllowMoveToBottom(allow: boolean): void;

    /**
     * 设置日志窗口是否可点击（穿透）
     * @param clickable 是否可点击
     */
    setClickable(clickable: boolean): void;

    /**
     * 检查日志窗口是否可点击
     * @returns 是否可点击
     */
    isClickable(): boolean;

    /**
     * 清空日志窗口中的所有日志
     */
    clearLogs(): void;

    /**
     * 设置日志窗口显示的最大行数。超过此数量的旧日志会被自动删除。
     * @param maxLines 最大行数
     */
    setMaxLogLines(maxLines: number): void;

    /**
     * 获取日志窗口显示的最大行数
     * @returns 最大行数
     */
    getMaxLogLines(): number;

    /**
     * 设置是否自动滚动到底部（当有新日志时）
     * @param autoScroll 是否自动滚动
     */
    setAutoScroll(autoScroll: boolean): void;

    /**
     * 一次性设置日志窗口的多个样式属性
     * @param config 配置对象
     */
    setWindowStyle(config: {
        width?: number;
        height?: number;
        x?: number;
        y?: number;
        backgroundColor?: number;
        textColor?: number;
        textSize?: number;
        lineHeight?: number;
        closeButtonColor?: number;
        resizeButtonColor?: number;
        titleTextColor?: number;
        titleTextSize?: number;
        titleText?: string | null;
        titleBarColor?: number;
        allowMoveToTop?: boolean;
        allowMoveToBottom?: boolean;
        clickable?: boolean;
    }): void;

    /**
     * 获取当前日志窗口的样式配置
     * @returns 包含所有样式配置的对象
     */
    getWindowStyle(): {
        width: number;
        height: number;
        x: number;
        y: number;
        backgroundColor: number;
        textColor: number;
        textSize: number;
        lineHeight: number;
        closeButtonColor: number;
        resizeButtonColor: number;
        titleTextColor: number;
        titleTextSize: number;
        titleText: string;
        titleBarColor: number;
        allowMoveToTop: boolean;
        allowMoveToBottom: boolean;
        clickable: boolean;
    };
}

export { };
