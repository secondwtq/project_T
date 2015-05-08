
// in projects like node.js, there are many modules(external) to import
// you may want to merge their declarations to a single .d.ts file

declare module "url" {
	export interface Url {
		protocol? : string;
		hostname? : string;
		pathname? : string;
	}
	
	export function parse(url_str : string, parse_query_str?, slashes_denote_host?) : Url;
}

declare module "path" {
	export function normalize(p : string) : string;
	export function join(... paths : any[]) : string;
	export var sep : string;
}