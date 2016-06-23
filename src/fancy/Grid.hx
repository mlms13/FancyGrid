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
  hSize: Void -> Float
};

class Grid {
  var options : GridOptions;
  var gridContainer : Element;
  var floater : Element;
  var vScroller : Element;

  public function new(parent : Element, options : GridOptions) {
    this.options = options;
    floater = Dom.create("div.fg-floater", ["style" => "position:absolute;"]);
    vScroller = Dom.create("div.fg-vscroller", ["style" => "position:absolute;right:0"]);
    gridContainer = Dom.create("div.fg-container", ["style" => "position:relative;width:100%;height:100%;overflow:hidden"], [floater, vScroller]);
    parent.empty().append(gridContainer);

    gridContainer.on("wheel", onWheel);
  }

  function onWheel(e : js.html.WheelEvent) {
    moveFloater(-e.deltaX, -e.deltaY);
  }

  function getContainerSize() {
    return {
      width: gridContainer.getOuterWidth(),
      height: gridContainer.getOuterHeight()
    };
  }

  function moveFloater(x : Float, y : Float) {
    moveFloaterTo(floater.offsetLeft + x, floater.offsetTop + y);
  }

  function moveFloaterTo(x : Float, y : Float) {
    floater.style.top = '${y}px';
    floater.style.left = '${x}px';
  }

  public function goto(row : Int, col : Int) {
    moveFloaterTo(0, 0);
    floater.empty();

    var size = getContainerSize();

    // TODO: add some validation that `row` < `options.rows`, same for cols
    for (r in row...options.rows) {
      var tr = Dom.create("div.fg-row");
      for (c in col...options.columns) {
        var content = options.render(r, c);
        var td = Dom.create("div.fg-cell", [content]);
        tr.append(td);
        if (tr.getOuterWidth() > size.width) break;
      }
      floater.append(tr);
      if (floater.getOuterHeight() > size.height) break;
    }
  }
}
