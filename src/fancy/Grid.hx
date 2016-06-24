package fancy;

import js.html.Element;
using dots.Dom;

typedef GridOptions = {
  render: Int -> Int -> Element,
  vOffset: Int -> Float,
  hOffset: Int -> Float,
  columns: Int,
  rows: Int,
  vSize: Void -> Float,
  hSize: Void -> Float,
  ?vExtraSize: Null<Float>,
  ?hExtraSize: Null<Float>
};

class RefSize {
  var vSize: Void -> Float;
  var hSize: Void -> Float;
  var vExtraSize: Float;
  var hExtraSize: Float;

  public var width(get, null): Float;
  public var height(get, null): Float;
  public var offsetTop(get, null): Float;
  public var offsetLeft(get, null): Float;

  public function new(vSize: Void -> Float, hSize: Void -> Float, vExtraSize: Null<Float>, hExtraSize: Null<Float>) {
    this.vSize = vSize;
    this.hSize = hSize;
    this.vExtraSize = null != vExtraSize ? vExtraSize : 0.5;
    this.hExtraSize = null != hExtraSize ? hExtraSize : 0.5;
  }

  function get_width() return hSize() + 2 * hSize() * hExtraSize;
  function get_height() return vSize() + 2 * vSize() * vExtraSize;

  function get_offsetTop() return - vSize() * vExtraSize;
  function get_offsetLeft() return - hSize() * hExtraSize;
}

class Grid {
  var options : GridOptions;
  var gridContainer : Element;
  var floater : Element;
  var vScroller : Element;

  var refSize: RefSize;

  public function new(parent : Element, options : GridOptions) {
    this.options = options;

    refSize = new RefSize(options.vSize, options.hSize, options.vExtraSize, options.hExtraSize);

    floater = Dom.create("div.fg-floater", ["style" => "position:absolute;"]);
    vScroller = Dom.create("div.fg-vscroller", ["style" => "position:absolute;right:0"]);
    gridContainer = Dom.create("div.fg-container", ["style" => "position:relative;width:100%;height:100%;overflow:hidden"], [floater, vScroller]);
    parent.empty().append(gridContainer);

    gridContainer.on("wheel", onWheel);
  }

  function onWheel(e : js.html.WheelEvent) {
    // TODO
    // conditionally insert row if moving down
    // conditionally append row if moving up
    // conditionally insert col if moving right
    // conditionally append col if moving left
    moveFloater(-e.deltaX, -e.deltaY);
  }

  function getContainerSize()
    return {
      width: gridContainer.getOuterWidth(),
      height: gridContainer.getOuterHeight()
    };

  function moveFloater(x : Float, y : Float) {
    moveFloaterTo(floater.offsetLeft + x, floater.offsetTop + y);
  }

  function moveFloaterTo(x : Float, y : Float) {
    var size = getContainerSize(),
        h = floater.getOuterHeight(),
        w = floater.getOuterWidth();
    if(y + h < size.height) {
      if(h < size.height) {
        y = 0;
      } else {
        y = size.height - h;
      }
    } else if(y > 0) {
      y = 0;
    }
    if(x + w < size.width) {
      if(w < size.width) {
        x = 0;
      } else {
        x = size.width - w;
      }
    } else if(x > 0) {
      x = 0;
    }
    if(y + h < size.height) {
      if(h < size.height) {
        y = 0;
      } else {
        y = size.height - h;
      }
    }
    floater.style.top = '${y}px';
    floater.style.left = '${x}px';
    trace('floater pos ($x, $y)');
  }

  public function goto(row : Int, col : Int) {
    floater.empty();

    var size = getContainerSize();
    // constraint movement
    if(row < 0) row = 0;
    else if(row >= options.rows) row = options.rows - 1;
    if(col < 0) col = 0;
    else if(col >= options.columns) col = options.columns - 1;

    var maxcol = options.columns;

    for (r in row...options.rows) {
      var tr = Dom.create("div.fg-row");
      floater.append(tr);
      for (c in col...maxcol) {
        var content = options.render(r, c);
        var td = Dom.create("div.fg-cell", [content]);
        tr.append(td);
        trace(r, c, tr.getOuterWidth(), size.width);
        if (maxcol == options.columns && tr.getOuterWidth() > size.width) {
          maxcol = c + 1;
          break;
        };
      }
      if (floater.getOuterHeight() > size.height) break;
    }

    moveFloaterTo(0, 0);
  }
}
