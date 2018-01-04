// setup canvas
//获取canvas元素
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
//获取窗口宽度
var width = canvas.width = window.innerWidth;
//获取窗口高度
var height = canvas.height = window.innerHeight;
//存着小球参数的数组
var balls = [];
var len = 25;
var jsnum = document.querySelector('.js-num');
// function to generate random number
function random(min,max) {
    var num = Math.floor(Math.random()*(max-min)) + min;
    return num;
}
function ballsLeft() {
    var num = len;
    for(var i=0;i<balls.length;i++){
        if(balls[i].exists==false){
            num--;
        }
    }
    return num;
}

/*
*
* 构造函数
*
* */
function Shape(x,y,velX,velY,exists) {
    this.x = x;//初始坐标的x y值
    this.y = y;
    this.velX = velX;//水平垂直速度
    this.velY = velY;
    this.exists = exists;
}

function Ball(x,y,velX,velY,color,size,exists) {
    Shape.call(this,x,y,velX,velY,exists);
    this.color = color;
    this.size = size;//半径距离
}
Ball.prototype.constructor = Ball;
/*
*
* 挂在原型上的方法 draw方法 完成画出小球的操作
*
* */
Ball.prototype.draw = function () {
    if(this.exists){
        ctx.beginPath();//开始画图
        ctx.fillStyle = this.color;//定义颜色
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        //原点坐标x y值，半径距离，开始和结束的角度360度
        ctx.fill();//结束了绘画 并且以之前设置的颜色填充
    }
};

/*
*
* 挂在原型上的方法 update方法 完成更新小球坐标的操作
*
* */
Ball.prototype.update = function () {
    if(this.exists){
        if(this.x+this.size>=width){
            this.velX = -(this.velX);
        }
        if(this.x-this.size<=0) {
            this.velX = -(this.velX);
        }
        if(this.y+this.size>=height) {
            this.velY = -(this.velY);
        }
        if(this.y-this.size<=0) {
            this.velY = -(this.velY);
        }
        this.x += this.velX;
        this.y += this.velY;
    }
};

/*
*
* 挂在原型上的方法 collisionDetect方法 完成检测小球相撞变色的操作
*
* */
Ball.prototype.collisionDetect = function () {
    if(this.exists){
        for(var i=0;i<balls.length;i++){//this是从调用处传来的？
            if(!(this===balls[i])){//数组中每一个值和this比对
                //要是不是全等则看看是否和this相撞
                var dx = this.x-balls[i].x;
                var dy = this.y-balls[i].y;
                var distance = Math.sqrt(dx*dx+dy*dy);
                if(distance<this.size+balls[i].size){
                    balls[i].color = this.color = 'rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')';
                }
            }
        }
    }
};

function EvilCircle(color,x,y,exists) {
    Shape.call(this,x,y,exists);
    this.color = color;
    this.size = 10;//半径距离
    this.velX = 20;
    this.velY = 20;
}
EvilCircle.prototype.constructor = EvilCircle;
EvilCircle.prototype.draw = function () {
    ctx.beginPath();//开始画图
    ctx.fillStyle = this.color;//定义颜色
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    //原点坐标x y值，半径距离，开始和结束的角度360度
    ctx.fill();//结束了绘画 并且以之前设置的颜色填充
};
EvilCircle.prototype.beInRect = function () {
    if(this.x<=0){
        this.x+=this.velX;
    }
    if(this.x>=width){
        this.x-=this.velX;
    }
    if(this.y<=0){
        this.y+=this.velY;
    }
    if(this.y>=height){
        this.y-=this.velY;
    }
};
EvilCircle.prototype.beControlled = function (num) {
    var _this = this;
    window.onkeydown = function (e) {
        if(num==1){
            if(e.keyCode=='87'){
                _this.y-=_this.velY;
            }
            if(e.keyCode=='83'){
                _this.y+=_this.velY;
            }
            if(e.keyCode=='65'){
                _this.x-=_this.velX;
            }
            if(e.keyCode=='68'){
                _this.x+=_this.velX;
            }
        }
        if(num==2){
            if(e.keyCode=='38'){
                _this.y-=_this.velY;
            }
            if(e.keyCode=='40'){
                _this.y+=_this.velY;
            }
            if(e.keyCode=='37'){
                _this.x-=_this.velX;
            }
            if(e.keyCode=='39'){
                _this.x+=_this.velX;
            }
        }
    };
};
EvilCircle.prototype.collisionDetect = function () {
    for(var i=0;i<balls.length;i++){//this是从调用处传来的？
        if(!(this===balls[i])){//数组中每一个值和this比对
            //要是不是全等则看看是否和this相撞
            var dx = this.x-balls[i].x;
            var dy = this.y-balls[i].y;
            var distance = Math.sqrt(dx*dx+dy*dy);
            if(distance<this.size+balls[i].size){
                balls[i].exists = false;
                jsnum.innerHTML = ballsLeft();
            }
        }
    }
};
/*
*
* loop方法 初始化25个小球 并且递归调用自己 来让小球的状态更新
*
* */
function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';//填充色
    ctx.fillRect(0, 0, width, height);
    //将整个画布的颜色设置成半透明的黑色
    // 这是在下一个视图画出来时用来遮住之前的视图的

    while (balls.length < len) {//数组长度小于25则继续
        var ball = new Ball(//创建小球
            random(10,width-10),//x坐标
            random(10,height-10),//y坐标
            random(-7,7),//速度
            random(-7,7),
            'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
            //颜色随机
            random(10,20),//大小随机
            true
        );
        balls.push(ball);
    }

    for (var i = 0; i < balls.length; i++) {
        balls[i].draw();//将小球画出来
        balls[i].update();//调用更新函数
        balls[i].collisionDetect();//当前正在遍历的小球调用碰撞检测方法
    }
    evalcircle.draw();
    evalcircle.beInRect();
    evalcircle.collisionDetect();
    // evalcircle2.draw();
    // evalcircle2.beInRect();
    // evalcircle2.collisionDetect();
    requestAnimationFrame(loop);//递归调用自己
}
var evalcircle = new EvilCircle('red',200,300,true);
evalcircle.beControlled(1);
// var evalcircle2 = new EvilCircle('blue',400,400,true);
// evalcircle2.beControlled(2);


loop();
