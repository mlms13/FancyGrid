package fancy;

import js.html.Element;
using dots.Dom;
using dots.Query;
using thx.Arrays;
using thx.Floats;
using thx.Functions;
using thx.Nulls;

// TODO
// - resize handle
// - scroll handle
// - touch handle
// - snap to cell
// - fixed header rows
// - fixed footer rows
// - fixed left columns
// - fixed right columns
// - no fixed columns
// - no fixed rows


typedef GridOptions = {
  // render: Int -> Int -> Element,
  // vOffset: Int -> Float,
  // hOffset: Int -> Float,
  // columns: Int,
  // rows: Int,
  // vSize: Void -> Float,
  // hSize: Void -> Float,
  // ?vExtraSize: Null<Float>,
  // ?hExtraSize: Null<Float>
};

// class RefSize {
//   var vSize: Void -> Float;
//   var hSize: Void -> Float;
//   var vExtraSize: Float;
//   var hExtraSize: Float;
//
//   public var width(get, null): Float;
//   public var height(get, null): Float;
//   public var offsetTop(get, null): Float;
//   public var offsetLeft(get, null): Float;
//
//   public function new(vSize: Void -> Float, hSize: Void -> Float, vExtraSize: Null<Float>, hExtraSize: Null<Float>) {
//     this.vSize = vSize;
//     this.hSize = hSize;
//     this.vExtraSize = null != vExtraSize ? vExtraSize : 0.5;
//     this.hExtraSize = null != hExtraSize ? hExtraSize : 0.5;
//   }
//
//   function get_width() return hSize() + 2 * hSize() * hExtraSize;
//   function get_height() return vSize() + 2 * vSize() * vExtraSize;
//
//   function get_offsetTop() return - vSize() * vExtraSize;
//   function get_offsetLeft() return - hSize() * hExtraSize;
// }

class Size {
  public var width: Float;
  public var height: Float;
}

class ScrollPosition {
  public var x: Float;
  public var y: Float;
  public function new() {
    x = 0;
    y = 0;
  }
}

class CellPosition {
  public var row: Int;
  public var col: Int;
  public function new() {
    row = 0;
    col = 0;
  }
}

class SwipeHelper {
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
        callback(dx, dy);
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

typedef Grid9Options = {
  ?scrollerSize: Float,
  ?scrollerMargin: Float,
  ?scrollerMinLength: Float,
  ?scrollerMaxLength: Float
}

class Grid9 {
  public var el(default, null): Element;
  public var contentWidth(default, null): Float;
  public var contentHeight(default, null): Float;
  public var gridWidth(default, null): Float;
  public var gridHeight(default, null): Float;

  public var topHeight(default, null): Float;
  public var bottomHeight(default, null): Float;
  public var leftWidth(default, null): Float;
  public var rightWidth(default, null): Float;

  public var position: ScrollPosition;

  var top: Element;
  var tops: Array<Element>;
  var bottom: Element;
  var bottoms: Array<Element>;
  var left: Element;
  var lefts: Array<Element>;
  var right: Element;
  var rights: Array<Element>;
  var middles: Array<Element>;
  var centers: Array<Element>;
  var dirty: Bool;

  var scrollerV: Element;
  var scrollerH: Element;
  var scrollerSize: Float;
  var scrollerMargin: Float;
  var scrollerMinLength: Float;
  var scrollerMaxLength: Float;

  public function new(parent: Element, ?options: Grid9Options) {
    position = new ScrollPosition();
    scrollerSize = options.scrollerSize.or(10);
    scrollerMargin = options.scrollerMargin.or(4);
    scrollerMinLength = options.scrollerMinLength.or(10);
    scrollerMaxLength = options.scrollerMaxLength.or(200);
    el = Dom.create("div.grid9", [
      Dom.create('div.scroller.scroller-v'),
      Dom.create('div.scroller.scroller-h'),
      Dom.create("div.row.top"),
      Dom.create("div.row.bottom"),
      Dom.create("div.column.left"),
      Dom.create("div.column.right"),
      Dom.create("div.cell.top.left", "top.left"),
      Dom.create("div.cell.top.center", "top.center"),
      Dom.create("div.cell.top.right", "top.right"),
      Dom.create("div.cell.middle.left", "middle.left"),
      Dom.create("div.cell.middle.center", "middle.center"),
      Dom.create("div.cell.middle.right", "middle.right"),
      Dom.create("div.cell.bottom.left", "bottom.left"),
      Dom.create("div.cell.bottom.center", "bottom.center"),
      Dom.create("div.cell.bottom.right", "bottom.right")
    ]);
    parent.append(el);

    // GET REFERENCES
    scrollerV = Query.find(".scroller-v", el);
    scrollerH = Query.find(".scroller-h", el);
    top     = Query.find(".row.top", el);
    bottom  = Query.find(".row.bottom", el);
    left    = Query.find(".column.left", el);
    right   = Query.find(".column.right", el);
    tops    = Query.select(".cell.top", el);
    bottoms = Query.select(".cell.bottom", el);
    lefts   = Query.select(".cell.left", el);
    rights  = Query.select(".cell.right", el);
    middles = Query.select(".cell.middle", el);
    centers = Query.select(".cell.center", el);

    // RESIZE
    // TODO no hard coded
    setGridSizeFromContainer();
    resizeContent(1000, 1000); // TODO
    sizeFixedElements(60, 30, 100, 90); // TODO
    refresh();

    // EVENTS
    // TODO make wiring optional
    js.Browser.window.addEventListener("resize", function(_) {
      setGridSizeFromContainer();
      resetPosition();
      refresh();
    });
    el.on("wheel", function(e: js.html.WheelEvent) {
      movePosition(e.deltaX, e.deltaY);
      refresh();
    });
    new SwipeHelper(el, function(dx, dy) {
      movePosition(-dx, -dy);
      refresh();
    });
  }

  function resetPosition() {
    setPosition(position.x, position.y);
  }

  public function movePosition(x: Float, y: Float) {
    setPosition(position.x + x, position.y + y);
  }

  public function setPosition(x: Float, y: Float) {
    var oldx = position.x,
        oldy = position.y;
    position.x = x;
    position.y = y;

    var limit = (contentWidth - gridWidth).max(0);
    if(position.x < 0) {
      position.x = 0;
    } else if(position.x > limit) {
      position.x = limit;
    }
    var limit = (contentHeight - gridHeight).max(0);
    if(position.y < 0) {
      position.y = 0;
    } else if(position.y > limit) {
      position.y = limit;
    }

    if(oldx == position.x && oldy == position.y) return;
    dirty = true;
  }

  function setGridSizeFromContainer() {
    var w = Dom.getOuterWidth(el.parentElement),
        h = Dom.getOuterHeight(el.parentElement);
    resizeGrid(w, h);
  }

  public function refresh() {
    if(!dirty) return;
    dirty = false;
    middles.each.fn(_.style.top = '${-position.y + topHeight}px');
    bottoms.each.fn(_.style.top = '${gridHeight.min(contentHeight) - bottomHeight}px');
    bottom.style.top = '${gridHeight.min(contentHeight) - bottomHeight}px';

    centers.each.fn(_.style.left = '${-position.x + leftWidth}px');
    rights.each.fn(_.style.left = '${gridWidth.min(contentWidth) - rightWidth}px');
    right.style.left = '${gridWidth.min(contentWidth) - rightWidth}px';

    top.toggleClass('overlay-bottom', position.y > 0 || gridHeight < topHeight + bottomHeight);
    bottom.toggleClass('overlay-top', contentHeight > gridHeight && position.y < contentHeight - gridHeight);
    left.toggleClass('overlay-right', position.x > 0 || gridWidth < leftWidth + rightWidth);
    right.toggleClass('overlay-left', contentWidth > gridWidth && position.x < contentWidth - gridWidth);

    refreshScrollers();
  }

  public function resizeGrid(width: Float, height: Float) {
    if(gridWidth == width && gridHeight == height)
      return;
    dirty = true;
    gridWidth = width;
    gridHeight = height;

    top.style.width = bottom.style.width = '${gridWidth.min(contentWidth)}px';
    left.style.height = right.style.height = '${gridHeight.min(contentHeight)}px';
  }

  public function resizeContent(width: Float, height: Float) {
    if(contentWidth == width && contentHeight == height)
      return;
    dirty = true;
    contentWidth = width;
    contentHeight = height;

    top.style.width = bottom.style.width = '${gridWidth.min(contentWidth)}px';
    left.style.height = right.style.height = '${gridHeight.min(contentHeight)}px';
  }

  public function sizeFixedElements(topHeight: Float, bottomHeight: Float, leftWidth: Float, rightWidth: Float) {
    if(this.topHeight == topHeight && this.bottomHeight == bottomHeight && this.leftWidth == leftWidth && this.rightWidth == rightWidth)
      return;
    dirty = true;
    this.topHeight = topHeight;
    this.bottomHeight = bottomHeight;
    this.leftWidth = leftWidth;
    this.rightWidth = rightWidth;
    top.style.height = '${topHeight}px';
    tops.each.fn(_.style.height = '${topHeight}px');
    middles.each.fn(_.style.height = '${contentHeight - topHeight - bottomHeight}px');
    bottom.style.height = '${bottomHeight}px';
    bottoms.each.fn(_.style.height = '${bottomHeight}px');
    left.style.width = '${leftWidth}px';
    lefts.each.fn(_.style.width = '${leftWidth}px');
    centers.each.fn(_.style.width = '${contentWidth - leftWidth - rightWidth}px');
    right.style.width = '${rightWidth}px';
    rights.each.fn(_.style.width = '${rightWidth}px');
  }

  function refreshScrollers() {
    var vspan = gridHeight - topHeight - bottomHeight,
        vratio = (gridHeight / contentHeight).min(1),
        hspan = gridWidth - leftWidth - rightWidth,
        hratio = (gridWidth / contentHeight).min(1),
        offset = (vratio < 1 && hratio < 1) ? scrollerSize + scrollerMargin : 0;
    if(vratio == 1) {
      scrollerV.style.display = "none";
    } else {
      scrollerV.style.display = "block";
      var idealLen = vratio * (vspan - offset);
      var len = scrollerMinLength.max(idealLen).min(scrollerMaxLength);
      var lenRatio = len / idealLen;
      var absPos = (position.y / (contentHeight - gridHeight));
      var pos = absPos * (vspan - len - offset);
      scrollerV.style.top = '${topHeight + pos}px';
      scrollerV.style.left = '${gridWidth.min(contentWidth) - rightWidth - scrollerSize - scrollerMargin}px';
      scrollerV.style.width = '${scrollerSize}px';
      scrollerV.style.height = '${len}px';
    }
    if(hratio == 1) {
      scrollerH.style.display = "none";
    } else {
      scrollerH.style.display = "block";
      var idealLen = hratio * (hspan - offset);
      var len = scrollerMinLength.max(idealLen).min(scrollerMaxLength);
      var lenRatio = len / idealLen;
      var absPos = (position.x / (contentWidth - gridWidth));
      var pos = absPos * (hspan - len - offset);
      scrollerH.style.left = '${leftWidth + pos}px';
      scrollerH.style.top = '${gridHeight.min(contentHeight) - bottomHeight - scrollerSize - scrollerMargin}px';
      scrollerH.style.width = '${len}px';
      scrollerH.style.height = '${scrollerSize}px';
    }
  }
}

class View {
  public var el(default, null): Element;
  public function new(parent: Element) {
    el = Dom.create("div.view", []);
    parent.append(el);
  }
}

class Grid {
  // var options : GridOptions;
  // var gridContainer : Element;
  // var floater : Element;
  // var vScroller : Element;

  // var refSize: RefSize;

  // var view: Element;
  // var floater: Element;
  // var grid9: Element;
  // var area: Element;

  public function new(parent : Element, options : GridOptions) {
    var fancyGrid = Dom.create("div.fancy-grid");
    parent.append(fancyGrid);
    var view = new View(fancyGrid);
    var grid9 = new Grid9(view.el);
    // this.options = options;
    //
    // refSize = new RefSize(options.vSize, options.hSize, options.vExtraSize, options.hExtraSize);
    //
    // floater = Dom.create("div.fg-floater", ["style" => "position:absolute;"]);
    // vScroller = Dom.create("div.fg-vscroller", ["style" => "position:absolute;right:0"]);
    // gridContainer = Dom.create("div.fg-container", ["style" => "position:relative;width:100%;height:100%;overflow:hidden"], [floater, vScroller]);
    // parent.empty().append(gridContainer);
    //
    // gridContainer.on("wheel", onWheel);
  }

  // function onWheel(e : js.html.WheelEvent) {
  //   // TODO
  //   // conditionally insert row if moving down
  //   // conditionally append row if moving up
  //   // conditionally insert col if moving right
  //   // conditionally append col if moving left
  //   moveFloater(-e.deltaX, -e.deltaY);
  // }
  //
  // function getContainerSize()
  //   return {
  //     width: gridContainer.getOuterWidth(),
  //     height: gridContainer.getOuterHeight()
  //   };
  //
  // function moveFloater(x : Float, y : Float) {
  //   moveFloaterTo(floater.offsetLeft + x, floater.offsetTop + y);
  // }
  //
  // function moveFloaterTo(x : Float, y : Float) {
  //   var size = getContainerSize(),
  //       h = floater.getOuterHeight(),
  //       w = floater.getOuterWidth();
  //   if(y + h < size.height) {
  //     if(h < size.height) {
  //       y = 0;
  //     } else {
  //       y = size.height - h;
  //     }
  //   } else if(y > 0) {
  //     y = 0;
  //   }
  //   if(x + w < size.width) {
  //     if(w < size.width) {
  //       x = 0;
  //     } else {
  //       x = size.width - w;
  //     }
  //   } else if(x > 0) {
  //     x = 0;
  //   }
  //   if(y + h < size.height) {
  //     if(h < size.height) {
  //       y = 0;
  //     } else {
  //       y = size.height - h;
  //     }
  //   }
  //   floater.style.top = '${y}px';
  //   floater.style.left = '${x}px';
  //   trace('floater pos ($x, $y)');
  // }
  //
  // public function goto(row : Int, col : Int) {
  //   floater.empty();
  //
  //   var size = getContainerSize();
  //   // constraint movement
  //   if(row < 0) row = 0;
  //   else if(row >= options.rows) row = options.rows - 1;
  //   if(col < 0) col = 0;
  //   else if(col >= options.columns) col = options.columns - 1;
  //
  //   var maxcol = options.columns;
  //
  //   for (r in row...options.rows) {
  //     var tr = Dom.create("div.fg-row");
  //     floater.append(tr);
  //     for (c in col...maxcol) {
  //       var content = options.render(r, c);
  //       var td = Dom.create("div.fg-cell", [content]);
  //       tr.append(td);
  //       trace(r, c, tr.getOuterWidth(), size.width);
  //       if (maxcol == options.columns && tr.getOuterWidth() > size.width) {
  //         maxcol = c + 1;
  //         break;
  //       };
  //     }
  //     if (floater.getOuterHeight() > size.height) break;
  //   }
  //
  //   moveFloaterTo(0, 0);
  // }
}
