###Introduction###

1.3.0 版本滋瓷 CPython 2.6 以上版本（不滋瓷 3K），可以使用 numpy 等库。可以使用 IPython 1.0 以上版本。

spark/bin/spark-submit

Resilient Distributed Dataset RDD

可以由程序中已有的数据 parallelize  创建或从 Hadoop InputFormat 的外部源创建（共享文件系统，HDFD，HBase）。

sc.parallelize(data[, partitions])

一般每个 CPU 有 2-4 个 partition（以前也叫 slices）。Spark 会自动设置（貌似效果不怎么样）

RDD from text file and to pickle file

textFile = sc.textFile(filename[, partitions]) # local path, hdfs://, s3n://, URI 按行读取

sc.wholeTextFiles() # 读取包含多个小文本的文件夹并返回 (filename, content) 对，并非按行读取

sc.pickleFile

所有 RDD 的文件输入方法都滋瓷文件夹、压缩包、通配符。对于本地文件，应可在所有节点中以相同路径访问（也就是说你得挨个拷一份）。默认的 partition 按块分（比如 HDFS 中是 64M），partition 数量不可少于块数量。

RDD.saveAsPickleFile

###RDD 操作###

Spark 依赖于函数参数进行操作，一般包括三种形式： lambda，local 函数或全局函数。

允许传入对象实例的方法，方法参数为待处理数据。注意此处传入的 self 和函数中引用的 self 等都会导致整个对象的拷贝。因此需要访问对象中变量时直接拷贝一份做局部变量最好。

大多数 RDD 操作滋瓷任意类型对象，少数只滋瓷键值对（指两个元素的 Python tuple）（如按 key 进行的 shuffle 操作）。

Transformations on RDD:

基于已有数据创建新数据。

Trans. 都是懒惰的，默认情况下只有运行 action 时会计算，也可以 persist/cache。

RDD.filter(func)

RDD.count()

RDD.first()

RDD.map(func) # 每个输入 exactly 一个输出

RDD.flatMap(func[, preserves_partitioning=False]) # func 返回一个序列，长度随便，所有序列被合并为一个集合

RDD.flatMapValues(func)

RDD.aggregate(zero_value, func_seq, func_comb)

RDD.reduceByKey(func[, partitions]) # 对相同 key 的值执行 reduce

RDD.reduceByKeyLocally(func) # 执行完立刻返回为 dict

RDD.groupByKey([parititions]) # 将所有 key 相同的 value 集合为一个列表作为该 key 的 value

RDD.aggregateByKey(zero_value, func_seq, func_comb[, partitions])

RDD.sortByKey([bool ascending], [num_tasks])

RDD.cartesian(other) 返回与另一个 RDD 的笛卡尔积

RDD.collect()

RDD.union/intersection(other_dataset)

RDD.distinct([partitions]) # 去重

RDD.sample(withReplacement, fraction, seed) # 指定比例取样，seed 由随机数生成器生成

RDD.mapPartitions(func) # 对每一个 partition 进行 map，这时 func 的参数和返回值都是集合（迭代器）

RDD.mapPartitionsWithIndex(func) # 额外在第一个位置添加了一个表示 index 的参数

zipWithIndex()

Actions on RDD:

计算之后返回给程序。

RDD.reduce(func)

RDD.persist()

RDD.cache() # 以默认的 MEMORY_ONLY_SER 持久化 RDD

collect() # 返回包括 RDD 中全部元素的列表

collectAsMap() # 将 RDD 键值对以 dict 形式返回

foreach(func)

foreachPartition(func)

first()

take(n)

count() # RDD 中元素数量

countApprox(timeout[, confi=0.95])

countApproxDistinct([relativeSD=0.05])

countByKey/Value()

wordCounts = textFile.flatMap(lambda line: line.split()).map(lambda word: (word, 1)).reduceByKey(lambda a, b: a+b)

其他操作：

setName(name)

checkpoint()

coalesce(partitions[, shuffle=False]) # 返回被分为 n 块的 RDD。

SparkContext RDD.context

###使用 Spark Interactive Shell###

Scala Shell: spark/bin/spark-shell

Python Shell: spark/bin/pyspark

pyspark 实际上使用 spark-submit。

PySpark 中的默认 SparkContext：sc，默认 SQLContext：sqlCtx。

以 IPython (Notebook) 运行 Spark Python Interactive Shell：

PYSPARK_DRIVER_PYTHON=ipython PYSPARK_DRIVER_PYTHON_OPTS="notebook --pylab inline"

###Properties###

spark.executor.memory 1g

###master 语法###

local
local[n]
local[*]

###Write App###

from pyspark import SparkContext, SparkConf
conf = SparkConf().setAppName(appName).setMaster(master)
sc = SparkContext(conf=conf)

一般在本地调试和单元测试时把 master 设置为 local。

sc.parallelize(data[, partition])

    """SimpleApp.py"""
    from pyspark import SparkContext
    
    logFile = "YOUR_SPARK_HOME/README.md"  # Should be some file on your system
    sc = SparkContext("local", "Simple App")
    logData = sc.textFile(logFile).cache()
    
    numAs = logData.filter(lambda s: 'a' in s).count()
    numBs = logData.filter(lambda s: 'b' in s).count()
    
    print "Lines with a: %i, lines with b: %i" % (numAs, numBs)
    
###Spark SQL###

DataFrame 带有 Schema 元信息，更加适合优化。其操作同样是 lazy 的。

Create:

    df = sql_context.load(source="jdbc", url="jdbc:postgresql://server/dbname?user=username&password=passwd", dbtable="schema(public).table")

    users = sql_context.table("users") # Hive table 'users' -> DataFrame

    logs = sql_context.load("s3n://path/to/data.json", "json") # S3 JSON File
    
    clicks = sql_context.load("hdfs://path/to/data.parquet", "parquet") # HDFS Parquet File
    
    comments = sql_context.jdbc("jdbc:mysql://localhost/comments", "user") # JDBC MySQL
    
    # 普通RDD -> DataFrame  
    rdd = sparkContext.textFile("article.txt").flatMap(lambda line: line.split()) \  
                 	.map(lambda word: (word, 1)).reduceByKey(lambda a, b: a + b)
    word_cnt = sql_context.createDataFrame(rdd, ["word", "count"])
    
    # 本地数据类型 -> DataFrame  
    data = [("Alice", 21), ("Bob", 24)]  
    people = sql_context.createDataFrame(data, ["name", "age"])
    
    df = sql_context.createDataFrame(pandasDF) # Pandas DataFrame -> Spark DataFrame (Python 特有)
    
SQL:

    young.registerTempTable("young")  
    sqlContext.sql("SELECT count(*) FROM young")
    
Spark DataFrame DSL:

    young = users.filter(users.age < 21) # 创建一个只包含"年轻"用户的DataFrame
    
    young = users[users.age < 21] # Pandas style syntax
    
    young.select(young.name, young.age + 1) # 将所有人的年龄加1
    
    young.groupBy("gender").count() # 统计年轻用户中各性别人数
    
    young.join(logs, logs.userId == users.userId, "left_outer") # 将所有年轻用户与另一个名为logs的DataFrame联接起来
    
Output/Save:

    # append to Parquet file in HDFS
    young.save(path="hdfs://path/to/data.parquet", source="parquet", mode="append")
    
    # 覆写S3上的JSON文件  
    young.save(path="s3n://path/to/data.json", source="json", mode="append")
    
    # 保存为SQL表  
    young.saveAsTable(tableName="young", source="parquet" mode="overwrite")
    
    pandasDF = young.toPandas() # convert as Pandas DataFrame (Python 特有)  
    
    young.show() # print as table

###BlockManager###

###Cache###

###CheckPoint###

###GraphX###

###MLLib###

Scalable 内置机器学习库。自 Spark 0.9 开始滋瓷 numpy（1.4+），并且可以使用任何的 Hadoop 数据源。MLLib 使用线性代数库 Breeze，同时使用依赖于 gfortran RT 的 jblas。

Initial Example:

    points = spark.textFile("hdfs://...").map(parsePoint)
    model = KMeans.train(points, k=10)
    
* 数据类型。

    向量

    Scala：Vector DenseVector SparseVector Vectors.dense Vectors.sparse
    
    Python：numpy array，Py List，pyspark.mllib.linalg.Vectors.sparse，单列 scipy.csc_matrix
    
    标记点，与一个结果值相关联的向量，用于有监督学习算法，使用 double，可以用于分类（0, 1, 2...）和回归。
    
    Scala: LabeledPoint
    
    Python: pyspark.mllib.regression.LabeledPoint(label, vector)
    
    MLLib 支持 libsvm 文本格式的稀疏训练数据。数据格式与用法：
    
        label index1:value1 index2:value2 ...
        examples = MLUtils.loadLibSVMFile(sc, "data.txt")
        
    矩阵，Spark 滋瓷以列优先的数组存储的密集矩阵。
    
    Scala: Matrix Matrixs DenseMatrix
    
    分布式矩阵，能分布式存储在单个或多个 RDD 中。存储格式的选择很重要，并且转换开销很大。目前实现了三种分布式矩阵。
    
* 基础统计功能

    基础信息：对包含向量的 RDD 中的**列**进行统计。
    
    Scala: Statistics.colStats(RDD[Vector]) MultivariateStatisticalSummary.mean/variance/numNonzeros
    
    Python: Statistics.colStats(RDD[Vector]) .mean() .variance() .numNonzeros()
    
    相关性：pearson（默认） 和 correlation。
    
    Scala: Statistics.corr(RDD[double], RDD[double], "pearson") Statistics.corr(RDD[vector], "pearson")
    
    Python: pyspark.mllib.stat.Statistics.corr
    
    Stratified sampling：用于键值对 RDD。
    
    假设测试：支持对拟合度（输入为向量）和独立性（输入为矩阵）的 Pearson chi-squared 测试。同时也可对标记点 RDD 的独立性测试以进行特征选择。
    
    Scala: Statistics.chiSqTest(Vector/Matrix/RDD[LabeledPoint])
    
    Python: pyspark.mllib.stat.Statistics.chiSqTest(Vector/Matrix/RDD[LabeledPoint])
    
    随机数据生成：适用于随机算法，原型和性能测试。滋瓷从统一分布、标准正太分布和泊松分布生成随机 RDD。生成之后通过 map 变换即可。
    
    Scala: RamdomRDDs.normalRDD(SparkContext, count, partitions)
    
    Python: pyspark.mllib.random.RandomRDDs.uniformRDD(SparkContext, count, partitions)

    
###spark.ml###

Spark 1.2 引入的用来创建和调节机器学习流水线的高级 API。目前处于 Alpha 状态。ml 和 mllib 同步开发。

###Spark Streaming###

###SparkR###
