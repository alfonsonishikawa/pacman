var pacman = null ;
var fantasmas = new Array(2) ;
var mapa = null ;

var colorFondo = "rgb(63,72,204)" ;
var colorNaranja = "rgb(255,127,127)" ;
var colorVerde = "rgb(50,255,50)" ;

function polar2cartesian(radio, angulo) {
    var x = radio * Math.cos(angulo);
    var y = radio * Math.sin(angulo);

    return {x:x,y:y} ;
}

function dibujar() {
	pacman.borrar(colorFondo) ;
	pacman.actualizarMovimiento() ;
	pacman.incrementarFrame() ;
	pacman.dibujar() ;
	for (var numFantasma = 0 ; numFantasma < fantasmas.length ; numFantasma++ ) {
		fantasmas[numFantasma].borrar(colorFondo) ;
		fantasmas[numFantasma].actualizarMovimiento() ;
		fantasmas[numFantasma].incrementarFrame() ;
		fantasmas[numFantasma].dibujar() ;
	}
}

function boot() {
	var canvas = document.getElementById("canvas") ;
	var context = canvas.getContext("2d") ;

	mapa = new Mapa() ;
	mapa.setContext(context) ;
	mapa.dibujarMapa() ;

	pacman = new Pacman() ;
	pacman.setContext(context) ;
	//pacman.
	mapa.configurarPacman(pacman) ;
	pacman.direccion = "parado" ;
	
	fantasmas[0] = new Fantasma() ;
	fantasmas[0].setColor(colorNaranja) ;
	fantasmas[0].setContext(context) ;
	mapa.configurarFantasma(fantasmas[0],1) ;
	fantasmas[1] = new Fantasma() ;
	fantasmas[1].setColor(colorVerde) ;
	fantasmas[1].setContext(context) ;
	mapa.configurarFantasma(fantasmas[1],2) ;

	context.fillStyle=colorFondo;
	context.fillRect(0,0,canvas.width,canvas.height);
	
	document.onkeydown = function(event){
		pacman.estado = "moviendose" ;
		switch (event.keyCode) {
		case 37: //izquierda
			pacman.direccion = "izquierda" ;
			break ;
		case 38: //arriba
			pacman.direccion = "arriba" ;
			break ;
		case 39: //derecha
			pacman.direccion = "derecha" ;
			break ;
		case 40: //abajo
			pacman.direccion = "abajo" ;
			break ;
		}
	} ;

	setInterval(dibujar,30);
}