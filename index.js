/* global ig */

'use strict';

window.onload = function () {

    var cjContainer = $('.cj-container');
    var cjTrack = $('.cj-track');
    var cjMoveGuide = $('.cj-move-guide');
    var cjMoveGuideArrow = $('.cj-move-guide-arrow');

    // var cjMoveGuideLeft = parseInt(cjMoveGuide.css('left'), 10);
    // var cjMoveGuideWidth = cjMoveGuide.width();

    var isMove = false;
    var dx;
    var dy;
    var originLeft = parseInt(cjContainer.css('left'), 10);

    cjContainer.mousedown(function (e) {
        isMove = true;
        dx = e.pageX - parseInt($(this).css('left'), 10);
        dy = e.pageY - parseInt($(this).css('top'), 10);
        $(document).on('mousemove', docMove);
    }).mouseup(function (e) {
        isMove = false;
        $(document).off('mousemove', docMove);
    });

    function docMove(e) {
        if (!isMove) {
            return;
        }
        var ex = e.pageX;
        var ey = e.pageY;

        var distance = ex - dx;
        if (distance > 980 - 10) {
            isMove = false;
            $(document).off('mousemove', docMove);
            // game.start(function () {
            //     cjContainer.css('display', 'none');
            //     cjTrack.css('display', 'none');
            //     cjMoveGuide.css('display', 'none');
            //     cjMoveGuideArrow.css('display', 'none');
            // });
        }
        else {
            cjContainer.css({
                left: ex - dx
            });
            cjTrack.width(ex - originLeft - 25);
        }
    }

    game.start(function () {
        cjContainer.css('display', 'none');
        cjTrack.css('display', 'none');
        cjMoveGuide.css('display', 'none');
        cjMoveGuideArrow.css('display', 'none');
    });
};
