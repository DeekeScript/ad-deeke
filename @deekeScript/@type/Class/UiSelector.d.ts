
declare global {
    function UiSelector(simpleMode?: boolean): UiSelector;
    /**
     * 控件选择器
     */
    class UiSelector {
        //public setLevel(level: number): UiSelector; //这个方法待完善
        //public getLevel(): number;//这个方法待完善
        public UiSelector(): void;//使用new UiSelector()  或者  UiSelector() 都可以实例化选择器

        /**
         * 
         * @param text 控件文本
         */
        public text(text: string): UiSelector;

        /**
         * 
         * @param text 模糊匹配文本控件
         */
        public textContains(text: string): UiSelector;

        /**
         * 
         * @param text 正则匹配文本控件
         */
        public textMatches(text: RegExp): UiSelector;

        //public textStartsWith(text: string): UiSelector;
        //public  textEndsWith(text: string): UiSelector;

        /**
         * 
         * @param desc 控件描述内容
         */
        public desc(desc: string): UiSelector;

        /**
         * 
         * @param desc 模糊匹配描述控件
         */
        public descContains(desc: string): UiSelector;

        /**
         * 
         * @param desc 正则表达式匹配描述控件
         */
        public descMatches(desc: RegExp): UiSelector;
        //public descStartsWith(desc: string): UiSelector;
        //public descEndsWith(desc: string): UiSelector;

        /**
         * 
         * @param className 控件类名
         */
        public className(className: string): UiSelector;
        //public classNameMatches(className: string): UiSelector;

        // public packageName(packageName: string): UiSelector;
        //public packageNameMatches(packageName: string): UiSelector;

        /**
         * 
         * @param id 控件ID
         */
        public id(id: string): UiSelector;

        /**
         * 
         * @param left 左边距 整数
         * @param top  上边距  整数
         * @param right 右边距  整数
         * @param bottom 下边距  整数
         */
        public bounds(left: Number, top: Number, right: Number, bottom: Number): UiSelector;

        /**
         * 
         * @param bool 是否可以点击
         */
        public clickable(bool: boolean): UiSelector;

        /**
         * 
         * @param bool 是否选中
         */
        public checked(bool: boolean): UiSelector;

        /**
         * 
         * @param bool 是否被选择
         */
        public selected(bool: boolean): UiSelector;

        /**
         * 
         * @param bool 是否可用，为false时，用户无法通过点击、输入等方式与该控件交互
         */
        public enabled(bool: boolean): UiSelector;

        /**
         * 
         * @param bool 是否已被勾选
         */
        public checked(bool: boolean): UiSelector;

        /**
         * 
         * @param bool 是否可以滚动
         */
        public scrollable(bool: boolean): UiSelector;

        /**
         * 
         * @param bool 是否可以勾选
         */
        public checkable(bool: boolean): UiSelector;

        /**
         * 
         * @param bool 是否可以聚焦
         */
        public focusable(bool: boolean): UiSelector;

        /**
         * @param bool 是否已聚焦
         */
        public focused(bool: boolean):UiSelector;

        /**
         * @param bool 是否可编辑
         */
        public editable(bool: boolean):UiSelector;

        /**
         * 
         * @param bool 是否可见
         */
        public isVisibleToUser(bool: boolean): UiSelector;

        /**
         * 
         * @param filter 过滤控件，回调函数，返回true表示符合条件，返回false表示不符合条件
         */
        public filter(filter: (v: UiObject) => boolean): UiSelector;

        /**
         * 判断节点是否存在，底层使用的findOne方法
         */
        public exists(): boolean;

        /**
         * 
         * 等待节点出现，一直阻塞直到找到节点
         */
        public waitFindOne(): UiObject;

        /**
         * 查找所有符合条件的控件
         */
        public find(): UiObject[];

        /**
         * 在当前的所有控件对象中查找所有符合某个控件选择器的控件
         * @param obj 控件选择器
         */
        public findBy(obj: UiSelector): UiObject[];

        /**
         * 查找某个控件选择器，在timeout时间内，如果找不到，则返回null；如果找到立马返回
         * @param timeout 查找时间（毫秒数）
         */
        public findBy(timeout: Number): UiObject[];

        /**
         * 返回一个符合当前选择器条件的控件
         */
        public findOne(): UiObject;

        /**
         * 返回一个符合当前选择器条件的控件
         */
        public findOnce(): UiObject;

        /**
         * 返回一个符合当前控件选择的控件
         * @param obj 控件选择器
         */
        public findOneBy(obj: UiSelector): UiObject;

        /**
         * 查找某个控件选择器，在timeout时间内，如果找不到，则返回null；如果找到立马返回
         * @param timeout 查找时间（毫秒数）
         */
        public findOneBy(timeout: Number): UiObject;
    }
}


export {};
