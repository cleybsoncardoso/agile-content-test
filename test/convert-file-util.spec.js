'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised);
const convert = require('../lib/convert');
const utils = require('../lib/utils');

describe('check urlfile input', function () {
  it('should return error with undefined value', function () {
    const url = undefined;
    return expect(convert.getFileUsingUrl(url)).to.be.rejectedWith("fileUrl is missing");
  });

  it('should return error with a invalid url', function () {
    const url = "http://teste.com/invalid-file";
    return expect(convert.getFileUsingUrl(url)).to.be.rejectedWith("Error getting the file from " + url);
  })
})

describe('check date format', function () {
  it('should check the date format', function () {
    const dateRaw = "2022-06-16 00:05:37";
    expect(utils.formatDate(new Date(dateRaw))).to.equals("16/06/2022");
  });

})

describe('check time format', function () {
  it('should check the time format', function () {
    const dateRaw = "2022-06-16 00:05:37";
    expect(utils.formatTime(new Date(dateRaw))).to.equals("00:05:37");
  });

})

describe('check camelcase parse', function () {
  it('should change kebab to camelcase', function () {
    expect(utils.parseCamel("first-test")).to.equals("firstTest");
    expect(utils.parseCamel("test")).to.equals("test");
  });

})