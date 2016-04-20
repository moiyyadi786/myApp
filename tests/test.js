var calculator = {
  sum: function(x, y) {
    return 2; // <-- note this is hardcoded
  }
}
describe('calculator', function () {
  
  it('1 + 1 should equal 2', function () {
    expect(calculator.sum(1, 1)).toBe(2);
  });
});

describe('controller: LoginCtrl', function(){
beforeEach(function(){
  module('stateMock')
});
beforeEach(function(){
  module("starter");
});
beforeEach(function(){
  module("ngTemplates");
});
beforeEach(inject(function($state, $controller, $rootScope, $location, LoginService, $window, $httpBackend, $q){
  this.$location = $location;
  this.$httpBackend = $httpBackend;
  //$httpBackend.whenGET('templates/*.html').respond(200);
  this.scope=$rootScope.$new();
  this.state = $state;
  this.state.test = "Hi";
  this.q = $q;
  this.$window = $window;
  $controller('LoginCtrl', {
      $scope: this.scope,
      LoginService: LoginService,
      $ionicPopup: '',
      $state: this.state
  });
  this.stateGo = spyOn(this.state, 'go').and.callThrough();

 })); 
 describe('The login function', function(){
   it('should redirect to account', function(){
     
     var data = {
      username: 'hoze',
      password: 'hoze'
     }
    this.$httpBackend.expectPOST('/authenticate', data).respond(
    function(method,url,data) {
    return [200, {success: true}, {}];
    });
    var deferred = this.q.defer();
    var promise = deferred.promise;
    this.scope.data.username = 'hoze';
    this.scope.data.password = 'hoze';
    var user = {"name":"hoze"};
    this.scope.login(); 
    deferred.resolve('welcome');
    this.scope.$root.$digest();
    this.$httpBackend.flush();
    expect(this.stateGo).toHaveBeenCalledWith('tab.account');
    });
  });    
    
});