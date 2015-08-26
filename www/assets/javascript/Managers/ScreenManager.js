ScreenManager = function(game){
    Phaser.Group.call(this, game);
    this.game = game;
    this.loadSplashScreen();

}

ScreenManager.prototype = Object.create(Phaser.Group.prototype);
ScreenManager.prototype.constructor = ScreenManager;

ScreenManager.prototype.loadSplashScreen = function(){
    this.clearScreens();
    this.splashScreen = new SplashScreen(this.game);
    this.splashScreen.controlSp.events.onGameScreenScreen.add(this.loadGameScreen, this);
    this.add(this.splashScreen);
   
}

ScreenManager.prototype.clearScreens=function(){
    if(this.gameScreen) this.gameScreen.removeAll();
    if(this.splashScreen) this.splashScreen.removeAll();
    if(this.gameOverPopup) this.gameOverPopup.removeAll();
    //this.gameOverScreen.removeAll();
}


ScreenManager.prototype.loadGameScreen = function() {
    this.clearScreens();
    this.gameScreen = new GameScreen( this.game );
    this.gameScreen.controlSp.events.onGameOver.add(this.loadGameOver, this);
    this.add(this.gameScreen);
    //this.grid.pivot.x = -this.grid.width/2;
    //this.grid.pivot.y = -this.grid.height/2;
}



ScreenManager.prototype.loadGameOver = function(){
   this.gameOverPopup = new GameOverPopup( this.game);
    this.gameOverPopup.controlSp.events.onGameScreen.add(this.loadGameScreen, this);
    this.add(this.gameOverPopup);
}