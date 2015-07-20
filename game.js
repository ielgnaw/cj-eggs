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
        bgColor: 'transparent'
    });

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
                vx: 1
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
                if (this.y === 260 + this.height) {
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
    // function createMushroom(callback) {
    //     var mushroom = new ig.Bitmap({
    //         name: 'mushroom',
    //         asset: cjGame.asset.spritesImg1,
    //         x: cjGame.width / 3 + 47,
    //         y: 248,
    //         sx: 70,
    //         sy: 42,
    //         width: 18,
    //         sWidth: 18,
    //         height: 18,
    //         sHeight: 18,
    //         zIndex: 11,
    //         scaleX: 0.2,
    //         scaleY: 0.2,
    //         // debug: 1
    //     });

    //     mushroom.step = function (dt, stepCount, requestID) {
    //         this.vx += this.ax * dt;
    //         this.vx *= this.frictionX * dt;
    //         this.vy += this.ay * dt;
    //         this.vy *= this.frictionY * dt;

    //         this.x += this.vx * dt;
    //         this.y += this.vy * dt;

    //         this.move(this.x, this.y);

    //         if (this.x > cjGame.width / 3 + 64 + this.width / 2) {
    //             this.vy = 1.5;
    //         }

    //         if (this.y === 320) {
    //             this.vy = 0;
    //         }

    //         if (this.collidesWith(waterpipe)
    //             && ((this.x + this.width) > waterpipe.x + 3)
    //         ) {
    //             this.vx = -this.vx;
    //         }

    //         if (mario && this.collidesWith(mario)
    //             && ((mario.x + mario.width) > this.x + 3)
    //             && !mario.isDead
    //         ) {
    //             this.vx = 0;
    //             mario.vx = 0;
    //             mario.change(util.extend(true, {}, cjGame.asset.spritesData1.marioDead));
    //             mario.isDead = true;
    //             mario.setAnimate({
    //                 target: {
    //                     y: mario.y - 70
    //                 },
    //                 duration: 300,
    //                 completeFunc: function (e) {
    //                     mario.setAnimate({
    //                         target: {
    //                             y: mario.y + 70 + 64 + mario.height
    //                         },
    //                         duration: 500,
    //                         completeFunc: function (e) {
    //                             mario.setStatus(STATUS.DESTROYED);
    //                             gameOver();
    //                         }
    //                     })
    //                 }
    //             })
    //         }
    //     };

    //     mushroom.setAnimate({
    //         target: {
    //             scaleX: 1,
    //             scaleY: 1,
    //             y: 242
    //         },
    //         stepFunc: function (e) {
    //             if (e.data.source.alpha === 1) {
    //                 e.data.source.alpha = 0;
    //             }
    //             else {
    //                 e.data.source.alpha = 1;
    //             }
    //         },
    //         duration: 1000,
    //         completeFunc: function (e) {
    //             e.data.source.alpha = 1;
    //             e.data.source.vx = 2;
    //             callback();
    //         }
    //     });

    //     return mushroom;
    // }

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
                x: cjGame.width / 3 + 43,
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
            // console.warn(this.y);
            if (this.y === 314.5) {
                this.vy = 0;
            }

            if (this.collidesWith(waterpipe)
                && ((this.x + this.width) > waterpipe.x + 3)
            ) {
                this.vx = -this.vx;
                this.scaleX = -1;
            }

            if (mario && this.collidesWith(mario)
                && ((mario.x + mario.width) > this.x + 10)
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
                        })
                    }
                })
            }
        };

        motor.setAnimate({
            target: {
                scaleX: 1,
                scaleY: 1,
                y: 238
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
                }, 0)
                // this.setStatus(STATUS.DESTROYED);
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
            // duration: 7700,
            duration: 1000,
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
