Grid = function(game, width, height) {
    
    Phaser.Group.call(this, game);
    this.controlSp = this.create(0,0,'empty');
    this.controlSp.events.onGameOver = new Phaser.Signal();
    this.COLS=width;
    this.ROWS = height;
    this.tiles = [];
    this.game = game;
    this.turnSound;
    this.curRotation=0;
    this.rotationBlocker = false;
    var i = 0;
    var curYStart = 0;
    var curXStart = 0;
    var curRow = height;
    var heighestY=0;
    var lowestY=100;
    var lowestX=100;
    var heighestX=0;
    
    for(var i = 0;i<width;i++){
        for(var j = 0;j<curRow;j++) {
            var type = Tile.TYPE_ACTIVE;
            if(i==0 || j==0 || (j+1)==curRow || (i+1)==7) type = Tile.TYPE_BLOCK;
            
            var newTile = new Tile(game, this, i, curRow, type);
            newTile.x = curXStart + i * (Grid.HEX_WIDTH * 0.77) + Grid.HEX_WIDTH/2;
            newTile.y = curYStart + (Grid.HEX_HEIGHT * 1.07) * j;
            this.add(newTile);
            
            if (heighestY > newTile.y) heighestY = newTile.y;
            if (heighestX < newTile.x) heighestX = newTile.x;
            if (lowestY < newTile.y) lowestY = newTile.y;
            if (lowestX > newTile.x) lowestX = newTile.x;
            
            this.tiles.push( newTile );
        }
        
        if (i * 2 >= (width-1)) {
            curRow--;
            curYStart += Grid.HEX_HEIGHT/2;
        }else {
            curRow++;
            curYStart -= Grid.HEX_HEIGHT/2;
        }
    }
    
   console.log(lowestX+" "+heighestX+" " +lowestY+" "+heighestY);
    var midX = (lowestX-heighestX)/2;
    var midY = (heighestY - lowestY)/2;
    console.log(midX+" " +midY);
    for(var i= 0;i<this.tiles.length; i++){
        this.tiles[i].x += midX - Grid.HEX_WIDTH/2;
        this.tiles[i].y += midY + Grid.HEX_HEIGHT*1.5;
    }
    
    //var img = this.create(0,0,"pixel");
    this.generateNumber(2);
    this.generateNumber(4);
}
Grid.prototype = Object.create(Phaser.Group.prototype);
Grid.prototype.constructor = Grid;


Grid.HEX_WIDTH = 75;
Grid.HEX_HEIGHT = 65;


Grid.prototype.rotateDir = function( dir ){
    if(this.rotationBlocker) return;
    this.rotationBlocker= true;
    this.curRotation +=dir;
    if (this.curRotation < 0) this.curRotation = 5;
    else if (this.curRotation > 5) this.curRotation = 0;
    
    this.turnSound = this.game.add.audio('turnSound');
    this.turnSound.play();
    
   var rotateTo = this.rotation - Math.PI/3;
   if(dir>0) rotateTo= this.rotation + Math.PI/3;

    var degrees = (180/Math.PI)*rotateTo;

   var tween = this.game.add.tween(this).to({angle:degrees},500,Phaser.Easing.Linear.None, true, 100);
    tween.onComplete.add(this.onTweenComplete, this);
    for(var i= 0;i<this.tiles.length; i++){
        this.tiles[i].rotateDir( dir);
    }
    
}

Grid.prototype.onTweenComplete = function (){
    var i = 0;
    var imax = this.tiles.length;
    var rval;
    var row; 
    var col; 
    var movementCounter = 0;
    //console.log("onTweenComplete() this.curRotation:"+this.curRotation);
    if (this.curRotation < 3) {
        for(var i = imax-2;i>=0;i--){
            if (this.tiles[i].num != 0) {
                rval = i;	
				row = this.tiles[i].j;
				col = this.tiles[i].i;
                switch(this.curRotation) {
                    case 0:	//check tile below (3)
                        rval++;
                        if (rval < this.tiles.length && rval>=0 && this.tiles[rval].i != col) rval = -1;
                        break;
                    case 1:
                        if(this.COLS % 2!=0 && col >= Math.floor((this.COLS-1)/2)) rval += row;
                        else if(this.COLS%2==0 && col >= Math.floor(this.COLS/2)) rval += row;
                        else rval += row + 1;
                        break;
                    case 2:
                        if (this.COLS % 2 != 0 && col >= Math.floor((this.COLS - 1) / 2)) rval += row - 1;
                        else if(this.COLS % 2 == 0 && col >= Math.floor(this.COLS  / 2)) rval += row - 1;
                        else rval += row;
                        break;
                }
                if(rval < this.tiles.length && rval>=0 && rval!=i){
                    if (this.tiles[rval].num == 0 && this.tiles[rval].type==Tile.TYPE_ACTIVE) {
                        this.tiles[rval].setNumber( this.tiles[i].num );
                        this.tiles[i].setNumber( 0 );
                        this.tiles[i].lock=false;
                        movementCounter++;
                    }else if ( this.tiles[rval].num == this.tiles[i].num && this.tiles[rval].type==Tile.TYPE_ACTIVE && !this.tiles[rval].lock && !this.tiles[i].lock) {
                        this.tiles[rval].setNumber( this.tiles[rval].num * 2 ); 
                        this.tiles[rval].lock = true ;
                        this.tiles[i].setNumber(0);
                        this.tiles[i].lock=false;
                        movementCounter++;
                    }
                }
            }
        }
    }else {
        for(var i=1;i<imax;i++){
            if (this.tiles[i].num != 0) {
                rval = i;	
				row = this.tiles[i].j;
				col = this.tiles[i].i;
                
                switch(this.curRotation) {
                    case 3:
                        rval--;
                        if (rval < this.tiles.length && rval>=0 && this.tiles[rval].i != col) rval = -1;
                        break;
                    case 4:
                        if (this.COLS % 2 != 0 && col > Math.floor((this.COLS - 1) / 2)) rval -= row+1;
                        else if (this.COLS % 2 == 0 && col > Math.floor(this.COLS / 2)) rval -= row+1;
                        else rval -= row;
                        break;
                    case 5:
                        if (this.COLS % 2 != 0 && col > Math.floor((this.COLS - 1) / 2)) rval -= row;
                        else if (this.COLS % 2 == 0 && col > Math.floor(this.COLS / 2)) rval -= row;
                        else rval -= row - 1;
                        break;
                }
                
                if(rval < this.tiles.length && rval>=0 && rval!=i){
                    if (this.tiles[rval].num == 0 && this.tiles[rval].type==Tile.TYPE_ACTIVE) {
                        this.tiles[rval].setNumber( this.tiles[i].num );
                        this.tiles[i].setNumber( 0 );
                        this.tiles[i].lock = false;
                        movementCounter++;
                    }else if ( this.tiles[rval].num == this.tiles[i].num && this.tiles[rval].type==Tile.TYPE_ACTIVE && !this.tiles[rval].lock && !this.tiles[i].lock) {
                        this.tiles[rval].setNumber( this.tiles[rval].num * 2 );
                        this.tiles[rval].lock= true ;
                        this.tiles[i].setNumber( 0);
                        this.tiles[i].lock=false;
                        movementCounter++;
                    }
                }
            }
        }
    }
    if (movementCounter != 0) this.onTweenComplete();
    else this.addNumber();
}

Grid.prototype.addNumber = function(){
    var emptyHex = [];
    //find all empty spots
    var imax = this.tiles.length;
    var i = 0;
    while (i < imax) {
        if (this.tiles[i].num == 0 && this.tiles[i].type==Tile.TYPE_ACTIVE) {
            emptyHex.push(i);
        }
        this.tiles[i].lock = false;
        i++;
    }


    if (emptyHex.length == 0) {
        //GAME OVER
        console.log("GAME OVER");
        this.controlSp.events.onGameOver.dispatch(this);
        return;
    }
    this.rotationBlocker = false;
    var rand =  this.game.rnd.integerInRange(0,emptyHex.length-1);
    var num= (this.game.rnd.integerInRange(0,100) > 70)?2:4;
    this.tiles[emptyHex[rand]].setNumber( num );
}

Grid.prototype.generateNumber = function ( num ){
    var rand;
    var flag = false;
    do {
        rand =  this.game.rnd.integerInRange(0, this.tiles.length-1);
        if (this.tiles[rand].num == 0 && this.tiles[rand].type==Tile.TYPE_ACTIVE) {
            flag = true;
            this.tiles[rand].setNumber(num);
        }
    }while (!flag);
}

