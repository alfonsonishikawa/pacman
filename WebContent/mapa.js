
function Mapa() {

	//t=tunel horizontal
	//p=pacman
	//.=bolita
	//f=fantasma
	//#=muro
	//e=energia
this.mapa = [
"........#........",
".##.###.#.###.##.",
".................",
".##.#.#####.#.##.",
"....#...#...#....",
"###.### # ###.###",
"###.#       #.###",
"t  .  01s23  .  t",
"###.#       #.###",
"###.### # ###.###",
"....#...#...#....",
".##.#.#####.#.##.",
"........p........",
".##.###.#.###.##.",
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
		if (x < 0 || x > mapa[0].length-1) return false ;
		if (y < 0 || y > mapa.length-1) return false ;
		return mapa[y].charAt(x) != '#' &&
				mapa[y].charAt(x) != 's' &&
				!this.esFantasmaCualquiera(x, y);
	} ;
	
	this.esEnergia = function(x,y) {
		if (x < 0 || x > this.mapa[0].length-1) return false ;
		if (y < 0 || y > this.mapa.length-1) return false ;
		return (this.mapa[y].charAt(x) == 'e') ;
	}
	
	this.esBolita = function(x,y) {
		if (x < 0 || x > this.mapa[0].length-1) return false ;
		if (y < 0 || y > this.mapa.length-1) return false ;
		return (this.mapa[y].charAt(x) == '.') ;
	}
	
	this.comerBolita = function (x,y) {
		if (this.esBolita(x, y)) {
			this.mapa[y] = this.mapa[y].replaceAt(x, ' ') ;
			numBolitas-- ;
		}
	}
	
	this.esPacman = function(x,y) {
		return this.mapa[y].charAt(x) == 'p' ;
	} ;
	
	/**
	 * Dada una coordenada de tile y un número de fantasma (0-3) indica si el tile es
	 * el inicial de dicho fantasma
	 */
	this.esFantasma = function(x, y, numFantasma) {
		return this.mapa[y].charAt(x) == String.fromCharCode('0'.charCodeAt() + numFantasma) ;
	} ;
	
	this.esFantasmaCualquiera = function(x, y) {
		return this.mapa[y].charAt(x) == '0' ||
				this.mapa[y].charAt(x) == '1' ||
				this.mapa[y].charAt(x) == '2' ||
				this.mapa[y].charAt(x) == '3' ;
	}
	
	this.esSalida = function(x, y) {
		return this.mapa[y].charAt(x) == 's' ;
	}
	
	this.esCasaFantasmas = function(x, y) {
		if (x < 0 || x > this.mapa[0].length-1) return false ;
		if (y < 0 || y > this.mapa.length-1) return false ;
		return this.esSalida(x,y) || this.esFantasmaCualquiera(x,y) ;
	}
	
	this.esBordeCasaFantasmas = function(x,y) {
		return this.mapa[y].charAt(x) == '0' || this.mapa[y].charAt(x) == '3' ;
	}
	
	this.getTile = function(x,y) {
		var mapa = this.mapa ;
		var arriba = "0" ;
		var abajo = "0" ;
		var derecha = "0" ;
		var izquierda = "0" ;
		
		if (mapa[y].charAt(x) == '0') return "tiles/tile_cccc.png" ;
		if (mapa[y].charAt(x) == '1') return "tiles/tile_cccc.png" ;
		if (mapa[y].charAt(x) == '2') return "tiles/tile_cccc.png" ;
		if (mapa[y].charAt(x) == '3') return "tiles/tile_cccc.png" ;
		if (mapa[y].charAt(x) == 's') return "tiles/tile_cccc.png" ;
		
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

		if (y<this.alto-1) {
			if (this.esSalida(x,y+1)) abajo = "s" ;
		}
	
		return "tiles/tile_"+arriba+derecha+abajo+izquierda+".png" ;
	} ;

	/** Dibuja una bolita en la coordenada de Tiles X, Y
	 * @var x TileX
	 * @var y TileY
	 */
	this.dibujarBolita = function(x,y) {
		var pixTileX = x * this.tamanoTile ;
		var pixTileY = y * this.tamanoTile ;
		this.c.fillStyle = "rgb(255,255,255)" ;
		this.c.beginPath() ;
		this.c.arc(pixTileX+25, pixTileY+25, 5, 0, 2*Math.PI) ;
		this.c.fill() ;
	}
	
	/** Dibuja una energía en la coordenada de Tiles X, Y
	 * @var x TileX
	 * @var y TileY
	 */
	this.dibujarEnergia = function(x,y) {
		var pixTileX = x * this.tamanoTile ;
		var pixTileY = y * this.tamanoTile ;
		this.c.fillStyle = "rgb(255,185,175)" ;
		this.c.strokeStyle = "rgb(255,255,255)" ;
		this.c.beginPath() ;
		this.c.arc(pixTileX+25, pixTileY+25, 8, 0, 2*Math.PI) ;
		this.c.fill() ;
		this.c.stroke() ;
	}
	
	this.dibujarObjetoCasilla = function(x,y) {
		// Dibujar las bolitas
		if (this.esBolita(x,y)) {
			this.dibujarBolita(x, y) ;
		}
		// Dibujar las energías
		if (this.esEnergia(x,y)) {
			this.dibujarEnergia(x, y) ;
		}
	}
	
	this.dibujarMapa = function() {
		var tamanoTile = this.tamanoTile ;
		for (var y=0 ; y<this.alto ; y++) {
			for (var x=0 ; x<this.ancho ; x++) {
				var fileTile = this.getTile(x,y) ;
				
				if (fileTile==null) continue ;
				
				var tile = new Image() ;
				tile.src= fileTile ;
				tile.mapaEnTile = this ;
				tile.tileX = x ;
				tile.tileY = y ;
				tile.onload = function() {
					var pixTileX = this.tileX * this.mapaEnTile.tamanoTile ;
					var pixTileY = this.tileY * this.mapaEnTile.tamanoTile ;
					// Dibujar el tile
					this.mapaEnTile.c.drawImage(this, pixTileX, pixTileY) ;
					
					// Dibujar las bolitas
					// Dibujar las energías
					this.mapaEnTile.dibujarObjetoCasilla(this.tileX, this.tileY) ;
				};
			}
		}
	} ;
	
	this.numeroDirecciones = function(x,y) {
		var direcciones=0 ;
		if (this.esCamino(x,y-1)) direcciones++ ;
		if (this.esCamino(x,y+1)) direcciones++ ;
		if (this.esCamino(x+1,y)) direcciones++ ;
		if (this.esCamino(x-1,y)) direcciones++ ;
		if (this.esSalida(x, y-1) ||
			this.esSalida(x, y+1) ||
			this.esSalida(x-1, y) ||
			this.esSalida(x+1, y)) direcciones++; // hack, 3 direcciones = AI normal
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
				if (this.esFantasma(x,y, numeroFantasma)) {
					fantasma.x = x*tamanoTile+25;
					fantasma.y = y*tamanoTile+25;
				}
			}
		}
	}
}
