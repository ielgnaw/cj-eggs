/**
 * @file 背景的山坡和草丛模块
 * @author ielgnaw(wuji0223@gmail.com)
 */

/* global ig */

'use strict';


/**
 * 背景水管模块
 *
 * @return {Object} 模块导出对象
 */
var hillAndBrushwoodControl = (function () {

    var cjGame;
    var cjStage;

    var guid = 0;

    var hillAndBrushwood = {};

    /**
     * 创建背景的山坡
     *
     * @return {Object} 山坡对象
     */
    hillAndBrushwood.createHill = function () {
        var hillMain = new ig.Bitmap({
            name: 'hillMain',
            asset: cjGame.asset.spritesImg1,
            x: 10,
            y: 300,
            sx: 48,
            sy: 160,
            width: 150,
            sWidth: 150,
            height: 36,
            sHeight: 36,
            zIndex: 10,
            alpha: 0
        });
        hillMain.setAnimate({
            target: {
                alpha: 0.5
            },
            duration: 1000,
            completeFunc: function () {
            }
        });
        return hillMain;
    }

    /**
     * 创建背景的草丛
     *
     * @return {Object} 草丛对象
     */
    hillAndBrushwood.createBrushwood = function () {
        var brushwoodMain = new ig.Bitmap({
            name: 'brushwoodMain',
            asset: cjGame.asset.spritesImg1,
            x: 230,
            y: 320,
            sx: 48,
            sy: 253,
            width: 152,
            sWidth: 152,
            height: 17,
            sHeight: 17,
            zIndex: 10,
            alpha: 0
            // debug: 1
        });
        brushwoodMain.setAnimate({
            target: {
                alpha: 0.5
            },
            duration: 1000,
            completeFunc: function () {
            }
        });
        return brushwoodMain;
    }

    /**
     * 初始化
     *
     * @param {Object} opts 参数
     */
    hillAndBrushwood.init = function (opts) {
        cjGame = opts.cjGame;
        cjStage = opts.cjStage;
    };

    return hillAndBrushwood;
})();
