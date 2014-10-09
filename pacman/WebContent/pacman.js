function Pacman() {

	this.x = 320 ;
	this.y = 200 ;
	this.radio = 11 ;
	this.estado = "parado" ; // "parado","moviendose"
	this.direccion = "derecha" ;
	this.frame = 7 ;
	this.incFrame = 1 ;
	this.c = null ;
	this.velocidad = 2 ;
	this.mapa = null ;
	
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
			
//			console.debug({x:this.x, y:this.y, tileX:tileX, tileY:tileY}) ;

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
				break ;
			case "izquierda" :
				this.x = this.x - this.velocidad ;
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
	
	this.dibujar = function() {
		var c = this.c ;
		var direccion = this.direccion ;
		var x = this.x ;
		var y = this.y ;
		var radio = this.radio ;
		var frame = this.frame ;
		
		c.fillStyle = "rgb(255,255,0)" ;
		c.strokeStyle = "rgb(0,0,0)";
		c.lineWidth = 1 ;
		var tmpPolares ;
		
		switch (direccion) {
	    case "arriba" :
	        c.beginPath();
	        c.arc(x,y,radio,frame/10*Math.PI/4+3*Math.PI/2,frame/10*Math.PI/4 + 5*Math.PI/2);
	        c.fill() ;
	        c.stroke() ;
	        c.beginPath() ;
	        c.arc(x,y,radio,-frame/10*Math.PI/4+3*Math.PI/2,-frame/10*Math.PI/4 + 5*Math.PI/2, true);
	        c.fill() ;
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,frame/10*Math.PI/4+3*Math.PI/2) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,-frame/10*Math.PI/4+3*Math.PI/2) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
		    c.stroke() ;
	        break ;
	    case "abajo" :
	        c.beginPath();
	        c.arc(x,y,radio,frame/10*Math.PI/4+Math.PI/2,frame/10*Math.PI/4 + 3*Math.PI/2);
	        c.fill() ;
	        c.stroke() ;
	        c.beginPath() ;
	        c.arc(x,y,radio,-frame/10*Math.PI/4+Math.PI/2,-frame/10*Math.PI/4 + 3*Math.PI/2, true);
	        c.fill() ;
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,frame/10*Math.PI/4+Math.PI/2) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,-frame/10*Math.PI/4+Math.PI/2) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
		    c.stroke() ;
	        break ;
	    case "derecha" :
	        c.beginPath();
	        c.arc(x,y,radio,frame/10*Math.PI/4,frame/10*Math.PI/4 + Math.PI);
	        c.fill() ;
	        c.stroke() ;
	        c.beginPath() ;
	        c.arc(x,y,radio,-frame/10*Math.PI/4,-frame/10*Math.PI/4 + Math.PI,true);
	        c.fill() ;
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,frame/10*Math.PI/4) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,-frame/10*Math.PI/4) ;
			c.lineTo(x + tmpPolares.x, y + tmpPolares.y) ;        
		    c.stroke() ;
	        break ;
	    case "izquierda" :
	        c.beginPath();
	        c.arc(x,y,radio,-frame/10*Math.PI/4,-frame/10*Math.PI/4 + Math.PI);
	        c.fill() ;
	        c.stroke() ;
	        c.beginPath() ;
	        c.arc(x,y,radio,frame/10*Math.PI/4,frame/10*Math.PI/4 + Math.PI,true);
	        c.fill() ;
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,frame/10*Math.PI/4) ;
			c.lineTo(x - tmpPolares.x, y - tmpPolares.y) ;        
			c.moveTo(x,y) ;
			tmpPolares = polar2cartesian(radio,-frame/10*Math.PI/4) ;
			c.lineTo(x - tmpPolares.x, y - tmpPolares.y) ;        
		    c.stroke() ;
	    	break ;
	    }
	} ;
	
}
