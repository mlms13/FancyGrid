package fancy.core;

class IntCache<T> {
  var cache: Array<T>;
  public function new() {
    cache = [];
  }

  inline public function get(index: Int): Null<T>
    return cache[index];

  inline public function set(index: Int, value: T)
    cache[index] = value;

  inline public function exists(index: Int): Bool
    return cache[index] != null;

  public function getOrCreate(index: Int, handler: Int -> T): T {
    if(!exists(index))
      set(index, handler(index));
    return get(index);
  }

  public function invalidate()
    cache = [];

  public function invalidateAfter(index)
    cache = cache.splice(0, index);
}
