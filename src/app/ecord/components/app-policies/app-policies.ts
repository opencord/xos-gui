class EcordAppPolicies {

  public fast = [
    'Video Conference',
    'Secure File Storage',
    'WebEx',
    'Salesforce.com'
  ];

  public slow = [
    'Facebook',
    'Youtube',
    'Instagram'
  ];
}

export const ecordAppPolicies: angular.IComponentOptions = {
  template: require('./app-policies.html'),
  controllerAs: 'vm',
  controller: EcordAppPolicies
};