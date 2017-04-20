const user = require('../test_helpers/user');
const page = require('./keyboard.po');

describe('XOS Keyboard Shortcuts', function() {

  beforeEach(() => {
    user.login();
  });

  it('should open the side panel when ? is pressed', () => {
    page.pressKey('?');
    expect(page.sidePanel.getAttribute('class')).toMatch('open');
  });

  it('should select the search form when f is pressed', () => {
    page.pressKey('f');
    expect(page.searchField.getAttribute('placeholder')).toEqual(browser.driver.switchTo().activeElement().getAttribute('placeholder'));
  });
});