package fancy;

import js.html.Element;
import fancy.core.*;
using dots.Dom;
import fancy.core.IntCache;
import fancy.core.PositionCache;
using fancy.core.Search;
using thx.Nulls;
using thx.Floats;
using thx.Ints;

enum VerticalScrollPosition {
  Top;
  Bottom;
  FromTop(distance: ScrollUnit);
  FromBottom(distance: ScrollUnit);
  Visible(distance: ScrollUnit);
}

enum HorizontalScrollPosition {
  Left;
  Right;
  FromLeft(distance: ScrollUnit);
  FromRight(distance: ScrollUnit);
  Visible(distance: ScrollUnit);
}

enum ScrollUnit {
  Pixels(value: Float);
  Cells(value: Int);
}

enum CellDimension {
  Fixed(v: Float);
  RenderFirst;
  RenderSmart; // renders more cells, may be slower
  RenderAll; // renders all cells. definitely slower.
}

typedef GridOptions = {
  render: Int -> Int -> Element,
  ?vOffset: Int -> Float,
  ?hOffset: Int -> Float,
  ?vSize: Int -> CellDimension,
  ?hSize: Int -> CellDimension,
  columns: Int,
  rows: Int,
  ?fixedLeft: Int,
  ?fixedRight: Int,
  ?fixedTop: Int,
  ?fixedBottom: Int,
  ?scrollerMinSize: Float,
  ?scrollerMaxSize: Float,
  ?scrollerSize: Float,
  ?onScroll: Float -> Float -> Float -> Float -> Void,
  ?onResize: Float -> Float -> Float -> Float -> Void
};

typedef InvalidatableCache = {
  public function invalidate() : Void;
}

class Grid {
  var topLeft: Element;
  var topCenter: Element;
  var topRight: Element;
  var middleLeft: Element;
  var middleCenter: Element;
  var middleRight: Element;
  var bottomLeft: Element;
  var bottomCenter: Element;
  var bottomRight: Element;

  var view: Element;

  var fixedLeft: Int;
  var fixedRight: Int;
  var fixedTop: Int;
  var fixedBottom: Int;
  var columns: Int;
  var rows: Int;

  var grid9: Grid9;

  var render: Int -> Int -> Element;
  var vOffset: Int -> Float;
  var hOffset: Int -> Float;
  var vSize: Int -> Float;
  var hSize: Int -> Float;

  var topRailSize: Float;
  var leftRailSize: Float;
  var bottomRailSize: Float;
  var rightRailSize: Float;

  var cacheElement: PositionCache<Element> = new PositionCache();

  var caches : Array<InvalidatableCache> = [];

  public function new(parent : Element, options : GridOptions) {
    var fancyGrid = Dom.create("div.fancy-grid");
    parent.append(fancyGrid);
    view = Dom.create("div.view");
    fancyGrid.append(view);

    caches.push(cacheElement);

    render = options.render;
    vOffset = assignVOffset(options.vOffset);
    hOffset = assignHOffset(options.hOffset);
    hSize = assignHSize(options.hSize != null ? options.hSize : function (_) return RenderSmart);
    vSize = assignVSize(options.vSize != null ? options.vSize : function (_) return RenderSmart);
    rows = options.rows;
    columns = options.columns;

    fixedLeft = options.fixedLeft.or(0);
    fixedRight = options.fixedRight.or(0);
    fixedTop = options.fixedTop.or(0);
    fixedBottom = options.fixedBottom.or(0);

    var scrollerSize = options.scrollerSize.or(10);

    var onScroll = options.onScroll.or(function(_, _, _, _) {});
    var onResize = options.onResize.or(function(_, _, _, _) {});

    grid9 = new Grid9(view, {
      scrollerMinSize : options.scrollerMinSize.or(scrollerSize),
      scrollerMaxSize : options.scrollerMaxSize,
      scrollerSize : scrollerSize,
      contentWidth : 0,
      contentHeight : 0,
      onScroll : function(x, y, ox, oy) {
        if(oy != y)
          renderMiddle(y);
        if(ox != x)
          renderCenter(x);
        renderMain(x, y);
        onScroll(x, y, ox, oy);
      },
      onResize : function(w, h, ow, oh) {
        if(oh != h)
          renderMiddle(grid9.position.y);
        if(ow != w)
          renderCenter(grid9.position.x);
        renderMain(grid9.position.x, grid9.position.y);
        onResize(w, h, ow, oh);
      },
      onRefresh : function() {
        renderCorners();
        renderMiddle(grid9.position.y);
        renderCenter(grid9.position.x);
        renderMain(grid9.position.x, grid9.position.y);
      }
    });

    topLeft = grid9.topLeft;
    topCenter = grid9.topCenter;
    topRight = grid9.topRight;
    middleLeft = grid9.middleLeft;
    middleCenter = grid9.middleCenter;
    middleRight = grid9.middleRight;
    bottomLeft = grid9.bottomLeft;
    bottomCenter = grid9.bottomCenter;
    bottomRight = grid9.bottomRight;

    setRowsAndColumns(rows, columns);
  }

  public function patchCellContent(row: Int, col: Int, el: Element) {
    // TODO !!!
    var s = '.row-$row.col-$col';
    var p = grid9.el.querySelector(s);
    if(null == p) return;
    p.innerHTML = "";
    p.appendChild(el);
  }

  public function setRowsAndColumns(rows: Int, columns: Int) {
    this.rows = rows;
    this.columns = columns;
    invalidateCache();

    // recalculate sizes with the new content, and update grid9
    var contentWidth = hOffset(columns - 1) + hSize(columns - 1);
    var contentHeight = vOffset(rows - 1) + vSize(rows - 1);

    topRailSize = vOffset(fixedTop);
    leftRailSize = hOffset(fixedLeft);
    bottomRailSize = fixedBottom == 0 ? 0 : (contentHeight - vOffset(rows - fixedBottom));
    rightRailSize = fixedRight == 0 ? 0 : (contentWidth - hOffset(columns - fixedRight));
    grid9.sizeRails(topRailSize, bottomRailSize, leftRailSize, rightRailSize);
    grid9.resizeContent(contentWidth, contentHeight);
    grid9.setPosition(grid9.position.x, grid9.position.y, false);

    renderCorners();
    renderMiddle(grid9.position.y);
    renderCenter(grid9.position.x);
    renderMain(grid9.position.x, grid9.position.y);
    grid9.refresh();
  }

  public function scrollTo(?x: HorizontalScrollPosition, ?y: VerticalScrollPosition) {
    var xPos = x == null ? grid9.position.x : resolveHorizontalScroll(x),
        yPos = y == null ? grid9.position.y : resolveVerticalScroll(y);

    // `setPosition` in Grid9 already handles limits and early returns if
    // nothing changed, so we can just go ahead and call it here
    grid9.setPosition(xPos, yPos, true);
    grid9.refresh();
  }

  // public function refresh() {
  //   trace("grid.refresh");
  //   var x = 0,
  //       y = 0;

  //   scrollTo(100, 100);

  //   // renderMiddle(y);
  //   // renderCenter(x);
  //   // renderMain(x, y);
  //   // grid9.refresh();
  // }

  function resolveHorizontalDistance(x: ScrollUnit): Float {
    return switch x {
      case Pixels(v): v;
      case Cells(v): hOffset(v);
    };
  }

  function resolveHorizontalScroll(x: HorizontalScrollPosition): Float {
    return switch x {
      case Left: 0;
      case Right: grid9.contentWidth; // grid9.setPosition will limit this
      case FromLeft(d): resolveHorizontalDistance(d);
      case FromRight(d): grid9.contentWidth - resolveHorizontalDistance(d);
      case Visible(d):
        var off = resolveHorizontalDistance(d);
        var pos = grid9.position;
        var size = grid9.size;
        if(off >= pos.x && off <= pos.x + size.w) {
          pos.x;
        } else if(off < pos.x) {
          off;
        } else {
          off; // TODO !!!
        }
    };
  }

  function resolveVerticalDistance(y: ScrollUnit): Float {
    return switch y {
      case Pixels(v): v;
      case Cells(v): vOffset(v);
    };
  }

  function resolveVerticalScroll(y: VerticalScrollPosition): Float {
    return switch y {
      case Top: 0;
      case Bottom: grid9.contentHeight;
      case FromTop(d): resolveVerticalDistance(d);
      case FromBottom(d): grid9.contentHeight - resolveVerticalDistance(d);
      case Visible(d):
        var off = resolveVerticalDistance(d);
        var pos = grid9.position;
        var size = grid9.size;
        if(off >= pos.y && off <= pos.y + size.h) {
          pos.y;
        } else if(off < pos.y) {
          off;
        } else {
          off; // TODO !!!
        }
    };
  }

  function invalidateCache() {
    for(cache in caches)
      cache.invalidate();
  }

  function assignVSize(f: Int -> CellDimension): Int -> Float {
    var cache = new IntCache();
    caches.push(cache);

    return function(row) {
      if(cache.exists(row))
        return cache.get(row);

      var v = 0.0;
      var vCalculated = switch f(row) {
        case Fixed(val): val;
        case RenderSmart:
          // test left shoulder and first content cell
          var els: Array<Element> = [], el;
          var leftBound = (fixedLeft + 1).max(2).min(columns);
          for(i in 0...leftBound) {
            el = renderWithWidth(view, row, i);
            els.push(el);
          }
          // test last content cell and right shoulder
          var rightBound = (columns - fixedRight - 1).max(leftBound + 1);
          for(i in rightBound...columns) {
            el = renderWithWidth(view, row, i);
            els.push(el);
          }
          // get measure
          for(el in els)
            v = v.max(el.getOuterHeight());

          for(el in els)
            view.removeChild(el);
          v;
        case RenderFirst:
          // test left shoulder and first content cell
          var el = renderWithWidth(view, row, 0);

          // get measure
          v = v.max(el.getOuterHeight());
          view.removeChild(el);
          v;
        case RenderAll:
          var els = [], el;
          for (i in 0...columns) {
            el = renderWithWidth(view, row, i);

            els.push(el);
          }

          // get measure
          for(el in els)
            v = v.max(el.getOuterHeight());

          for(el in els)
            view.removeChild(el);
          v;
      }

      cache.set(row, vCalculated);
      return vCalculated;
    };
  }

  function assignHSize(f: Int -> CellDimension): Int -> Float {
    var cache = new IntCache();
    caches.push(cache);

    return function(col) {
      if(cache.exists(col))
        return cache.get(col);

      var v = 0.0;
      var vCalculated = switch f(col) {
        case Fixed(val): val;
        case RenderSmart:
          // test left shoulder and first content cell
          var els: Array<Element> = [], el;
          var topBound = (fixedTop + 1).max(2).min(rows);
          for(i in 0...topBound) {
            el = renderAt(i, col);
            els.push(el);
            view.append(el);
          }
          // test last content cell and right shoulder
          var bottomBound = (rows - fixedBottom - 1).max(topBound + 1);
          for(i in bottomBound...rows) {
            el = renderAt(i, col);
            els.push(el);
            view.append(el);
          }
          // get measure
          for(el in els)
            v = v.max(el.getOuterWidth());

          for(el in els)
            view.removeChild(el);
          v;
        case RenderFirst:
          // test left shoulder and first content cell
          var el = renderAt(0, col);
          view.append(el);

          // get measure
          v = v.max(el.getOuterWidth());
          view.removeChild(el);
          v;
        case RenderAll:
          var els = [], el;
          for (i in 0...rows) {
            el = renderAt(i, col);

            els.push(el);
            view.append(el);
          }

          // get measure
          for(el in els)
            v = v.max(el.getOuterWidth());

          for(el in els)
            view.removeChild(el);
          v;
      }

      cache.set(col, vCalculated);
      return vCalculated;
    };
  }

  function assignVOffset(f: Int -> Float): Int -> Float {
    if(null != f) return f;
    var cache = new IntCache();
    caches.push(cache);
    return function(row) {
      if(row == 0)
        return 0;
      if(cache.exists(row))
        return cache.get(row);
      var v = vOffset(row - 1) + vSize(row - 1);
      cache.set(row, v);
      return v;
    };
  }

  function assignHOffset(f: Int -> Float): Int -> Float {
    if(null != f) return f;
    var cache = new IntCache();
    caches.push(cache);
    return function(col) {
      if(col == 0)
        return 0;
      if(cache.exists(col))
        return cache.get(col);
      var v = hOffset(col - 1) + hSize(col - 1);
      cache.set(col, v);
      return v;
    };
  }

  function renderAt(row: Int, col: Int) {
    var el = cacheElement.get(row, col);
    if(null == el) {
      el = js.Browser.document.createElement("div");
      el.setAttribute("data-row", '$row');
      el.setAttribute("data-col", '$col');
      el.className = 'cell row-$row col-$col';
      el.appendChild(render(row, col));
      cacheElement.set(row, col, el);
    }
    return el;
  }

  function renderTo(parent: Element, row: Int, col: Int) {
    var el = renderAt(row, col);
    parent.append(el);
    el.style.top = '${vOffset(row)}px';
    el.style.left = '${hOffset(col)}px';
    el.style.width = '${hSize(col)}px';
    el.style.height = '${vSize(row)}px';
    return el;
  }

  function renderWithWidth(parent: Element, row: Int, col: Int) {
    var el = renderAt(row, col);
    parent.append(el);
    el.style.width = '${hSize(col)}px';
    return el;
  }

  function renderMiddle(v: Float) {
    var r = Search.binary(0, rows - 1, rowComparator(v + topRailSize)).max(fixedTop);
    var top = vOffset(r);
    var limit = top + vSize(r) + grid9.gridMiddleHeight;

    grid9.middleLeft.empty();
    grid9.middleRight.empty();
    var leftAnchor = Dom.create("div.anchor.middle.left");
    var rightAnchor = Dom.create("div.anchor.middle.right");
    var leftCols = fixedLeft.min(columns);
    var rightCols = (columns - fixedRight).min(columns);
    leftAnchor.style.top = '${-topRailSize}px';
    rightAnchor.style.top = '${-topRailSize}px';
    rightAnchor.style.left = '${-hOffset(rightCols)}px';

    grid9.middleLeft.append(leftAnchor);
    grid9.middleRight.append(rightAnchor);

    while(r < (rows - fixedBottom) && top < (limit + vSize(r))) {
      for(c in 0...leftCols) {
        renderTo(leftAnchor, r, c);
      }
      for(c in rightCols...columns) {
        renderTo(rightAnchor, r, c);
      }
      top += vSize(r++);
    }
  }

  function renderCenter(v: Float) {
    var c = Search.binary(0, columns - 1, columnComparator(v + leftRailSize)).max(fixedLeft);
    var left = hOffset(c);
    var limit = left + hSize(c) + grid9.gridCenterWidth;

    grid9.topCenter.empty();
    grid9.bottomCenter.empty();
    var topAnchor = Dom.create("div.anchor.top.center");
    var bottomAnchor = Dom.create("div.anchor.bottom.center");
    var topRows = fixedTop.min(rows);
    var bottomRows = (rows - fixedBottom).min(rows);
    topAnchor.style.left = '${-leftRailSize}px';
    bottomAnchor.style.top = '${-vOffset(bottomRows)}px';
    bottomAnchor.style.left = '${-leftRailSize}px';

    grid9.topCenter.append(topAnchor);
    grid9.bottomCenter.append(bottomAnchor);
    while(c < (columns - fixedRight) && left < (limit + hSize(c))) {
      for(r in 0...topRows) {
        renderTo(topAnchor, r, c);
      }
      for(r in bottomRows...rows) {
        renderTo(bottomAnchor, r, c);
      }
      left += hSize(c++);
    }
  }

  function renderMain(x: Float, y: Float) {
    var r = Search.binary(0, rows - 1, rowComparator(y + topRailSize)).max(fixedTop);
    var c = Search.binary(0, columns - 1, columnComparator(x + leftRailSize)).max(fixedLeft);

    var left = hOffset(c);
    var top = vOffset(r);
    var hlimit = left + hSize(c) + grid9.gridCenterWidth;
    var vlimit = top + vSize(r) + grid9.gridMiddleHeight;

    grid9.middleCenter.empty();

    var anchor = Dom.create("div.anchor.middle.center");
    anchor.style.top = '-${topRailSize}px';
    anchor.style.left = '-${leftRailSize}px';

    grid9.middleCenter.append(anchor);
    while(r < (rows - fixedBottom) && top < (vlimit + vSize(r))) {
      var tleft = left;
      var tc = c;
      while(tc < (columns - fixedRight) && tleft < hlimit + hSize(tc)) {
        renderTo(anchor, r, tc);
        tleft += hSize(tc++);
      }
      top += vSize(r++);
    }
  }

  function rowComparator(v: Float): Int -> Int
    return function(r: Int) {
      var tv = vOffset(r);
      if(tv > v)
        return 1;
      var th = vSize(r);
      if(tv + th >= v)
        return 0;
      return -1;
    }

  function columnComparator(v: Float): Int -> Int
    return function(r: Int) {
      var tv = hOffset(r);
      if(tv > v)
        return 1;
      var th = hSize(r);
      if(tv + th >= v)
        return 0;
      return -1;
    }

  function renderCorners() {
    var top = fixedTop.min(rows),
        bottom = (rows - fixedBottom).max(0),
        left = fixedLeft.min(columns),
        right = (columns - fixedRight).max(0),
        bottomLeftAnchor = Dom.create("div.anchor.bottom.left"),
        bottomRightAnchor = Dom.create("div.anchor.bottom.right"),
        topLeftAnchor = Dom.create("div.anchor.top.left"),
        topRightAnchor = Dom.create("div.anchor.top.right");

    var vDelta = vOffset(bottom),
        hDelta = hOffset(right);

    // TODO express in term of grid9 and xRailSize
    bottomRightAnchor.style.left = '${-hDelta}px';
    bottomRightAnchor.style.top = '${-vDelta}px';

    bottomLeftAnchor.style.top = '${-vDelta}px';

    topRightAnchor.style.left = '${-hDelta}px';

    topLeft.empty();
    topRight.empty();
    topLeft.append(topLeftAnchor);
    topRight.append(topRightAnchor);
    for(r in 0...top) {
      for(c in 0...left) {
        renderTo(topLeftAnchor, r, c);
      }
      for(c in right...columns) {
        renderTo(topRightAnchor, r, c);
      }
    }
    bottomLeft.empty();
    bottomRight.empty();
    bottomLeft.append(bottomLeftAnchor);
    bottomRight.append(bottomRightAnchor);
    for(r in bottom...rows) {
      for(c in 0...left) {
        renderTo(bottomLeftAnchor, r, c);
      }
      for(c in right...columns) {
        renderTo(bottomRightAnchor, r, c);
      }
    }
  }

  public function resetCacheForRange(minRow:Int, minCol: Int, maxRow: Int, maxCol: Int) {
    // cacheElement.invalidate(); // TODO !!!
    for(r in minRow...maxRow+1) {
      for(c in minCol...maxCol+1) {
        cacheElement.remove(r, c);
      }
    }
  }
}
