package fancy.core;

import js.html.Element;
using dots.Dom;

class SwipeMoveHelper {
  var el: Element;
  var id: Null<Int>;
  var x: Float;
  var y: Float;
  public function new(el: Element, callback : Float -> Float -> Void) {
    this.el = el;
    el.on("touchmove", function(e: js.html.TouchEvent) {
      e.preventDefault();
      apply(e, function(t) {
        var dx = t.clientX - x,
            dy = t.clientY - y;
        x = t.clientX;
        y = t.clientY;
        callback(-dx, -dy);
      });
    });
    el.on("touchstart", function(e: js.html.TouchEvent) {
      e.preventDefault();
      if(null != id) return;
      var t = e.touches[0];
      id = t.identifier;
      x = t.clientX;
      y = t.clientY;
    });
    el.on("touchend", function(e: js.html.TouchEvent) {
      e.preventDefault();
      if(e.touches.length == 0) {
        this.id = null;
      } else {
        apply(e, function(_) {
          this.id = null;
        });
      }
    });
  }

  function apply(e: js.html.TouchEvent, f : js.html.Touch -> Void) {
    for(t in e.touches) {
      if(t.identifier == id) {
        f(t);
        break;
      }
    }
  }
}
