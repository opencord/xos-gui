module.exports = new function(){

  this.graphTitle = element(by.css('xos-coarse-tenancy-graph h1'));
  this.graphSvg = element(by.css('xos-coarse-tenancy-graph svg'));

  this.summaryTitle = element(by.css('xos-dashboard > .row > .col-xs-12 > h2'));
  this.summaryBoxes = element.all(by.css('.panel.panel-filled'));
};
