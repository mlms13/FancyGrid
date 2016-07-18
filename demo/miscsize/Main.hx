import fancy.Grid;

class Main {
  static function main() {
    var rows       = 300,
        columns    = 300;
    var grid = new Grid(dots.Query.find(".my-fancy-grid-container"), ({
      render: function (row, col) {
        if(row == 0 && col == 0) {
          return dots.Dom.create("span.value", "");
        } else if(row == 0) {
          return dots.Dom.create("span.value", genTop(col));
        } else if(col == 0) {
          return dots.Dom.create("span.value", genLeft(row));
        } else {
          return dots.Dom.create("span.value", '${row}, ${col}');
        }
      },
      columns: columns,
      rows: rows,
      fixedLeft: 1,
      fixedTop: 1,
      fixedBottom: 1,
      fixedRight: 1,
    } : GridOptions));
  }

  static function genLeft(row: Int) {
    return words(6, 30);
  }

  static function genTop(col: Int) {
    return words(1, 50);
  }

  static function words(min: Int, max: Int) {
    var dict = ["about", "after", "again", "air", "all", "along", "also", "an", "and", "another", "any", "are", "around", "as", "at", "away", "back", "be", "because", "been", "before", "below", "between", "both", "but", "by", "came", "can", "come", "could", "day", "did", "different", "do", "does", "don't", "down", "each", "end", "even", "every", "few", "find", "first", "for", "found", "from", "get", "give", "go", "good", "great", "had", "has", "have", "he", "help", "her", "here", "him", "his", "home", "house", "how", "I", "if", "in", "into", "is", "it", "its", "just", "know", "large", "last", "left", "like", "line", "little", "long", "look", "made", "make", "man", "many", "may", "me", "men", "might", "more", "most", "Mr.", "must", "my", "name", "never", "new", "next", "no", "not", "now", "number", "of", "off", "old", "on", "one", "only", "or", "other", "our", "out", "over", "own", "part", "people", "place", "put", "read", "right", "said", "same", "saw", "say", "see", "she", "should", "show", "small", "so", "some", "something", "sound", "still", "such", "take", "tell", "than", "that", "the", "them", "then", "there", "these", "they", "thing", "think", "this", "those", "thought", "three", "through", "time", "to", "together", "too", "two", "under", "up", "us", "use", "very", "want", "water", "way", "we", "well", "went", "were", "what", "when", "where", "which", "while", "who", "why", "will", "with", "word", "work", "world", "would", "write", "year", "you", "your", "was"];
    return thx.Ints.range(min + Math.floor((max - min) * Math.random())).map(function(_) return dict[Math.floor(Math.random() * dict.length)]).join(" ");
  }
}
