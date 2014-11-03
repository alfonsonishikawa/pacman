function Fantasma() {

	this.x = 100 ;
	this.y = 100 ;
	this.radio = 13 ;
	this.estado = "parado" ; // "parado","moviendose","en_casa"
	this.direccion = "derecha" ;
	this.frame = 7 ;
	this.incFrame = 1 ;
	this.c = null ;
	this.colorFantasma = "rgb(0,0,255)" ;
	this.velocidad = 2 ;
	this.mapa = null ;
	this.modo = "chase" ; // {"chase" | "scatter" | "frightened"| "salir" === salir de casa}
	
	this.pacman = null ;

	this.setMapa = function(mapa) {
		this.mapa = mapa ;
	};
	
	this.setPacman = function(pacman) {
		this.pacman = pacman ;
	}

	this.mapX = function() {
		return Math.round(this.x/50)-1 ;
	} ;

	this.mapY = function() {
		return Math.round(this.y/50)-1 ;
	} ;

	this.setContext = function(context) {
		this.c = context ;
	} ;
	
	this.setColor = function(color) {
		this.colorFantasma = color ;
	} ;
	
	this.incrementarFrame = function () {
		if (this.frame == 10) this.incFrame = -1 ;
		if (this.frame == 0) this.incFrame = 1 ;
		this.frame += this.incFrame ;
	} ;
	
	this.borrar = function(color) {
		this.c.fillStyle = color ;
		this.c.lineWidth = 0 ;
		var r = this.radio ;
		this.c.fillRect(this.x-r-1, this.y-5/4*r-1, 2*r+2, 9/4*r+2);

		// Si sale por la derecha algo (pero no el centro)
		if (this.x + this.radio > this.mapa.anchoPixels - 1) {
			// Hack: simulamos que estamos fuera de la pantalla por la izquierda y pintamos
			var pixelesFuera = (this.x + this.radio) - (this.mapa.anchoPixels-1) ;
			this.c.fillRect(-this.radio + pixelesFuera-1, this.y-5/4*r-1, 2*r+2, 9/4*r+2);
		}
		
		// Si sale por la izquierda, blablabla
		if (this.x - this.radio < 0) {
			var pixelesFuera = Math.abs(this.x - this.radio) ;
			this.c.fillRect(this.mapa.anchoPixels - pixelesFuera-1, this.y-5/4*r-1, 2*r+2, 9/4*r+2);
		}
		
		this.mapa.dibujarObjetoCasilla(this.mapX(), this.mapY()) ;
		this.mapa.dibujarObjetoCasilla(this.mapX()+1, this.mapY()) ;
		this.mapa.dibujarObjetoCasilla(this.mapX()-1, this.mapY()) ;
		this.mapa.dibujarObjetoCasilla(this.mapX(), this.mapY()+1) ;
		this.mapa.dibujarObjetoCasilla(this.mapX(), this.mapY()-1) ;
	} ;
	
	this.setColorFantasma = function(color) {
		this.colorFantasma = color ;
	} ;

	this.determinarDireccion = function(posicion, objetivo, direccionActual) {
		var direccionDeterminada,
		    distancia = 99999999;
		var origen = {x:posicion.x, y:posicion.y} ;
		
if (this.colorFantasma == colorRojo) {
	console.debug ("origen: ") ;
	console.debug (origen) ;
	console.debug ("objetivo:") ;
	console.debug (objetivo) ;
}
		
		if (this.mapa.esCamino(posicion.x,posicion.y-1) &&
			distanciaEntre(origen, objetivo) < distancia &&
			direccionActual != "abajo")
		{
			direccionDeterminada = "arriba" ;
			distancia = distanciaEntre(origen, objetivo) ;
		}
		origen = {x:posicion.x, y:posicion.y+1} ;
		if (this.mapa.esCamino(posicion.x,posicion.y+1) &&
			distanciaEntre(origen, objetivo) < distancia &&
			direccionActual != "arriba")
		{
			direccionDeterminada = "abajo" ;
			distancia = distanciaEntre(origen, objetivo) ;
		}
		origen = {x:posicion.x+1, y:posicion.y} ;
		if (this.mapa.esCamino(posicion.x+1,posicion.y) &&
			distanciaEntre(origen, objetivo) < distancia &&
			direccionActual!="izquierda")
		{
			direccionDeterminada = "derecha" ;
			distancia = distanciaEntre(origen, objetivo) ;
		}
		origen = {x:posicion.x-1, y:posicion.y} ;
		if (this.mapa.esCamino(posicion.x-1,posicion.y) &&
			distanciaEntre(origen, objetivo) < distancia &&
			direccionActual != "derecha")
		{
			direccionDeterminada = "izquierda" ;
			distancia = distanciaEntre(origen, objetivo) ;
		}
		return direccionDeterminada ;
	}
	
	this.verificarMovimiento = function() {
		if ((((this.x-25)%50) == 0) && (((this.y-25)%50) == 0)) {
			// Centro de un tile
			switch (this.estado) {
			case 'en_casa' :

				var tileX = this.mapX() ;
				var tileY = this.mapY() ;
				
				if (this.mapa.esBordeCasaFantasmas(tileX, tileY)) {
					this.direccion = revertirDireccion(this.direccion) ;
				}
				
				if ( this.modo == 'salir' && this.mapa.esSalida(tileX,tileY) ) {
					this.direccion = 'arriba' ;
					this.estado = 'moviendose' ;
					this.modo = 'chase' ;
				}
				
				break ;
			case 'moviendose':
				var tileX = this.mapX() ;
				var tileY = this.mapY() ;
	
				switch (this.mapa.numeroDirecciones(tileX, tileY)) {
					case 0 :
						this.estado = "parado" ;
						break ;
					case 1 :
						this.direccion = revertirDireccion(this.direccion) ;
						break ;
					case 2 :
						//Continuar y en algunos casos girar esquina
						var nuevaDireccion ;
						if (this.mapa.esCamino(tileX,tileY-1) && this.direccion != "abajo") {
							nuevaDireccion = "arriba" ;
						}
						if (this.mapa.esCamino(tileX,tileY+1) && this.direccion != "arriba") {
							nuevaDireccion = "abajo" ;
						}
						if (this.mapa.esCamino(tileX+1,tileY) && this.direccion != "izquierda") {
							nuevaDireccion = "derecha" ;
						}
						if (this.mapa.esCamino(tileX-1,tileY) && this.direccion != "derecha") {
							nuevaDireccion = "izquierda" ;
						}
						this.direccion = nuevaDireccion ;
						break ;
					case 3:
					case 4:
						// elegir nueva dirección
						// Genuina IA! - ver http://gameinternals.com/post/2072558330/understanding-pac-man-ghost-behavior
						var posTileFantasma = {x:this.mapX(), y:this.mapY()} ;
						switch (this.colorFantasma) {
							case colorNaranja:
								// Distancia > 8 => chase
								// Distancia <=8 => scatter
								// He cambiado distancia 8 por 6 :)
								if (distanciaEntre(this,pacman)/this.mapa.tamanoTile > 6) {
									// entonces igual que el rojo
									var objetivo = {x:this.pacman.mapX(), y:this.pacman.mapY()} ;
									this.direccion = this.determinarDireccion(posTileFantasma, objetivo, this.direccion) ;
								} else {
									// scatter
									var objetivo = {x:1, y:14} ;
									this.direccion = this.determinarDireccion(posTileFantasma, objetivo, this.direccion) ;
								}
								break ;
							case colorVerde:
								// Comportamiento: el doble de la distancia del rojo al destino pacman
								var destinoPacman = {x:this.pacman.mapX(), y:this.pacman.mapY()},
							    distancia = 999999999;
								
								switch (this.pacman.direccion) {
									case "arriba":
										destinoPacman.y = Math.max(destinoPacman.y-2, 0) ;
										break ;
									case "abajo" :
										destinoPacman.y = Math.min(destinoPacman.y+2, this.mapa.alto-1) ;
										break ;
									case "derecha":
										destinoPacman.x = Math.min(destinoPacman.x+2, this.mapa.ancho-1) ;
										break ;
									case "izquierda":
										destinoPacman.x = Math.max(destinoPacman.x-2, 0) ;
										break ;
								}
								// Guarrada aquí para no tardar :P
								// fantasmas[2] = rojo
								var posFantasmaRojo = {x:fantasmas[2].mapX(), y:fantasmas[2].mapY()} ;
								var objetivo = { x: destinoPacman.x + (destinoPacman.x-posFantasmaRojo.x),
										        y: destinoPacman.y + (destinoPacman.y-posFantasmaRojo.y)} ;
								objetivo.x = Math.min(Math.max(objetivo.x, 0), this.mapa.ancho-1) ;
								objetivo.y = Math.min(Math.max(objetivo.y, 0), this.mapa.alto-1) ;
	
								this.direccion = this.determinarDireccion(posTileFantasma, objetivo, this.direccion) ;
								break ;
							case colorRojo:
								// Comportamiento: el tile más cercano a pacman
								var objetivo = {x:this.pacman.mapX(), y:this.pacman.mapY()} ;
								this.direccion = this.determinarDireccion(posTileFantasma, objetivo, this.direccion) ;
								break ;
							case colorRosa:
								// Comportamiento: el tile 4 casillas más allá de pacman
								var objetivo = {x:this.pacman.mapX(), y:this.pacman.mapY()} ;
								
								switch (this.pacman.direccion) {
									case "arriba":
										objetivo.y = Math.max(objetivo.y-4, 0) ;
										break ;
									case "abajo" :
										objetivo.y = Math.min(objetivo.y+4, this.mapa.alto-1) ;
										break ;
									case "derecha":
										objetivo.x = Math.min(objetivo.x+4, this.mapa.ancho-1) ;
										break ;
									case "izquierda":
										objetivo.x = Math.max(objetivo.x-4, 0) ;
										break ;
								}
								this.direccion = this.determinarDireccion(posTileFantasma, objetivo, this.direccion) ;
								break ;
						}
						
						break ;
				}
				break ;
			}
		}
	} ;
	
	this.actualizarMovimiento = function() {
		if (this.estado == "moviendose" || this.estado == "en_casa") {
			switch(this.direccion) {
			case "derecha" :
				this.x = this.x + this.velocidad ;
				// Sale por la derecha
				if (this.x > this.mapa.anchoPixels-1) {
					this.x = this.x - (this.mapa.anchoPixels) ;
				}
				break ;
			case "izquierda" :
				this.x = this.x - this.velocidad ;
				// Sale por la izquierda
				if (this.x < 0) {
					this.x = this.mapa.anchoPixels + this.x ;
				}
				break ;
			case "arriba" :
				this.y = this.y - this.velocidad ; 
				break ;
			case "abajo" :
				this.y = this.y + this.velocidad ;
				break ;
			}
		}
	} ;

	this.dibujar = function(esOverflow) {
		var esOverflow = esOverflow || false ;
		
		var c = this.c ;
		var direccion = this.direccion ;
		var x = this.x ;
		var y = this.y ;
		var radio = this.radio ;
		var frame = this.frame ;
		
		// Si no estamos dibujando un overflow...
		if (!esOverflow) {
			// Si sale por la derecha algo (pero no el centro)
			if (this.x + this.radio >= this.mapa.anchoPixels) {
				// Hack: simulamos que estamos fuera de la pantalla por la izquierda y pintamos
				var pixelesFuera = this.x + this.radio - (this.mapa.anchoPixels - 1) ;
				this.x = -this.radio + pixelesFuera ;
				this.dibujar(true) ;
				// Y ahora restauramos con la variable local
				this.x = x ;
			}
			
			// Si sale por la izquierda, blablabla
			if (this.x - this.radio < 0) {
				var pixelesFuera = Math.abs(this.x - this.radio) ;
				this.x = this.mapa.anchoPixels + this.radio - pixelesFuera ;
				this.dibujar(true) ;
				this.x = x ;
			}
		}

		c.fillStyle = this.colorFantasma ;

        c.fillRect(x-radio,y-radio/2+radio/4,2*radio,radio) ;
		c.beginPath();
        c.arc(x,y-radio/2+radio/4,radio,0,Math.PI,true);

        var ancho = 2*radio/3 ;
        for (var i=0 ; i<3 ; i++) {
        	c.arc(x-radio+(ancho/2)+i*ancho, y+radio/2+radio/4-1, ancho/2, 0, Math.PI) ;
        }
        c.fill() ;
        
        c.beginPath() ;
        c.fillStyle = "rgb(255,255,255)" ;

        switch (direccion) {
	    case "arriba" :
	        c.arc(x + radio/3, y-radio/2-radio/5+radio/4, radio/3.5, 0, 2*Math.PI) ;
	        c.arc(x - radio/3, y-radio/2-radio/5+radio/4, radio/3.5, 0, 2*Math.PI) ;
	        c.fill() ;
	        c.beginPath() ;
	        c.fillStyle = "rgb(0,0,0)" ;
	        c.arc(x + radio/3, y-radio/2-radio/5-radio/3.5+radio/7+radio/4, radio/7, 0, 2*Math.PI) ;
	        c.arc(x - radio/3, y-radio/2-radio/5-radio/3.5+radio/7+radio/4, radio/7, 0, 2*Math.PI) ;
	        c.fill() ;
	        break ;
	    case "abajo" :
	        c.arc(x + radio/3, y-radio/2+radio/5+radio/4, radio/3.5, 0, 2*Math.PI) ;
	        c.arc(x - radio/3, y-radio/2+radio/5+radio/4, radio/3.5, 0, 2*Math.PI) ;
	        c.fill() ;
	        c.beginPath() ;
	        c.fillStyle = "rgb(0,0,0)" ;
	        c.arc(x + radio/3, y-radio/2+radio/5+radio/3.5-radio/7+radio/4, radio/7, 0, 2*Math.PI) ;
	        c.arc(x - radio/3, y-radio/2+radio/5+radio/3.5-radio/7+radio/4, radio/7, 0, 2*Math.PI) ;
	        c.fill() ;
	        break ;
	    case "derecha" :
	        c.arc(x + radio/3+radio/5, y-radio/2+radio/4, radio/3.5, 0, 2*Math.PI) ;
	        c.arc(x - radio/3+radio/5, y-radio/2+radio/4, radio/3.5, 0, 2*Math.PI) ;
	        c.fill() ;
	        c.beginPath() ;
	        c.fillStyle = "rgb(0,0,0)" ;
	        c.arc(x + radio/3+radio/3.5, y-radio/2+radio/4, radio/7, 0, 2*Math.PI) ;
	        c.arc(x - radio/3+radio/3.5, y-radio/2+radio/4, radio/7, 0, 2*Math.PI) ;
	        c.fill() ;
	        break ;
	    case "izquierda" :
	        c.arc(x + radio/3-radio/5, y-radio/2+radio/4, radio/3.5, 0, 2*Math.PI) ;
	        c.arc(x - radio/3-radio/5, y-radio/2+radio/4, radio/3.5, 0, 2*Math.PI) ;
	        c.fill() ;
	        c.beginPath() ;
	        c.fillStyle = "rgb(0,0,0)" ;
	        c.arc(x + radio/3-radio/3.5, y-radio/2+radio/4, radio/7, 0, 2*Math.PI) ;
	        c.arc(x - radio/3-radio/3.5, y-radio/2+radio/4, radio/7, 0, 2*Math.PI) ;
	        c.fill() ;
	    	break ;
	    }
	} ;
	
}
