package fancy.core;

import utest.Assert;
using fancy.core.Lazy;
import fancy.core.ScrollerDimensions;

class TestScrollerDimensions {
  public function new() {}

  public function testScrollerSize() {
    var scroller = new ScrollerDimensions({
        viewSize : Lazy.ofValue(500.0),
        contentSize : Lazy.ofValue(1000.0),
        scrollerArea : Lazy.ofValue(200.0),
        minScrollerSize : Lazy.ofValue(10.0),
        maxScrollerSize : Lazy.ofValue(50.0)
      });
    assertLazy(100.0, scroller.proportionalScrollerSize);
    assertLazy(50.0, scroller.scrollerSize);
  }

  public function testScrollerPositionAsPercent() {
    var scroller = new ScrollerDimensions({
      viewSize : Lazy.ofValue(500.0),
      contentSize : Lazy.ofValue(1000.0),
      scrollerArea : Lazy.ofValue(200.0)
    });

    assertLazy(0.0, scroller.scrollerTopAsPercent(0));
    assertLazy(1.0, scroller.scrollerTopAsPercent(200));
    assertLazy(0.0, scroller.scrollerPositionAsPercent(0));
    assertLazy(1.0, scroller.scrollerPositionAsPercent(100));
  }

  public function testScrollerPositionAsPercentWithMaxSize() {
    var scroller = new ScrollerDimensions({
      viewSize : Lazy.ofValue(500.0),
      contentSize : Lazy.ofValue(1000.0),
      scrollerArea : Lazy.ofValue(200.0),
      maxScrollerSize : Lazy.ofValue(50.0)
    });

    assertLazy(0.0, scroller.scrollerTopAsPercent(0));
    assertLazy(1.0, scroller.scrollerTopAsPercent(200));
    assertLazy(0.0, scroller.scrollerPositionAsPercent(0));
    assertLazy(1.0, scroller.scrollerPositionAsPercent(150));
  }

  public function testScrollerPositionAsPercentWithMinSize() {
    var scroller = new ScrollerDimensions({
      viewSize : Lazy.ofValue(1.0),
      contentSize : Lazy.ofValue(100.0),
      scrollerArea : Lazy.ofValue(100.0),
      minScrollerSize : Lazy.ofValue(5.0)
    });

    assertLazy(0.0, scroller.scrollerTopAsPercent(0));
    assertLazy(1.0, scroller.scrollerTopAsPercent(100));
    assertLazy(0.0, scroller.scrollerPositionAsPercent(0));
    assertLazy(1.0, scroller.scrollerPositionAsPercent(95));
  }

  public function testScrollerToContentPosition() {
    var scroller = new ScrollerDimensions({
        viewSize : Lazy.ofValue(500.0),
        contentSize : Lazy.ofValue(1000.0),
        scrollerArea : Lazy.ofValue(200.0)
      });
    assertLazy(0.0, scroller.scrollerToContentPosition(0));
    assertLazy(500.0, scroller.scrollerToContentPosition(100));
    assertLazy(0.0, scroller.contentToScrollerPosition(0));
    assertLazy(100.0, scroller.contentToScrollerPosition(500));

    scroller = new ScrollerDimensions({
        viewSize : Lazy.ofValue(500.0),
        contentSize : Lazy.ofValue(1000.0),
        scrollerArea : Lazy.ofValue(200.0),
        minScrollerSize : Lazy.ofValue(10.0),
        maxScrollerSize : Lazy.ofValue(50.0)
      });
    assertLazy(0.0, scroller.scrollerToContentPosition(0));
    assertLazy(500.0, scroller.scrollerToContentPosition(150));
    assertLazy(0.0, scroller.contentToScrollerPosition(0));
    assertLazy(150.0, scroller.contentToScrollerPosition(500));
  }

  function assertLazy<T>(expected : T, l : Lazy<T>, ?pos: haxe.PosInfos)
    Assert.equals(expected, l.value, pos);
}
