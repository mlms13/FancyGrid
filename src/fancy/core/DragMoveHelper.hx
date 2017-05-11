package fancy.core;

import js.html.Element;
using dots.Dom;

class DragMoveHelper {
  var el: Element;
  var moving: Bool;
  var x: Float;
  var y: Float;
  public function new(el: Element, callback : Float -> Float -> Void) {
    this.el = el;
    el.on("mousedown", function(e: js.html.MouseEvent) {
      if(moving) return;
      e.preventDefault();
      e.stopPropagation();
      moving = true;
      x = e.clientX;
      y = e.clientY;
    });
    js.Browser.document.addEventListener("mousemove", function(e: js.html.MouseEvent) {
      if(!moving) return;
      e.preventDefault();
      el.toggleClass("dragging", true); // TODO move class name to option

      var dx = e.clientX - x,
          dy = e.clientY - y;
      x = e.clientX;
      y = e.clientY;
      callback(dx, dy);
    });
    js.Browser.document.addEventListener("mouseup", function(e: js.html.MouseEvent) {
      if(!moving) return;
      e.preventDefault();
      el.toggleClass("dragging", false); // TODO move class name to option
      this.moving = false;
    });
  }
}
