var colorFondo = "rgb(0,0,0)" ;
var colorNaranja = "rgb(255,180,0)" ;
var colorVerde = "rgb(50,255,50)" ;
var colorRojo = "rgb(255,0,0)" ;
var colorRosa = "rgb(255,80,255)" ;

var pacman = null ;
var fantasmas = [] ;
var numFantasmas = 4;
var colorFantasma = [colorNaranja, colorVerde, colorRojo, colorRosa] ;
var mapa = null ;
var timer ;

var pacmanMuerto = false ;

function polar2cartesian(radio, angulo) {
    var x = radio * Math.cos(angulo);
    var y = radio * Math.sin(angulo);

    return {x:x,y:y} ;
}

function distanciaManhattan(fantasma, pacman) {
	return Math.abs(fantasma.x - pacman.x) + Math.abs(fantasma.y - pacman.y) ;
}

function revertirDireccion(direccion) {
	if (direccion == "arriba") return "abajo" ;
	if (direccion == "abajo" ) return "arriba" ;
	if (direccion == "derecha")return "izquierda" ;
	if (drieccion == "izquierda")return "derecha" ;
}

function dibujar() {
	switch (pacmanMuerto) {
	case false :
		// Borrar todo
		pacman.borrar(colorFondo) ;
		for (var numFantasma = 0 ; numFantasma < numFantasmas ; numFantasma++ ) {
			fantasmas[numFantasma].borrar(colorFondo) ;
		}
		
		// Verificar, actualizar, incrementar frames
		pacman.verificarMovimiento() ;
		pacman.actualizarMovimiento() ;
		pacman.incrementarFrame() ;
		for (var numFantasma = 0 ; numFantasma < numFantasmas ; numFantasma++ ) {
			fantasmas[numFantasma].verificarMovimiento() ;
			fantasmas[numFantasma].actualizarMovimiento() ;
			fantasmas[numFantasma].incrementarFrame() ;
		}
		
		// Dibujar
		pacman.dibujar() ;
		for (var numFantasma = 0 ; numFantasma < numFantasmas ; numFantasma++ ) {
			fantasmas[numFantasma].dibujar() ;
		}
		
		// Comprobar si muerto
		for (var numFantasma = 0 ; numFantasma < numFantasmas ; numFantasma++ ) {
			if (distanciaManhattan(fantasmas[numFantasma], pacman)<5) {
				pacmanMuerto = true ;
			}
		}
		break ;
	case true :
		for (var numFantasma = 0 ; numFantasma < numFantasmas ; numFantasma++ ) {
			fantasmas[numFantasma].borrar(colorFondo) ;
		}
		//TODO dibujar pacman muriendo
		break ;
	}
}

function boot() {

	clearInterval(timer) ; //Reinicio de juego => parar el bucle de juego anterior
	var canvas = document.getElementById("canvas") ;
	var context = canvas.getContext("2d") ;

	pacman = null ;
	fantasmas = new Array(2) ;
	mapa = null ;
	pacmanMuerto = false ;
	
	mapa = new Mapa() ;
	mapa.setContext(context) ;
	mapa.dibujarMapa() ;

	pacman = new Pacman() ;
	pacman.setContext(context) ;
	pacman.setMapa(mapa) ;
	mapa.configurarPacman(pacman) ;

	for ( var numFantasma=0 ; numFantasma < numFantasmas ; numFantasma++) {
		fantasmas[numFantasma] = new Fantasma() ;
		fantasmas[numFantasma].setColor(colorFantasma[numFantasma]) ;
		fantasmas[numFantasma].setContext(context) ;
		fantasmas[numFantasma].setMapa(mapa) ;
		fantasmas[numFantasma].setPacman(pacman) ;
		mapa.configurarFantasma(fantasmas[numFantasma], numFantasma+1) ;
	}

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

	timer = setInterval(dibujar,20);
}