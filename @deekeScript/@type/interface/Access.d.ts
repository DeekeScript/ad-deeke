global {
    var Access: access;
}

/**
 * 
console.log(Access.isAccessibilityServiceEnabled());
console.log(Access.isFloatWindowsEnabled());
console.log(Access.isBackgroundAlertEnabled());
console.log(Access.isMediaProjectionEnable());

//console.log(Access.backgroundAlertSetting());
//console.log(Access.openAccessibilityServiceSetting());
//console.log(Access.openFloatWindowsSetting());
//console.log(Access.mediaProjectionSetting());


 */
interface access {
    /**
     * 是否开启了无障碍权限
     */
    public isAccessibilityServiceEnabled(): boolean;
    
    /**
     * 是否开启了悬浮窗权限
     */
    public isFloatWindowsEnabled(): boolean;

    /**
     * 是否开启了后台弹窗权限
     */
    public isBackgroundAlertEnabled(): boolean;

    /**
     * 是否开启了截图录屏权限
     */
    public isMediaProjectionEnable(): boolean;

    /**
     * 开启了无障碍权限设置界面
     */
    public openAccessibilityServiceSetting(): void;
    
     /**
     * 开启了悬浮窗权限设置界面
     */
     public openFloatWindowsSetting(): void;

      /**
     * 开启了后台弹窗权限设置界面
     */
    public openBackgroundAlertSetting(): void;

     /**
     * 开启了截图录屏权限设置界面
     */
     public openMediaProjectionSetting(): void;

     /** 
      * 进入通知权限设置界面（用户可以开启通知权限）
      */
     public requestNotificationAccess(): void;

     /**
      * 是否开启读取通知权限
      */
     public hasNotificationAccess(): boolean;

     /**
      * 检查是否有媒体库读取权限（图片、视频）
      * @return true 如果有权限
      */
     public hasMediaReadPermission(): boolean;

     /**
      * 申请媒体库权限（统一接口，自动处理各Android版本差异）
      * 
      * 权限说明：
      * - Android 13+: 请求 READ_MEDIA_IMAGES 和 READ_MEDIA_VIDEO
      * - Android 10-12: 请求 READ_EXTERNAL_STORAGE
      * - Android 9-: 请求 READ_EXTERNAL_STORAGE 和 WRITE_EXTERNAL_STORAGE
      * 
      * 注意：这是异步操作，不会阻塞
      */
     public requestMediaPermissions(): void;

     /**
      * 打开应用权限设置页面
      */
     public openPermissionSettings(): void;

     /**
      * 检查媒体权限是否被永久拒绝（用户选择了"不再询问"）
      * 
      * 如果返回true，说明用户之前拒绝过权限并选择了"不再询问"，
      * 系统不会再弹出权限对话框，需要引导用户去设置页面手动开启
      * 
      * @return true 如果权限被永久拒绝
      */
     public isMediaPermissionPermanentlyDenied(): boolean;

     /**
      * 检查是否有文件存储权限（适配Android 8及以上版本）
      * 
      * 权限说明：
      * - Android 11+: 检查 MANAGE_EXTERNAL_STORAGE 权限（需要用户手动在设置中开启）
      * - Android 8-10: 检查 READ_EXTERNAL_STORAGE 和 WRITE_EXTERNAL_STORAGE 权限
      * 
      * @return true 如果有权限
      */
     public hasStoragePermission(): boolean;

     /**
      * 申请文件存储权限（适配Android 8及以上版本）
      * 
      * 权限说明：
      * - Android 11+: 引导用户去设置页面手动开启 MANAGE_EXTERNAL_STORAGE 权限
      * - Android 8-10: 请求 READ_EXTERNAL_STORAGE 和 WRITE_EXTERNAL_STORAGE 权限
      * 
      * 注意：这是异步操作，不会阻塞
      * 如果用户禁用了权限，需要调用 isStoragePermissionPermanentlyDenied() 检查是否被永久拒绝
      */
     public requestStoragePermission(): void;

     /**
      * 检查文件存储权限是否被永久拒绝（用户选择了"不再询问"或禁用了权限）
      * 
      * 权限说明：
      * - Android 11+: 检查 MANAGE_EXTERNAL_STORAGE 权限状态
      * - Android 8-10: 检查 READ_EXTERNAL_STORAGE 和 WRITE_EXTERNAL_STORAGE 是否被永久拒绝
      * 
      * 如果返回true，说明用户之前拒绝过权限并选择了"不再询问"，
      * 或者用户禁用了权限，系统不会再弹出权限对话框，需要引导用户去设置页面手动开启
      * 
      * @return true 如果权限被永久拒绝或禁用
      */
     public isStoragePermissionPermanentlyDenied(): boolean;

     /**
      * 检查是否有位置权限
      * 
      * 权限说明：
      * - 检查 ACCESS_FINE_LOCATION（精确定位）或 ACCESS_COARSE_LOCATION（粗略定位）权限
      * - 如果授予了 ACCESS_FINE_LOCATION，则自动拥有 ACCESS_COARSE_LOCATION 权限
      * 
      * @return true 如果有权限
      */
     public hasLocationPermission(): boolean;

     /**
      * 申请位置权限
      * 
      * 权限说明：
      * - 优先请求 ACCESS_FINE_LOCATION（精确定位）
      * - 如果用户拒绝了精确定位，系统可能降级为 ACCESS_COARSE_LOCATION（粗略定位）
      * 
      * 注意：这是异步操作，不会阻塞
      * 如果用户禁用了权限，需要调用 isLocationPermissionPermanentlyDenied() 检查是否被永久拒绝
      */
     public requestLocationPermissions(): void;

     /**
      * 检查位置权限是否被永久拒绝（用户选择了"不再询问"）
      * 
      * 如果返回true，说明用户之前拒绝过权限并选择了"不再询问"，
      * 系统不会再弹出权限对话框，需要引导用户去设置页面手动开启
      * 
      * @return true 如果权限被永久拒绝
      */
     public isLocationPermissionPermanentlyDenied(): boolean;
}

export { };
