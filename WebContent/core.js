var colorFondo = "rgb(0,0,0)" ;
var colorNaranja = "rgb(255,180,0)" ;
var colorVerde = "rgb(50,255,50)" ;
var colorRojo = "rgb(255,0,0)" ;
var colorRosa = "rgb(255,80,255)" ;

var estadoJuego = "pacman vivo" ; // "pacman muerto" | "pacman vivo" | "ganador"

var pacman = null ;
var fantasmas = [] ;
var numFantasmas = 4;
var colorFantasma = [colorRojo, colorRosa, colorVerde, colorNaranja] ;
var mapa = null ;

var numSegundo = 0 ;
var numBolitas = 127 ;

var pacmanMuerto = false ;
var segundoMuerto ;

var requestAnimationFrameId = undefined ;

var timestampInicial = undefined ;

function polar2cartesian(radio, angulo) {
    var x = radio * Math.cos(angulo);
    var y = radio * Math.sin(angulo);

    return {x:x,y:y} ;
}

function distanciaEntre(fantasma, pacman) {
	return Math.sqrt((fantasma.x - pacman.x)*(fantasma.x - pacman.x) + (fantasma.y - pacman.y)*(fantasma.y - pacman.y)) ;
}

function revertirDireccion(direccion) {
	if (direccion == "arriba") return "abajo" ;
	if (direccion == "abajo" ) return "arriba" ;
	if (direccion == "derecha")return "izquierda" ;
	if (direccion == "izquierda")return "derecha" ;
}

function dibujar(timestamp) {
	timestampInicial = timestampInicial || timestamp ;
	
	numSegundo = Math.floor((timestamp - timestampInicial)/1000) ;
	
	switch (estadoJuego) {
	case "pacman vivo" :
//		if (numSegundo > 10) {
		if (numSegundo > -1) {
			fantasmas[0].modo = "salir" ;
		}
		if (numFantasmas >= 2 && numSegundo > 25) {
			fantasmas[1].modo = "salir" ;
		}
		if (numFantasmas >= 3 && numSegundo > 45) {
			fantasmas[2].modo = "salir" ;
		}
		if (numFantasmas >= 4 && numSegundo > 65) {
			fantasmas[3].modo = "salir" ;
		}
		
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
			if (distanciaEntre(fantasmas[numFantasma], pacman)<20) {
				estadoJuego = "pacman muerto" ;
				segundoMuerto = numSegundo ;
			}	
		}

		// Comprobar si gana
		if (numBolitas == 0) {
			estadoJuego = "ganador" ;
		}

		requestAnimationFrameId = window.requestAnimationFrame(dibujar) ;
		break ;		

	case "pacman muerto" :
		for (var numFantasma = 0 ; numFantasma < numFantasmas ; numFantasma++ ) {
			fantasmas[numFantasma].borrar(colorFondo) ;
		}
		pacman.borrar(colorFondo) ;
		
		pacman.dibujarMuerto (((timestamp-timestampInicial) - segundoMuerto*1000)/30) ;

		if (numSegundo - segundoMuerto < 20) {
			requestAnimationFrameId = window.requestAnimationFrame(dibujar) ;
		}

		break ;
	
	case "ganador" :
		for (var numFantasma = 0 ; numFantasma < numFantasmas ; numFantasma++ ) {
			fantasmas[numFantasma].borrar(colorFondo) ;
		}
		pacman.borrar(colorFondo) ;
		pacman.dibujar(false) ;
	}
}

function boot() {

	if (requestAnimationFrameId) {
		window.cancelAnimationFrame(requestAnimationFrameId) ; 
	}
	
	if (!String.prototype.replaceAt) {
		String.prototype.replaceAt=function(index, character) {
			return this.substr(0, index) + character + this.substr(index+character.length);
		}
	}
	
	var canvas = document.getElementById("canvas") ;
	var context = canvas.getContext("2d") ;

	pacman = null ;
	fantasmas = new Array(2) ;
	mapa = null ;
	numSegundo = 0 ;
	numBolitas = 127 ;
	estadoJuego = "pacman vivo" ;
	timestampInicial = undefined ;
	
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
		fantasmas[numFantasma].estado = "en_casa" ;
		if (numFantasma == 0) fantasmas[numFantasma].direccion = "izquierda" ;
		if (numFantasma == 1) fantasmas[numFantasma].direccion = "izquierda" ;
		if (numFantasma == 2) fantasmas[numFantasma].direccion = "derecha" ;
		if (numFantasma == 3) fantasmas[numFantasma].direccion = "derecha" ;
		mapa.configurarFantasma(fantasmas[numFantasma], numFantasma) ;
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

	requestAnimationFrameId = window.requestAnimationFrame(dibujar) ;
}

function mapaEstatico() {
	var canvas = document.getElementById("canvas") ;
	var context = canvas.getContext("2d") ;
	mapa = new Mapa() ;
	mapa.setContext(context) ;
	mapa.dibujarMapa() ;
	context.fillStyle=colorFondo;
	context.fillRect(0,0,canvas.width,canvas.height);
}
