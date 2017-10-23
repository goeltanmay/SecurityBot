var expect    = require("chai").expect;
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

describe('Selenium Tests', function() {
  driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();

  before(function () {

  });

  describe('Test for Pull request event',function () {
    describe('Pull request created', function () {

          driver.get('http://www.google.com/');
          driver.findElement(By.name('q')).sendKeys('webdriver');
          driver.findElement(By.name('btnK')).click();
          driver.wait(until.titleIs('webdriver - Google Search'), 1000);
          done()

    });
  });

  after(function() {
    driver.quit();
  });
});
