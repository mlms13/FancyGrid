import fancy.Grid;

class Main {
  static function main() {
    var grid = new Grid(dots.Query.find(".my-fancy-grid-container"), ({
      render: function (row, col) return dots.Dom.create("div.cell", '$row, $col'),
      vOffset: function (row) return 30 * row,
      hOffset: function (col) return 120 * col,
      columns: 100,
      rows: 200,
      vSize: function () return 200 * 30,
      hSize: function () return 100 * 120
    } : GridOptions));

    grid.goto(10, 10);
  }
}
