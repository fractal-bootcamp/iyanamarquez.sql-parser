import state_db from "./db";
const data = state_db;
const select_one = `SELECT "firstName","lastName", "age", "eyeColor" FROM table WHERE age > 30 OR ("eyeColor" = "blue" AND gender = "male";`;
const select_two = ` SELECT  "firstName","lastName", "age", "eyeColor"  FROM  user  WHERE  ("eyeColor" = "blue" AND gender != "female") OR ("eyeColor" = "blue" AND gender != "male");`;

// SELECT (comma separated list of cols or \*) FROM TABLE WHERE (conditions) LIMIT (integer);

const stringParser = (query_string: string): PARSED_STRING_OBJECT => {
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
  const arrayString = select_one.match(/[^\s"(),]+|"([^"]*)"/g);

  let cutsArr = [];
  let newArr = [];
  arrayString?.forEach((thing, idx) => {
    let bruh = thing.replace(/["\\]/g, "");
    newArr.push(bruh);
    if (sqlKeywords.includes(thing)) {
      cutsArr.push(idx);
    }
  });

  let newcuts = [];

  for (let i = 0; i <= cutsArr.length - 1; i++) {
    newcuts.push(newArr.slice(cutsArr[i], cutsArr[i + 1]));
  }

  const mapobj = {};
  newcuts.forEach((arr) => {
    const [key, ...values] = arr;
    mapobj[key] = values;
  });

  return mapobj as PARSED_STRING_OBJECT;
};
type PARSED_STRING_OBJECT = {
  SELECT: string[];
  FROM: string[];
  WHERE?: string[];
  OR?: string[];
  AND?: string[];
};

const parsed_string = stringParser(select_one);
// parsed string looks like this
// {
//   SELECT: [ "firstName", "lastName", "age", "eyeColor" ],
//   FROM: [ "table" ],
//   WHERE: [ "age", ">", "30" ],
//   OR: [ "eyeColor", "=", "blue","and","gender", "=", "male", ";"  ],
//   AND: [ "gender", "=", "male", ";" ],
// }

const query_db = (parsed_string, state_db) => {
  const { SELECT, FROM, WHERE, OR, AND } = parsed_string;

  //   console.log(parsed_string, state_db);
  // where statement
  let whereVar1 = WHERE[0];
  let whereVar2 = WHERE[2];

  let whereOperator = WHERE[1];

  console.log(whereOperator);

  const whereFunc = () => {
    // if there is an or statement, try to return where first
    if (!OR.length && !AND.length) {
      if (whereOperator === "<") {
        return state_db.find((element) => {
          return element[whereVar1] < whereVar2;
        });
      } else if (whereOperator.trim() == ">") {
        console.log("brulnile");
        return state_db.find((element) => {
          console.log(element[whereVar1]);
          return element[whereVar1] > whereVar2;
        });
      } else if (whereOperator === "=") {
        return state_db.find((element) => {
          return element[whereVar1] === whereVar2;
        });
      } else {
        console.log("here");
      }
    }
  };
  console.log(whereFunc());
};

console.log(query_db(parsed_string, state_db));
