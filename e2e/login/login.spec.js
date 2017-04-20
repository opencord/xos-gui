const config = require('../test_helpers/config');
const user = require('../test_helpers/user');
const pwd = user.pwd;
const username = user.username;
const loginPage = require('./login.po');

describe('XOS Login page', function() {

  beforeEach(() => {
    browser.get(`${config.url}/login`);
  });

  it('should not login with a wrong password', function() {
    loginPage.sendUsername(username);
    loginPage.sendPassword('wrongpwd');
    loginPage.submit();

    const alert = element(by.css('.alert.alert-danger'));
    expect(alert.isDisplayed()).toBeTruthy();
  });

  it('should login', () => {
    loginPage.sendUsername(username);
    loginPage.sendPassword(pwd);
    loginPage.submit();

    expect(browser.getCurrentUrl()).toEqual(`${config.url}/dashboard`);
  });
});