2015-03-08 EVE

晚上整了不下于三个小时，才把 Epic 在 GitHub 上面公布的 Unreal Engine 4 (以下简称 UE4) 的 repo clone 到本地，学校这网速真的有点...

事先声明，没有任何 Unreal 的***基础***，暂时也不打算去学，纯属随便看看捡有用的玩玩。

拖下来之后顺便看了下 log，大概一时半会对这玩意不大习惯，而且他的 commit message 废话有点多，而且不同的人弄上去的很乱，很多一眼看上去不知道是干啥的，总而言之人家就是不习惯了啦

呃，其实第一次让我看代码我是拒绝的，因为你不能让我看，我马上就去看，首先我得看一下目录结构...

(好吧其实就是懒)

* Binaries 文件夹

	里面有一个 `DotNet/GitDependencies.exe` 不知道干毛的，`ThirdParty` 文件夹下面有一个 Mac 的 Mono (貌似吧，不知道能不能用)。
	
	本来纳闷为啥没 Linux 的东西，功夫网了一下：
		
	* [Building On Linux](https://wiki.unrealengine.com/Building_On_Linux)

	* [Linux Support](https://wiki.unrealengine.com/Linux_Support)

	恩，大概意思貌似是，你一定要问我，对 Linux 支持不支持，我们... 他现在是开源的，我们怎么能不支持开源？
	
	事实证明貌似确实支持，只是有一点小问题。而且也有点麻烦，毕竟也要按照基本法来编译嘛。Linux 没有提供现成的 package 大概是想按照选举法，把权力交给 Linux 的 package  manager，去产生。
	
	还有一个问题，就是为啥非要 CLI/Mono 这个 dependency，再没基础的人大概都能想到是跑 C shit 用的，目前我可以确定的大概就是 Build System 里面用了 C shit，别的暂时没找到，不过找到了这些：
	
	* [Mono for Unreal Engine](https://mono-ue.github.io/)

	* [Some UE4 plug. that enable the use of C# (and other CLI lang.) in game projects for Win.](https://github.com/enlight/klawr)

	当然应该不是官方的。根据[之前的情报](http://blog.csdn.net/xoyojank/article/details/28491933)，UE4 已经放弃 Unreal Script，全面转向 C艹。
	
	(我顺便又把这个之前的情报又看了一遍，然后想起了盒子那个蛋疼的玩意，感觉换 pure C艹 写也没啥，但是且不论具体状况，我现在貌似处于 Lua 写的烂，C艹 又不会写的状态... 还不如 C shit，但是太特么啰嗦啊)
	
* Build 文件夹

	我不搞页游，不搞 Android，不搞 iOS blablabla... 然后里面剩一个 BatchFiles 文件夹放着一堆 Batch File 和 .sh，懒得看，***以后再说***。
	
	（顺便吐槽下 Epic 的命名，要我绝对把文件夹名称写成 scripts）
	
* Config 文件夹

	没基础的人都知道是配置文件。
	
	里面一堆 ini，然后里面有些奇怪的内容：
	
	* 这什么 section... 还有别跟 Ares 学啊
	
			BaseScalability.ini

			[AntiAliasingQuality@1]
			r.PostProcessAAQuality=2
			r.MSAA.CompositingSampleCount=1
			
	* 好嘛，section 都开始 Ares 了，还有注意那个 vector 值：

			BaseLightmass.ini

			[DevOptions.StaticLightingMaterial]
			bUseDebugMaterial=False
			ShowMaterialAttribute=None
			; Material export sizes default to very small to keep exports fast
			EmissiveSampleSize=128
			DiffuseSampleSize=128
			SpecularSampleSize=128
			TransmissionSampleSize=256
			NormalSampleSize=256
			; Terrain materials default to much higher resolution since each material typically covers a large area in world space
			TerrainSampleScalar=4
			DebugDiffuse=(R=0.500000,G=0.500000,B=0.500000)
			EnvironmentColor=(R=0.00000,G=0.00000,B=0.00000)
			

	* 这个 section 更销魂... 另外加号是什么鬼啊！下面那个还自带 associative array 的？
			
			BaseInput.ini
	
			[/Script/Engine.InputSettings]
			bEnableMouseSmoothing=true
			bEnableFOVScaling=true
			FOVScale=0.01111
			DoubleClickTime=0.2f

			DefaultTouchInterface=/Engine/MobileResources/HUD/DefaultVirtualJoysticks.DefaultVirtualJoysticks
			bAlwaysShowTouchInterface=false
			bShowConsoleOnFourFingerTap=true

			+ConsoleKeys=Tilde
			bRequireCtrlToNavigateAutoComplete=False

			;-----------------------------------------------------------------------------------------
			; Axis properties
			;-----------------------------------------------------------------------------------------

			+AxisConfig=(AxisKeyName="Gamepad_LeftX",AxisProperties=(DeadZone=0.25,Exponent=1.f,Sensitivity=1.f))
			+AxisConfig=(AxisKeyName="Gamepad_LeftY",AxisProperties=(DeadZone=0.25,Exponent=1.f,Sensitivity=1.f))
			+AxisConfig=(AxisKeyName="Gamepad_RightX",AxisProperties=(DeadZone=0.25,Exponent=1.f,Sensitivity=1.f))
			+AxisConfig=(AxisKeyName="Gamepad_RightY",AxisProperties=(DeadZone=0.25,Exponent=1.f,Sensitivity=1.f))
			+AxisConfig=(AxisKeyName="MouseX",AxisProperties=(DeadZone=0.f,Exponent=1.f,Sensitivity=0.07f))
			+AxisConfig=(AxisKeyName="MouseY",AxisProperties=(DeadZone=0.f,Exponent=1.f,Sensitivity=0.07f))

	各平台都有一小点额外的 config，l10n 有一个文件夹的 ini，暂时并不能看懂。
	
	几个 ini 基本属于要么特别小，要么特别大的类型，说明两点，一个 UE 的设置很详细，另一个是 UE 的语法很啰嗦...
	
	还有一个蛋疼的文件叫 `controller.vdf`，现摘抄其段落如下：
	
		"pads"
		{
			"left_stick_up"		""
			"left_stick_right"	""
			
			...
			
			"right_click"		""

			// Extra descriptions for pads as a whole rather than just individual directions
			pad_rollup_descriptions
			{
				"left_pad"	"Movement"
				"right_pad"	"Look"
			}
		}
		
	这 Lua，JSON，C (Ruby?) 混合的语法是什么鬼啊！

* Extras 文件夹

	两套插件，一个 py 写的 Maya_AnimationRiggingTools（源码），还有一套 VisualStudioSnippets，大概是类似 cocosx 在 Sublime 之下的存在。俩玩意暂时都没条件用也不想用。

* Programs 文件夹

	这个文件夹里面没什么东西貌似，是 UE 的几个组件的 Config：
	
	* Shader Compile Worker. 参见 [Shader Development](https://docs.unrealengine.com/latest/INT/Programming/Rendering/ShaderDevelopment/index.html).

	* Unreal Frontend. [Unreal Frontend](https://docs.unrealengine.com/latest/INT/Engine/Deployment/UnrealFrontend/index.html).

	* Unreal Header Tool. 一时半会没搜到官方的东西，不过从一个 [slides (Epic’s Build Tools & Infrastructure)](https://de45xmedrsdbp.cloudfront.net/Resources/files/BuildTools-2031748007.pdf) 上面看应该是 Build System 的东西，负责处理中间层。

	* Unreal Lightmass. [Lightmass Global Illumination](https://docs.unrealengine.com/latest/INT/Engine/Rendering/LightingAndShadows/Lightmass/index.html).

* Plugins 文件夹

* Shaders 文件夹

	放着近 200 个 shader，扩展名是 .usf，意思是 Unreal Shader Files，我也懒得一个个看了，而且 Graphic 暂时不是我的重点，具体还是先看 [Shader Development](https://docs.unrealengine.com/latest/INT/Programming/Rendering/ShaderDevelopment/index.html)。（***这部分大概得以后结合 codebase 做解释***）
	
	顺便，在搜索 codebase 时我平常习惯的 Sublime 自带的 Find in Files 已经有点卡了，ag 勉强够用。
	
* Source 文件夹

	重头戏。这东西一共有快 380 MB，`ThirdParty` 占了 270 MB，其中最大的是 118 MB 的 ICU，老实说这货在我的 Homebrew 里面也占了不少地方，不鸟它。其他的熟悉的有 SDL2，FreeType，Vorbis，zlib，libpng，Box2D，OpenSSL 之类喜闻乐见的东西，不熟悉的还有一大堆。
	
	剩下的有：
	
	* Runtime 文件夹。大概是引擎主要代码。

	* Editor 文件夹。貌似 UE 在 Editor 上也是下了很大功夫。

	* Programs 和 Developer 文件夹，大概是一些 utility。