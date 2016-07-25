import thx.benchmark.speed.*;

class ArrayVsMapCache {
  public static function main() {

    var tests = thx.Ints.range(100000).map(function(v) {
      return {
        index : v,
        value : '${v*v}'
      };
    });
    testSetCache(tests);
    testGetCacheSmall(tests);
    testGetCache(tests);
  }

  static function testSetCache(tests : Array<{ index : Int, value : String }>) {
    var suite = new Suite(10, 2500);
    suite.add("set array cache", function() {
      var cache = [];
      @:measure {
        for(t in tests)
          cache[t.index] = t.value;
      };
    });
    suite.add("set map cache", function() {
      var cache = new Map();
      @:measure {
        for(t in tests)
          cache.set(t.index, t.value);
      };
    });
    trace(suite.run().toString());
  }

  static function testGetCache(tests : Array<{ index : Int, value : String }>) {
    var suite = new Suite(10, 2500);
    var cache1 = [];
    for(t in tests)
      cache1[t.index] = t.value;
    var cache2 = new Map();
    for(t in tests)
      cache2.set(t.index, t.value);
    suite.add("get array cache", function() {
      var buf = [];
      @:measure {
        for(i in 1...1000000)
          buf.push(cache1[i]);
      };
    });
    suite.add("get map cache", function() {
      var buf = [];
      @:measure {
        for(i in 1...1000000)
          buf.push(cache2.get(i));
      };
    });
    trace(suite.run().toString());
  }

  static function testGetCacheSmall(tests : Array<{ index : Int, value : String }>) {
    var suite = new Suite(10, 2500);
    var cache1 = [];
    for(t in tests)
      cache1[t.index] = t.value;
    var cache2 = new Map();
    for(t in tests)
      cache2.set(t.index, t.value);
    suite.add("get array cache", function() {
      var buf = [];
      @:measure {
        for(i in 1...1000)
          buf.push(cache1[i]);
      };
    });
    suite.add("get map cache", function() {
      var buf = [];
      @:measure {
        for(i in 1...1000)
          buf.push(cache2.get(i));
      };
    });
    trace(suite.run().toString());
  }
}
