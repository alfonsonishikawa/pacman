var pacman = null ;
var fantasmas = new Array(2) ;
var mapa = null ;

var colorFondo = "rgb(63,72,204)" ;
var colorNaranja = "rgb(255,127,127)" ;
var colorVerde = "rgb(50,255,50)" ;

var pacmanMuerto = false ;

function polar2cartesian(radio, angulo) {
    var x = radio * Math.cos(angulo);
    var y = radio * Math.sin(angulo);

    return {x:x,y:y} ;
}

function distanciaManhattan(fantasma, pacman) {
	return Math.abs(fantasma.x - pacman.x) + Math.abs(fantasma.y - pacman.y) ;
}

function dibujar() {
	switch (pacmanMuerto) {
	case false :
		pacman.borrar(colorFondo) ;
		pacman.verificarMovimiento() ;
		pacman.actualizarMovimiento() ;
		pacman.incrementarFrame() ;
		pacman.dibujar() ;
		for (var numFantasma = 0 ; numFantasma < fantasmas.length ; numFantasma++ ) {
			fantasmas[numFantasma].borrar(colorFondo) ;
			fantasmas[numFantasma].verificarMovimiento() ;
			fantasmas[numFantasma].actualizarMovimiento() ;
			fantasmas[numFantasma].incrementarFrame() ;
			fantasmas[numFantasma].dibujar() ;
			if (distanciaManhattan(fantasmas[numFantasma], pacman)<5) {
				pacmanMuerto = true ;
			}
		}
		break ;
	case true :
		for (var numFantasma = 0 ; numFantasma < fantasmas.length ; numFantasma++ ) {
			fantasmas[numFantasma].borrar(colorFondo) ;
		}
		//TODO dibujar pacman muriendo
		break ;
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
	pacman.setMapa(mapa) ;
	mapa.configurarPacman(pacman) ;
	
	fantasmas[0] = new Fantasma() ;
	fantasmas[0].setColor(colorNaranja) ;
	fantasmas[0].setContext(context) ;
	fantasmas[0].setMapa(mapa) ;
	fantasmas[0].setPacman(pacman) ;
	mapa.configurarFantasma(fantasmas[0],1) ;
	fantasmas[1] = new Fantasma() ;
	fantasmas[1].setColor(colorVerde) ;
	fantasmas[1].setContext(context) ;
	fantasmas[1].setMapa(mapa) ;
	fantasmas[1].setPacman(pacman) ;
	mapa.configurarFantasma(fantasmas[1],2) ;

	context.fillStyle=colorFondo;
	context.fillRect(0,0,canvas.width,canvas.height);
	
	document.onkeydown = function(event){
		pacman.estado = "moviendose" ;
		switch (event.keyCode) {
		case 37: //izquierda
			pacman.direccionEncolada = "izquierda" ;
			break ;
		case 38: //arriba
			pacman.direccionEncolada = "arriba" ;
			break ;
		case 39: //derecha
			pacman.direccionEncolada = "derecha" ;
			break ;
		case 40: //abajo
			pacman.direccionEncolada = "abajo" ;
			break ;
		}
	} ;

	setInterval(dibujar,30);
}