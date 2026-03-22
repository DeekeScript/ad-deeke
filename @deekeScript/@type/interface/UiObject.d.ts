
/**
 * 控件对象
 */
declare global {
    interface UiObject {
        /**
         * 点击控件
         */
        public click(): boolean;

        /**
         * 长按控件
         */
        public longClick(): boolean;

        /**
         * 向前滚动控件（手指向下或者向右移动）
         */
        public scrollForward(): boolean;

        /**
         * 向后滚动控件（手指往上或者往左移动）
         */
        public scrollBackward(): boolean;

        /**
         * 选中文本
         * @param start 起始位置 
         * @param end  结束位置
         */
        public setSelection(start: number, end: number): boolean;

        /**
         * 复制控制内容，结合setSelection使用
         */
        public copy(): boolean;

        /**
         * 剪切控件内容，结合setSelection使用
         */
        public cut(): boolean;

        /**
         * 粘贴内容到文本框
         */
        public paste(): boolean;

        /**
         * 让控件获取焦点
         */
        public focus(): boolean;

        /**
         * 给文本框输入内容
         * @param text 文本内容
         */
        public setText(text: string): boolean;
        /**
         * 在当前控件或者所有子控件中查找某些控件
         * 如果使用了children() 方法，则只搜索子控件
         * @param obj 搜索条件
         */
        public find(obj: UiSelector): UiObject[];

        /**
        * 在当前控件或者所有子控件中查找某个控件
        * 如果使用了children() 方法，则只搜索子控件
        * @param obj 搜索条件
        */
        public findOne(obj: UiSelector): UiObject;

        /**
         * 获取控件的位置
         */
        public bounds(): Rect;

        /**
         * 获取控件的文本内容
         */
        public text(): string;

        /**
         * 获取控件的描述内容
         */
        public desc(): string;

        /**
         * 获取控件的id
         */
        public id(): string;

        /**
         * 获取当前控件的子控件
         */
        public children(): this;

        /**
         * 获取当前控件的子控件数量，必须在children() 方法之后调用
         */
        public length(): number;

        /**
         * 获取子控件数量
         */
        public getChildCount(): number;

        /**
         * 获取子控件
        */
        public getChildren(index): UiObject;

        /**
         * 获取父控件
         */
        public parent(): UiObject;

        /**
         * 获取控件的绘制顺序
         */
        public getDrawingOrder(): number;

        /**
         * 判断控件是否被选中
         */
        public isSelected(): boolean;

        /**
        * 判断控件是否可以点击
        */
        public isClickable(): boolean;

        /**
         * 判断控件是否可以长按
         */
        public isLongClickable(): boolean;

        /**
        * 判断控件是否可以选中
        */
        public isCheckable(): boolean;

        /**
        * 判断控件是否被选中
        */
        public isChecked(): boolean;

        /**
         * 判断控件是否可用
         */
        public isEnabled(): boolean;

        /**
        * 判断控件是否获得焦点
        */
        public isFocusable(): boolean;

        /**
         * 获取控件是否获得焦点
         */
        public isFocused(): boolean;


        /**
         * 判断控件是否可以滚动
         */
        public isScrollable(): boolean;


        /**
         * 判断控件是否对用户可见
         */
        public isVisibleToUser(): boolean;


        /**
         * 判断控件是否可以编辑
         */
        public isEditable(): boolean;

        /**
         * 判断控件是否是密码控件
         */
        public isPassword(): boolean;

        /**
         * 获取控件的className
         */
        public className(): string;

        /**
         * 获取控件的包名
         */
        public getPackageName(): string;

        /**
         * 获取控件的提示文本
         */
        public getHintText(): string;
    }
}
export { };
