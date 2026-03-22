declare global {
    var Device: Device;
}

interface Device {
    /**
     * 获取屏幕宽度
     */
    public width(): number;

    /**
     * 获取屏幕高度
     */
    public height(): number;

    /**
     * 获取设备版本，如 26
     */
    public sdkInt(): number;

    /**
     * 获取设备
     */
    public device(): string;

    /**
     * 获取设备版本，如 "8.1.0"
     */
    public androidVersion(): string;

    /**
     * 获取设备唯一标识符
     * 
     * 返回系统级别的 ANDROID_ID，在设备恢复出厂设置之前会保持不变，保证设备唯一性。
     * 注意：设备恢复出厂设置后，ANDROID_ID 可能会改变。App卸载不会影响此标识符。
     */
    public getUuid(): string;

    /**
     * 获取设备卡密
     */
    public getToken(): string;

    /**
     * 获取设备其他信息（此方法可以取代getToken和getUuid）
     */
    public getAttr(key: string): string;

    /**
     * 获取设备品牌， 如 "HUAWEI" 或 "Xiaomi"
     */
    public brand(): string;

    /**
     * 获取设备操作系统名称， 如 "Android"
     */
    public os(): string;

    /**
     * 获取设备型号名称， 如 "Honor V30" 或类似的字符串
     */
    public model(): string;

    /**
     * 获取设备代号， 例如 "REL" 表示正式发布的版本
     */
    public codename(): string;

    /**
     * 获取设备制造商信息，如 "HUAWEI"、"Xiaomi" 等
     */
    public manufacturer(): string;

    /**
     * 获取硬件名称，如 "kirin990" 等
     */
    public hardware(): string;

    /**
     * 获取主板型号信息
     */
    public board(): string;

    /**
     * 获取产品名称信息
     */
    public product(): string;

    /**
     * 获取 Bootloader 版本信息
     */
    public bootloader(): string;

    /**
     * 获取构建ID信息
     */
    public buildId(): string;

    /**
     * 获取显示版本信息
     */
    public display(): string;

    /**
     * 获取设备指纹信息
     */
    public fingerprint(): string;

    /**
     * 获取主机名信息
     */
    public host(): string;

    /**
     * 获取构建用户信息
     */
    public user(): string;

    /**
     * 获取CPU架构信息，如 "arm64-v8a"、"armeabi-v7a" 等
     */
    public getCpuAbi(): string;

    /**
     * 获取所有支持的CPU架构列表
     */
    public getCpuAbis(): string[];

    /**
     * 获取WiFi网络的IP地址（仅WiFi连接时有效）
     * @returns WiFi IP地址，如果WiFi未连接返回空字符串
     */
    public getWifiIPAddress(): string;

    /**
     * 获取当前活动网络的IP地址（支持WiFi和移动网络，返回局域网IP）
     * @returns 当前活动网络的IP地址，如果获取失败返回 "127.0.0.1"
     */
    public getIPAddress(): string;

    /**
     * 获取公网IPv4地址（需要通过HTTP请求外部服务）
     * @returns 公网IPv4地址，如果获取失败返回空字符串
     */
    public getPublicIPAddress(): string;

    /**
     * 获取公网IPv6地址（需要通过HTTP请求外部服务）
     * @returns 公网IPv6地址，如果获取失败返回空字符串
     */
    public getPublicIPAddressV6(): string;

    /**
     * 获取公网IP信息（包含IPv4和IPv6）
     * @returns 包含 ipv4 和 ipv6 的对象
     */
    public getPublicIPInfo(): {
        ipv4: string;
        ipv6: string;
    };

    /**
     * 获取完整的IP信息（包括当前IP、WiFi IP、公网IP等）
     * @returns 包含所有IP信息的对象
     */
    public getIpInfo(): {
        ip: string;
        wifiIP: string;
        publicIP: string;
        publicIPV6: string;
        publicIPInfo: {
            ipv4: string;
            ipv6: string;
        };
    };

    /**
     * 获取MAC地址（需要WiFi已连接）
     * @returns MAC地址，如果WiFi未连接返回空字符串
     */
    public getMacAddress(): string;

    /**
     * 获取网络类型
     * @returns 网络类型："WiFi" | "Mobile" | "Ethernet" | "Other" | "None"
     */
    public getNetworkType(): "WiFi" | "Mobile" | "Ethernet" | "Other" | "None";

    /**
     * 检查网络是否已连接
     * @returns 网络是否已连接
     */
    public isNetworkConnected(): boolean;

    /**
     * 获取完整的网络信息
     * @returns 包含网络类型、连接状态、MAC地址、IP地址等的对象
     */
    public getNetworkInfo(): {
        type: "WiFi" | "Mobile" | "Ethernet" | "Other" | "None";
        connected: boolean;
        macAddress: string;
        ip: string;
        wifiIP: string;
        publicIP: string;
        publicIPV6: string;
    };

    /**
     * 获取设备当前位置信息
     * 
     * 需要先申请位置权限（使用Access.requestLocationPermissions()）。
     * 此方法会优先使用GPS定位（更精确），如果GPS不可用，会尝试使用网络定位。
     * 如果仍然无法获取位置，会尝试使用被动定位提供者。
     * 
     * @returns 位置信息对象，包含纬度、经度、海拔、精度、速度、方向角、时间戳和定位提供者。
     *          如果获取失败或没有权限，返回 null
     */
    public getLocation(): {
        latitude: number;
        longitude: number;
        altitude: number;
        accuracy: number;
        speed: number;
        bearing: number;
        time: number;
        provider: string;
    } | null;

    /**
     * 获取状态栏高度（像素）
     * 
     * 状态栏是屏幕顶部显示时间、电池、信号等信息的区域。
     * 如果获取失败返回0。
     * 
     * @returns 状态栏高度（像素）
     */
    public getStatusBarHeight(): number;

    /**
     * 获取底部虚拟按钮（导航栏）高度（像素）
     * 
     * 导航栏是屏幕底部显示返回、主页、最近任务等虚拟按钮的区域。
     * 如果导航栏隐藏了或获取失败返回0。
     * 
     * @returns 导航栏高度（像素），如果隐藏或获取失败返回0
     */
    public getNavigationBarHeight(): number;

    /**
     * 获取所有已安装应用的包名列表
     * @returns 应用包名数组
     */
    public getInstalledPackages(): string[];

    /**
     * 获取所有已安装应用的详细信息列表
     * @returns 应用信息数组，每个元素包含应用信息对象（packageName, appName, versionName, versionCode等）
     */
    public getInstalledApplications(): Array<{
        packageName: string;
        appName: string;
        versionName: string;
        versionCode: number;
    }>;
}

export { };
