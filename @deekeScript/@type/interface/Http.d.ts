declare global {
    var Http: Http;
}

interface Http {
    /**
     * post请求
     * @param url 请求地址
     * @param json 请求内容
     * @param headers 请求头n的请求头，如：{"Content-Type":"application/json"}
     */
    public post(url: string, json: object, headers?: object): string | null;

    /**
     * get请求
     * @param url 请求地址
     * @param headers 请求头
     */
    public get(url: string, headers: object): string | null;

     /**
     * 
     * @param url 请求地址
     * @param files 
     * @param params 
     * @param httpCallback 
     */
    public postFile(url: string, files: string[], params: object, httpCallback: {
        success: (response: any) => void,
        fail: (response: any) => void
    }): void;


    /**
      * 下载文件
      * @param url 下载链接
      * @param destPath 保存路径（含文件名称）
      * @param headers 请求头
      */
    public download(url: string, destPath: string, headers?: object): string | null;

    /**
     * 设置连接超时时间
     * @param seconds 超时时间（秒），默认10秒
     */
    public setConnectTimeout(seconds: number): void;

    /**
     * 设置读取超时时间
     * @param seconds 超时时间（秒），默认30秒
     */
    public setReadTimeout(seconds: number): void;

    /**
     * 设置写入超时时间
     * @param seconds 超时时间（秒），默认30秒
     */
    public setWriteTimeout(seconds: number): void;

    /**
     * 设置所有超时时间
     * @param connectSeconds 连接超时时间（秒）
     * @param readSeconds 读取超时时间（秒）
     * @param writeSeconds 写入超时时间（秒）
     */
    public setTimeout(connectSeconds: number, readSeconds: number, writeSeconds: number): void;

    /**
     * 设置所有超时时间为相同的值
     * @param seconds 超时时间（秒），将应用于连接、读取和写入
     */
    public setTimeout(seconds: number): void;

    /**
     * 流式POST请求（支持Server-Sent Events等流式输出）
     * @param url 请求URL
     * @param json 请求体JSON对象
     * @param headers 请求头（可选）
     * @param onData 数据回调函数，每收到一行数据时调用，参数为数据字符串
     * @param onError 错误回调函数，发生错误时调用，参数为错误信息
     */
    public postStream(url: string, json: object, headers: object, onData: (data: string) => void, onError: (error: string) => void): void;

    /**
     * 流式POST请求（支持Server-Sent Events等流式输出）
     * @param url 请求URL
     * @param json 请求体JSON对象
     * @param onData 数据回调函数，每收到一行数据时调用，参数为数据字符串
     * @param onError 错误回调函数，发生错误时调用，参数为错误信息
     */
    public postStream(url: string, json: object, onData: (data: string) => void, onError: (error: string) => void): void;
}

export { };
