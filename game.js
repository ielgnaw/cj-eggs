/* global ig, groundControl, cloudControl, brickControl, waterpipeControl, hillAndBrushwoodControl */

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
            {id: 'logo', src: './img/logo.png'},
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
        bgColor: 'transparent'
    });

    var cjStage2 = cjGame.createStage({
        name: 'cjStage2',
        bgColor: 'transparent'
    });

    /**
     * 创建 logo 的精灵，在 cjStage2 中
     *
     * @return {Object} logo 对象
     */
    function createLogo() {
        var logoMain = new ig.Bitmap({
            name: 'logoMain',
            asset: cjGame.asset.logo,
            x: 0,
            y: 0,
            sx: 0,
            sy: 0,
            width: cjGame.width,
            sWidth: cjGame.width,
            height: cjGame.height,
            sHeight: cjGame.height,
            zIndex: 9,
            scaleX: 0.01,
            scaleY: 0.01,
            alpha: 0
        });
        logoMain.setAnimate({
            target: {
                scaleX: 1,
                scaleY: 1,
                alpha: 1
            },
            duration: 1500,
            tween: ig.easing.easeOutBounce,
            completeFunc: function () {
                cjGame.stop();
            }
        });
        cjStage2.addDisplayObject(logoMain);
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
                y: 303,
                zIndex: 11,
                jumpFrames: 10,
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
                if (this.x === cjGame.width / 3 + 33 && this.scaleX !== -1) {
                    this.isJump = true;
                    this.vx = 0.8;
                    this.vy = -3;
                    this.change(util.extend(true, {}, cjGame.asset.spritesData1.marioJump));
                }
                else if (this.x > cjGame.width / 3 + 33 + 34) {
                    this.scaleX = -1;
                    this.vx = -this.vx;
                }
            }
            else {
                // console.warn(this.height);
                // console.warn(this.y, 244 + this.height);
                if (this.y === 244 + this.height) {
                    this.vy = 0;
                    if (!cjStage.getDisplayObjectByName('motor')) {
                        this.vx = 0;
                        cjStage.addDisplayObject(
                            createMotor(function () {
                                marioMain.vy = 3;
                                marioMain.vx = 0.8;
                            })
                        );
                    }
                }
                else if (this.y === 303) {
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
     * 创建摩托
     *
     * @return {Object} 摩托对象
     */
    function createMotor(callback) {
        var motor = cjStage.addDisplayObject(
            new ig.SpriteSheet({
                name: 'motor',
                asset: cjGame.asset.spritesImg1,
                sheetData: cjGame.asset.spritesData1.motor,
                x: cjGame.width / 3 + 40,
                y: 248,
                zIndex: 11,
                jumpFrames: 5,
                vx: 0,
                scaleX: 0.2,
                scaleY: 0.2,
            })
        );

        motor.step = function (dt, stepCount, requestID) {
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

            if (this.y === 308.5) {
                this.vy = 0;
            }

            if (this.collidesWith(waterpipe)
                && ((this.x + this.width) > waterpipe.x + 3)
            ) {
                this.vx = -this.vx;
                this.scaleX = -this.scaleX;
            }

            if (mario && this.collidesWith(mario)
                && ((mario.x + mario.width) > this.x + 5)
                && !mario.isDead
            ) {
                this.vx = 0;
                mario.vx = 0;
                mario.change(util.extend(true, {}, cjGame.asset.spritesData1.marioDead));
                mario.isDead = true;
                mario.setAnimate({
                    target: {
                        y: mario.y - 70
                    },
                    duration: 300,
                    completeFunc: function (e) {
                        mario.setAnimate({
                            target: {
                                y: mario.y + 70 + 64 + mario.height
                            },
                            duration: 500,
                            completeFunc: function (e) {
                                mario.setStatus(STATUS.DESTROYED);
                                gameOver();
                            }
                        });
                    }
                });
            }
        };

        motor.setAnimate({
            target: {
                scaleX: 1.5,
                scaleY: 1.5,
                y: 232
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
                e.data.source.vx = 2;
                callback();
            }
        });

        return motor;
    }

    /**
     * gameOver 的字样
     *
     * @return {Object} Text 对象
     */
    function gameOver() {
        var gameOverMain = cjStage.addDisplayObject(
            new ig.Text({
                name: 'gameOver',
                content: 'GAME OVER',
                x: (cjGame.width - 400) / 2,
                y: (cjGame.height - 70) / 2,
                size: 50,
                isBold: true,
                angle: 0,
                zIndex: 20,
                fillStyle: '#f00',
                scaleX: 0.01,
                scaleY: 0.01,
                width: 400,
                height: 70
            })
        );
        gameOverMain.step = function (dt, stepCount) {
            if (this.scaleX.toFixed(2) === '1.00') {
                this.angle = 0;
                setTimeout(function () {
                    cjGame.stop();

                    canvas[0].style.opacity = 1;
                    var anim = new ig.Animation({
                        source: canvas[0].style,
                        target: {
                            opacity: 0
                        },
                        jumpFrames: 2
                    });
                    anim.play().on('complete', function (e) {
                        canvas[0].style.opacity = 1;
                        cjGame.start('cjStage2');
                        createLogo();
                    });

                }, 0);
            }
            else {
                this.angle += 20;
                this.scaleX += 0.01;
                this.scaleY += 0.01;
            }
        };
        return gameOverMain;
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

        hillAndBrushwoodControl.init({
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
            duration: 7700,
            // duration: 1000,
            completeFunc: function () {
                cjStage.addDisplayObject(hillAndBrushwoodControl.createHill());
                cjStage.addDisplayObject(hillAndBrushwoodControl.createBrushwood());
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
