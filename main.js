// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
    var num = Math.floor(Math.random()*(max-min)) + min;
    return num;
}
function Ball(x,y,velX,velY,color,size) {
    this.x = x;//初始坐标的x y值
    this.y = y;
    this.velX = velX;//水平垂直速度
    this.velY = velY;
    this.color = color;
    this.size = size;//半径距离
}
Ball.prototype.draw = function () {
    ctx.beginPath();//开始画图
    ctx.fillStyle = this.color;//定义颜色
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
           //原点坐标x y值，半径距离，开始和结束的角度360度
    ctx.fill();//结束了绘画 并且以之前设置的颜色填充
};
Ball.prototype.update = function () {
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

};
Ball.prototype.collisionDetect = function () {
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
};
var balls = [];
function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';//填充色
    ctx.fillRect(0, 0, width, height);
    //将整个画布的颜色设置成半透明的黑色
    // 这是在下一个视图画出来时用来遮住之前的视图的

    while (balls.length < 25) {//数组长度小于25则继续
        var ball = new Ball(//创建小球
            random(10,width-10),//x坐标
            random(10,height-10),//y坐标
            random(-7,7),//速度
            random(-7,7),
            'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
            //颜色随机
            random(10,20)//大小随机
        );
        balls.push(ball);
    }

    for (var i = 0; i < balls.length; i++) {
        balls[i].draw();//将小球画出来
        balls[i].update();//调用更新函数
        balls[i].collisionDetect();//当前正在遍历的小球调用碰撞检测方法
    }

    requestAnimationFrame(loop);//递归调用自己
}
loop();