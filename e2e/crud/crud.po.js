
/*
 * Copyright 2017-present Open Networking Foundation

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


module.exports = new function(){

  // list view
  this.tableRows = element.all(by.css('tbody > tr'));
  this.tableColumn = element(by.css('tbody > tr:first-child'))
                      .all(by.css('td'));

  this.actionsColumn = element(by.css('tbody > tr:first-child'))
    .element(by.css('td:last-child'));

  this.deleteBtn = this.actionsColumn.all(by.css('a[title="delete"'));
  this.detailBtn = this.actionsColumn.all(by.css('a[title="details"'));

  this.addBtn = element(by.linkText('Add'));

  // detail page
  this.formInputs = element.all(by.repeater('field in vm.config.inputs'));
  this.nameInput = element.all(by.css('xos-form input')).first()
  this.formBtn = element(by.buttonText('Save'));

  this.nameField = element(by.css('[name="name"]'));
  this.successFeedback = element(by.css('.alert.alert-success'));
};
