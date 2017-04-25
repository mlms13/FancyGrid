package fancy.core;

class PositionCache<T> {
  var cache: Array<Array<T>>;
  public function new() {
    cache = [];
  }

  public function get(row: Int, col: Int): Null<T> {
    var r = cache[row];
    if(null == r) return null;
    return r[col];
  }

  public function set(row: Int, col: Int, value: T) {
    var r = cache[row];
    if(null == r) r = cache[row] = [];
    r[col] = value;
  }

  public function exists(row: Int, col: Int): Bool
    return get(row, col) != null;

  public function getOrCreate(row: Int, col: Int, handler: Int -> Int -> T): T {
    if(exists(row, col)) {
      return get(row, col);
    } else {
      var v = handler(row, col);
      set(row, col, v);
      return v;
    }
  }

  public function remove(row: Int, col: Int) {
    var r = cache[row];
    if(null == r) return;
    r[col] = null;
  }

  public function invalidate()
    cache = [];
}
