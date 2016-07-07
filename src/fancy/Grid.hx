package fancy;

import js.html.Element;
using dots.Dom;
using dots.Query;
using thx.Arrays;
using thx.Floats;
using thx.Functions;

// TODO
// - resize handle
// - scroll handle
// - touch handle
// - snap to cell
// - fixed header rows
// - fixed footer rows
// - fixed left columns
// - fixed right columns


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

// TODO
// - dynamically add class to state overlapping
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

  public function new(parent: Element) {
    position = new ScrollPosition();
    el = Dom.create("div.grid9", [
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
    setGridSizeFromContainer();
    resizeContent(1200, 1000); // TODO
    sizeFixedElements(400, 100, 600, 200); // TODO
    refresh();

    // EVENTS
    // TODO make wiring optional
    js.Browser.window.addEventListener("resize", function(_) {
      setGridSizeFromContainer();
      refresh();
    });
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

    if(position.y > 0 || gridHeight < topHeight + bottomHeight)
      Dom.addClass(top, 'overlay-bottom');
    else
      Dom.removeClass(top, 'overlay-bottom');
    if(contentHeight > gridHeight)
      Dom.addClass(bottom, 'overlay-top');
    else
      Dom.removeClass(bottom, 'overlay-top');
    if(position.x > 0 || gridWidth < leftWidth + rightWidth)
      Dom.addClass(left, 'overlay-right');
    else
      Dom.removeClass(left, 'overlay-right');
    if(contentWidth > gridWidth && gridWidth > leftWidth + rightWidth)
      Dom.addClass(right, 'overlay-left');
    else
      Dom.removeClass(right, 'overlay-left');
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

  public function scrollTo(x: Float, y: Float) {

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
