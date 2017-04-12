/**
 * Created by xiaogang on 2017/3/30.
 */
"use strict";



var touch = {},
  touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
  longTapDelay = 750,
  gesture;

function swipeDirection(x1, x2, y1, y2) {
  return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
}

function longTap() {
  longTapTimeout = null
  if (touch.last) {
    // touch.el.trigger('longTap')
    // todo

    touch = {}
  }
}

function cancelLongTap() {
  if (longTapTimeout){clearTimeout(longTapTimeout);}
  longTapTimeout = null;
}

function cancelAll() {
  if (touchTimeout) {clearTimeout(touchTimeout);}
  if (tapTimeout){ clearTimeout(tapTimeout);}
  if (swipeTimeout) {clearTimeout(swipeTimeout);}
  if (longTapTimeout) {clearTimeout(longTapTimeout);}
  touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
  touch = {};
}

function isPrimaryTouch(event) {
  return (event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary;
}

function isPointerEventType(e, type) {
  return (e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type);
}


function init(el) {
  var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType;

  if ('MSGesture' in window) {
    gesture = new MSGesture();
    gesture.target = document.body;
  }

  el.addEventListener('MSGestureEnd', function (e) {
    if(el.modifiers.stop){
      e.stopPropagation();
    }
    var swipeDirectionFromVelocity = e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
    if (swipeDirectionFromVelocity) {
      touch.el.trigger('swipe');
      touch.el.trigger('swipe' + swipeDirectionFromVelocity);
    }
  });
  // el.addEventListener('touchstart MSPointerDown pointerdown', _touchstart);
  el.addEventListener('touchstart', _touchstart, false);
  // el.addEventListener('MSPointerDown', _touchstart);
  // el.addEventListener('pointerdown', _touchstart);

  // el.addEventListener('touchmove MSPointerMove pointermove',_touchmove);
  el.addEventListener('touchmove', _touchmove, false);
  // el.addEventListener('MSPointerMove', _touchmove);
  // el.addEventListener('pointermove', _touchmove);

  // el.addEventListener('touchend MSPointerUp pointerup', _touchend);
  el.addEventListener('touchend', _touchend, false);
  // el.addEventListener('MSPointerUp', _touchend);
  // el.addEventListener('pointerup', _touchend);

  // when the browser window loses focus,
  // for example when a modal dialog is shown,
  // cancel all ongoing events
  // el.addEventListener('touchcancel MSPointerCancel pointercancel', cancelAll)
  el.addEventListener('touchcancel', cancelAll, false);

  // scrolling the window indicates intention of the user
  // to scroll, not tap or swipe, so cancel all ongoing events
  window.addEventListener('scroll', cancelAll, false);

  //内部函数
  function _touchstart(e) {
    console.log('touchstart');
    if(el.modifiers.stop){
      e.stopPropagation();
    }
    if ((_isPointerType = isPointerEventType(e, 'down')) &&
      !isPrimaryTouch(e)) return;
    firstTouch = _isPointerType ? e : e.touches[0];
    if (e.touches && e.touches.length === 1 && touch.x2) {
      // Clear out touch movement data if we have it sticking around
      // This can occur if touchcancel doesn't fire due to preventDefault, etc.
      touch.x2 = undefined;
      touch.y2 = undefined;
    }
    now = Date.now();
    delta = now - (touch.last || now);
    touch.el = firstTouch.target.tagName ? firstTouch.target : firstTouch.target.parentNode;
    touchTimeout && clearTimeout(touchTimeout);
    touch.x1 = firstTouch.pageX;
    touch.y1 = firstTouch.pageY;
    if (delta > 0 && delta <= 250) {
      touch.isDoubleTap = true;
    }
    touch.last = now;
    longTapTimeout = setTimeout(_longTap, longTapDelay);
    // adds the current touch contact for IE gesture recognition
    if (gesture && _isPointerType) {
      gesture.addPointer(e.pointerId);
    }
    //触发相关事件 todo
    // el.touchstart(e);
  }

  function _touchmove(e) {
    if(el.modifiers.stop){
      e.stopPropagation();
    }
    if ((_isPointerType = isPointerEventType(e, 'move')) &&
      !isPrimaryTouch(e)) return;
    firstTouch = _isPointerType ? e : e.touches[0];
    cancelLongTap();
    touch.x2 = firstTouch.pageX;
    touch.y2 = firstTouch.pageY;

    deltaX += Math.abs(touch.x1 - touch.x2);
    deltaY += Math.abs(touch.y1 - touch.y2);
  }

  function _touchend(e) {
    if(el.modifiers.stop){
      e.stopPropagation();
    }
    if ((_isPointerType = isPointerEventType(e, 'up')) && !isPrimaryTouch(e)) return;
    cancelLongTap();

    // swipe
    if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

      swipeTimeout = setTimeout(function () {
        if (touch.el) {
          //touch.el.trigger('swipe');
          //touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
          //todo
          el.swipe(e);
          el['swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2))](e);
        }
        touch = {}
      }, 0);

    // normal tap
    else if ('last' in touch)
    // don't fire tap when delta position changed by more than 30 pixels,
    // for instance when moving to a point and back to origin
      if (deltaX < 30 && deltaY < 30) {
        // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
        // ('tap' fires before 'scroll')
        tapTimeout = setTimeout(function () {

          // trigger universal 'tap' with the option to cancelTouch()
          // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
          var event = $.Event('tap');
          event.cancelTouch = cancelAll;
          // [by paper] fix -> "TypeError: 'undefined' is not an object (evaluating 'touch.el.trigger'), when double tap
          if (touch.el) {
            // touch.el.trigger(event);
            // todo
            el.tap(e);
          }

          // trigger double tap immediately
          if (touch.isDoubleTap) {
            if (touch.el) {
              // touch.el.trigger('doubleTap');
              //todo
              el.doubleTap(e);
            }
            touch = {}
          }

          // trigger single tap after 250ms of inactivity
          else {
            touchTimeout = setTimeout(function () {
              touchTimeout = null;
              if (touch.el) {
                //touch.el.trigger('singleTap');
                //todo
                el.singleTap(e);
              }
              touch = {}
            }, 250);
          }
        }, 0)
      } else {
        touch = {}
      }
    deltaX = deltaY = 0;

  }

  function _longTap() {
    longTapTimeout = null
    if (touch.last) {
      //touch.el.trigger('longTap')
      //todo
      el.longTap();
      touch = {}
    }
  }
}
;
//组件对外暴露的插件方法
function eventMap(el) {
  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function (eventName) {
    el[eventName] = function (e) {
      if (el.funcName == eventName) {
        el.callback(e);
      }
    }
  });
}


export default {
  bind(el, binding, vnode) {
    console.log("directives bind--------------");
    //存储dom节点信息
    // touch.el = el;
    //func
    el.funcName = binding.arg;
    el.callback = binding.value;
    el.modifiers=binding.modifiers;

    eventMap(el);
    //var s = JSON.stringify;
    // el.innerHTML =
    //   'name: ' + s(binding.name) + '<br>' +
    //   'value: ' + s(binding.value) + '<br>' +
    //   'expression: ' + s(binding.expression) + '<br>' +
    //   'argument: ' + s(binding.arg) + '<br>' +
    //   'modifiers: ' + s(binding.modifiers) + '<br>' +
    //   'vnode keys: ' + Object.keys(vnode).join(', ');

    console.log(this);
    console.log(el);
    console.log(binding);
    console.log(vnode);

    init(el);

  },
  unbind(el) {
    console.log("directives unbind");
    console.log(el);
  }
}
