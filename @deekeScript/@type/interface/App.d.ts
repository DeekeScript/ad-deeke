declare global {
    var App: App;

    interface App {
        /**
         * 获取当前包名
         */
        public currentPackageName(): string;

        /**
         * 获取当前版本号
         */
        public currentVersionCode(): number;

        /**
         * 获取当前版本名称
         */
        public currentVersionName(): string;

        /**
         * 获取包信息
         * @param packageName 包名
         */
        public packageInfo(packageName: string): any;//这里是返回的PackageInfo（Android对象）

        /**
         * 调整到某个Activity
         * @param uri 跳转的uri
         */
        public gotoIntent(uri: string): void;

        /**
         * 启动Activity
         * @param intent Intent对象
         */
        public startActivity(intent: Intent): void;

        /**
         * 返回到App
         */
        public backApp(): void;

        /**
         * 启动服务
         * @param service Intent对象
         */
        public startService(service: Intent): any;//这里的参数和返回都是ComponentName（Android对象）

        /**
         * 发送广播
         * @param intent Intent对象
         */
        public sendBroadcast(intent: Intent): void;

        /**
         * 通过包名，打开某个App
         * @param packageName 包名
         */
        public launch(packageName: string): void;

        /**
         * 通知
         * @param title 标题
         * @param content 内容
         */
        public notifySuccess(title: string, content: string): void;

        /**
         * 通过包名，获取某个App的版本名称
         * @param packageName 包名
         */
        public getAppVersionName(packageName: string): string;

        /**
         * 通过包名，获取某个App版本号
         * @param packageName 包名
         */
        public getAppVersionCode(packageName: string): number;

        /**
         * 通过包名，进入某个App设置界面
         * @param packageName 包名
         */
        public openAppSetting(packageName: string): void;

        /**
         * 判断应用是否已安装
         * @param packageName 包名
         */
        public isAppInstalled(packageName: string): boolean;

        /**
         * 通过指定应用打开URL，如果应用未安装则使用浏览器打开
         * @param url URL地址
         * @param packageName 包名（可选，用于指定打开URL的应用）
         */
        /**
         * 打开URL地址。如果提供了packageName，则优先使用指定应用打开，如果应用未安装则使用浏览器打开；如果未提供packageName，则直接使用浏览器打开。
         * @param url URL地址
         * @param packageName 包名（可选，用于指定打开URL的应用）
         */
        openUrl(url: string, packageName?: string): void;
    }
}

export { };
