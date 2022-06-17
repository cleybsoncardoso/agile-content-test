const parse = (fileData) => {
  if (typeof fileData !== "string") {
    throw new Error("file data is not string");
  }
  return fileData.split("\n")
  .map(line => line.replace(/(\r|\t)/g, ""))
  .filter(line => !!line)
  .map((line, lineIndex) => {
    try {
      return parseLine(line);
    } catch (err) {
      throw new Error(
        `Error on parse Minha CDN: ${line}. Line number ${lineIndex + 1}`
      );
    }
  });
};

const parseLine = (line) => {
  const modelMinhaCdnRegex =
  /(\d+)[|](\d+)[|](\w+)[|]"(GET|POST|PUT|DELETE|OPTIONS|PATCH|HEAD|CONNECT|TRACE) (.+) (.+)"[|](\d+)[.]\d+$/;

  if (!modelMinhaCdnRegex.test(line)) {
    throw new Error("Error when parsing " + line);
  }
  const [
    ,
    responseSize,
    statusCode,
    cacheStatus,
    httpMethod,
    uriPath,
    protocol,
    timeTaken,
  ] = line.match(modelMinhaCdnRegex);
  return {
    provider: "MINHA CDN",
    responseSize,
    statusCode,
    cacheStatus,
    httpMethod,
    uriPath,
    protocol,
    timeTaken,
  };
};

module.exports = {
  parse,
  parseLine,
};