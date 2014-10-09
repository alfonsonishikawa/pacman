function Fantasma() {

	this.x = 100 ;
	this.y = 100 ;
	this.radio = 11 ;
	this.estado = "parado" ; // "parado","moviéndose"
	this.direccion = "derecha" ;
	this.frame = 7 ;
	this.incFrame = 1 ;
	this.c = null ;
	this.colorFantasma = "rgb(0,0,255)" ;
	
	this.mapX = function() {
		return Math.round(this.x/50) ;
	}

	this.mapY = function() {
		return Math.round(this.y/50) ;
	}

	this.setContext = function(context) {
		this.c = context ;
	} ;
	
	this.setColor = function(color) {
		this.colorFantasma = color ;
	}
	
	this.incrementarFrame = function () {
		if (this.frame == 10) this.incFrame = -1 ;
		if (this.frame == 0) this.incFrame = 1 ;
		this.frame += this.incFrame ;
	} ;
	
	this.borrar = function(color) {
		this.c.fillStyle = color ;
		this.c.lineWidth = 0 ;
		var r = this.radio ;
		this.c.fillRect(this.x-r-1, this.y-r-1, 2*r+2, 2*r+2);
		
	} ;
	
	this.setColorFantasma = function(color) {
		this.colorFantasma = color ;
	} ;

	this.actualizarMovimiento = function() {
		if (this.estado == "moviendose") {
			switch(this.direccion) {
			case "derecha" :
				this.x = this.x + 2 ;
				break ;
			case "izquierda" :
				this.x = this.x - 2 ;
				break ;
			case "arriba" :
				this.y = this.y - 2 ; 
				break ;
			case "abajo" :
				this.y = this.y + 2 ;
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
		
		c.fillStyle = this.colorFantasma ;

        c.fillRect(x-radio,y-radio/2+radio/4,2*radio,radio+1) ;
		c.beginPath();
        c.arc(x,y-radio/2+radio/4,radio,0,Math.PI,true);

        var ancho = 2*radio/3 ;
        for (var i=0 ; i<3 ; i++) {
        	c.arc(x-radio+(ancho/2)+i*ancho, y+radio/2+radio/4, ancho/2, 0, Math.PI) ;
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
