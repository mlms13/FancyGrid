package fancy.core;

using fancy.core.Lazy;

class ScrollerDimensions {
  // inputs
  var viewSize: Lazy<Float>;
  var contentSize: Lazy<Float>;
  var scrollerArea: Lazy<Float>;
  var minScrollerSize: Lazy<Float>;
  var maxScrollerSize: Lazy<Float>;

  // outputs
  public var proportionalScrollerSize(default, null) : Lazy<Float>;
  public var scrollerSize(default, null) : Lazy<Float>;

  public function new(opt : {
    viewSize: Lazy<Float>,
    contentSize: Lazy<Float>,
    scrollerArea: Lazy<Float>,
    ?minScrollerSize: Lazy<Float>,
    ?maxScrollerSize: Lazy<Float>
  }) {
    viewSize = opt.viewSize;
    contentSize = opt.contentSize;
    scrollerArea = opt.scrollerArea;

    var minScrollerSize: Lazy<Float> = null == opt.minScrollerSize ?
        Lazy.ofValue(0.0) :
        opt.minScrollerSize.max(Lazy.ofValue(0.0));
    var maxScrollerSize: Lazy<Float> = null == opt.maxScrollerSize ?
        Lazy.ofValue(Math.POSITIVE_INFINITY) :
        opt.maxScrollerSize.map(function(v) return v < 0.0 ? Math.POSITIVE_INFINITY : v);

    // computed values
    proportionalScrollerSize = function(): Float return viewSize.value / contentSize.value * scrollerArea.value;
    scrollerSize = proportionalScrollerSize
        .max(minScrollerSize)
        .min(maxScrollerSize);
  }

  public function scrollerPositionAsPercent(position : Float) : Lazy<Float>
    return position / (scrollerArea - scrollerSize);

  public function scrollerTopAsPercent(position : Float) : Lazy<Float>
    return position / scrollerArea;

  public function contentPositionAsPercent(position : Float) : Lazy<Float>
    return position / (contentSize - viewSize);

  public function contentTopAsPercent(position : Float) : Lazy<Float>
    return position / contentSize;

  public function scrollerToContentPosition(position : Float) : Lazy<Float>
    return scrollerPositionAsPercent(position) * (contentSize - viewSize);

  public function contentToScrollerPosition(position : Float) : Lazy<Float>
    return contentPositionAsPercent(position) * (scrollerArea - scrollerSize);
}
