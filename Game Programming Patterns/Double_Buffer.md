##双缓冲模式##
---
####游戏编程模式 - 序列模式####

###功能主治###

_让一系列顺序操作看上去像单个操作或者同步操作。_

###适应症###

从本质上来说，计算机是序列化的，计算机的力量来源于将大型的任务分解为可逐个执行的较小操作。而我们的用户一般希望看到所有事情在一步之内同时做完，或者多个任务同步运行。

_实际上随着线程和多核架构的发展，这个定义的适用性正在慢慢缩减，但是就算在多核同时运行时，也只能并行运行少量的操作。_

一个典型的，并且每个游戏引擎都必须面对的例子是渲染。当游戏画出用户所看到的世界时，应该是瞬时完成的，从远处的山脉，到近处的树木，而如果让用户观察到视图由远及近绘制出的过程，那么就不会有产生连贯的世界的概念了。场景必须平滑快速地更新，并即时渲染出一系列的完整画面。

双缓存解决了这个问题，但是要理解它是怎么回事，我们需要先复习一下计算机是如何显示图形的。

####计算机图形大概是怎么一回事####

视频显示器每次绘制一个像素，它从左至右，从上至下扫描没一个像素，当到达右下角时又回到左上角并继续扫描。这个过程是很快的，每秒钟要进行几十次，我们的眼镜难以分辨。对于我们来说那就是一个静态的像素集，也就是图像。

_这些解释都是多少经过一些简化的，如果你对底层硬件有了解的话那就不必阅读这一部分了。_

你可以把它看作是一个小水管在往屏幕上面堆积像素。不同的颜色从水管后面进来，并散布在屏幕上

在大多数的计算机里，解决方案都是将其放到一个_帧缓冲区_里。帧缓冲区是内存中的一个像素数组，每若干个字节代表特定像素的颜色。当水管在屏幕上堆积时会从数组中读取颜色值。

_字节值和颜色之间的具体对应关系是由系统的_像素格式_和_色深_决定的。在现在的大多数游戏终端中，每一个像素都有 32 位，即红、绿、蓝通道，再加上为一些其他目的而保留的 8 位数据。_

这样要想显示图像，我们需要做的就是向帧缓冲区数组中写入数据，所有疯狂的先进图形算法都可以归结为这一点。但是其中存在一个小问题。

我曾经说过计算机是序列化的，如果它在执行我们的渲染代码，那就不应该同时再做其他的事情。大多数情况下这是成立的，但是在我们的程序运行过程中，确实还发生了一些其他的事情。其中之一就是在游戏运行时，视频显示设备将持续读取帧缓冲区，这会给我们造成一些问题。

假设我们希望在屏幕中绘制一个笑脸。我们的程序会遍历帧缓冲区，为像素设置颜色。而我们没有考虑的是，与此同时，视频硬件也在从帧缓冲区中读取数据。所以在我们绘制的过程中，这个笑脸就已经开始显示了，但是读取缓冲区的速度最后会超过我们写入的速度，这样就读取到了我们尚未操作过的像素，造成的结果就是_画面的撕裂_。

_当视频硬件读取帧缓冲区时，像素的绘制也就开始了，_

这就是我们需要双缓冲模式的原因。我们的程序在单个单个地渲染像素，但是我们需要让他们一次性地显示出来。我将以类比的方式解释其工作原理。

####第一幕，场景一####

假设我们的用户在观看一个我们录制的影片，在第一幕结束，第二幕开始的时候，我们需要变换舞台道具，如果我们直接让工作人员拖走原来的东西的话，影片的连贯性就会被打破。所以此时我们就可以调暗灯光，但是这样我们的观众就会知道在搞什么小动作。我们希望在场景之间没有空余的时间。

在受了现实例子的一点启发之后，我们提出了一个巧妙的解决办法，建造两套舞台，有两套灯光，叫做 A 和 B，观众可以看到其中任何一个。第一幕在 A 上演出，同时 B 正在为第二幕做准备。当第一幕结束的时候就把 A 的灯光移到 B 上，第二幕立即开始。

同时我们的工作人员会继续处理未展示的 A，准备演出第三幕。当第二幕结束时，我们把灯光打回 A，并继续演出，利用 B 来准备下一幕。每一次场景的转换只需要改变两个舞台的灯光。而我们的观众也可以获得在场景之间不间断的连续的体验，他们也不会看到工作人员。

####回到图形上####

这就是双缓冲的工作原理，这种在渲染背后隐藏的机制存在于你所见到的每一个游戏上。我们使用两个帧缓冲区，其中一个代表当前帧的，在我们的例子中也就是 A，这也是硬件读取的缓冲区，GPU 可以随意读取它。同时我们的渲染代码正在写入另一个帧缓冲区，这就是被隐藏在后面的 B，当我们的渲染代码完成场景的绘制之后，他会通过交换缓冲区把 B 显示出来，即告知视频硬件从第二个缓冲区，而不是在第一个缓冲区开始读取数据。这样就不会碰到画面撕裂的情况，整个场景一下子就刷新完成了。而同时原来的帧缓冲区依然可用，我们的下一个渲染周期就将在原来的缓冲区中进行。

_不是所有游戏都使用了这样的机制，较老，较简单的环境中，内存受限，相对而言比较复杂。_

###用法用量###

一个有缓存的类会封装一个缓存，即可被修改的一个状态，缓存会以增量的方式修改，而我们希望外部代码看到的是一次性的原子修改。所以我们在类中维护同一缓存的两个实例：一个当前缓存和一个下一步缓存。信息始终从当前缓存中被读取，而写入到下一个缓存中。当变化过程完成时，将会在当前缓存和下一步缓存之间进行一个交换操作，原来的下一步缓存就变成了新的公开可见的当前缓存，而原来的当前缓存则被复用为新的下一步缓存。

###注意事项###

这个模式属于可以很明确的知道什么时候应该使用的那种。如果你的系统没有双缓冲机制的话，那显示出来，或者其行为就能感觉出问题。更确切地说，这个模式在以下几个条件全部成立时比较适用：

* 存在增量修改的状态。

* 这些状态在修改过程中可能被访问。

* 我们需要避免让访问状态的代码看到半成品。

* 我们希望能随时读取状态而不用等待其被重新写入。

###不良反应###

不像其他较大的结构模式，双缓存是在更底层的实现中的。因此它对其他代码的影响更小——游戏的大部分根本与此无关。但是也有一些需要注意的地方。

####交换本身是需要时间的####

双缓冲需要一个_交换_过程，该操作必须是原子的，即保证在交换过程中没有其他代码可以访问被交换的两个状态。通常而言就是一个指针赋值操作之类的东西，但是如果交换所需时间比修改状态的时间都长，那还不如不用双缓冲。

####我们需要有两个缓冲区####

该模式的另一个问题是会增加内存使用，它需要同时在内存中维护两份状态的拷贝。在一些内存紧张的设备上需要谨慎使用。如果受内存限制不能使用双缓冲区，你就需要找其他的办法来确保状态在修改的过程中不会被访问。

###患者现身说法###

####图形之外####

双缓冲所解决的核心问题是：状态在修改过程中被访问。一般来说这有两个最主要的原因，我们已经看过了第一个，也就是图形的例子：状态被其他线程的代码或中断直接访问。

还有另外一个同样很普遍的原因：正在进行修改的代码也访问着其正在修改的状态。这种状况会出现在各种地方，尤其是物理和 AI 这些涉及到对象之间交互的地方，双缓冲区在这里往往也很有用。

####人工不智能####

###药物相互作用###

双缓冲区很直接，我们举出的例子囊括了大部分你可能遇到的情况。而在实现该模式的过程中，会遇到两个最主要的选择：

####如何交换缓存？####

####缓存的粒度该是多少？####

###附录###

你可以在几乎任何一个图形 API 中找到双缓存模式的影子。比如，OpenGL 有 swapBuffers()，Direct3D 有“交换链”，微软的 XNA 框架在 endDraw() 函数中进行了帧缓存的交换。