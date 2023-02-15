const { By, Builder, Browser } = require("selenium-webdriver");
const { suite } = require("selenium-webdriver/testing");
const assert = require("assert");

suite(
  function (env) {
    describe("First script", function () {
      let driver;

      before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
      });

      after(async () => await driver.quit());

      it("First Selenium script", async function () {
        await driver.get("http://localhost:8080/");

        let title = await driver.getTitle();
        assert.equal("Web Component Compass Design", title);

        let header2 = await driver.findElement(By.tagName("h2"));
        let value = await header2.getText();
        assert.equal("Welcome!", value);
      });
    });
  },
  { browsers: [Browser.CHROME, Browser.FIREFOX] }
);
