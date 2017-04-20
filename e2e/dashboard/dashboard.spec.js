const user = require('../test_helpers/user');
const dashboardPage = require('./dashboard.po');

describe('XOS Dashboard', function() {
  it('should have a graph and system summary', () => {
    user.login();
    expect(dashboardPage.graphTitle.isPresent()).toBeTruthy();
    expect(dashboardPage.graphSvg.isPresent()).toBeTruthy();
    expect(dashboardPage.summaryTitle.isPresent()).toBeTruthy();
    expect(dashboardPage.summaryBoxes.count()).toBe(3);
  });
});