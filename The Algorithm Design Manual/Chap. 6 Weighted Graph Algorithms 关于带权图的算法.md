##Chap. 6 Weighted Graph Algorithms 关于带权图的算法##

---

**Chap. 5** 中所讲的数据结构和遍历算法是图操作的基础，这些算法都是针对无权图的。带权图的世界与之大不相同，比如：无权图中的最短途径问题，BFS 就可解决，带权图则要复杂很多，但是其应用同样也更为广泛。当然 Chap. 5 中的算法对带权图还是基本适用的，本章中我们会明确其适用范围等问题，并会介绍最小生成树 MST、最短路径、最大流量等若干较复杂的算法，需要注意的是，它们大多属于优化问题。

本章中我们使用邻接表作为数据结构，entry 是链表的数组，每一个节点（`edgenode`）包含其终点索引，权值和 `next` 三个字段。

###6.1 最小生成树 MST###

对于图 G = (V, E) 的一个生成树（spanning tree），是指构成一个连接所有顶点 V 的边 E 的子集。MST 即是指总权值最小的生成树，特定图的最小生成树可能不唯一（如果所有边权值不相等，则 MST 唯一。对于无权图来说所有生成树都是 MST）。MST 可解决用最少量的路/线/管道连接若干城市/房子/岔路等问题。其他应用在 **Section 15.3** 中介绍。

本章介绍的 MST 算法着重体现了贪心启发的最优特性。

####6.1.1 Prim 算法####

Prim 算法从某个特定点开始，向周围生长直到覆盖所有点。Prim 算法是贪心算法，其生长方式是寻找当前树外围边中权值最小的边加入树中（即局部最小值）。Prim 算法的正确性可以反证法证明，假定存在图 G，对其运行 Prim 算法结果并非 MST，意味着在构造树中的某一步出现了问题 blablabla。并且由于当前树外围的边端点之一并不在树中，因此不会出现循环。

TODO: 实现

Prim 算法的效率取决于其数据结构。理论上来说是 O(mn) 的（n 次迭代，每次测试大概 m 个边）。我们改进的实现则并不必每次迭代都测试 m 个边，只需要 O(n^2) 时间。这是利用数据结构改善算法性能的栗子。要是再应用优先队列的话，可以再优化到 O(m + nlgn)。

####6.1.2 Kruskal 算法####

Kruskal 算法和 Prim 算法一样是贪心算法，但是它并不从特定的点开始，并且在稀疏图中效率一般更高。Kruskal 算法每次选择权值最小且两个端点并非处于同一集合中的边加入到树中，逐渐建造 conntect component，并连接为 MST。其证明与 Prim 类似。

Kruskal 算法需要 O(mlgm) 时间排序边，之后通过 m 次迭代 DFS/BFS 进行测试，总共 O(mn) 时间。而使用下面要讲的并查集数据结构对测试过程进行优化的话在稀疏图上可以达到 O(mlgm) 的，比 Prim 要快。这依然是数据结构的作用。

####6.1.3 Union-Find 并查集####

TODO

####6.1.4 MST 的衍生####

* **最大生成树**。用于解决电信如何布线的问题，只要把权值取反即可。

    需要注意的是虽然 MST 在负权值情况下可以 work，但是最短路径等算法并不一定是这样子。
    
* **最小积生成树**。lg(a * b) = lg(a) + lg(b)，把权值用对数处理一下即可。

* **最小瓶颈生成树**。最小化所有边权值之和的最大值。当权值代表成本、容量或强度等属性时有一些应用。实际上每个 MST 都满足该条件。

还需要注意有两种问题不能用本章的方法解决：

* **Steiner 树。**允许加入新的点，最小 Steiner 树问题在 **Section 16.10** 中讨论。

* **低度生成树。** 最小化树中度数最大点的度数。最简单的低度生成树是遍历所有点的一条简单路径，称为 Hamiltonian 路径，在 **Section 16.5** 中。

###6.2 栗子：有且只有“网”###

事情是这样的，我被一个做 PCB 测试的小型公司委托做算法咨询。他们的业务是这样的，在向 PCB 装元件之前，必须确认每个板子上每条该连通的线都是连通的。因此必须逐个测试各个点。在这之中有一个 net 的概念，就是 PCB 中被一层金属完全连接起来的若干点，实际上输入的就只有 net 的信息。他们使用一个两臂的机器，一个臂按住某个点，然后把各个点从左到右排序，用另一个臂照着 net 逐个测试连通性。

我立刻联想到了 Traveling Salesman Problem (TSP)，问题是这样的，给定某某集合的点，求遍历一遍时间最短情况下的顺序。对于较小的网来说，穷举可找出最优解，对于较大的网，可以利用启发接近最优解，该问题具体在 **Section 16.4** 中讨论。

但是实际的问题是，原来的过程中，左臂一直呆着，右臂一直忙着，而如果能把较大的网分成点数和区域都较小的集合的话，事情会好很多，所以实际上是两边都存在的互相影响的 TSP 问题。这个准确来说是一个聚类问题。MST 可用于聚类（参见 **Section 15.3**），具体方法是找出网的 MST，然后在路径过长的地方打断，这样产生的每两个簇之间共享一个点。

这样还有一个问题，就是把 net 建模为图的问题，我们需要把 net 中每一对点都连起来，定义为 complete graph，其边的权值应为机械臂移动所需时间。但是这个时间又不好算，存在机械臂在不同方向上移动速度是否相同，机械臂的运动是否为匀速运动等问题。在本栗中，机械臂在 x 和 y 方向上速度相同，因此权值应定义为 △x 和 △y 的最大值，这叫 L∞ 度量，不是欧拉距离。实际上机械臂的运动还存在启动和刹车中的加速度的问题，但是就算建模不那么精确，KISS 的话，最后也节省了 30% 左右的运动距离，当然运算量肯定多了一点，但是要知道一台机器比 PC 贵多了，而且如果 PCB 设计固定了，计算只需进行一次就完事了。（TODO 此处插播阿里云广告）

本栗使用经典图算法问题对实际工作进行建模。实际上大多数图的应用都可化归为成熟的图算法，比如 MST，最短路径等。

###6.3 最短路径###

最短路径问题就算在和运输之类的无关的东西中都很有用。对于无权图来说，直接 BFS 就可以解决，但是对于边权值并不全部相等的情况就不行了。就像走 shortcut，路不一定在明面上，而且可能相对麻烦一点，但是多快好（不一定省多少）。本章描述两个带权图的最短路径算法。

####6.3.1 Dijkstra 算法####

Dijkstra 算法和前面的 Prim 算法很相似，它并不寻找从特定点 s 到特定点 t 的最短路径，而是会把从 s 到所有点的最短路径全部计算出来，形成一个以 s 为根的最短路径生成树，并通过回溯 parent 指针构建出来。在 MST 中，我们考虑下一个要加入的边的权值，而在最短路径问题中，我们考虑的是下一个加入的点到根节点 s 的最短路径。实现上应用了 DP 的思想，实际上就算包括一个函数名的更改，我们给出的 Dijkstra 算法实现和 Prim 只差三行。

Dijkstra 算法的效率和一般的 Prim 一样都是 O(n^2)。在存在负权值的边时是无效的，但实际应用中也少有这种情况，针对该问题大多数还是学术上的讨论。

还有一个问题，是权值不在边上定义，而是在节点上定义时，要求经过节点权值之和最小的路径。一种方法是稍微改一下 Dijkstra 算法的实现，然后拿节点的权值当边的权值。但是我个人偏向于不改算法实现，而是想办法重建一个图结构，把点的权值转移到边上，然后直接用原来的算法。类似的战术可以拓展到点和边都定义了权值之类的一系列问题上。

####6.3.2 全最短路径算法####

对于类似的 All-pairs Shortest Path 问题，丑的人用 n 次 Dijkstra 解决，帅的人跑一次 Floyd 就解决了。

Floyd 算法相对更适合于邻接矩阵数据结构（这种图算法很少），我们就暂且 将就 一下。但是这里引出一个问题，实现邻接矩阵的时候，如何表示图中不存在的边。教科书上面说对于无权图，就是 1 和 0，这是存在歧义的。我们应该把不存在的边设置为 CONNECTION RESET，哦不是 MAXINT，这样不仅能表示边的存在性，算法在跑的时候，可以自动无视掉这种数据。

TODO

Floyd 的渐进复杂度是 O(n^3)，实际并不比 n 次 Dijkstra 解决，但是因为循环紧凑，程序简洁，实际效果要好。

*（注：对于 Shortest Path，个人了解相对是比较多的，此处应该补充 Sedgewick 描述的 Bellman Ford，以及 A\* 等 TODO）*

####6.3.3 传递闭包####

Floyd 算法的另一个重要应用是传递闭包的计算。即分析在有向图中从某一特定点触发可到达哪些点。对于单个点来说可以用遍历解决，但是利用 Floyd 算法可以计算出整个图的数据，即若算法返回的点 i 与 j 之间的最短路径是 MAXINT 的话，你可以认为并不存在这么一条路径。相关的细节出门左转 **Section 15.5**。

一个栗子是 blackmail 图。TODO

###6.4 栗子：用电话打字（当 NLP 碰到算法狂魔）###

我参观过 Periphonics，当时一个顶尖的电话自动应答系统供应商。我和他们探讨这个系统的易用性问题，我认为要达到目的（输入某个代码，或者输入一篇文章），不必每个字母都用两次拨号来表示，他们不以为然，我回去之后想试试。问题是这样的，我要弄一个自动处理用户在电话上拨号输入文本时，由于拨号键的字母分布导致的二义性问题（实际上是个excited 的 NLP 问题...）。

* 第一次尝试。英语中不同单词的分布是不一样的，我们利用三个*字符* 构成的 trigram 在统计上进行推测，效果较差。trigram 看起来很适合希腊语，却不适合英语。


* 第二次尝试。和一个英语字典相结合，但是实际上相同的数字序列也可能代表若干个正确单词，我们则是先推断出无二义的字符，之后利用 trigram 填充剩下的字符。效果好了一点，但是依然无法直视。

* 第三次尝试。利用字典去匹配输入序列，从 Brown Corpus 中获取单词使用模式和语法信息。之后利用图算法应用到识别过程中。模型是这样的，一个句子实际上是若干个代表单词的符号，每段数字序列又可对应一个单词集，对句子的每一个可能解释可建模为图中的一个路径。

    那么图怎么表示呢？句子自身单词数的限制如何体现呢？每一个单独的词都是一个节点，对相邻单词的每一个不同选择都表现为一个边。这样整个图的最短路径就是最优解。就还剩一个问题，权值怎么定义，作者撂下一句话，你觉得应该怎么定义，就怎么定义...

整个系统分若干部分，对输入进行空白符识别，之后根据数字序列段构造出可能的候选单词列表，然后进行去二义化并输出。尽管我们依然有一些错误，不过系统的效果很不错，并且可用于许多应用，并且被 Periphonics 采用了。

许多模式识别问题中的约束都可以建模为图最短路径问题。并且针对 NLP，还有一个专用的 DP 算法名叫 ***Viterbi*** 来解决这些问题。实际上 Viterbi 算法就是解决 DAG 中的最短路径问题。