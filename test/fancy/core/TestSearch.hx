package fancy.core;

import utest.Assert;
import fancy.core.Search.*;

class TestSearch {
  public function new() {}

  public function comp(expected: Int)
    return function(v) return thx.Ints.compare(v, expected);

  public function comp2(a: Int)
    return -1;

  public function testBinarySearch() {
    var max = 10;
    var values = thx.Ints.range(0, max + 1);
    for(v in values)
      Assert.equals(v, binary(0, max, comp(v)));

    Assert.equals(3, binary(max, 0, comp(3)));

    Assert.equals(3, binary(0, 3, comp2));
  }
}
