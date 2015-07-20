/**
 * @file 地面模块
 * @author ielgnaw(wuji0223@gmail.com)
 */

/* global ig */

'use strict';


/**
 * 地面模块
 *
 * @return {Object} 暴露方法
 */
var groundControl = (function () {

    var cjGame;
    var cjStage;

    var guid = 0;

    var ground = {};

    // 地面每块砖的宽度
    ground.pieceWidth = 16;

    // 地面每块砖的高度
    ground.pieceHeight = 16;

    /**
     * 创建地面上一块砖头
     *
     * @return {Object} 砖头对象
     */
    ground.createGroundPiece = function (x, y) {
        var tmp = {
            name: 'groundPiece_' + guid++,
            x: x,
            y: y,
            sx: 373,
            sy: 124,
            width: ground.pieceWidth,
            sWidth: ground.pieceWidth,
            height: ground.pieceHeight,
            sHeight: ground.pieceHeight,
            zIndex: 10
        };
        if (cjGame.asset && cjGame.asset.spritesImg1) {
            tmp.asset = cjGame.asset.spritesImg1;
        }
        else {
            tmp.image = 'spritesImg1';
        }
        return new ig.Bitmap(tmp);
    };

    /**
     * 创建整个地面
     */
    ground.createGround = function () {
        var pieces = Math.ceil(cjGame.width / 16);

        var y = 64;
        var index = 0;

        ig.loop({
            step: function (dt, stepCount, requestID) {
                cjStage.addDisplayObject(
                    groundControl.createGroundPiece(index * ground.pieceWidth, cjGame.height - y)
                );
                if (index === pieces - 1) {
                    if (y !== 16) {
                        y -= 16;
                        index = 0;
                    }
                    else {
                        window.cancelAnimationFrame(requestID);
                        requestID = null;
                    }
                }
                else {
                    index++;
                }
            },
            jumpFrames: 3
        });

        // var loop = function () {
        //     for (var i = 0; i < pieces; i++) {
        //         /* jshint loopfunc:true */
        //         (function (index) {
        //             setTimeout(function () {
        //                 cjStage.addDisplayObject(groundControl.createGroundPiece(index * 16, cjGame.height - y));
        //                 if (index === pieces - 1) {
        //                     if (y !== 16) {
        //                         y -= 16;
        //                         loop();
        //                     }
        //                     else {
        //                         // cjStage.setBgColor('#5283f4');
        //                     }
        //                 }
        //             }, (index + 1) * 50);
        //         })(i);
        //     }
        // }
        // loop();
    };

    /**
     * 初始化
     *
     * @param {Object} opts 参数
     */
    ground.init = function (opts) {
        cjGame = opts.cjGame;
        cjStage = opts.cjStage;
    };

    return ground;
})();
