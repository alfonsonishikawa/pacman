var pacman = null ;
var fantasma = null ;
var mapa = null ;

var colorFondo = "rgb(63,72,204)" ;
var colorNaranja = "rgb(255,127,127)" ;

function polar2cartesian(radio, angulo) {
    var x = radio * Math.cos(angulo);
    var y = radio * Math.sin(angulo);

    return {x:x,y:y} ;
}

function dibujar() {
	pacman.incrementarFrame() ;
	pacman.borrar(colorFondo) ;
	pacman.dibujar() ;
	fantasma.incrementarFrame() ;
	fantasma.borrar(colorFondo) ;
	fantasma.dibujar() ;
}

function boot() {
	var canvas = document.getElementById("canvas") ;
	var context = canvas.getContext("2d") ;
	pacman = new Pacman() ;
	pacman.setContext(context) ;
	pacman.x = 25 ;
	pacman.y = 25 ;
	fantasma = new Fantasma() ;
	fantasma.setColor(colorNaranja) ;
	fantasma.setContext(context) ;
	fantasma.x = 125 ;
	fantasma.y = 125 ;
	
	context.fillStyle=colorFondo;
	context.fillRect(0,0,canvas.width,canvas.height);
	
	mapa = new Mapa() ;
	mapa.setContext(context) ;
	mapa.dibujarMapa() ;
	
	document.onkeydown = function(event){
		switch (event.keyCode) {
		case 37: //izquierda
			pacman.direccion = "izquierda" ;
			fantasma.direccion = "izquierda" ;
			break ;
		case 38: //arriba
			pacman.direccion = "arriba" ;
			fantasma.direccion = "arriba" ;
			break ;
		case 39: //derecha
			pacman.direccion = "derecha" ;
			fantasma.direccion = "derecha" ;
			break ;
		case 40: //abajo
			pacman.direccion = "abajo" ;
			fantasma.direccion = "abajo" ;
			break ;
		}
	} ;

	setInterval(dibujar,30);
}