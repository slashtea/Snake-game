/**
 * Created by shannon on 10/29/14.
 * Game engine.
 * @author: Ziyad MEstour
 */

// Constants.
var COLS=26, ROWS=26;

// IDs.
var EMPTY=0, SNAKE=1, FRUIT=2;

// Directions.
var LEFT=0, UP=1, RIGHT=2, DOWN=3;

// Keyboards.
var KEY_LEFT=37, KEY_UP=38, KEY_RIGHT=39, KEY_DOWN=40;

// Score
var score=0;

/** Let's start by making our grid.
 * It is going to be implemented using the singleton pattern.
 */

var grid = {

    width: null,
    height: null,
    _grid: null,

    init: function(d,c,r){

        // Setting up members.

        this.width = c;
        this.height = r;

        // Creating the grid.

        this._grid = [];            // Grid is empty.
        for(var x=0; x<c; x++){
            this._grid.push([]);        // Creating the columns.
            for(var y=0; y<r; y++) {
                this._grid[x].push(d);      // Creating rows related to columns.
            }
        }
    },

    set: function(val,x,y){
        this._grid[x][y] = val;     // Setting a specific point with specific value.
    },

    get: function(x,y) {
        return this._grid[x][y];        // returns a point of the grid.
    }
}

/**
 * Now let's make our snake object.
 * Again we're going to implement the singleton pattern.
 */

var snake = {

    direction: null,
    last: null,
    _queue: null,

    init: function(d,x,y) {
        this.direction = d;

        this._queue = [];
        this.insert(x,y);
    },

    insert: function(x,y) {
        this._queue.unshift({x:x,y:y});
        this.last = this._queue[0];
    },

    remove: function() {
        return this._queue.pop();
    }
}

function setFood() {
    var empty = [];

    for(var x=0; x<grid.width; x++){
        for(var y=0; y<grid.height; y++){
            if(grid.get(x,y) === EMPTY){
                empty.push({x:x, y:y});
            }
        }
    }

    var randpos = empty[Math.floor(Math.random()*empty.length)];
    grid.set(FRUIT, randpos.x, randpos.y);
}

/**
 * Game Objects.
 */

var canvas, ctx, keystate, frames;

function main() {
    canvas = document.createElement("canvas");
    canvas.width = COLS*20;
    canvas.height = ROWS*20;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    frames = 0;
    keystate = {};
    document.addEventListener("keydown", function(evt){
        keystate[evt.keyCode] = true;
     });
    document.addEventListener("keyup", function(evt){
        delete keystate[evt.keyCode];
    });


    init();
    loop();

}

function init(){
    grid.init(EMPTY,COLS,ROWS);

    // Starting positions.
    var sp = {x:Math.floor(COLS/2), y:ROWS-1};
    snake.init(UP,sp.x,sp.y);
    grid.set(SNAKE,sp.x,sp.y);


    setFood();
    score =0;
}

function loop() {
    update();
    draw();

    window.requestAnimationFrame(loop,canvas);
}

function update() {
    frames++;

    if(keystate[KEY_LEFT] && snake.direction != RIGHT) snake.direction = LEFT;
    if(keystate[KEY_UP] && snake.direction != DOWN) snake.direction = UP;
    if(keystate[KEY_RIGHT] && snake.direction != LEFT) snake.direction = RIGHT;
    if(keystate[KEY_DOWN] && snake.direction != UP) snake.direction = DOWN;

    if(frames%5 === 0) {
        var nx = snake.last.x;
        var ny = snake.last.y;

        switch(snake.direction){
            case LEFT:
                nx--;
                break;
            case UP:
                ny--;
                break;
            case RIGHT:
                nx++;
                break;
            case DOWN:
                ny++;
                break;
        }

        if(0 > nx || nx > grid.width -1 ||
           0 > ny || ny > grid.height - 1 ||
           grid.get(nx,ny) === SNAKE
        )
        {
            alert("Your score is : " + score);
            return init();
        }

        if(grid.get(nx,ny) == FRUIT) {
            var tail = {x:nx,y:ny};
            score ++;
            setFood();
        } else {
            var tail = snake.remove();
            grid.set(EMPTY,tail.x,tail.y);
            tail.x = nx;
            tail.y = ny;
        }

        grid.set(SNAKE,tail.x,tail.y);

        snake.insert(tail.x,tail.y);
    }

    if(score >= 10) {

        if(frames%4 === 0) {
        var nx = snake.last.x;
        var ny = snake.last.y;

        switch(snake.direction){
            case LEFT:
                nx--;
                break;
            case UP:
                ny--;
                break;
            case RIGHT:
                nx++;
                break;
            case DOWN:
                ny++;
                break;
        }

        if(0 > nx || nx > grid.width -1 ||
           0 > ny || ny > grid.height - 1 ||
           grid.get(nx,ny) === SNAKE
        )
        {
            alert("Your score is : " + score);
            return init();
        }

        if(grid.get(nx,ny) == FRUIT) {
            var tail = {x:nx,y:ny};
            score ++;
            setFood();
        } else {
            var tail = snake.remove();
            grid.set(EMPTY,tail.x,tail.y);
            tail.x = nx;
            tail.y = ny;
        }

        grid.set(SNAKE,tail.x,tail.y);

        snake.insert(tail.x,tail.y);
    }
    }
}

function draw(){
    var tw = canvas.width/grid.width;
    var th = canvas.height/grid.height;

    for(var x=0; x<grid.width; x++) {
        for(var y=0; y<grid.height; y++){
            switch (grid.get(x,y)){
                case EMPTY:
                    ctx.fillStyle = "#F0FFF0";
                    break;
                case SNAKE:
                    ctx.fillStyle = "#00FA9A";
                    break;
                case FRUIT:
                    ctx.fillStyle = "#FA8072";
                    break;
            }
            ctx.fillRect(x*tw,y*th, tw, th);
        }
    }
    ctx.fillStyle = "#000";
    ctx.fillText("Score:" + score, 10, canvas.height-12);
    ctx.font = "30px Calibri";

}

main();