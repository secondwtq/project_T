静态变量的初始化可以保证是线程安全的。

最小化共享可变状态（Actor 等高级模型），使用消息，提供合适的接口，控制锁的粒度，使用锁结构来避免死锁，注意异常安全性。

最小化耦合，不要有太多共享数据和线程间通信。避免用锁，换成对象+消息队列。

在内存结构之间传递数据很蛋疼，慢还会碰到伪共享等问题。

线程池（用 Intel TBB 等轮子），线程负载均衡，自定义 allocator 以避免 malloc 性能问题（并行 malloc，每个线程有自己的堆，别管太多全局堆）

std::call_once

    template< class Callable, class... Args >
    void call_once( std::once_flag& flag, Callable&& f, Args&&... args );
    
其 helper 结构 std::once_flag，不可拷贝/复制。

全部定义在 <mutex> 中。在多个线程中对同一个 once_flag 调用 call_once 时，只有一个会执行，具体哪个并没有定义，在函数返回之前所有 call_once 都会阻塞，而如果函数抛出异常则会传播给调用者，同时选择并执行另一个函数。有时比 mutex 要快。

std::future

    template<class T> class future;
    template<class T> class future<T&>;
    template<> class future<void>;
    
    template<class Function, class... Args>
    std::future<typename std::result_of<typename decay<F>::type(typename decay<Args>::type...)>::type>
        async(Function&& f, Args&&... args);
    template<class Function, class... Args>
    std::future<typename std::result_of<typename decay<F>::type(typename decay<Args>::type...)>::type>
        async(std::launch policy, Function&& f, Args&&... args);
        
    enum class launch /* unspecified */ {
        async =    /* unspecified */,
        deferred = /* unspecified */,
        /* implementation-defined */
    }; // (bitmask)
    
    enum class future_status {
        ready,  // 已准备好
        timeout,  // 在规定的时间内并未准备好
        deferred // 惰性求值，尚未进行
    };
    
std::launch::async 在新线程中异步执行，std::launch::deferred 惰性求值（需要时才计算，当前线程中同步执行）。全部设置时行为由实现决定选择哪一个，一个都没有时未定义。

    void std::future::wait() const;
    
    bool std::future::valid() const;
    
    T(&)/void std::future::get();  // 调用 wait 等待并取值, 将 valid 设为 false, valid 为 false 时调用行为未定义
    
    template<class Rep, class Period>
    std::future_status std::future::wait_for(const std::chrono::duration<Rep,Period>& timeout_duration) const;

    template<class Clock, class Duration>
    std::future_status wait_until(const std::chrono::time_point<Clock,Duration>& timeout_time) const;
    
    std::shared_future<T> std::future::share(); // 调用后原来 future 的 valid 为 false
    
    template<class R, class ...Args> class packaged_task<R(Args...)>;
    
    std::future<R> std::packaged_task::get_future(); // 对每个 packaged_task 仅可调用一次
    
    void std::packaged_task::reset();
    
    void std::packaged_task::operator()(ArgTypes... args);
    
用于包装 callable 对象及其返回值。

    template<class T> class promise;
    template<class T> class promise<T&>;
    template<> class promise<void>;
    
    std::future<R> std::future::get_future();
    
    void std::future::set_value((const) R& value );
    void std::future::set_value( R&& value );
    void std::future::set_value();
    
    void std::future::set_exception(std::exception_ptr p); // atomic