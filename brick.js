/* global ig */

'use strict';


/**
 * 砖头模块，三种砖头，可顶碎的、不可顶碎的、带金币的
 *
 * @return {Object} 模块导出对象
 */
var brickControl = (function () {

    var cjGame;
    var cjStage;

    var guid = 0;

    var brick = {};
    brick.width = 16;
    brick.height = 16;

    /**
     * 创建可顶碎的砖头
     *
     * @param {number} x 横坐标
     * @param {number} y 纵坐标
     *
     * @return {Object} 砖头对象
     */
    brick.create1 = function (x, y) {
        return new ig.Bitmap({
            name: 'brick1_' + guid++,
            asset: cjGame.asset.spritesImg1,
            x: x,
            y: y,
            sx: 373,
            sy: 103,
            width: brick.width,
            sWidth: brick.width,
            height: brick.height,
            sHeight: brick.height,
            zIndex: 10,
            // debug: 1
        });
    };

    /**
     * 创建不可顶碎的砖头
     *
     * @param {number} x 横坐标
     * @param {number} y 纵坐标
     *
     * @return {Object} 砖头对象
     */
    brick.create2 = function (x, y) {
        return new ig.Bitmap({
            name: 'brick2_' + guid++,
            asset: cjGame.asset.spritesImg1,
            x: x,
            y: y,
            sx: 373,
            sy: 84,
            width: brick.width,
            sWidth: brick.width,
            height: brick.height,
            sHeight: brick.height,
            zIndex: 10,
            // debug: 1
        });
    };

    /**
     * 创建带金币的砖头
     *
     * @param {number} x 横坐标
     * @param {number} y 纵坐标
     *
     * @return {Object} 砖头对象
     */
    brick.create3 = function (x, y) {
        return new ig.Bitmap({
            name: 'brick3_' + guid++,
            asset: cjGame.asset.spritesImg1,
            x: x,
            y: y,
            sx: 372,
            sy: 160,
            width: brick.width,
            sWidth: brick.width,
            height: brick.height,
            sHeight: brick.height,
            zIndex: 10,
            // debug: 1
        });
    };

    /**
     * 创建五个砖头，思路是创建最左边那个，另外四个作为最左边那个的 children
     * 可顶碎的、不可顶碎的、可顶碎的、带金币的、可顶碎的
     *
     * @param {number} x 横坐标
     * @param {number} y 纵坐标
     *
     * @return {Object} 砖头对象
     */
    brick.createMain = function (x, y) {
        var brickMain = new ig.Bitmap({
            name: 'brickMain_' + guid++,
            asset: cjGame.asset.spritesImg1,
            x: x,
            y: y,
            sx: 373,
            sy: 103,
            width: brick.width,
            sWidth: brick.width,
            height: brick.height,
            sHeight: brick.height,
            zIndex: 10,
            children: [
                brick.create2(16, 0),
                brick.create1(32, 0),
                brick.create3(48, 0),
                brick.create1(64, 0)
            ]
        });

        brickMain.setAnimate({
            target: {
                x: cjGame.width / 3
            },
            duration: 1000,
            tween: ig.easing.easeOutBounce
        });

        return brickMain;
    };

    /**
     * 初始化
     *
     * @param {Object} opts 参数
     */
    brick.init = function (opts) {
        cjGame = opts.cjGame;
        cjStage = opts.cjStage;
    };

    return brick;
})();
