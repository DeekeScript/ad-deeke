global {
  var SocketIoClient: socketIoClient;
}

interface socketIoClient {
  /**
   * 获取socketIOClient实例
   * @param serverUrl  socketIOServer地址
   * @param reconnect  是否自动重连（默认为true）
   * @param timeout  重连超时时间（毫秒）（默认为5000毫秒）
   */
  public getInstance(serverUrl: string, reconnect: boolean = true, timeout: number = 5000): socketIOClient;

  /**
   * 连接socketIOServer
   */
  public connect(): void;

  /**
   * 断开socketIOServer
   */
  public disconnect(): void;

  /**
   * 是否已连接
   */
  public isConnected(): boolean;

  /**
   * 向服务器发送事件和数据
   * @param eventName  事件名称
   * @param data  数据
   */
  public emit(eventName: string, data: string): void;

  /**
   * 向服务器发送事件和数据
   * @param eventName 事件名称
   * @param data 数据
   * @param callback 服务器确认后的回调函数
   */
  public emit(eventName: string, data: string, callback: function): void;

  /**
   * 监听事件
   * @param eventName 
   * @param callback 
   */
  public on(eventName: string, callback: (data: string) => void): void;

  /**
  *  移除事件监听器
  * @param eventName 
  * @param callback 
  */
  public off(eventName: string, callback: (data: string) => void): void;

  /**
  *  移除事件监听器
  * @param eventName 
  */
  public off(eventName: string): void;

  /**
  *  移除所有事件监听器
  */
  public off(): void;

  /**
   * 重置当前实例的是否重连
   * @param bool 是否自动重连
   */
  public setReconnect(bool: boolean): void;
}

export { };
