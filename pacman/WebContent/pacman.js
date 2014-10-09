function Pacman() {

	this.x = 320 ;
	this.y = 200 ;
	this.radio = 11 ;
	this.estado = "parado" ; // "parado","moviendose"
	this.direccion = "derecha" ;
	this.frame = 7 ;
	this.incFrame = 1 ;
	this.c = null ;
	
	this.setContext = function(context) {
		this.c = context ;
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
		this.c.fillRect(this.x-r-1, this.y-r-1, 2*r+2, 2*r+2);
		
	} ;
	
	this.actualizarMovimiento = function() {
		if (this.estado == "moviendose") {
			switch(this.direccion) {
			case "derecha" :
				this.x = this.x + 1 ;
				break ;
			case "izquierda" :
				this.x = this.x - 1 ;
				break ;
			case "arriba" :
				this.y = this.y - 1 ; 
				break ;
			case "abajo" :
				this.y = this.y + 1 ;
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
