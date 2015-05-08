module Shapes {
	export module Polygons {
		export class Triangle { }
		export class Square { }
	}
}
// @ Python import $name as $name
// use 'import' to define alias for module
// 	used for modules, types, namespaces
//	but be careful when using this with values
import polygons = Shapes.Polygons;
var sq = new polygons.Square();