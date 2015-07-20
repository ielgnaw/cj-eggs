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

        groundControl.init({
            cjGame: cjGame,
            cjStage: cjStage
        });

        cloudControl.init({
            cjGame: cjGame,
            cjStage: cjStage
        });

        brickControl.init({
            cjGame: cjGame,
            cjStage: cjStage
        });

        waterpipeControl.init({
            cjGame: cjGame,
            cjStage: cjStage
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
                waterpipe = cjStage.addDisplayObject(
                    waterpipeControl.createWaterpipe(function () {
                        mario = createMario();
                    })
                );

                cjStage.addDisplayObject(brickControl.createMain(0, 260));

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
