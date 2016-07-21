package fancy.core;

using thx.Floats;

abstract Lazy<T>(Void -> T) from Void -> T {
  public var value(get, never): T;

  inline function get_value(): T
    return this();

  macro public static function of(e: haxe.macro.Expr) {
    var t = haxe.macro.Context.toComplexType(haxe.macro.Context.typeof(e));
    return macro (function() {
      return $e;
    } : Lazy<$t>);
  }

  inline public static function ofValue<T>(v : T) : Lazy<T>
    return function() return v;

  public function map<TOut>(f : T -> TOut): Lazy<TOut>
    return function() return f(this());

  @:op(-A) public static function negate(l: Lazy<Float>): Lazy<Float>
    return l.map(function(v) return -v);
  @:op(A+B) public static function add(l1: Lazy<Float>, l2: Lazy<Float>): Lazy<Float>
    return function() return l1.value + l2.value;
  @:op(A-B) public static function subtract(l1: Lazy<Float>, l2: Lazy<Float>): Lazy<Float>
    return function() return l1.value - l2.value;
  @:op(A*B) public static function multiply(l1: Lazy<Float>, l2: Lazy<Float>): Lazy<Float>
    return function() return l1.value * l2.value;
  @:op(A/B) public static function divide(l1: Lazy<Float>, l2: Lazy<Float>): Lazy<Float>
    return function() return l1.value / l2.value;
  @:commutative
  @:op(A+B) public static function addFloat(l1: Lazy<Float>, v2: Float): Lazy<Float>
    return function() return l1.value + v2;
  @:op(A-B) public static function subtractFloat(l1: Lazy<Float>, v2: Float): Lazy<Float>
    return function() return l1.value - v2;
  @:op(A-B) public static function subtractFromFloat(v1: Float, l2: Lazy<Float>): Lazy<Float>
    return function() return v1 - l2.value;
  @:commutative
  @:op(A*B) public static function multiplyFloat(l1: Lazy<Float>, v2: Float): Lazy<Float>
    return function() return l1.value * v2;
  @:op(A/B) public static function divideFloat(l1: Lazy<Float>, v2: Float): Lazy<Float>
    return function() return l1.value / v2;
  @:op(A/B) public static function divideFromFloat(v1: Float, l2: Lazy<Float>): Lazy<Float>
    return function() return v1 / l2.value;

  public function toString()
    return 'Lazy[${Std.string(value)}]';
}

class LazyFloatExtensions {
  public static function min(l1: Lazy<Float>, l2: Lazy<Float>): Lazy<Float>
    return function() return l1.value.min(l2.value);
  public static function max(l1: Lazy<Float>, l2: Lazy<Float>): Lazy<Float>
    return function() return l1.value.max(l2.value);
}
