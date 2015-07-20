/**
 * @file 水管模块
 * @author ielgnaw(wuji0223@gmail.com)
 */

/* global ig */

'use strict';


/**
 * 背景水管模块
 *
 * @return {Object} 模块导出对象
 */
var waterpipeControl = (function () {

    var cjGame;
    var cjStage;

    var guid = 0;

    var waterpipe = {};

    /**
     * 创建背景水管
     *
     * @return {Object} 水管对象
     */
    waterpipe.createWaterpipe = function (callback) {
        var waterpipeMain = new ig.Bitmap({
            name: 'waterpipeMain',
            asset: cjGame.asset.spritesImg1,
            x: 470,
            y: 350,
            sx: 614,
            sy: 46,
            width: 32,
            sWidth: 32,
            height: 33,
            sHeight: 33,
            zIndex: 9,
            scaleY: 1.5,
        });
        waterpipeMain.setAnimate({
            target: {
                y: 296
            },
            duration: 1500,
            completeFunc: function () {
                callback();
            }
        });
        return waterpipeMain;
    };

    /**
     * 初始化
     *
     * @param {Object} opts 参数
     */
    waterpipe.init = function (opts) {
        cjGame = opts.cjGame;
        cjStage = opts.cjStage;
    };

    return waterpipe;
})();
