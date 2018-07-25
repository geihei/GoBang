;(function() {
    "use strict";
    let _global;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    /*先手为黑子*/
    let currentUser = 'black';
    /*
    * 定义棋盘对象
    * n:每条边有多少条线
    * cellWidth:单元格宽度
    * maxCount:连续多少子获胜
    * init():初始化棋盘
    * isExsit():当前点是否存在棋子
    * convertPosition():当前点坐标
    * drawCheese():画棋子
    * checkWin():是否获胜
    */
    function CheeseBoard(n = 20, cellWidth = 40, maxCount = 5){
        this.cellWidth = cellWidth;
        this.maxCount = maxCount;
        this.isEnd = false;
        this.line = n;
        this.arr = [];
    }
    CheeseBoard.prototype = {
        init: function () {
            canvas.width = this.cellWidth*(this.line + 1);
            canvas.height = this.cellWidth*(this.line + 1);
            ctx.save();
            ctx.beginPath();
            for(let i = 0;i <= this.line;i ++){
                ctx.moveTo(this.cellWidth / 2, this.cellWidth / 2 + this.cellWidth*i);
                ctx.lineTo(this.cellWidth / 2 + this.cellWidth*this.line, this.cellWidth / 2 + this.cellWidth*i)
                ctx.moveTo(this.cellWidth / 2 + this.cellWidth*i, this.cellWidth / 2);
                ctx.lineTo(this.cellWidth / 2 + this.cellWidth*i, this.cellWidth / 2 + this.cellWidth*this.line);
                this.arr[i] = [];
            }
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.closePath();
        },
        isExsit: function (x, y) {
            var point = this.convertPosition(x, y);
            return (this.arr[point.xIndex] && typeof(this.arr[point.xIndex][point.yIndex]) != 'undefined')
        },
        convertPosition: function(x, y){
            return {xIndex: Math.round((x - this.cellWidth / 2)/this.cellWidth),yIndex: Math.round((y - this.cellWidth / 2)/this.cellWidth)};
        },
        drawCheese: function (x, y, color) {
            if(this.isEnd == true) return;
            var point = this.convertPosition(x, y);
            ctx.save();
            ctx.beginPath();
            ctx.arc(point.xIndex * this.cellWidth + this.cellWidth / 2, point.yIndex * this.cellWidth + this.cellWidth / 2,this.cellWidth*2 / 5,0,Math.PI * 2,true);
            ctx.shadowBlur = 5;
            ctx.shadowColor = "black";
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            this.arr[point.xIndex][point.yIndex] = color;
            if(this.checkWin(point.xIndex, point.yIndex, color)){
                this.isEnd = true;
                setTimeout(function(){alert(color + "获胜");}, 100);
            }
        },
        checkWin: function(x, y, color) {
            var direction = [{x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: -1}]
            var count = 1;
            for (var index = 0; index < direction.length; index ++) {
                var d = direction[index];

                var i = x + d.x, j = y + d.y;
                for(var c = 0; c < this.maxCount; c ++){
                    if(j >= 0 && i >= 0 && i < this.line && j < this.line && this.arr[i][j] == color){
                        count ++;
                    }
                    else{
                        break;
                    }
                    i += d.x;
                    j += d.y;
                }

                i = x - d.x;
                j = y - d.y;
                for(var c = 0; c < this.maxCount; c ++){
                    if(j >= 0 && i >= 0 && i < this.line && j < this.line && this.arr[i][j] == color){
                        count ++;
                    }
                    else{
                        break;
                    }
                    i -= d.x;
                    j -= d.y;
                }

                if(count >= this.maxCount){
                    return true;
                }
                else{
                    count = 1;
                }
            }
            return false;
            
        }
    }

    /*
    黑白子切换
    */
    canvas.onmousedown = function(event) {
        var e = event || window.event;
        
        if(!cheeseboard.isExsit(e.offsetX, e.offsetY)){
            cheeseboard.drawCheese(e.offsetX, e.offsetY, currentUser);
            currentUser = currentUser == 'black' ? 'white' : 'black';
        }
    }

    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = CheeseBoard;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return CheeseBoard;});
    } else {

        !('CheeseBoard' in _global) && (_global.CheeseBoard = CheeseBoard);
    }
})();