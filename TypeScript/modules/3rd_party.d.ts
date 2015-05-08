// ambient internal modules
// you do not need to define implementation
// when working with 3rd-parties
// use .d.ts for these definitions
// @ C extern

// use 'declare' keyword for it
declare module D3 {
	export interface Selectors {
		select : { 
			(selector : string) : Selection;
			(element : EventTarget) : Selection;
		};
	}
	
	export interface Event {
		x : number; y : number; }
		
	export interface Base extends Selectors {
		event : Event; }
}

declare var d3 : D3.Base;