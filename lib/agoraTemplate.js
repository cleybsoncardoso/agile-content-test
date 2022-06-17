const { formatDate, formatTime, parseCamel } = require('./utils');

const headerV1 = () => {
  const currentDate =  new Date();
  let headerRaw = `#Version: 1.0
#Date: ${formatDate(currentDate)} ${formatTime(currentDate)}
#Fields: ${v1.order.join('\t')}`;
  return headerRaw;
}

const bodyV1 = (logs) => {
  return logs
    .map((log) => {
      let line = "";
      for (const key of v1.order) {
        line += log[parseCamel(key)] + "\t";
      }
      return line;
    })
    .join("\n");
}

const parseValuesV1 = (logs) => {
  const replaceCacheStatus = {
    "INVALIDATE": "REFRESH_HIT",
  }
  const changeValue = (key, value) => {
    if (key === 'cacheStatus') {
      if (replaceCacheStatus[value]) {
        return replaceCacheStatus[value];
      }
    } else if (key === 'provider') {
      return `"${value}"`;
    }
    return value;
  }
  return logs.map(log => {
    const newLog = {};
    Object.entries(log)
      .forEach(([key, value]) => {
        newLog[key] = changeValue(key, value);
      })
    return newLog;
  })
}

const generateLogDataV1 = (logs) => {
  return `${v1.header()}
${v1.body(parseValuesV1(logs))}`;
}

const v1 = {
  order: ['provider', 'http-method', 'status-code', 'uri-path', 'time-taken', 'response-size', 'cache-status'],
  parseValues: parseValuesV1,
  header: headerV1,
  body: bodyV1,
  generateLogData: generateLogDataV1,
}

module.exports = {
  v1
}