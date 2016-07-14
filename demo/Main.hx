import fancy.Grid;

class Main {
  static function main() {
    var cellWidth = 78,
        cellHeight = 12,
        rows = 200000,
        columns = 100000;
    var grid = new Grid(dots.Query.find(".my-fancy-grid-container"), ({
      render: function (row, col) return dots.Dom.create("span.value", '$row, $col'),
      vOffset: function (row) return cellHeight * row,
      hOffset: function (column) return cellWidth * column,
      vSize: function (row) return cellHeight,
      hSize: function (column) return cellWidth,
      columns: columns,
      rows: rows,
      fixedLeft: 4,
      fixedTop: 3,
      fixedBottom: 2,
      fixedRight: 1
    } : GridOptions));

    // grid.goto(10, 10);
  }
}
