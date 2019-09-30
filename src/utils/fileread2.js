const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

let searchTerm = 'Tønsberg'
let results = ''

const search = (async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('./data/vascular_o.txt'),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        if (line.includes(searchTerm)) {
            results = '\n' + line + results
            // console.log(line)
        }
       
    });

    await once(rl, 'close');

    console.log('File processed.');
    // console.log(results)
    return results
  } catch (err) {
    console.error(err);
  }
})();

// const svar = search()

console.log( 'her ute' + results);

