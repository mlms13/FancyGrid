package fancy.core;

class Search {
  public static function binary(min: Int, max: Int, comparator: Int -> Int): Int {
    if(min > max) {
      var temp = max;
      max = min;
      min = temp;
    }
    function mid(l: Int, r: Int)
      return Std.int((l+r)/2);
    function search(m: Int, l: Int, r: Int) {
      var c = comparator(m);
      if(c < 0) {
        l = m + 1;
        return search(mid(l, r), l, r);
      } else if(c > 0) {
        r = m - 1;
        return search(mid(l, r), l, r);
      } else {
        return m;
      }
    }
    return search(mid(min, max), min, max);
  }
}
