const fs = require('fs');
const config = require('./config');
const P = require('bluebird');

const username = 'xosadmin@opencord.org';

const getPwd = () => {

  if (process.env.UI_PWD) {
    return process.env.UI_PWD;
  }

  const pwdFile = fs.readFileSync('../../build/platform-install/credentials/xosadmin@opencord.org', 'utf8');
  return pwdFile;
};

exports.pwd = getPwd();

exports.username = username;

exports.login = P.promisify((done) => {
  browser.get(`${config.url}/login`);

  browser.getCurrentUrl()
    .then((url) => {
      // NOTE login only if it is not yet
      if (url.indexOf('login') !== -1) {
        const loginPage = require('../login/login.po');
        loginPage.sendUsername(username);
        loginPage.sendPassword(getPwd());
        loginPage.submit();
      }
      browser.waitForAngular();
      done();
    });
});