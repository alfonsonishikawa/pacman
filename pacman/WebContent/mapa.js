
function Mapa() {

this.mapa = [
"............",
".#.###.####.",
"............",
"###.#####.#.",
"#.....#.....",
"#.###...###.",
"......#####.",
".##.#.......",
"....#######.",
] ;

	this.tamanoTile=50 ;
	this.c = null ;
	this.alto = this.mapa.length ;
	this.ancho = this.mapa[0].length ;
	
	this.setContext = function(context) {
		this.c = context ;
	} ;
	
	this.getTile = function(x,y) {
		var mapa = this.mapa ;
		var arriba = "0" ;
		var abajo = "0" ;
		var derecha = "0" ;
		var izquierda = "0" ;
		
		console.debug("("+x+ ","+y+") = " + mapa[y].charAt(x)) ;
		if (mapa[y].charAt(x) == '#') return null ;
		
		if (y>0) {
			if (mapa[y-1].charAt(x)=='.') arriba = "1" ;
		}
		if (y<this.alto-1) {
			if (mapa[y+1].charAt(x)=='.') abajo = "1" ;
		}
		if (x>0) {
			if (mapa[y].charAt(x-1)=='.') izquierda = "1" ;
		}
		if (x<this.ancho-1) {
			if (mapa[y].charAt(x+1)=='.') derecha = "1" ;
		}
	
		return "pacman/tile_"+arriba+derecha+abajo+izquierda+".png" ;
	} ;

	this.dibujarMapa = function() {
		var tamanoTile = this.tamanoTile ;
		for (var y=0 ; y<this.alto ; y++) {
			for (var x=0 ; x<this.ancho ; x++) {
				var fileTile = this.getTile(x,y) ;
				
				if (fileTile==null) continue ;
				
				var tile = new Image() ;
				tile.src= fileTile ;
				tile.c = this.c ;
				tile.centroTileX = x*tamanoTile ;
				tile.centroTileY = y*tamanoTile ;
				tile.onload = function() {
					this.c.drawImage(this, this.centroTileX, this.centroTileY) ;
				};
			}
		}
	} ;
}