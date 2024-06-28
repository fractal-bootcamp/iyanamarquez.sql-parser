import state_db from "./db";
const data = state_db;
const select_one = `SELECT "firstName","lastName", "age", "eyeColor" FROM table WHERE age > 30 OR ("eyeColor" = "blue" AND gender = "male";`;
const select_two = ` SELECT  "firstName","lastName", "age", "eyeColor"  FROM  user  WHERE  ("eyeColor" = "blue" AND gender != "female") OR ("eyeColor" = "blue" AND gender != "male");`;

// SELECT (comma separated list of cols or \*) FROM TABLE WHERE (conditions) LIMIT (integer);

const stringParser = (query_string: string) => {
  // Get list of all keywords.(commands and data)
  const allWordsRegex = /\b\w+\b/g;
  const wordsArr = query_string.match(allWordsRegex);
  // Get list of all commands
  const capitalLettersRegex = /[A-Z]+/g;
  const sqlKeywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "AND",
    "OR",
    "LIMIT",
    "TABLE",
  ];

  let sqlQueryWords = [];
  wordsArr!.forEach((item) => {
    const matches = item.match(capitalLettersRegex);
    if (matches) {
      matches.forEach((match) => {
        if (sqlKeywords.includes(match)) {
          sqlQueryWords.push(match);
        }
      });
    }
  });
  //   console.log(sqlQueryWords);
  //   [ "SELECT", "FROM", "WHERE", "OR", "AND" ] Contains commands requested to perform in query
  //   SELECT all words between words next to each other const regex = /SELECT\s+(.*?)\s+FROM/i;
  let cuts = [];
  let arr_Copy = [...wordsArr];
  console.log(arr_Copy);
  for (let i = 0; i < wordsArr!.length; i++) {
    if (sqlKeywords.includes(wordsArr![i])) {
      cuts.push(i);
    }
    //   console.log(wordsArr);
    //   words Array
    //   [
    //   "SELECT", "firstName", "lastName", "age", "eyeColor", "FROM", "table", "WHERE", "age", "30", "OR", "eyeColor",
    //   "blue", "AND", "gender", "male"
    // ]
  }
  //   console.log(arr_Copy);

  let newcuts = [];

  for (let i = 0; i <= cuts.length - 1; i++) {
    newcuts.push(arr_Copy.slice(cuts[i], cuts[i + 1]));
    // if (i ) {
    //   console.log("erm", arr_Copy.slice(cuts[i], arr_Copy.length - 1));
    // }
  }
  console.log("cuts:", cuts);
  newcuts.push(arr_Copy.slice(cuts[cuts.length - 1], arr_Copy.length - 1));
  console.log("new:", newcuts);

  //   [
  //     ["SELECT", "firstName", "lastName", "age", "eyeColor"],
  //     ["FROM", "table"],
  //     ["WHERE", "age", "30"],
  //     ["OR", "eyeColor", "blue"],
  //   ];

  const mapobj = {};
  newcuts.forEach((arr) => {
    const [key, ...values] = arr;
    mapobj[key] = values;
  });

  console.log(mapobj);

  // capital letters not surrounded by quotes
  // data labels are surrounded by ""
  // from keyword and text after is the table
  //
  //   if query words ! include SELECT throw err, else select something
};

stringParser(select_one);

// Select - get vars for which data we are getting
// from - chooses the db table we are looking at
// where - helps be specifc at which object we get
// Or is included in where
// And is included in
