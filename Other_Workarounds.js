1. To update redux array:
case REMOVE_CART_ITEM:
     return {
         ...state,
         // cartData: [...state.cartData.slice(0, action.payload),
         // ...state.cartData.slice(action.payload + 1)]
         cartData: state.cartData.filter(item => item !== action.payload)
     };
--------------------------------------------------------------------------------------

2. Perfect Image Background Resolution:

1x => 375x667
2x => 750x1134
3x => 1125x2001
--------------------------------------------------------------------------------------
3. To track “Unhandled Promise rejection” in React-Native:

// pass all unhandled promise rejections through reactotron
if (__DEV__) {
  // reach horribly into the bowels of react native
  const rejectionTracking = require("promise/setimmediate/rejection-tracking")

  // if we have it
  if (rejectionTracking && rejectionTracking.enable) {
    // register for rejection tracking
    rejectionTracking.enable({
      allRejections: true,
      onUnhandled: (id, error) => {
 	 	console.log(error);
        //console.tron && console.tron.reportError(error)
      },
      onHandled: () => {},
    })
  }
}

OR

if (__DEV__) {
    const old87 = Promise._87;
    const new87 = (promise, err) => {
        console.log('Unhandled promise is: ', err);
        old87(promise, err);
    };
 
    Promise._87 = new87;
}
https://github.com/infinitered/reactotron/issues/646
--------------------------------------------------------------------------------------
4. Regex To validate Credit Card Type:

https://stackoverflow.com/a/5911300 
--------------------------------------------------------------------------------------

5. To Resolve issue Undefined is not an object (evaluating '_react2.PropTypes.number') etc:

Step 1: install prop-types dependency
npm/yarn install prop-types create-react-class
Step 2: Add the following to node_modules/react/index.js
module.exports.PropTypes = require('prop-types'); let createClass; Object.defineProperty(module.exports, 'createClass', { get: function() { if (!createClass) { createClass = require('create-react-class').bind(module.exports); } return createClass; } });

https://stackoverflow.com/a/47407271 
--------------------------------------------------------------------------------------
6. To truncate the string upto specific length

const truncateString = (str, num) =>
  str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str;
truncateString('boomerang', 7); // 'boom...'
--------------------------------------------------------------------------------------
7. To convert RGB into Hex Code

const RGBToHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

console.log(RGBToHex(255,255,255)) //ffffff
--------------------------------------------------------------------------------------
8. To colorize console output


const colorize = (...args) => ({
  black: `\x1b[30m${args.join(' ')}`,
  red: `\x1b[31m${args.join(' ')}`,
  green: `\x1b[32m${args.join(' ')}`,
  yellow: `\x1b[33m${args.join(' ')}`,
  bgBlack: `\x1b[40m${args.join(' ')}\x1b[0m`,
  bgRed: `\x1b[41m${args.join(' ')}\x1b[0m`,
  bgGreen: `\x1b[42m${args.join(' ')}\x1b[0m`,
  bgYellow: `\x1b[43m${args.join(' ')}\x1b[0m`,
  bgBlue: `\x1b[44m${args.join(' ')}\x1b[0m`,
  bgMagenta: `\x1b[45m${args.join(' ')}\x1b[0m`,
  bgCyan: `\x1b[46m${args.join(' ')}\x1b[0m`,
  bgWhite: `\x1b[47m${args.join(' ')}\x1b[0m`
});

console.log(colorize('foo').red); // 'foo' (red letters)
console.log(colorize('foo', 'bar').bgBlue); // 'foo bar' (blue background)
console.log(colorize(colorize('foo').yellow, colorize('foo').green).bgWhite); // 'foo bar' (first word in yellow letters, second word in green letters, white background for both)
9. To getColonTimeFromDate
const getColonTimeFromDate = date => date.toTimeString().slice(0, 8);
getColonTimeFromDate(new Date()); // "08:38:00"
--------------------------------------------------------------------------------------
10. To check if its absolute URL

const isAbsoluteURL = str => /^[a-z][a-z0-9+.-]*:/.test(str);
isAbsoluteURL('https://google.com'); // true
isAbsoluteURL('ftp://www.myserver.net'); // true
isAbsoluteURL('/foo/bar'); // false
--------------------------------------------------------------------------------------
11. To find intersection between two arrays
const intersectionBy = (a, b, fn) => {
  const s = new Set(b.map(fn));
  return a.filter(x => s.has(fn(x)));
};
intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [2.1]
--------------------------------------------------------------------------------------
12. To convert string into Title Case:

const titleCase = (string) => {
  let sentence = string.toLowerCase().split(" ");
  for(var i = 0; i< sentence.length; i++){
    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
   sentence = sentence.join(" ")
   return sentence;
}
   
console.log(titleCase("tutorix is one of best e-platforms")) //Tutorix Is One Of Best E-platforms
--------------------------------------------------------------------------------------
13. To convert string into camelCase:

// util function to convert the input to string type
const convertToString = (input) => {
   if (input) {
       if (typeof input === "string") {
           return input;
       }

       return String(input);
   }

   return '';
}

// convert string to words
const toWords = (input) => {
   input = convertToString(input);

   const regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;

   return input.match(regex);
}
// convert the input array to camel case
const toCamelCase = (inputArray) => {
   let result = '';
   for (let i = 0, len = inputArray.length; i < len; i++) {
       let currentStr = inputArray[i];
       let tempStr = currentStr.toLowerCase();

       if (i != 0) {
           // convert first letter to upper case (the word is in lowercase)
           tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
       }

       result += tempStr;
   }

   return result;
}

// this function call all other functions
const toCamelCaseString = (input) => {
   let words = toWords(input);

   return toCamelCase(words);
}

console.log(toCamelCaseString("tutorix is one of best e-platforms")) //tutorixIsOneOfBestEPlatforms
--------------------------------------------------------------------------------------
14. To compare two objects:

function isDeepEqual(obj1, obj2, testPrototypes = false) {
  if (obj1 === obj2) {
    return true
  }

  if (typeof obj1 === "function" && typeof obj2 === "function") {
    return obj1.toString() === obj2.toString()
  }

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime()
  }

  if (
    Object.prototype.toString.call(obj1) !==
      Object.prototype.toString.call(obj2) ||
    typeof obj1 !== "object"
  ) {
    return false
  }

  const prototypesAreEqual = testPrototypes
    ? isDeepEqual(
        Object.getPrototypeOf(obj1),
        Object.getPrototypeOf(obj2),
        true
      )
    : true

  const obj1Props = Object.getOwnPropertyNames(obj1)
  const obj2Props = Object.getOwnPropertyNames(obj2)

  return (
    obj1Props.length === obj2Props.length &&
    prototypesAreEqual &&
    obj1Props.every(prop => isDeepEqual(obj1[prop], obj2[prop]))
  )
}
--------------------------------------------------------------------------------------
15. To check the time taken for a task:
const timeTaken = callback => {
  console.time('timeTaken');

  const r = callback();

  console.timeEnd('timeTaken');
  return r;
};

timeTaken(() => Math.pow(2, 10)); // 1024, (logged): timeTaken: 0.02099609375ms
--------------------------------------------------------------------------------------
16. To generate Random Number:
const generateRandomNumber = () => Math.floor((Math.random() * 899999) + 100000);

--------------------------------------------------------------------------------------
17. To generate Random AlphaNumeric String:
const getRandomAlphaNumericString = (length = 10) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};
//console.log(getRandomAlphaNumericString()) output: Cql8WWWOZu

--------------------------------------------------------------------------------------
18. To get the sum of a particular keys in an array of objects:
const sumBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => acc + val, 0);

sumBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], o => o.n); // 20
sumBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], 'n'); // 20
--------------------------------------------------------------------------------------
19. To Filter an array of objects based on a condition while also filtering out unspecified keys:
Use Array.prototype.filter() to filter the array based on the predicate fn so that it returns the objects for which the condition returned a truthy value. On the filtered array, use Array.prototype.map() to return the new object using Array.prototype.reduce() to filter out the keys which were not supplied as the keys argument.

const reducedFilter = (data, keys, fn) =>
  data.filter(fn).map(el =>
    keys.reduce((acc, key) => {
      acc[key] = el[key];
      return acc;
    }, {})
  );

const data = [
  {
    id: 1,
    name: 'john',
    age: 24
  },
  {
    id: 2,
    name: 'mike',
    age: 50
  }
];

reducedFilter(data, ['id', 'name'], item => item.age > 24); // [{ id: 2, name: 'mike'}]
--------------------------------------------------------------------------------------
20. To initializes and fills an array with the specified values:
Use Array(n) to create an array of the desired length, fill(v) to fill it with the desired values. You can omit val to use a default value of 0.
const initializeArrayWithValues = (n, val = 0) => Array(n).fill(val);

initializeArrayWithValues(5, 2); // [2, 2, 2, 2, 2]
--------------------------------------------------------------------------------------
21. To Reverses a string:
const reverseString = str => [...str].reverse().join('');

reverseString('foobar'); // 'raboof'
--------------------------------------------------------------------------------------
22. To convert percentage opacity/alpha into hex code
const percentToHex = (p) => {
    const percent = Math.max(0, Math.min(100, p)); // bound percent from 0 to 100
    const intValue = Math.round(p / 100 * 255); // map percent to nearest integer (0 - 255)
    const hexValue = intValue.toString(16); // get hexadecimal representation
    return hexValue.padStart(2, '0').toUpperCase(); // format with leading 0 and upper case characters
}

console.log(percentToHex(0)); // 00
console.log(percentToHex(50)); // 80
console.log(percentToHex(80)); // CC
console.log(percentToHex(100)); // FF

Usage: 
color: `#000000${percentToHex(10)}` //black with 10% opacity
--------------------------------------------------------------------------------------
23. To find intersection between two arrays with different keys
const intersectionByKey = (array1, array2, key1, key2) =>
  array1.filter((item1) => array2.some((item2) => item1[key1] == item2[key2]));
--------------------------------------------------------------------------------------
24. To get the file name from a url
const getFilename = (url) => {
   if (url) {
       const splittedUrlArray = url.toString().match(/.*\/(.+?)\./);
       if (splittedUrlArray && splittedUrlArray.length > 1) {
           return splittedUrlArray[1];
       }
   }
   return '';
};

Example:
console.log(getFilename(“http://www.test.com/home.html”)) //output: home
--------------------------------------------------------------------------------------
25. To get the file name from a url
const getFileExtension = (url = '') => url.split('.').pop();

Example:
const url = 'http://www.test.com/home.html.tct';
console.log(url.split('.').pop()) //tct
--------------------------------------------------------------------------------------
26. To disable git “ignorecase”:

//for current project
git config core.ignorecase false

//globally for all project
git config --global core.ignorecase false

--------------------------------------------------------------------------------------
27. Git error: “Host Key Verification Failed”

https://stackoverflow.com/a/29908140/9282328
--------------------------------------------------------------------------------------

