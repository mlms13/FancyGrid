class TestAll {
  public static function main() {
    utest.UTest.run([
      new fancy.core.TestScrollerDimensions(),
      new fancy.core.TestSearch()
    ]);
  }
}
