function Pacman() {

	this.x = 320 ;
	this.y = 200 ;
	this.radio = 13 ;
	this.estado = "parado" ; // {"parado","moviendose"}
	this.direccion = "derecha" ;
	this.frame = 7 ;
	this.incFrame = 1 ;
	this.c = null ;
	this.velocidad = 2 ;
	this.mapa = null ;
	this.bolitasZampadas = 0 ;
	
	this.direccionEncolada = null ; 
	
	this.setContext = function(context) {
		this.c = context ;
	} ;
	
	this.setMapa = function(mapa) {
		this.mapa = mapa ;
	};

	this.mapX = function() {
		return Math.round(this.x/50)-1 ;
	} ;

	this.mapY = function() {
		return Math.round(this.y/50)-1 ;
	} ;
	
	this.incrementarFrame = function () {
		if (this.estado == "moviendose") {
			if (this.frame == 10) this.incFrame = -1 ;
			if (this.frame == 0) this.incFrame = 1 ;
			this.frame += this.incFrame ;
		}
	} ;
	
	this.borrar = function(color) {
		this.c.fillStyle = color ;
		this.c.lineWidth = 0 ;
		var r = this.radio ;
		this.c.fillRect(this.x-r-1, this.y-r-1, 2*r+2, 2*r+2);

		// Si sale por la derecha algo (pero no el centro)
		if (this.x + this.radio > this.mapa.anchoPixels - 1) {
			// Hack: simulamos que estamos fuera de la pantalla por la izquierda y pintamos
			var pixelesFuera = (this.x + this.radio) - (this.mapa.anchoPixels-1) ;
			this.c.fillRect(-this.radio + pixelesFuera-1, this.y-r-1, 2*r+2, 2*r+2);
		}
		
		// Si sale por la izquierda, blablabla
		if (this.x - this.radio < 0) {
			var pixelesFuera = Math.abs(this.x - this.radio) ;
			this.c.fillRect(this.mapa.anchoPixels - pixelesFuera-1, this.y-r-1, 2*r+2, 2*r+2);
		}
		
		this.mapa.dibujarObjetoCasilla(this.mapX(), this.mapY()) ;
		this.mapa.dibujarObjetoCasilla(this.mapX()+1, this.mapY()) ;
		this.mapa.dibujarObjetoCasilla(this.mapX()-1, this.mapY()) ;
		this.mapa.dibujarObjetoCasilla(this.mapX(), this.mapY()+1) ;
		this.mapa.dibujarObjetoCasilla(this.mapX(), this.mapY()-1) ;
	} ;
	
	this.verificarMovimiento = function() {
		var dirEncolada = this.direccionEncolada ;
		var dir = this.direccion ;
		
		// Cambio de sentido en caliente
		if (this.direccionEncolada) {
			if (this.estado = "moviendose") {
				if (this.direccionEncolada=="izquierda" && this.direccion=="derecha") {
					this.direccion = "izquierda" ;
					this.direccionEncolada = null ;
				}
				if (this.direccionEncolada=="derecha" && this.direccion=="izquierda") {
					this.direccion = "derecha" ;
					this.direccionEncolada = null ;
				}
				if (this.direccionEncolada=="arriba" && this.direccion=="abajo") {
					this.direccion = "arriba" ;
					this.direccionEncolada = null ;
				}
				if (this.direccionEncolada=="abajo" && this.direccion=="arriba") {
					this.direccion = "abajo" ;
					this.direccionEncolada = null ;
				}
			}
		}
		
		if ((((this.x-25)%50) == 0) && (((this.y-25)%50) == 0)) {
			// Centro de un tile
			var tileX = this.mapX() ;
			var tileY = this.mapY() ;
			
			// Zampar bolita
			if (this.mapa.esBolita(tileX, tileY)) {
				this.bolitasZampadas ++ ;
				this.mapa.comerBolita(tileX, tileY) ;
			}

			// Cambio de dirección en cola
			if (this.direccionEncolada) {
				switch (dirEncolada) {
				case "derecha" :
					if (this.mapa.esCamino(tileX+1,tileY)) {
						this.estado = "moviendose" ;
						this.direccion = "derecha" ;
					}
					break ;
				case "izquierda" :
					if (this.mapa.esCamino(tileX-1,tileY)) {
						this.estado = "moviendose" ;
						this.direccion = "izquierda" ;
					}
					break ;
				case "arriba" :
					if (this.mapa.esCamino(tileX,tileY-1)) {
						this.estado = "moviendose" ;
						this.direccion = "arriba" ;
					}
					break ;
				case "abajo" :
					if (this.mapa.esCamino(tileX,tileY+1)) {
						this.estado = "moviendose" ;
						this.direccion = "abajo" ;
					}
					break ;
				}
				this.direccionEncolada = null ;
			}
			
			// Comprobación de parada por muro
			switch(this.direccion) {
			case "derecha" :
				if (!this.mapa.esCamino(tileX+1,tileY)) {
					this.estado = "parado" ;
				}
				break ;
			case "izquierda" :
				if (!this.mapa.esCamino(tileX-1,tileY)) {
					this.estado = "parado" ;
				}
				break ;
			case "arriba" :
				if (!this.mapa.esCamino(tileX,tileY-1)) {
					this.estado = "parado" ;
				}
				break ;
			case "abajo" :
				if (!this.mapa.esCamino(tileX,tileY+1)) {
					this.estado = "parado" ;
				}
				break ;
			}
		}
	} ;
	
	this.actualizarMovimiento = function() {
		if (this.estado == "moviendose") {
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
			
		c.fillStyle = "rgb(255,255,0)" ;
		var tmpPolares ;
		
		switch (direccion) {
	    case "arriba" :
	        c.beginPath();
	        c.arc(x,y,radio,frame/10*Math.PI/4+3*Math.PI/2,frame/10*Math.PI/4 + 5*Math.PI/2);
	        c.fill() ;
	        c.beginPath() ;
	        c.arc(x,y,radio,-frame/10*Math.PI/4+3*Math.PI/2,-frame/10*Math.PI/4 + 5*Math.PI/2, true);
	        c.fill() ;
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,frame/10*Math.PI/4+3*Math.PI/2) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,-frame/10*Math.PI/4+3*Math.PI/2) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
	        break ;
	    case "abajo" :
	        c.beginPath();
	        c.arc(x,y,radio,frame/10*Math.PI/4+Math.PI/2,frame/10*Math.PI/4 + 3*Math.PI/2);
	        c.fill() ;
	        c.beginPath() ;
	        c.arc(x,y,radio,-frame/10*Math.PI/4+Math.PI/2,-frame/10*Math.PI/4 + 3*Math.PI/2, true);
	        c.fill() ;
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,frame/10*Math.PI/4+Math.PI/2) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,-frame/10*Math.PI/4+Math.PI/2) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
	        break ;
	    case "derecha" :
	        c.beginPath();
	        c.arc(x,y,radio,frame/10*Math.PI/4,frame/10*Math.PI/4 + Math.PI);
	        c.fill() ;
	        c.beginPath() ;
	        c.arc(x,y,radio,-frame/10*Math.PI/4,-frame/10*Math.PI/4 + Math.PI,true);
	        c.fill() ;
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,frame/10*Math.PI/4) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,-frame/10*Math.PI/4) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
	        break ;
	    case "izquierda" :
	        c.beginPath();
	        c.arc(x,y,radio,-frame/10*Math.PI/4,-frame/10*Math.PI/4 + Math.PI);
	        c.fill() ;
	        c.beginPath() ;
	        c.arc(x,y,radio,frame/10*Math.PI/4,frame/10*Math.PI/4 + Math.PI,true);
	        c.fill() ;
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,frame/10*Math.PI/4) ;
			c.lineTo(x - tmpPolares.x, y - tmpPolares.y) ;        
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,-frame/10*Math.PI/4) ;
			c.lineTo(x - tmpPolares.x, y - tmpPolares.y) ;        
	    	break ;
	    }
	} ;
	
	this.dibujarMuerto = function(frame) {
		if (frame > 180) frame = 180 ;
		
		var decAng = frame*Math.PI/180 ;
		this.c.fillStyle = "rgb(255,255,0)" ;
		
        this.c.beginPath();
        this.c.arc(this.x, this.y, this.radio, 0, 2*Math.PI);
        this.c.fill() ;
        
        this.c.beginPath();
		this.c.fillStyle = colorFondo ;
        this.c.arc(this.x, this.y, this.radio+1, 3*Math.PI/2-decAng, 3*Math.PI/2+decAng);
        this.c.fill() ;
	}
	
}
