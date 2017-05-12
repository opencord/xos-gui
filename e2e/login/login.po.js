module.exports = new function(){

  const usernameField = element(by.model('username'));
  const passwordField = element(by.model('password'));
  const submitBtn = element(by.css('.btn.btn-accent'));

  this.sendUsername = (username) => {
    usernameField.sendKeys(username);
  };

  this.sendPassword = (pwd) => {
    passwordField.sendKeys(pwd);
  };

  this.submit = () => {
    submitBtn.click();
  }
};
