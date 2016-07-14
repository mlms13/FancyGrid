package fancy.core;

import js.html.Element;
using dots.Dom;
using dots.Query;
using thx.Arrays;
using thx.Floats;
using thx.Functions;
using thx.Nulls;

typedef Grid9Options = {
  contentWidth: Float,
  contentHeight: Float,
  scrollerSize: Float,
  ?onScroll: Float -> Float -> Void,
  ?scrollerMargin: Float,
  ?scrollerMinSize: Float,
  ?scrollerMaxSize: Float,
  ?topRail : Float,
  ?bottomRail : Float,
  ?leftRail : Float,
  ?rightRail : Float
}

class Grid9 {
  public var el(default, null): Element;
  public var contentWidth(default, null): Float;
  public var contentHeight(default, null): Float;
  public var gridWidth(default, null): Float;
  public var gridHeight(default, null): Float;

  public var topRail(default, null): Float;
  public var bottomRail(default, null): Float;
  public var leftRail(default, null): Float;
  public var rightRail(default, null): Float;


  public var topLeft(default, null): Element;
  public var topCenter(default, null): Element;
  public var topRight(default, null): Element;
  public var middleLeft(default, null): Element;
  public var middleCenter(default, null): Element;
  public var middleRight(default, null): Element;
  public var bottomLeft(default, null): Element;
  public var bottomCenter(default, null): Element;
  public var bottomRight(default, null): Element;

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

  var onScroll: Float -> Float -> Void;

  public function new(parent: Element, options: Grid9Options) {
    position = { x: 0.0, y: 0.0 };
    onScroll = options.onScroll.or(function(x, y) {});
    var offset = Lazy.of(willDisplayBothScrollbar() ? scrollerSize + scrollerMargin : 0),
        viewHeight = Lazy.of(gridHeight - topRail - bottomRail),
        contentHeight = Lazy.of(contentHeight - topRail - bottomRail),
        viewWidth = Lazy.of(gridWidth - leftRail - rightRail),
        contentWidth = Lazy.of(contentWidth - leftRail - rightRail),
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

    scrollerSize = options.scrollerSize;
    scrollerMargin = options.scrollerMargin.or(0);

    el = Dom.create("div.grid9", [
      Dom.create('div.scroller.scroller-v'),
      Dom.create('div.scroller.scroller-h'),
      Dom.create("div.row.top"),
      Dom.create("div.row.bottom"),
      Dom.create("div.column.left"),
      Dom.create("div.column.right"),
      Dom.create("div.pane.top.left"),
      Dom.create("div.pane.top.center"),
      Dom.create("div.pane.top.right"),
      Dom.create("div.pane.middle.left"),
      Dom.create("div.pane.middle.center"),
      Dom.create("div.pane.middle.right"),
      Dom.create("div.pane.bottom.left"),
      Dom.create("div.pane.bottom.center"),
      Dom.create("div.pane.bottom.right")
    ]);
    parent.append(el);

    // GET REFERENCES
    scrollerV = Query.find(".scroller-v", el);
    scrollerH = Query.find(".scroller-h", el);
    top     = Query.find(".row.top", el);
    bottom  = Query.find(".row.bottom", el);
    left    = Query.find(".column.left", el);
    right   = Query.find(".column.right", el);
    tops    = Query.select(".pane.top", el);
    bottoms = Query.select(".pane.bottom", el);
    lefts   = Query.select(".pane.left", el);
    rights  = Query.select(".pane.right", el);
    middles = Query.select(".pane.middle", el);
    centers = Query.select(".pane.center", el);

    topLeft      = Query.find(".pane.top.left", el);
    topCenter    = Query.find(".pane.top.center", el);
    topRight     = Query.find(".pane.top.right", el);
    middleLeft   = Query.find(".pane.middle.left", el);
    middleCenter = Query.find(".pane.middle.center", el);
    middleRight  = Query.find(".pane.middle.right", el);
    bottomLeft   = Query.find(".pane.bottom.left", el);
    bottomCenter = Query.find(".pane.bottom.center", el);
    bottomRight  = Query.find(".pane.bottom.right", el);

    // RESIZE
    setGridSizeFromContainer();
    resizeContent(options.contentWidth, options.contentHeight);
    sizeRails(
      options.topRail.or(0),
      options.bottomRail.or(0),
      options.leftRail.or(0),
      options.rightRail.or(0)
    );
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
      scrollerV.style.top = '${topRail + pos}px';
      scrollerV.style.left = '${gridWidth.min(contentWidth) - rightRail - scrollerSize - scrollerMargin}px';
      scrollerV.style.width = '${scrollerSize}px';
      scrollerV.style.height = '${size}px';
    }
    if(!displayHScroller()) {
      scrollerH.style.display = "none";
    } else {
      scrollerH.style.display = "block";
      var pos = scrollerHDimensions.contentToScrollerPosition(position.x).value,
          size = scrollerHDimensions.scrollerSize.value;
      scrollerH.style.left = '${leftRail + pos}px';
      scrollerH.style.top = '${gridHeight.min(contentHeight) - bottomRail - scrollerSize - scrollerMargin}px';
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
    onScroll(position.x, position.y);
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
    middles.each.fn(_.style.top = '${-position.y + topRail}px');
    bottoms.each.fn(_.style.top = '${gridHeight.min(contentHeight) - bottomRail}px');
    bottom.style.top = '${gridHeight.min(contentHeight) - bottomRail}px';

    centers.each.fn(_.style.left = '${-position.x + leftRail}px');
    rights.each.fn(_.style.left = '${gridWidth.min(contentWidth) - rightRail}px');
    right.style.left = '${gridWidth.min(contentWidth) - rightRail}px';

    top.toggleClass('overlay-bottom', position.y > 0 || gridHeight < topRail + bottomRail);
    bottom.toggleClass('overlay-top', contentHeight > gridHeight && position.y < contentHeight - gridHeight);
    left.toggleClass('overlay-right', position.x > 0 || gridWidth < leftRail + rightRail);
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

  public function sizeRails(topRail: Float, bottomRail: Float, leftRail: Float, rightRail: Float) {
    if(this.topRail == topRail && this.bottomRail == bottomRail && this.leftRail == leftRail && this.rightRail == rightRail)
      return;
    dirty = true;
    this.topRail = topRail;
    this.bottomRail = bottomRail;
    this.leftRail = leftRail;
    this.rightRail = rightRail;
    top.style.height = '${topRail}px';
    tops.each.fn(_.style.height = '${topRail}px');
    middles.each.fn(_.style.height = '${contentHeight - topRail - bottomRail}px');
    bottom.style.height = '${bottomRail}px';
    bottoms.each.fn(_.style.height = '${bottomRail}px');
    left.style.width = '${leftRail}px';
    lefts.each.fn(_.style.width = '${leftRail}px');
    centers.each.fn(_.style.width = '${contentWidth - leftRail - rightRail}px');
    right.style.width = '${rightRail}px';
    rights.each.fn(_.style.width = '${rightRail}px');
  }
}
