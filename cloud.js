/**
 * @file 云朵模块
 * @author ielgnaw(wuji0223@gmail.com)
 */

/* global ig */

'use strict';


/**
 * 云朵模块
 *
 * @return {Object} 模块导出对象
 */
var cloudControl = (function () {

    var util = ig.util;
    var CONFIG = ig.getConfig();
    var STATUS = CONFIG.status;

    var cjGame;
    var cjStage;

    var guid = 0;

    /**
     * 设置动画
     */
    function _setAnimate() {
        this.setAnimate({
            target: {
                alpha: 1
            },
            duration: 1000
        });
    }

    /**
     * step update
     */
    function _step(dt, stepCount, requestID) {
        this.vx += this.ax * dt;
        this.vx *= this.frictionX * dt;
        this.vy += this.ay * dt;
        this.vy *= this.frictionY * dt;

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        this.move(this.x, this.y);
    }

    var cloud = {};

    /**
     * 创建一朵的云
     *
     * @param {number} x 横坐标
     * @param {number} y 纵坐标
     *
     * @return {Object} 云朵对象
     */
    cloud.create1 = function (x, y) {
        var cloud1 = new ig.Bitmap({
            name: 'cloud_1' + guid++,
            asset: cjGame.asset.spritesImg1,
            x: x,
            y: util.randomInt(20, 80),
            sx: 160,
            sy: 198,
            width: 35,
            sWidth: 35,
            height: 24,
            sHeight: 24,
            zIndex: 10,
            alpha: 0,
            vx: -0.3
        });

        _setAnimate.call(cloud1);

        cloud1.step = function (dt, stepCount, requestID) {
            _step.call(this, dt, stepCount, requestID);
            if (this.x + this.width < 0) {
                cjStage.addDisplayObject(cloud.create1(cjGame.width, this.y));
                this.setStatus(STATUS.DESTROYED);
            }
        };
        return cloud1;
    };

    /**
     * 创建两朵的云
     *
     * @param {number} x 横坐标
     * @param {number} y 纵坐标
     *
     * @return {Object} 云朵对象
     */
    cloud.create2 = function (x, y) {
        var cloud2 = new ig.Bitmap({
            name: 'cloud_2' + guid++,
            asset: cjGame.asset.spritesImg1,
            x: x,
            y: util.randomInt(20, 80),
            sx: 48,
            sy: 198,
            width: 47,
            sWidth: 47,
            height: 24,
            sHeight: 24,
            zIndex: 10,
            alpha: 0,
            vx: -0.3,
        });

        _setAnimate.call(cloud2);

        cloud2.step = function (dt, stepCount, requestID) {
            _step.call(this, dt, stepCount, requestID);
            if (this.x + this.width < 0) {
                cjStage.addDisplayObject(cloud.create2(cjGame.width, this.y));
                this.setStatus(STATUS.DESTROYED);
            }
        };
        return cloud2;
    };

    /**
     * 创建三朵的云
     *
     * @param {number} x 横坐标
     * @param {number} y 纵坐标
     *
     * @return {Object} 云朵对象
     */
    cloud.create3 = function (x, y) {
        var cloud3 = new ig.Bitmap({
            name: 'cloud_3' + guid++,
            asset: cjGame.asset.spritesImg1,
            x: x,
            y: util.randomInt(20, 80),
            sx: 95,
            sy: 198,
            width: 66,
            sWidth: 66,
            height: 24,
            sHeight: 24,
            zIndex: 10,
            alpha: 0,
            vx: -0.3
        });

        _setAnimate.call(cloud3);

        cloud3.step = function (dt, stepCount, requestID) {
            _step.call(this, dt, stepCount, requestID);
            if (this.x + this.width < 0) {
                cjStage.addDisplayObject(cloud.create3(cjGame.width, this.y));
                this.setStatus(STATUS.DESTROYED);
            }
        };
        return cloud3;
    };

    /**
     * 创建三种云朵
     */
    cloud.create = function () {
        var xArr = [
            util.randomInt(10, cjGame.width / 2 - 150),
            util.randomInt(cjGame.width / 2 - 150, cjGame.width / 2 + 150),
            util.randomInt(cjGame.width / 2 + 150, cjGame.width - 70)
        ];
        var opts = [
            {
                sx: 160,
                sy: 198,
                width: 35,
                sWidth: 35,
                height: 24,
                sHeight: 24,
                alpha: 0,
            },
            {
                sx: 48,
                sy: 198,
                width: 47,
                sWidth: 47,
                height: 24,
                sHeight: 24,
                alpha: 0,
            },
            {
                sx: 95,
                sy: 198,
                width: 66,
                sWidth: 66,
                height: 24,
                sHeight: 24,
                alpha: 0,
            }
        ];

        for (var i = 1, len = opts.length; i <= len; i++) {
            var tmp = new ig.Bitmap({
                x: xArr[i - 1],
                y: util.randomInt(20, 80),
                name: 'cloud_' + i,
                asset: cjGame.asset.spritesImg1,
                sx: opts[i - 1].sx,
                sy: opts[i - 1].sy,
                width: opts[i - 1].width,
                sWidth: opts[i - 1].sWidth,
                height: opts[i - 1].height,
                sHeight: opts[i - 1].sHeight,
                alpha: opts[i - 1].alpha,
                zIndex: 10,
                vx: -0.3,
            });

            _setAnimate.call(tmp);

            tmp.step = function (dt, stepCount, requestID) {
                _step.call(this, dt, stepCount, requestID);

                if (this.x + this.width < 0) {
                    if (this.name.indexOf('_1') > -1) {
                        cjStage.addDisplayObject(cloud.create1(cjGame.width, this.y));
                        this.setStatus(STATUS.DESTROYED);
                    }
                    else if (this.name.indexOf('_2') > -1) {
                        cjStage.addDisplayObject(cloud.create2(cjGame.width, this.y));
                        this.setStatus(STATUS.DESTROYED);
                    }
                    else if (this.name.indexOf('_3') > -1) {
                        cjStage.addDisplayObject(cloud.create3(cjGame.width, this.y));
                        this.setStatus(STATUS.DESTROYED);
                    }
                }
            };

            cjStage.addDisplayObject(tmp);
        }
    };

    /**
     * 初始化
     *
     * @param {Object} opts 参数
     */
    cloud.init = function (opts) {
        cjGame = opts.cjGame;
        cjStage = opts.cjStage;
    };

    return cloud;
})();
