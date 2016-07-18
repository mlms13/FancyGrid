import fancy.Grid;

class Main {
  static function main() {
    var cellWidth  = 65,
        cellHeight = 15,
        rows       = 100,
        columns    = 30;
    var grid = new Grid(dots.Query.find(".my-fancy-grid-container"), ({
      render: function (row, col) return dots.Dom.create("span.value", '${row+1}, ${col+1}'),
      vSize: function (row) return cellHeight,
      hSize: function (column) return cellWidth,
      columns: columns,
      rows: rows,
      fixedLeft: 4,
      fixedTop: 3,
      fixedBottom: 2,
      fixedRight: 1
    } : GridOptions));
  }
}
