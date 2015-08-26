GameOverPopup = function(game){
    Phaser.Group.call(this, game);
    
    
    this.controlSp = this.create(0,0,'empty');
    this.controlSp.events.onGameScreen = new Phaser.Signal();
    //var okBtn = gameScreen.create(820,480, 'OKButton');

    var bg = this.create(game.world.width/2, 50, 'GameOverWindow');
    bg.anchor.setTo(0.5,0);
    var replayBtn = this.create(game.world.width/2,280, 'ReplayButtonNormal');
    replayBtn.anchor.setTo(0.5,0);
    replayBtn.inputEnabled = true;
    replayBtn.events.onInputDown.add(this.onReplayBtn, this);


    
    //this.events.onGameOverPopup = new Phaser.Signal();
}

GameOverPopup.prototype = Object.create(Phaser.Group.prototype);
GameOverPopup.prototype.constructor = GameOverPopup;

GameOverPopup.prototype.onReplayBtn = function (){
    this.controlSp.events.onGameScreen.dispatch(this);
}