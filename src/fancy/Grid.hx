package fancy;

import js.html.Element;
import fancy.core.*;
using dots.Dom;
using fancy.core.Lazy;
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

  var render: Int -> Int -> Element;
  var vOffset: Int -> Float;
  var hOffset: Int -> Float;
  var vSize: Int -> Float;
  var hSize: Int -> Float;

  public function new(parent : Element, options : GridOptions) {
    var fancyGrid = Dom.create("div.fancy-grid");
    parent.append(fancyGrid);
    var view = Dom.create("div.view", []);
    fancyGrid.append(view);
    var grid9 = new Grid9(view, {
      scrollerMinSize : 10.0,
      scrollerMaxSize : 100.0,
      scrollerSize : 10,
      contentWidth : options.hOffset(options.columns - 1) + options.hSize(options.columns - 1),
      contentHeight : options.vOffset(options.rows - 1) + options.vSize(options.rows - 1),
      topRail : (0...options.fixedTop).reduce(function(acc, row) {
        return options.vSize(row) + acc;
      }, 0.0),
      leftRail : (0...options.fixedLeft).reduce(function(acc, col) {
        return options.hSize(col) + acc;
      }, 0.0),
      bottomRail : ((options.rows - options.fixedBottom).max(0)...options.rows).reduce(function(acc, row) {
        return options.vSize(row) + acc;
      }, 0.0),
      rightRail : ((options.columns - options.fixedRight).max(0)...options.columns).reduce(function(acc, col) {
        return options.hSize(col) + acc;
      }, 0.0),
      onScroll : function(x, y) {
        renderMiddleLeft(y);
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

    rows = options.rows;
    columns = options.columns;

    fixedLeft = options.fixedLeft.or(0);
    fixedRight = options.fixedRight.or(0);
    fixedTop = options.fixedTop.or(0);
    fixedBottom = options.fixedBottom.or(0);

    renderCorners();
  }

  function renderTo(parent: Element, row: Int, col: Int) {
    var el = renderCell(row, col);
    parent.append(el);
  }

  function renderCell(row: Int, col: Int) {
    var cell = Dom.create('div.cell.row-$row.col-$col', [render(row, col)]);
    cell.style.top = '${vOffset(row)}px';
    cell.style.left = '${hOffset(col)}px';
    return cell;
  }

  function renderMiddleLeft(v: Float) {

  }

  function searchRow(v: Float, r: Int): Int {

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
