const convert = require('./lib/convert');

const [urlFile, outputFile] = process.argv.slice(2);
convert.start(urlFile, outputFile);