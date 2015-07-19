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
            {id: 'spritesData1', src: './data/sprites1.json'}
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
                alpha: 0.5
            },
            duration: 1000,
            completeFunc: function () {
            }
        });
        return brushwoodMain;
    }

    /**
     * 创建背景水管
     *
     * @return {Object} 水管对象
     */
    function createWaterpipe() {
        var waterpipeMain = new ig.Bitmap({
            name: 'waterpipeMain_1',
            asset: cjGame.asset.spritesImg1,
            x: 420,
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
                mario = createMario();
            }
        });
        return waterpipeMain;
    }

    /**
     * 创建马里奥
     *
     * @return {Object} 马里奥对象
     */
    function createMario() {
        var marioMain = cjStage.addDisplayObject(
            new ig.SpriteSheet({
                name: 'marioMain',
                asset: cjGame.asset.spritesImg1,
                sheetData: cjGame.asset.spritesData1.marioMove,
                x: 0,
                y: 320,
                zIndex: 11,
                jumpFrames: 5,
                vx: 1,
                // debug: 1
            })
        );

        marioMain.step = function (dt, stepCount, requestID) {
            this.vx += this.ax * dt;
            this.vx *= this.frictionX * dt;
            this.vy += this.ay * dt;
            this.vy *= this.frictionY * dt;

            this.x += this.vx * dt;
            this.y += this.vy * dt;

            this.move(this.x, this.y);

            if (!this.isJump) {
                if (this.x === cjGame.width / 3 + 33) {
                    this.isJump = true;
                    this.vx = 0.8;
                    this.vy = -3;
                    this.change(util.extend(true, {}, cjGame.asset.spritesData1.marioJump));
                }
            }
            else {
                if (this.y === 260 + this.height) {
                    this.vy = 0;
                    if (!cjStage.getDisplayObjectByName('mushroom')) {
                        this.vx = 0;
                        cjStage.addDisplayObject(
                            createMushroom(function () {
                                marioMain.vy = 3;
                                marioMain.vx = 0.8;
                            })
                        );
                    }
                }
                else if (this.y === 320) {
                    this.isJump = false;
                    this.vx = 0.8;
                    this.vy = 0;
                    this.change(util.extend(true, {}, cjGame.asset.spritesData1.marioMove));
                }
            }
        };

        return marioMain;
    }

    /**
     * 创建蘑菇
     *
     * @return {Object} 蘑菇对象
     */
    function createMushroom(callback) {
        var mushroom = new ig.Bitmap({
            name: 'mushroom',
            asset: cjGame.asset.spritesImg1,
            x: cjGame.width / 3 + 47,
            y: 248,
            sx: 70,
            sy: 42,
            width: 18,
            sWidth: 18,
            height: 18,
            sHeight: 18,
            zIndex: 11,
            scaleX: 0.2,
            scaleY: 0.2,
            // debug: 1
        });

        mushroom.step = function (dt, stepCount, requestID) {
            this.vx += this.ax * dt;
            this.vx *= this.frictionX * dt;
            this.vy += this.ay * dt;
            this.vy *= this.frictionY * dt;

            this.x += this.vx * dt;
            this.y += this.vy * dt;

            this.move(this.x, this.y);

            if (this.x > cjGame.width / 3 + 64 + this.width / 2) {
                this.vy = 1.5;
            }

            if (this.y === 320) {
                this.vy = 0;
            }

            if (this.collidesWith(waterpipe)
                && ((this.x + this.width) > waterpipe.x + 3)
            ) {
                this.vx = -this.vx;
            }

            if (mario && this.collidesWith(mario)
                && ((mario.x + mario.width) > this.x + 3)
            ) {
                this.vx = 0;
                mario.vx = 0;
            }
        };

        mushroom.setAnimate({
            target: {
                scaleX: 1,
                scaleY: 1,
                y: 242
            },
            stepFunc: function (e) {
                if (e.data.source.alpha === 1) {
                    e.data.source.alpha = 0;
                }
                else {
                    e.data.source.alpha = 1;
                }
            },
            duration: 1000,
            completeFunc: function (e) {
                e.data.source.alpha = 1;
                e.data.source.vx = 1;
                callback();
            }
        });

        return mushroom;
    }

    // 水管对象
    var waterpipe;

    // 马里奥对象
    var mario;

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
            duration: 7700,
            // duration: 1000,
            completeFunc: function () {
                cjStage.addDisplayObject(createHill());
                cjStage.addDisplayObject(createBrushwood());
                cjStage.addDisplayObject(cloudControl.create());
                waterpipe = cjStage.addDisplayObject(createWaterpipe());

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
