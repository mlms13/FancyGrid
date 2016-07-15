package fancy;

import js.html.Element;
import fancy.core.*;
using dots.Dom;
using fancy.core.Lazy;
using fancy.core.Search;
using thx.Nulls;
using thx.Ints;
using thx.Iterators;

// TODO
// - snap to cell
// - no fixed columns
// - no fixed rows

typedef GridOptions = {
  render: Int -> Int -> Element,
  vOffset: Int -> Float,
  hOffset: Int -> Float,
  vSize: Int -> Float,
  hSize: Int -> Float,
  columns: Int,
  rows: Int,
  ?fixedLeft: Int,
  ?fixedRight: Int,
  ?fixedTop: Int,
  ?fixedBottom: Int
};

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

  public function new(parent : Element, options : GridOptions) {
    var fancyGrid = Dom.create("div.fancy-grid");
    parent.append(fancyGrid);
    var view = Dom.create("div.view", []);
    fancyGrid.append(view);
    topRailSize = (0...options.fixedTop).reduce(function(acc, row) {
      return options.vSize(row) + acc;
    }, 0.0);
    leftRailSize = (0...options.fixedLeft).reduce(function(acc, col) {
      return options.hSize(col) + acc;
    }, 0.0);
    bottomRailSize = ((options.rows - options.fixedBottom).max(0)...options.rows).reduce(function(acc, row) {
      return options.vSize(row) + acc;
    }, 0.0);
    rightRailSize = ((options.columns - options.fixedRight).max(0)...options.columns).reduce(function(acc, col) {
      return options.hSize(col) + acc;
    }, 0.0);
    grid9 = new Grid9(view, {
      scrollerMinSize : 20.0,
      scrollerMaxSize : 160.0,
      scrollerSize : 10,
      contentWidth : options.hOffset(options.columns - 1) + options.hSize(options.columns - 1),
      contentHeight : options.vOffset(options.rows - 1) + options.vSize(options.rows - 1),
      topRail : topRailSize,
      leftRail : leftRailSize,
      bottomRail : bottomRailSize,
      rightRail : rightRailSize,
      onScroll : function(x, y, ox, oy) {
        if(oy != y)
          renderMiddle(y);
        if(ox != x)
          renderCenter(x);
        renderMain(x, y);
      },
      onResize : function(w, h, ow, oh) {
        if(oh != h)
          renderMiddle(grid9.position.y);
        if(ow != w)
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

    render = options.render;
    vOffset = options.vOffset;
    hOffset = options.hOffset;
    vSize = options.vSize;
    hSize = options.hSize;

    rows = options.rows;
    columns = options.columns;

    fixedLeft = options.fixedLeft.or(0);
    fixedRight = options.fixedRight.or(0);
    fixedTop = options.fixedTop.or(0);
    fixedBottom = options.fixedBottom.or(0);

    renderCorners();
    renderMiddle(0);
    renderCenter(0);
    renderMain(0, 0);
  }


  var cache: Map<String, Element> = new Map();
  function renderTo(parent: Element, row: Int, col: Int) {
    var k = '$row-$col';
    var el = cache.get(k);
    if(null == el) {
      el = renderCell(row, col);
      cache.set(k, el);
    }
    parent.append(el);
  }

  function renderCell(row: Int, col: Int) {
    var cell = Dom.create('div.cell.row-$row.col-$col', [render(row, col)]);
    cell.style.top = '${vOffset(row)}px';
    cell.style.left = '${hOffset(col)}px';
    cell.style.width = '${hSize(row)}px';
    cell.style.height = '${vSize(col)}px';
    return cell;
  }

  function renderMiddle(v: Float) {
    var r = Search.binary(0, rows, rowComparator(v)) + fixedTop;
    var top = vOffset(r);
    var limit = top + grid9.gridMiddleHeight;

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
    while(top < limit + (vSize(r))) {
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
    var c = Search.binary(0, columns, columnComparator(v)) + fixedLeft;
    var left = hOffset(c);
    var limit = left + grid9.gridCenterWidth;

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
    while(left < limit + (hSize(c))) {
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
    var r = Search.binary(0, rows, rowComparator(y)) + fixedTop;
    var c = Search.binary(0, columns, columnComparator(x)) + fixedLeft;

    var left = hOffset(c);
    var top = vOffset(r);
    var hlimit = left + grid9.gridCenterWidth;
    var vlimit = top + grid9.gridMiddleHeight;


    grid9.middleCenter.empty();

    var anchor = Dom.create("div.anchor.middle.center");
    anchor.style.top = '-${topRailSize}px';
    anchor.style.left = '-${leftRailSize}px';

    grid9.middleCenter.append(anchor);
    while(r < (rows - fixedBottom) && top < vlimit + vSize(r)) {
      var tleft = left;
      var tc = c;
      // renderTo(anchor, r, tc);
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
}
