module.exports = new function(){

  // list view
  this.tableRows = element.all(by.repeater('item in vm.data'));
  this.tableColumn = element(by.repeater('item in vm.data').row(0))
                      .all(by.repeater('col in vm.columns'));

  this.actionsColumn = element(by.repeater('item in vm.data').row(0))
    .element(by.css('td:last-child'));

  this.deleteBtn = this.actionsColumn.all(by.tagName('a'));

  this.addBtn = element(by.linkText('Add'));

  // detail page
  this.formInputs = element.all(by.repeater('field in vm.config.inputs'));
  this.formBtn = element(by.buttonText('Save'));

  this.nameField = element(by.css('[name="name"]'));
  this.successFeedback = element(by.css('.alert.alert-success'));
};
