declare global {
    var Threads: Threads;
}

interface Threads {
    /**
     * 创建一个新线程并执行指定的任务
     * @param runnable 要执行的任务，可以是函数或包含run方法的对象
     * @returns 返回ThreadWrapper对象，用于管理创建的线程
     */
    create(runnable: (() => void) | { run: () => void }): ThreadWrapper;

    /**
     * 休眠当前线程指定的毫秒数
     * @param millis 休眠的毫秒数
     * @throws InterruptedException 如果线程在休眠时被中断
     */
    sleep(millis: number): void;

    /**
     * 让出当前线程的CPU时间片，允许其他线程执行
     */
    yield(): void;

    /**
     * 获取当前线程的ThreadWrapper对象
     * @returns 当前线程的ThreadWrapper对象
     */
    currentThread(): ThreadWrapper;
}

/**
 * ThreadWrapper对象，用于管理线程
 */
interface ThreadWrapper {
  /**
   * 启动线程
   */
  start(): void;

    /**
     * 等待线程任务完成
     * @throws InterruptedException 如果等待过程中线程被中断
     */
    join(): void;

    /**
     * 等待线程任务完成，最多等待指定的毫秒数
     * @param millis 最多等待的毫秒数
     * @throws InterruptedException 如果等待过程中线程被中断
     */
    join(millis: number): void;

    /**
     * 中断线程
     */
    interrupt(): void;

    /**
     * 检查线程是否存活
     * @returns 如果线程正在运行返回true，否则返回false
     */
    isAlive(): boolean;

    /**
     * 检查线程是否被中断
     * @returns 如果线程被中断返回true，否则返回false
     */
    isInterrupted(): boolean;

    /**
     * 设置线程名称
     * @param name 线程名称
     */
    setName(name: string): void;

    /**
     * 获取线程名称
     * @returns 线程名称
     */
    getName(): string;

    /**
     * 设置线程优先级
     * @param priority 线程优先级（1-10），数字越大优先级越高
     */
    setPriority(priority: number): void;

    /**
     * 获取线程优先级
     * @returns 线程优先级（1-10）
     */
    getPriority(): number;

    /**
     * 获取底层的Java Thread对象（通常不需要使用）
     * @returns Java Thread对象
     */
    getThread(): any;
}

export { };

