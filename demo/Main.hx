import fancy.Grid;

class Main {
  static function main() {
    var cellWidth = 50,
        cellHeight = 30;
    var grid = new Grid(dots.Query.find(".my-fancy-grid-container"), ({
      render: function (row, col) return dots.Dom.create("div.cell", '$row, $col'),
      vOffset: function (row) return cellHeight * row,
      hOffset: function (col) return cellWidth * col,
      columns: 100000,
      rows: 200000,
      vSize: function () return 200 * cellHeight,
      hSize: function () return 100 * cellWidth
    } : GridOptions));

    // grid.goto(10, 10);
  }
}
