##享元模式##
---
####游戏编程模式 - 重温 设计模式####

这差不多是游戏开发者世外桃源般的想像，而这样的场景可以借助一个并不起眼的模式成为现实：享元模式。

###党和国家鼓励多植树###

我可以只用几句话描绘出一片森林，但是在游戏中实现起来就没那么容易了，你在屏幕上看到的是满屏的树木，而图形程序员则要考虑如何把数百万的多边形塞进 GPU 中。

请注意这森林是由上千个树木组成的，而每个树木都需要上千个多边形。就算你有足够的存储空间，在渲染的时候，你还需要足够的带宽让数据从 CPU 传送到 GPU。

一般来说，每一棵树都包含以下的数据：

* 一个定义树干、树枝、树冠形状的多边形网格。
* 树皮与树叶的贴图。
* 个体在森林中的位置和朝向
* 大小和色彩等其他个性化的参数。

以代码的形式可以表示为下面这样：

    class Tree {
        private:
            Mesh mesh_;
            Texture bark_;
            Vector position_;
            double height_;
            double thickness_;
            Color barkTint_;
            Color leafTint_;
    };
    
可以看到实际的数据量还是不小的，尤其是模型和贴图部分。如果把它做成一个森林，其数据量将超过 GPU 在一帧的渲染时间中能够承受的极限。但是我们也发明了若干解决该问题的小伎俩。

我们把原来的树木对象分为两部分，第一部分负责存储大量树木所共有的以部分内容，并且放到另外一个类中：

    class TreeModel {
        private:
            Mesh mesh_;
            Texture bark_;
            Texture leaves_;
    };
    
游戏只需少量该类的实例——因为显然没必要在内存中存储大量重复的模型和贴图。这样，每一个树木对象都存储一个共享的 TreeModel 对象的引用：

    class Tree {
        private:
            TreeModel *model_;
            
            Vector position_;
            double height_;
            double thickness_;
            Color barkTint_;
            Color leafTint_;
    };
    
_这种做法表面上很像___类型对象模式___：它们都在较多的实例中包含了对其他对象的共享部分。但是这两种应用的意图是不同的。_

_类型对象模式的目标是通过把类型提升到你自己的对象模型内的方式来减少需要定义的类数目，而空间上的节约是只是一种附带品。应用享元模式则是纯粹的为了空间上的效率。_

对于在内存中存储的数据，这么做很有效，但是到目前为止，还对渲染没有作用。为了完成渲染，这些数据依然需要像之前一样被传送到 GPU。我们需要把资源共享的目的以 GPU 能够理解的形式表达出来。

###少生孩子多种树###

为了达到优化渲染过程的目的，我们需要想办法让数据中的共享部分——也就是 TreeModel，只传送一次，之后针对每个树所具有的不同的个体属性，位置，颜色，大小等分别传送。最后告诉 GPU：使用一个模型，渲染多个实例。

现在的图形硬件和 API 一般都支持这种做法。本书不详细探讨其细节，不过 Direct3D 和 OpenGL 两大图形 API 都支持了相关的___实例几何体___功能。


在这种 API 中，你需要传入两个数据流，第一个包含了少量将被渲染多次的数据，即本例中的模型和贴图。第二个包含了几何体实例及其相关参数的列表。这样整个森林可以在一个 drawcall 内被绘制出来。

_有趣的是，这相当于硬件直接支持了我们的享元模式，也许该模式是原书中唯一被硬件实际支持的设计模式。_

###享元模式###

在理解了上面的具体例子之后，我想你也应该明白享元模式的用处了。正如它的英文名（Flyweight）所言，它是一种使对象变得轻量级（lightweight）的设计模式，一般下适用于有大量同类对象的情况。

在有了现代的实例几何体支持的基础上，存储和渲染大量物体的性能获得了极大的提升。但是其核心思想是没有改变的。

享元模式解决问题的手段，就是把一个对象的数据分为两类——一类是受实例限制较小的公共部分，原书称为“固有部分”，不过我更喜欢称为“上下文无关部分”，在这里即为我们的树木模型和贴图。另一部分是“外在部分”，即在不同的实例之间差别很大的数据，在这里指树木的位置，大小和颜色。对于不同的对象，享元模式使其共享同一个固有部分，来达到节约存储空间的目的。

不过上面的例子仅仅是简单的资源共享而已，还不足以称为一种“设计模式”。某种程度上，这是因为对于本例的对象，我们可以很容易的分辨出其共享的部分，即 TreeModel 对象。

然而我发现，享元模式用在一些难以明确分辨共享对象的情况下的时候就不是那么明显了，但是更为巧妙。看起来就像是同一个对象同时处在不同的位置，我们举出另一个例子。

我们不仅仅需要做出树木，还需要做出树木生长所需要的地面。地表上可以有各种各样的元素：草地，泥土，山丘，湖泊，河流等等。我们使用传统的地块方式制作地面：以小地块构成的大网格作为地表，每一个地块上有某种特定类型的地形。

而每一种地形都有一些能够影响游戏逻辑的行为，在此举出一些例子：

* 一个移动速度因子，代表玩家能以多快的速度移动。
* 一个代表船只能不能穿越该地块的水面标志。
* 一个用来渲染的贴图。

在我们深究效率问题之前，我们首先要考虑把这些数据都塞进每一个地块的可行性。一般来说不鼓励这么做_（和上面的森林是一样的道理）_，一个替代方案是定义一个代表地形类型的枚举：

    enum Terrain {
        TERRAIN_GRASS,
        TERRAIN_HILL,
        TERRAIL_RIVER,
        //  blablabla...
    };

然后维护一张地形块的网格：

    class World {
        private:
            Terrain tiles_[WIDTH][HEIGHT];
    };
     
_注意我在这里使用了一个连续数组来存储 2D 网格。这种手段在 C/C++ 中是非常有效的，因为它把所有的数据打包在了一起。而在 Java 等不直接面向内存的语言中，使用这种方式将会得到一个包含列引用的行数组，导致实际的效率也不不如你想像的高。_

_但是无论如何，你都应该使用一个 2D 网格数据结构来隐藏实现的细节，我在这里这么写仅仅是为了简单。_

在这种情况下，应该这样利用某个地块的相关数据：

    int World::getMovementCost(int x, int y) {
        switch (tiles_[x][y]) {
            case TERRAIN_GRASS: return 1;
            case TERRAIN_HILL: return 3;
            case TERRAIN_RIVER: return 2;
            //  Other terrains...
        }
    }
    
    bool World::isWater(int x, int y) {
        switch (tiles_[x][y]) {
            case TERRAIN_GRASS: return false;
            case TERRAIN_HILL: return false;
            case TERRAIN_RIVER: return true;
            //  Other terrains...
        }
    }
    
你或许知道我是什么意思了，但是别急，这么做的确行得通，但是很明显不够优雅。并且，速度因子等本应是地形的数据，然而在这里它被嵌入到代码中了；另外，同一种地形的数据被分散到了不同的方法中，而我们最好让它们是被封装在一起。
 
这一切的前提是，我们首先需要有一个地形类：

    class Terrain {
        public:
            Terrain(int movementCost, bool isWater, Texture texture) : movementCost_(movementCost), isWater_(isWater), texture_(texture) { }
            
            int getMovementCost() const { return movementCost_; }
            bool isWater() const { return isWater_; }
            const Texture& getTexture() const { return texture_; }
            
        private:
            int movementCost_;
            bool isWater_;
            Texture texture_;
    };
    
_你应该注意到了，所有的方法都是 const 的，这是有特殊意义的。同一个对象可能被用在多个上下文中，如果它可以被更改，按就意味着可能会同时在多个地方被更改。_

_上面的实现可能和你的想像有所出入。共享对象是一种用来节约内存的优化手段，它并不改变程序的外在行为，享元对象几乎全部是无法改变的。_

但是我们并不必为游戏世界中的每一个地块的存储付出代价。如果你仔细观察上面的实现，就会发现其中并没有定义地块_位置_的地方。用享元的术语来解释，这个地形状态是“上下文无关”的，也就是“固有”的。

这样我们只需要为每一种类型的地形创建一个地形类就可以了，之后把原来存储地形类型枚举的网格，替换为存储地形对象指针的网格。

    class World {
        private:
            Terrain *tiles_[WIDTH][HEIGHT];
            
            //  Other stuff...
    };
    
同一类地形的地块都将指向同一个地形类的实例。

这些实例会在许多地方用到，所以在进行生命周期管理时可能有些麻烦，但是我们可以不使用动态分配的手段，而直接把它们存储在 World 中。

    class World {
        public:
            World() : grassTerrain_(1, false, GRASS_TEXTURE),
                        hillTerrain_(3, false, HILL_TEXTURE),
                        riverTerrain_(2, true, RIVER_TEXTURE) { }
        
        private:
            Terrain grassTerrain_;
            Terrain hillTerrain_;
            Terrain riverTerrain_;
            
            //  Other stuff...
    };
    
之后我们使用以下的方法来绘制地形：

    void World::generateTerrain() {
        // Fill the ground with grass.
        for (int x = 0; x < WIDTH; x++)
            for (int y = 0; y < HEIGHT; y++)
                if (random(10) == 0)
                    tiles_[x][y] = &hillTerrain_;
                else
                    tiles_[x][y] = &grassTerrain_;
        
        // Lay a river;
        int x = random(WIDTH);
        for (int y = 0; y < HEIGHT; y++)
            tiles_[x][y] = &riverTerrian_;        
    }
    
_关于这个算法，不要在意它的细节。_

我们可以不在 World 对象中定义访问地形属性的函数，而是直接暴露出 Terrain 对象：

    const Terrain& World::getTile(int x, int y) const { return *tiles_[x][y]; }

这样 World 对象就和所有的细节脱离了，如果你想利用地块的属性，直接调用相关函数即可：

    int cost = world.getTile(2, 3).getMovementCost();

我们现在有了更加直观的接口，并且几乎没有付出任何额外的开销——枚举并不比指针更高效。

###它的性能怎样###

我使用“几乎”这一个词，是因为优化狂们肯定明白指针和枚举的区别，使用指针来引用地形会引入间接寻址。在获得地形信息的过程中，你必须首先通过指针找到地形对象，再获取相关的属性，指针的引入可能会引发 cache miss，从而导致性能的下降。

_关于指针和 cache miss 的更多信息，参考___数据本地性___一节。_

优化的原则是优先 profile。用单纯粗暴的理由来解释游戏性能问题，对于现代的计算机硬件来说太过简单了。在本章我进行的测试中，使用享元并不比枚举更慢，这很大程度上取决于数据在内存中如何放置。

享元模式是对面向对象范型高内存开销的一种弥补，如果你纠结与枚举和各种分支选择之中，可以试试使用一个设计模式。如果你担心性能会出问题的话，可以尝试通过 profile 来进行调整。

###其他###

* 在地形块的例子中，我们仅仅是简单地创建了几种地形对象的实例，并且直接存储在了 World 对象中。这么做的好处是容易寻找和重用，但是很多时候，预先将这些全部定义好或许不是你想要的。如果你不能预测你究竟需要哪些地块，你最好还是采用动态创建的方式。为了达到共享的目的，你可以在每次创建时检查是否已经创建了该类型的地块，如果已经创建了就直接返回一个实例引用。这样做的前提是需要使用一些特殊的接口包装构建过程，例如___工厂方法模式___。为了能够找到相应的享元，你还需要维护一个已实例化物体池，这里又可以使用___物体池___。

* 当使用___状态模式___时，你可能经常会遇到和特定的状态机关系不是很大的状态对象，其本身的数据和方法已经足够使用了。在这种情况下，你可以使用享元模式，在多个状态机中重用同一个状态实例。