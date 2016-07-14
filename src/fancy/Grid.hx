package fancy;

import js.html.Element;
import fancy.core.*;
using dots.Dom;
using fancy.core.Lazy;

// TODO
// - snap to cell
// - no fixed columns
// - no fixed rows

typedef GridOptions = { };

class View {
  public var el(default, null): Element;
  public function new(parent: Element) {
    el = Dom.create("div.view", []);
    parent.append(el);
  }
}

class Grid {
  public function new(parent : Element, options : GridOptions) {
    var fancyGrid = Dom.create("div.fancy-grid");
    parent.append(fancyGrid);
    var view = new View(fancyGrid);
    var grid9 = new Grid9(view.el, {
      scrollerMinSize : 10.0,
      scrollerMaxSize : 100.0,
      scrollerSize : 10,
      contentWidth : 1000,
      contentHeight : 2000,
      topRail : 30,
      leftRail : 100
    });
  }
}
