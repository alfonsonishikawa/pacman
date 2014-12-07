Pacman
======

Pacman in HTML5. The hardest pacman in the world (well, not actually):
* 1 life
* 0 energy pills
* 4 hungry ghosts

Online playable version: http://alfonsonishikawa.github.io/pacman

Developed after 16 hours HTML5/CSS3 course, without formal knowledge of javascript other than some bits read here and there. Don't expect clean, beauty and comprenhensive sourcecode: it's really a mess.
The motivation was the execise of DRAWING a Pacman with code in the canvas and "if much inspired, a ghost too".
The cut version and for that, hardest, is because implementing more things would take me more time that I want to spend in other projects.

Stuff learnt
------------
Although the resulting game is not awesome, actually more like crap (but proud of owns crap), it was very useful to develop the game to learn things:

* Animations, specially characters animations, must be linked to frames or to real time, but not both.
* It is easier to link to frames, but a frameskip controll will be needed for slower devices (we can assume the navigator will limit to max 60fps)
* Linking to timestamp will need a sofisticated behavior control, for example calculating the positions and handling turns. 
* I should take a look at some graphics/games library :P

