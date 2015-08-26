SplashScreen = function(game){
    Phaser.Group.call(this, game);
    
   
    
    var title = this.create(game.world.centerX, 50, 'TitleScreen_green');
    title.anchor.setTo(0.5, 0);

    this.playBtn = this.create(game.world.centerX, 450, 'PlayButton');
    this.playBtn.anchor.setTo(0.5, 0);
    this.playBtn.inputEnabled = true;
    this.playBtn.events.onInputDown.add(this.onMouseUp, this);
    
    this.controlSp = this.create(0,0,'empty');
    this.controlSp.events.onGameScreenScreen = new Phaser.Signal();
    
}

SplashScreen.prototype = Object.create(Phaser.Group.prototype);
SplashScreen.prototype.constructor = SplashScreen;

 
SplashScreen.prototype.onMouseUp = function(){
   this.controlSp.events.onGameScreenScreen.dispatch(this);
}
