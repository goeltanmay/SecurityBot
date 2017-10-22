var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://www.google.com/');
driver.findElement(By.name('q')).sendKeys('webdriver');
driver.findElement(By.name('btnK')).click();
driver.wait(until.titleIs('webdriver - Google Search'), 1000);
driver.quit();
