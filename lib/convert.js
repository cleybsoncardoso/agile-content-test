const fs = require("fs");
const https = require("https");
const http = require("http");
const agoraTemplate = require('./agoraTemplate');
const minhaCDNTemplate = require('./minhaCDN');

const start = async (urlFile, outputFile) => {
  try {
    const fileData = await getFileUsingUrl(urlFile);
    const logs = minhaCDNTemplate.parse(fileData);
    const logsText = agoraTemplate.v1.generateLogData(logs);
    const fileDestination = getFileNameAndMakeFolder(outputFile);
    fs.writeFileSync(fileDestination, logsText)
    console.log("Log was parsed to agora template, show on path: " + fileDestination);
  } catch (err) {
    console.error("err", err.message);
  }
};

const getFileNameAndMakeFolder = (filePath) => {
  if (!filePath) {
    throw new Error("outputFile is missing");
  }

  const folders = filePath.split("/");
  const fileName = folders.pop();
  let path = "";
  for (const folderName of folders) {
    if (folderName && folderName != ".") {
      path += folderName + "/";
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
    }
  }
  return path + fileName;
};

const getFileUsingUrl = async (urlFile) =>
  new Promise((res, rej) => {
    if (!urlFile) {
      return rej(new Error("fileUrl is missing"));
    }

    const httpClient = /^https/.test(urlFile) ? https : http;
    httpClient
      .get(urlFile, (textResponse) => {
        if (textResponse.statusCode > 300) {
          return rej(new Error(`Error getting the file from ${urlFile}`));
        }
        let text = "";
        textResponse.on("data", (curr) => {
          text += curr;
        });
        textResponse.once("end", () => {
          res(text);
        });
        textResponse.once("error", (err) => {
          console.log("err", err);
        });
      })
      .on("error", () => {
        rej(new Error(`Error getting the file from ${urlFile}`));
      });
  });

module.exports = {
  start,
  getFileUsingUrl,
};
