'use strict'

const chai = require('chai')
const expect = chai.expect
const minhaCDN = require('../lib/minhaCDN');

describe('parse minha CDN line', function () {

  it('should parse the line minha cdn with file uri', function () {
    const minhaCDNFormat = `312|200|HIT|"GET /robots.txt HTTP/1.1"|100.2`;
    const parsed = minhaCDN.parseLine(minhaCDNFormat);
    expect(parsed.provider).to.equals("MINHA CDN");
    expect(parsed.responseSize).to.equals("312");
    expect(parsed.statusCode).to.equals("200");
    expect(parsed.cacheStatus).to.equals("HIT");
    expect(parsed.httpMethod).to.equals("GET");
    expect(parsed.uriPath).to.equals("/robots.txt");
    expect(parsed.protocol).to.equals("HTTP/1.1");
    expect(parsed.timeTaken).to.equals("100");
  });

  it('should parse the line minha cdn with folder uri', function () {
    const minhaCDNFormat = `101|200|MISS|"POST /myImages HTTP/1.1"|319.4`;
    const parsed = minhaCDN.parseLine(minhaCDNFormat);
    expect(parsed.provider).to.equals("MINHA CDN");
    expect(parsed.responseSize).to.equals("101");
    expect(parsed.statusCode).to.equals("200");
    expect(parsed.cacheStatus).to.equals("MISS");
    expect(parsed.httpMethod).to.equals("POST");
    expect(parsed.uriPath).to.equals("/myImages");
    expect(parsed.protocol).to.equals("HTTP/1.1");
    expect(parsed.timeTaken).to.equals("319");
  });

  it('should identify wrong formats', function () {
    const missingCloseQMark = `101|200|MISS|"POST /myImages HTTP/1.1|319.4`;
    expect(() => minhaCDN.parseLine(missingCloseQMark)).to.throw(Error, 'Error when parsing ' + missingCloseQMark);

    const missingSize = `|200|MISS|"POST /myImages HTTP/1.1"|319.4`;
    expect(() => minhaCDN.parseLine(missingSize)).to.throw(Error, 'Error when parsing ' + missingSize);

    const missingTime = `101|200|MISS|"POST /myImages HTTP/1.1"`;
    expect(() => minhaCDN.parseLine(missingTime)).to.throw(Error, 'Error when parsing ' + missingTime);

    const missingMethod = `101|200|MISS|"/myImages HTTP/1.1"|319.4`;
    expect(() => minhaCDN.parseLine(missingMethod)).to.throw(Error, 'Error when parsing ' + missingMethod);
  });

})
describe('parse minha CDN', function () {

  it('should parse the lines minha cdn', function () {
    const minhaCDNRaw = `312|200|HIT|"GET /robots.txt HTTP/1.1"|100.2
312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|245.1`;

    const [line1, line2] = minhaCDN.parse(minhaCDNRaw);

    expect(line1.provider).to.equals("MINHA CDN");
    expect(line1.responseSize).to.equals("312");
    expect(line1.statusCode).to.equals("200");
    expect(line1.cacheStatus).to.equals("HIT");
    expect(line1.httpMethod).to.equals("GET");
    expect(line1.uriPath).to.equals("/robots.txt");
    expect(line1.protocol).to.equals("HTTP/1.1");
    expect(line1.timeTaken).to.equals("100");

    expect(line2.provider).to.equals("MINHA CDN");
    expect(line2.responseSize).to.equals("312");
    expect(line2.statusCode).to.equals("200");
    expect(line2.cacheStatus).to.equals("INVALIDATE");
    expect(line2.httpMethod).to.equals("GET");
    expect(line2.uriPath).to.equals("/robots.txt");
    expect(line2.protocol).to.equals("HTTP/1.1");
    expect(line2.timeTaken).to.equals("245");
  });

  it('should identify wrong formats and show the line', function () {
    const minhaCDNRaw = `312|200|HIT|"GET /robots.txt HTTP/1.1|100.2
312|200|INVALIDATE|"GET /robots.txt HTTP/1.1"|245.1`;
    expect(() => minhaCDN.parse(minhaCDNRaw)).to.throw(Error, 'Error on parse Minha CDN: 312|200|HIT|"GET /robots.txt HTTP/1.1|100.2. Line number 1');
  });

})
