"use strict";

const chai = require("chai");
const expect = chai.expect;
const agoraTemplate = require("../lib/agoraTemplate");

describe("Agora v1 Template", function () {
  it("should get the header", function () {
    const header = agoraTemplate.v1.header();
    expect(header).to.match(
      /^#Version: 1.0\n#Date: \d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}\n#Fields:/
    );
  });

  it("should get the body", function () {
    const logs = [
      { provider: '"MINHA CDN"', responseSize: "312", statusCode: "200", cacheStatus: "HIT", httpMethod: "GET", uriPath: "/robots.txt", protocol: "HTTP/1.1", timeTaken: "100" },
    ];
    const logText = agoraTemplate.v1.body(logs);
    expect(logText).to.match(/"MINHA CDN"\tGET\t200\t\/robots.txt\t100\t312\tHIT/);
  });

  it("should parse the logs to agora template", function () {
    const logs = [
      { provider: "MINHA CDN", responseSize: "312", statusCode: "200", cacheStatus: "INVALIDATE", httpMethod: "GET", uriPath: "/robots.txt", protocol: "HTTP/1.1", timeTaken: "245" },
    ];
    const [parsedLog] = agoraTemplate.v1.parseValues(logs);
    expect(parsedLog.provider).to.equals('"MINHA CDN"');
    expect(parsedLog.cacheStatus).to.equals('REFRESH_HIT');
    expect(parsedLog.responseSize).to.equals("312");
    expect(parsedLog.statusCode).to.equals("200");
    expect(parsedLog.httpMethod).to.equals("GET");
    expect(parsedLog.uriPath).to.equals("/robots.txt");
    expect(parsedLog.protocol).to.equals("HTTP/1.1");
    expect(parsedLog.timeTaken).to.equals("245");
  });
});
