global {
    var KeyBoards: KeyBoards;
}

interface KeyBoards {
    /**
     * DeekeScript输入法是否启用（未设置为默认，也返回true，但是此时不能输入和删除）
     */
    public isEnabled(): boolean;

    /**
     * 判断DeekeScript输入法是否设置为默认，是的话，则可以使用输入和删除方法
     */
    public canInput():boolean;

    /**
     * 往文本框追加字符串
     */
    public input(str: string): boolean;

    /**
     * 删除文本框最后一个字符
     */
    public delete():boolean;

    /**
     * 隐藏键盘
     */
    public hide(): boolean;

    /**
     * 发送按键事件，支持各种按键
     * 注意：输入法只能发送文本输入相关的按键，系统级按键（如HOME、BACK、POWER等）无法通过输入法发送
     * @param key 按键代码，可以是字符串（如 "ENTER"）或数字（如 KeyBoards.KEYCODE.ENTER）
     */
    public pressKey(key: string | number): boolean;

    /**
     * 发送Enter键（回车键）
     */
    public pressEnter(): boolean;

    /**
     * 发送Tab键（制表符）
     */
    public pressTab(): boolean;

    /**
     * 发送空格键
     */
    public pressSpace(): boolean;

    /**
     * 智能方法：根据当前状态自动跳转到合适的页面
     * - 如果已经是默认输入法，返回 true
     * - 如果未启用，跳转到启用页面（用户需要先启用）
     * - 如果已启用但未设为默认，弹出输入法选择界面（用户可以选择为默认）
     * @returns 返回当前输入法是否已设为默认（true表示已是默认，false表示需要用户操作）
     */
    public showInputMethodPicker(): boolean;
}

export { };
