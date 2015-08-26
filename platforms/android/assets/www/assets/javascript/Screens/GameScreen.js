GameScreen = function(game){
    Phaser.Group.call(this, game);
    
    
    this.controlSp = this.create(0,0,'empty');
    this.controlSp.events.onGameOver = new Phaser.Signal();
    //var okBtn = gameScreen.create(820,480, 'OKButton');

    var RotateLeft = this.create(20,380, 'RotateLeft');
    RotateLeft.inputEnabled = true;
    RotateLeft.events.onInputDown.add(this.onRotateLeft, this);

    var RotateRight = this.create(120,620, 'RotateLeft');
    RotateRight.inputEnabled = true;
    RotateRight.events.onInputDown.add(this.onRotateRight, this);
    RotateRight.anchor.setTo(1, 1);
    RotateRight.width *=-1;

    this.grid = new Grid(game,7,4);
    this.grid.controlSp.events.onGameOver.add(this.onGameOver, this);
    //this.splashScreen.controlSp.events.onGameScreenScreen.add(this.loadGameScreen, this);
    this.grid.x = 500;
    this.grid.y = 300;
    this.add(this.grid);
    //this.events.onGameOverPopup = new Phaser.Signal();
}

GameScreen.prototype = Object.create(Phaser.Group.prototype);
GameScreen.prototype.constructor = GameScreen;


GameScreen.prototype.onRotateLeft = function(){
    this.grid.rotateDir(-1);

}

GameScreen.prototype.onRotateRight = function(){
    this.grid.rotateDir(1);

}

GameScreen.prototype.onGameOver = function(){
    this.controlSp.events.onGameOver.dispatch(this);
}