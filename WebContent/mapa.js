
function Mapa() {

	//t=tunel horizontal
	//p=pacman
	//.=bolita
	//f=fantasma
	//#=muro
	//c=cereza
this.mapa = [
"........#........",
"c##.###.#.###.##c",
".................",
".##.#.#####.#.##.",
"....#...#...#....",
"###.###   ###.###",
"###.#   f   #.###",
"t  .   fff   .  t",
"###.#       #.###",
"###.###   ###.###",
"....#...#...#....",
".##.#.#####.#.##.",
"........p........",
"c##.###.#.###.##c",
"........#........"
] ;

	this.tamanoTile=50 ;
	this.c = null ;
	this.alto = this.mapa.length ;
	this.ancho = this.mapa[0].length ;
	this.anchoPixels = this.tamanoTile * this.ancho ;
	this.altoPixels = this.tamanoTile * this.alto ;
	
	this.setContext = function(context) {
		this.c = context ;
	} ;
	
	this.esCamino = function(x,y) {
		var mapa = this.mapa ;
		if (x == mapa[0].length && mapa[y].charAt(x-1) == 't'
			|| x == -1 && mapa[y].charAt(0) == 't')
		{
			// Saliendo por un túnel
			return true ;
		}
		if (mapa[y].charAt(x) == 't') return true ;
		if (x < 0 || x > mapa[0].length-1) return false ;
		if (y < 0 || y > mapa.length-1) return false ;
		return mapa[y].charAt(x) != '#' ;
	} ;
	
	this.esPacman = function(x,y) {
		return this.mapa[y].charAt(x) == 'p' ;
	} ;
	
	this.esFantasma = function(x,y) {
		return this.mapa[y].charAt(x) == 'f' ;
	} ;
	
	this.getTile = function(x,y) {
		var mapa = this.mapa ;
		var arriba = "0" ;
		var abajo = "0" ;
		var derecha = "0" ;
		var izquierda = "0" ;
		
		//console.debug("("+x+ ","+y+") = " + mapa[y].charAt(x)) ;
		if (mapa[y].charAt(x) == '#') return null ;
		if (mapa[y].charAt(x) == 't') return "tiles/tile_0101.png" ;
		
		if (y>0) {
			if (this.esCamino(x,y-1)) arriba = "1" ;
		}
		if (y<this.alto-1) {
			if (this.esCamino(x,y+1)) abajo = "1" ;
		}
		if (x>0) {
			if (this.esCamino(x-1,y)) izquierda = "1" ;
		}
		if (x<this.ancho-1) {
			if (this.esCamino(x+1,y)) derecha = "1" ;
		}
	
		return "tiles/tile_"+arriba+derecha+abajo+izquierda+".png" ;
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
					if (this.mapa[y].charAt(x) == '.') {
						// TODO Dibujar circulo
					}
				};
			}
		}
	} ;
	
	this.numeroDirecciones = function(x,y) {
		var direcciones=0 ;
		if (this.esCamino(x,y-1)) direcciones++ ;
		if (this.esCamino(x,y+1)) direcciones++ ;
		if (this.esCamino(x+1,y)) direcciones++ ;
		if (this.esCamino(x-1,y-1)) direcciones++ ;
		return direcciones ;
	} ;
	
	this.configurarPacman = function(pacman) {
		var tamanoTile = this.tamanoTile ;
		for (var y=0 ; y<this.alto ; y++) {
			for (var x=0 ; x<this.ancho ; x++) {
				if (this.esPacman(x,y)) {
					pacman.x = x*tamanoTile+25;
					pacman.y = y*tamanoTile+25;
				}
			}
		}
	} ;
	
	this.configurarFantasma = function(fantasma, numeroFantasma) {
		var tamanoTile = this.tamanoTile ;
		for (var y=0 ; y<this.alto ; y++) {
			for (var x=0 ; x<this.ancho ; x++) {
				if (this.esFantasma(x,y)) {
					numeroFantasma-- ;
					if (numeroFantasma == 0) {
						fantasma.x = x*tamanoTile+25;
						fantasma.y = y*tamanoTile+25;
					}
				}
			}
		}
	}
}
