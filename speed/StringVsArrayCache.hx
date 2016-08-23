import thx.benchmark.speed.*;

class StringVsArrayCache {
  public static function main() {
    var size = 500;
    var tests = [
      for(x in 0...size)
        for(y in 0...size)
          {
            x : x,
            y : y,
            value : '$x,$y'
          }
    ];
    testSetCache(tests);
    testGetCache(tests);
  }

  static function testSetCache(tests : Array<{ x : Int, y : Int, value : String }>) {
    var suite = new Suite(10, 2500);
    suite.add("set array cache", function() {
      var cache = new ArrayCache();
      @:measure {
        for(t in tests)
          cache.set(t.x, t.y, t.value);
      };
    });
    suite.add("set map cache", function() {
      var cache = new MapCache();
      @:measure {
        for(t in tests)
          cache.set(t.x, t.y, t.value);
      };
    });
    suite.add("set double map cache", function() {
      var cache = new DoubleMapCache();
      @:measure {
        for(t in tests)
          cache.set(t.x, t.y, t.value);
      };
    });
    trace(suite.run().toString());
  }

  static function testGetCache(tests : Array<{ x : Int, y : Int, value : String }>) {
    var suite = new Suite(10, 2500);
    var cache1 = new ArrayCache();
    var size = 1000;
    for(t in tests)
      cache1.set(t.x, t.y, t.value);
    var cache2 = new MapCache();
    for(t in tests)
      cache2.set(t.x, t.y, t.value);
    var cache3 = new DoubleMapCache();
    for(t in tests)
      cache3.set(t.x, t.y, t.value);
    suite.add("get array cache", function() {
      var buf = [];
      @:measure {
        for(x in 0...size)
          for(y in 0...size)
            buf.push(cache1.get(x * y, y % x));
      };
    });
    suite.add("get map cache", function() {
      var buf = [];
      @:measure {
        for(x in 0...size)
          for(y in 0...size)
            buf.push(cache2.get(x * y, y % x));
      };
    });
    suite.add("get double map cache", function() {
      var buf = [];
      @:measure {
        for(x in 0...size)
          for(y in 0...size)
            buf.push(cache3.get(x * y, y % x));
      };
    });
    trace(suite.run().toString());
  }
}

class ArrayCache {
  var arr : Array<Array<String>>;
  public function new()
    arr = [];

  public function get(x : Int, y : Int) : String {
    var row = arr[y];
    if(null == row) return null;
    return row[x];
  }

  public function set(x : Int, y : Int, v : String) : Void {
    var row = arr[y];
    if(null == row) row = arr[y] = [];
    row[x] = v;
  }
}

class MapCache {
  var map : Map<String, String>;
  public function new()
    map = new Map();

  inline function k(x : Int, y : Int)
    return '$x-$y';

  inline public function get(x : Int, y : Int) : String
    return map.get(k(x, y));

  inline public function set(x : Int, y : Int, v : String) : Void
    map.set(k(x, y), v);
}

class DoubleMapCache {
  var map : Map<Int, Map<Int, String>>;
  public function new()
    map = new Map();

  public function get(x : Int, y : Int) : String {
    var m = map.get(y);
    if(null == m) return null;
    return m.get(x);
  }

  public function set(x : Int, y : Int, v : String) : Void {
    var m = map.get(y);
    if(null == m) return map.set(y, m = new Map());
    m.set(x, v);
  }
}
