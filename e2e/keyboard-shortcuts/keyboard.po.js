module.exports = new function(){

  const body = element(by.css('body'));

  this.pressKey = (key) => {
    body.sendKeys(key);
  };

  this.sidePanel = element(by.css('xos-side-panel > section'));
  this.searchField = element(by.model('vm.query'));
};
