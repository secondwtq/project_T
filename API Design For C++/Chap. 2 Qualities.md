## 优秀 API 的特征

简单来说，精巧实用，好用，易于集成，最好“润物细无声”。而本章从 more exactly 的角度**概述**优秀 API 的特征，设计的基本准则以及需要避免的糟糕设计。大多是语言无关的。

### 2.1 问题域建模

API 应该对其解决的问题提供良好的逻辑抽象，着重于深层概念而非实现细节，操作应合乎逻辑并共属统一单元，每个类都应该有中心并且能够通过名称和操作体现出来。

非技术人员也能理解其概念和机制，这是坠好的。需要注意的是对于统一问题的 approach 不是唯一的。但是最后的 API 体系都应该是一致且合理的。

API 需要对问题域的关键对象建模。确定主要对象，其提供的操作及对象之间的关系。要考虑需求变化，通用性和灵活性但不要过于极端（最小完备性）。

栗子是使用 UML 描述的地址簿模型。其中有一些需要注意的：

每个人可能会有多个地址和电话号码，可以将其作为属性一个个添加到 `Person` 类中，但是更优雅的方式是专门建立 `Address` 和 `TelephoneNumber` 对象，并允许 `Person` 包含多个该种对象。多个 `Person` 可能有相同的名称，这时可以改用 UUID。

### 2.2 隐藏实现细节

内部实现细节必须对客户隐藏。原因之一是那些被称为内部实现细节的东西，很可能发生变化。隐藏分为两种：用户无法获得私有代码的物理隐藏，和基于语言特性限制用户访问的逻辑隐藏。

* 利用声明实现物理隐藏。header 应该只提供声明，只向用户暴露必要的东西。内部细节分离放在 .cxx 中。

	避免 inline：inline 暴露实现，并且将代码直接内联到客户程序中。但某些情况（模板等）例外。

* 利用封装实现逻辑隐藏。不要对用户过于友善，用户往往不遵循 API 约束。因此应该避免提供内部的 hook（栗子：CS 中的 wallhack）。

	C++ 提供了 `public`，`private` 及 `protected` 访问控制标签，其他语言可能有所不同，如 Smalltalk 中实例变量全部为 private，方法全部为 protected。Java 提供了 `package private` （对应的 C++ 特性为 `friend`）。

* no 公有成员变量，而是使用 accessor。理由无非是要向前看。属于内部细节的成员变量不应出现在公有接口中。并且 protected 其实和 public 并没有什么区别。关于性能问题，自己去 profile，适当使用 inline。

	成员变量私有化的好处有以下几个：

	可以进行 validation，利于访问控制和维持内部一致性，利于惰性求值和 cache，debug，允许额外操作和 changed 通知，方便达成线程安全等，最重要的：

	代码改得比谁都快。

* 属于内部细节的方法，也不应该出现在接口中。**类应该定义做什么而不是如何做。**然而如果只是设置为 private，依然要出现在头文件中，同时也构成了对其他头文件的依赖。可以使用 **Pimpl 惯用法**，或将私有方法作为 .cxx 中的静态函数定义（但是这样无法访问私有成员）。

* 属于内部细节的类也应该隐藏。并非所有类都要公开。隐藏类可以声明为公有类的私有类，或者将其隐藏进入实现，这样就没头文件的事情了。隐藏类无法从公共接口访问，因此不必一定使用 accessor，有时就是 POD 的。

### 2.3 最小完备性

* 尽量简洁，但不要过分简洁。紧凑的接口更符合用户的思维习惯。如无必要，勿增实体。关键问题之一是 API 的最小化，也会影响以后的进一步开发。

* API 的公有元素属于承诺，其支持贯穿 API 的生命期，添加功能要比移除功能简单。如果不确定是否需要某个接口，就不要添加，类和类的公有成员暴露越少越好。易于理解，易于用户使用，易于调试。

* 工程师可能更喜欢通用性和灵活性，会自发增加抽象。但是该种层次的通用性可能永远不会用到，并且届时可能已经得出了更好地方案，并且简单 API 更容易添加新功能。

* 添加虚函数也要谨慎。你需要考虑的问题有：

	脆弱基类问题，影响以后对基类的升级。重写函数可能破坏内部一致性，客户往往不遵循你的约束，而你的约束有时与客户需求相冲突。技术问题有可以忽略的时间开销，可以忽略的 vptr 空间开销，ABI 兼容性，放弃 inline 的代价，难以重载（派生类中的符号会隐藏基类所有同名符号）。

	虚函数应该是私有的，接口应该是非虚的，适当情况下使用 Template Method，被叫做非虚拟接口惯用法。要构建安全的虚接口，你需要注意编写文档，说明关系和约束，同时按照 C++ 的限制，记得定义一个虚析构函数，不要在构造和析构函数里面调用虚函数。

### 2.4 易用性

API 应使简单的任务更简单，在不需要文档的情况下，客户仅通过 API 本身就能了解 usage。

类似于最小化：简单，易于理解。应该符合最小惊奇原则，尽量使用现有的模型。也需要考虑 pro 用户对复杂功能的的需求，但前提是 API 能使简单的任务更简单。

文档依然必要，但易用的 API 有利于编写文档。注意 sample 的重要性。

* 可发现性。用户不需要参阅任何解释和文档，能通过 API 自身明白如何使用。利于初学者，但不一定对 pro 用户友好，但一般来说有利于易用性。尤其注意命名，给出清晰、描述性强的名字，不要使用缩略语（使用的话就会导致有时使用缩略语，有时不使用的不一致）。

* 不易误用。栗子：Effective C++ 中描述过的，`Date` 对象的年月日参数问题。`enum` 比 `int` 更具约束性，避免 `bool` 参数，确保每个参数都有唯一类型。对于复杂情况可以引入新类，这样还可以进行 validation，可以添加静态函数以达到类似 `enum` 的效果。这也有利于增加用户代码的自描述性：
	
		result = findString(text, FORWARD, CASE_INSENITIVE);
		Date birthday(Year(1996), Month::Dec(), Day(8));

* 一致性。包括各个方面：命名约定，参数顺序，设计模式采用，内存模型语义，错误处理等。在函数层面，命名约定：使用相同词语表达相同概念，不要出现 begin/end 与 start/finish 并存的状态，避免缩略。方法签名一致，对于类似的参数列表，应提供类似的参数顺序。在类层面，相似角色的类应提供相似的接口，适当使用公共基类和多态，考虑静态多态（确定类之间的公共概念，并且使用相同的惯用法保证一致性），考虑模板。使用习惯的模式和标准、统一的平台原语。简化用户学习过程的 API（可以参考现有、流行的 API）。

	栗子：标准库。bcopy & strncpy，calloc & malloc，read/write & fgets/fputs。STL size()，iterator。

* 正交性。方法没有副作用，代码影响范围是局部并且有边界的。有助于预测和理解 API 行为，易于开发、测试、调试、修改。注意减少冗余，相同信息只用一种形式表示；增加独立性，暴露的概念充分分解，没有重叠。

	另一种正交性：不同的操作通用于不同数据类型。栗子：编程语言和 CPU 指令集。

* 资源分配。指针的老毛病，包括 nullptr、二次释放、访问非法内存、内存分配器混用、错误释放数组和内存泄露等。解决方案：托管指针，包括共享指针、弱指针和作用域指针等。返回需要客户管理的指针，或预计生命周期比对象生命周期更长，则返回智能指针，而若返回对象所有权由对象持有，则可返回普通指针。

	内存管理仅仅是资源管理的一个方面。其他资源包括锁、文件等。RAII 是好工具。如果你的 API 提供了资源，考虑提供一个 Helper 类（以及公有 release()）方法来管理。

* 平台独立。公共头文件中永远不该出现平台相关的条件编译语句，API 不应因平台而异，不应暴露平台的细节，而应该仅给出高层逻辑模型。栗子：部分平台不具备 GPS 功能，与其让用户利用条件编译判断是否具有该功能，不如将接口全部暴露，但是加入 hasGPS() 方法供判定。优雅，有利于扩展。

### 2.5 松耦合

高内聚，低耦合。

耦合的度量：尺度（类、方法、参数数目），可见度（组件之间连接的显著程度），密切度（组件之间连接的直接/间接性），灵活度（改变组件之间连接的难易度）。避免依赖循环。

* 多使用**前置声明**，这样类之间就仅仅通过名字耦合了。尽量少将完整声明 include 进来。

* 相对于成员函数优先使用**非成员/友元函数**。避免了函数与类的耦合，同时促成最小完备。只有访问私有成员的核心函数进入类内部，其他的以 *Helper* 的形式存在于单独的类/命名空间中。并且为了说明概念关联性，将其与类声明在名称联系/同一个命名空间下的命名空间/帮助类中，但应定义在独立的模块中。

* 必要时**刻意添加冗余**。优秀的软件工程实践致力于减少冗余，*每个重要的点/行为有且只有一次实现*。但是代码复用会导致耦合。特定情况：两个相互依赖的大型组件，只使用了对方的很小功能，可以考虑复制代码。注意应谨慎使用，并且添加注释。

* 可以使用管理器类协调**若干**低层类，打破依赖关系。这样用户只依赖于少数管理器类，管理器类再依赖于低层类，同时易于扩展。栗子：用户类，输入管理器和鼠标、摇杆等多种输入源。

* 对于事件发生时通知其他类的问题，考虑使用**回调、观察者和通知**。但要考虑一些问题：回调中的重入、生命周期管理，防止重复注册、事件的顺序（Cocoa 使用 will/did 之类很好的解决了这一问题）。注意向用户说明相关约束。

	回调是一个 C approach。其中常见的 data 指针，被称为闭包。可以考虑包括多个回调并轮流调用。但是在面向对象环境下的非静态回调略显复杂（考虑使用 bind/functor 等）。观察者通过调用观察者的方法来通知观察者，参见第 3 章。

	通知则在系统中不连通的部分构建集中发送通知机制和事件，其中，发送者事先并不知道接收者。典型栗子是源于 Qt 的 singal/slot（boost 有引入）。当信号发出时，所有对应槽都会被调用。

### 2.6 稳定 文档 测试

API 应该具有前瞻性。

API 应该保持稳定：可以改变，但接口应该版本化，并保持向后兼容。

API 应该有明确的文档支持。

应该为 API 编写可扩展的自动化测试。

详细内容此处按下不表。