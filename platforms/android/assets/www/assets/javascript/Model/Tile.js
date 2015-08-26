Tile = function(game,parent,i,curRow,type) {
    //console.log(game +" "+parent+" "+i+" "+curRow+" "+type+" "+this);
    Phaser.Group.call(this, game);
    this.i = i;
    this.j = curRow;
    this.curRotation=0;
    //var _image;
    this.lock = false;
    this.num = 0;
    this.text;
    this.game = game;
    this.type=type;
    //console.log( "Tile("+game+" "+i+" "+curRow+" "+type+")");
    if(type == Tile.TYPE_ACTIVE){
        var rand = game.rnd.integerInRange(1, 5);
        this._image = this.create(0, 0, 'tiles_unselected0'+rand);
    }else if(type == Tile.TYPE_BLOCK){
        var rand = game.rnd.integerInRange(1, 4);
        this._image = this.create(0, 0, 'tiles_edge0'+rand);
    }

    this._image.anchor.setTo(0.5,0.5);
    
}

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;

Tile.TYPE_BLOCK = 1;
Tile.TYPE_ACTIVE = 2;

Tile.prototype.setNumber = function (num){
    if(num!=0) this.remove(this.text);
  var style = { font: "20px Arial", fill: "#000000", align: "center" };
    this.num = num;
    
    //console.log("setNumber("+num+")");
    if(this.num!=0){
        this.text = this.game.add.text(0, 0, this.num , style);
        this.add(this.text);
        this.text.anchor.set(0.5);
        var rotateTo = Math.PI/3*(this.curRotation*-1);
        var degrees = (180/Math.PI)*rotateTo;
        this.text.angle = degrees;
    }else{
        this.remove(this.text);
    }
}

Tile.prototype.rotateDir = function( dir ){
    this.curRotation+=dir;
    if(this.curRotation<0) this.curRotation= 5;
    else if(this.curRotation>5) this.curRotation =0;
    if(this.num==0) return;
    var rotateTo = this.text.rotation + Math.PI/3;
   if(dir>0) rotateTo= this.text.rotation - Math.PI/3;
    //console.log( "Before Rotation: "+this.text.rotation +" After Rotation: "+rotateTo);
    var degrees = (180/Math.PI)*rotateTo;

   this.game.add.tween(this.text).to({angle:degrees},500,Phaser.Easing.Linear.None, true, 100);
}