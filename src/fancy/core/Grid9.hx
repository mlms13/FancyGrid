package fancy.core;

import js.html.Element;
using dots.Dom;
using dots.Query;
using thx.Arrays;
using thx.Floats;
using thx.Functions;
using thx.Nulls;

// TODO
// - initial size
// - initial left/top/right/bottom

typedef Grid9Options = {
  ?scrollerSize: Float,
  ?scrollerMargin: Float,
  ?scrollerMinSize: Float,
  ?scrollerMaxSize: Float
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

  public var position: {
    x: Float,
    y: Float
  };

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
  var scrollerVDimensions: ScrollerDimensions;
  var scrollerHDimensions: ScrollerDimensions;

  public function new(parent: Element, ?options: Grid9Options) {
    if(null == options)
      options = {};
    position = { x: 0.0, y: 0.0 };
    var offset = Lazy.of(willDisplayBothScrollbar() ? scrollerSize + scrollerMargin : 0),
        viewHeight = Lazy.of(gridHeight - topHeight - bottomHeight),
        contentHeight = Lazy.of(contentHeight - topHeight - bottomHeight),
        viewWidth = Lazy.of(gridWidth - leftWidth - rightWidth),
        contentWidth = Lazy.of(contentWidth - leftWidth - rightWidth),
        minScrollerSize = null != options.scrollerMinSize ? Lazy.ofValue(options.scrollerMinSize) : null,
        maxScrollerSize = null != options.scrollerMaxSize ? Lazy.ofValue(options.scrollerMaxSize) : null;
    scrollerVDimensions = new ScrollerDimensions({
      viewSize: viewHeight,
      contentSize: contentHeight,
      scrollerArea: viewHeight - offset,
      minScrollerSize: minScrollerSize,
      maxScrollerSize: maxScrollerSize
    });
    scrollerHDimensions = new ScrollerDimensions({
      viewSize: viewWidth,
      contentSize: contentWidth,
      scrollerArea: viewWidth - offset,
      minScrollerSize: minScrollerSize,
      maxScrollerSize: maxScrollerSize
    });

    scrollerSize = options.scrollerSize.or(10);
    scrollerMargin = options.scrollerMargin.or(4);

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
    resizeContent(1000, 2200); // TODO
    sizeFixedElements(100, 100, 100, 100); // TODO
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
    new SwipeMoveHelper(el, function(dx, dy) {
      movePosition(dx, dy);
      refresh();
    });
    new DragMoveHelper(scrollerH, function(dx, _) {
      movePosition(scrollerHDimensions.scrollerToContentPosition(dx).value, 0);
      refresh();
    });
    new DragMoveHelper(scrollerV, function(_, dy) {
      movePosition(0, scrollerVDimensions.scrollerToContentPosition(dy).value);
      refresh();
    });
  }

  inline function displayVScroller()
    return contentHeight > gridHeight;

  inline function displayHScroller()
    return contentWidth > gridWidth;

  inline function willDisplayBothScrollbar()
    return displayHScroller() && displayVScroller();

  function refreshScrollers() {
    if(!displayVScroller()) {
      scrollerV.style.display = "none";
    } else {
      scrollerV.style.display = "block";
      var pos = scrollerVDimensions.contentToScrollerPosition(position.y).value,
          size = scrollerVDimensions.scrollerSize.value;
      scrollerV.style.top = '${topHeight + pos}px';
      scrollerV.style.left = '${gridWidth.min(contentWidth) - rightWidth - scrollerSize - scrollerMargin}px';
      scrollerV.style.width = '${scrollerSize}px';
      scrollerV.style.height = '${size}px';
    }
    if(!displayHScroller()) {
      scrollerH.style.display = "none";
    } else {
      scrollerH.style.display = "block";
      var pos = scrollerHDimensions.contentToScrollerPosition(position.x).value,
          size = scrollerHDimensions.scrollerSize.value;
      scrollerH.style.left = '${leftWidth + pos}px';
      scrollerH.style.top = '${gridHeight.min(contentHeight) - bottomHeight - scrollerSize - scrollerMargin}px';
      scrollerH.style.width = '${size}px';
      scrollerH.style.height = '${scrollerSize}px';
    }
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
}
