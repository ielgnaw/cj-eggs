/* global ig */

'use strict';

var game = (function () {

    var util = ig.util;
    var CONFIG = ig.getConfig();
    var STATUS = CONFIG.status;
    var canvas = $('#cj-canvas');
    // var storage = new ig.Storage();

    var gameContainer;

    var cjGame = new ig.Game({
        canvas: canvas[0],
        name: 'cjGame',
        scaleFit: false,
        maxWidth: 600,
        maxHeight: 400,
        resource: [
            {id: 'spritesImg1', src: './img/sprites1.gif'},
            // {id: 'spritesImg', src: './img/sprites.png'},
            // {id: 'spritesImg1', src: './img/sprites1.png'},
            // {id: 'boomImg', src: './img/boom.png'},
            // {id: 'spritesData', src: './data/sprites.json'},
            // {id: 'spritesData1', src: './data/sprites1.json'},
            // {id: 'boomData', src: './data/boom.json'},
        ]
    }).on('loadResProcess', function (e) {
    }).on('loadResDone', function (e) {
        gameContainer.css({
            position: 'absolute',
            // top: ($(window).height() - $(gameContainer).height()) / 2 ,
            top: parseInt($('.cj-move-guide').css('top'), 10) - game.height,
            left: ($(window).width() - $(gameContainer).width()) / 2
        });
    });

    var cjStage = cjGame.createStage({
        name: 'cjStage',
        // bgColor: 'rgba(0, 0, 0, 0.2)',
        // bgColor: '#5283f4',
        bgColor: 'transparent'
    });

    /**
     * 地面模块
     *
     * @return {Object} 暴露方法
     */
    var groundControl = (function () {
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

        return ground;
    })();

    /**
     * 砖头模块，三种砖头，可顶碎的、不可顶碎的、带金币的
     *
     * @return {Object} 模块导出对象
     */
    var brickControl = (function () {
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
            return new ig.Bitmap({
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
                // debug: 1
            });
        };

        return brick;
    })();

    /**
     * 云朵模块
     *
     * @return {Object} 模块导出对象
     */
    var cloudControl = (function () {
        var guid = 0;

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
                vx: -1
            });

            cloud1.setAnimate({
                target: {
                    alpha: 1
                },
                duration: 2000,
                completeFunc: function () {
                }
            });
            cloud1.step = function (dt, stepCount, requestID) {
                this.vx += this.ax * dt;
                this.vx *= this.frictionX * dt;
                this.vy += this.ay * dt;
                this.vy *= this.frictionY * dt;

                this.x += this.vx * dt;
                this.y += this.vy * dt;

                if (this.x + this.width < 0) {
                    cjStage.addDisplayObject(cloud.create1(cjGame.width, this.y));
                    this.setStatus(STATUS.DESTROYED);
                }
                this.move(this.x, this.y);
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
                vx: -1,
            });

            cloud2.setAnimate({
                target: {
                    alpha: 1
                },
                duration: 2000,
                completeFunc: function () {
                }
            });
            cloud2.step = function (dt, stepCount, requestID) {
                this.vx += this.ax * dt;
                this.vx *= this.frictionX * dt;
                this.vy += this.ay * dt;
                this.vy *= this.frictionY * dt;

                this.x += this.vx * dt;
                this.y += this.vy * dt;

                if (this.x + this.width < 0) {
                    cjStage.addDisplayObject(cloud.create2(cjGame.width, this.y));
                    this.setStatus(STATUS.DESTROYED);
                }
                this.move(this.x, this.y);
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
                vx: -1
            });

            cloud3.setAnimate({
                target: {
                    alpha: 1
                },
                duration: 2000,
                completeFunc: function () {
                }
            });

            cloud3.step = function (dt, stepCount, requestID) {
                this.vx += this.ax * dt;
                this.vx *= this.frictionX * dt;
                this.vy += this.ay * dt;
                this.vy *= this.frictionY * dt;

                this.x += this.vx * dt;
                this.y += this.vy * dt;

                if (this.x + this.width < 0) {
                    cjStage.addDisplayObject(cloud.create3(cjGame.width, this.y));
                    this.setStatus(STATUS.DESTROYED);
                }
                this.move(this.x, this.y);
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
            ]
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
            ]

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
                    vx: -1,
                });
                tmp.setAnimate({
                    target: {
                        alpha: 1
                    },
                    duration: 2000,
                });

                tmp.step = function (dt, stepCount, requestID) {
                    this.vx += this.ax * dt;
                    this.vx *= this.frictionX * dt;
                    this.vy += this.ay * dt;
                    this.vy *= this.frictionY * dt;

                    this.x += this.vx * dt;
                    this.y += this.vy * dt;

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
                    this.move(this.x, this.y);
                };

                cjStage.addDisplayObject(tmp);
            }
        };

        return cloud;
    })();

    /**
     * 创建背景的山坡
     *
     * @return {Object} 山坡对象
     */
    function createHill() {
        var hillMain = new ig.Bitmap({
            name: 'hillMain_1',
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
                alpha: 1
            },
            duration: 2000,
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
    function createBrushwood() {
        var brushwoodMain = new ig.Bitmap({
            name: 'brushwoodMain_1',
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
                alpha: 1
            },
            duration: 2000,
            completeFunc: function () {
            }
        });
        return brushwoodMain;
    }

    var exports = {};

    /**
     * 游戏开始
     *
     * @param {Function} startCallback 游戏开始的回调函数
     */
    exports.start = function (startCallback) {
        cjGame.start(function () {
            gameContainer = $('#ig-game-container-cjGame');
            startCallback();
        });

        groundControl.createGround();

        var bg = cjStage.addDisplayObject(
            new ig.Rectangle({
                name: 'bg',
                fillStyle: '#5283f4',
                x: 0,
                y: 336,
                width: cjGame.width,
                height: 0
            })
        );

        bg.setAnimate({
            target: {
                height: -336
            },
            // duration: 7700,
            duration: 1000,
            completeFunc: function () {
                cjStage.addDisplayObject(createHill());
                cjStage.addDisplayObject(createBrushwood());
                cjStage.addDisplayObject(cloudControl.create());
                // cjStage.addDisplayObject(cloudControl.create2());
                // cjStage.addDisplayObject(cloudControl.create1());
                var brickMain = cjStage.addDisplayObject(brickControl.createMain(0, 260));
                brickMain.setAnimate({
                    target: {
                        x: cjGame.width / 3
                    },
                    duration: 1000,
                    tween: ig.easing.easeOutBounce
                });

                var brick3 = cjStage.addDisplayObject(brickControl.create3(32, 200));
                brick3.setAnimate({
                    target: {
                        x: cjGame.width / 3 + 32
                    },
                    duration: 1000,
                    tween: ig.easing.easeOutBounce
                });
            }
        });
    };

    return exports;
})();
