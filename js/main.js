
var myApp = angular.module('angAppX',['720kb.datepicker']);

// should be put in service separately for bigger app
myApp.service('joinCrewService',['$http',function($http){

  // to show All transaction
  this.listAllTransaction = function(){
  return $http.get('https://jointhecrew.in/api/txns/priya@gmail.com')
  .then(function(response){
    return response;
    
  })
  }
 // to show one transaction
 this.oneTransaction = function (id, user) {
   console.log(user)
            return $http.get('https://jointhecrew.in/api/txns/'+ user +'/'+ id)
                .then(function (response) {
                    return response
                });
        };
 // to delete transaction
  this.deleteTransaction = function (id, user) {
   console.log(user)
            return $http.delete('https://jointhecrew.in/api/txns/'+ user +'/'+ id)
                .then(function (response) {
                    return response
                })
        };

   // to Edit transaction
  this.updateTransaction = function (id, user, amount, currency, txn_date) {
    var data = {
      'amount':amount,
      'currency':currency,
      'txn_date':txn_date
    }
            return $http.post('https://jointhecrew.in/api/txns/'+ user +'/'+ id, data,
            {headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
          }
            )
                .then(function (response) {
                    return response
                })
        };

    // to Edit transaction
  this.createTransaction = function (user, amount, currency, txn_date) {
    var data = {
      'amount':amount,
      'currency':currency,
      'txn_date':txn_date
    }
            return $http.post('https://jointhecrew.in/api/txns/'+ user, data,
            {headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}
          }
            )
                .then(function (response) {
                    return response
                })
        }

}]);


// should be put in controller separately for bigger app
myApp.controller('joinCrew',['$scope', 'joinCrewService', function($scope, joinCrewService){
  $scope.currency = ["USD","GBP","INR","EUR"];
  $scope.errorMessage = '';
   $scope.modalClose = function(){
    $scope.modalOpen = false;
    $scope.openOne = false; 
    $scope.openEdit = false; 
    $scope.openAdd = false;
  }
  $scope.modalClose();
  $scope.addModel = function(){
    $scope.modalOpen = true;
    $scope.openAdd = true;
    $scope.user= "priya@gmail.com";
    $scope.currencyN = '';
    $scope.amount = '';
    $scope.txn_date = '';
  }

  function loadAllTransaction(){
  joinCrewService.listAllTransaction().then(function(response){
  $scope.allTransaction = response.data;
  
  });
  };
  loadAllTransaction();
  $scope.oneTransaction = function(id, user){
    $scope.modalOpen = true;
    $scope.openOne = true;
    joinCrewService.oneTransaction(id, user)
    .then(function (response) {
                    $scope.showInfo = response.data
                  })
                  .catch(function (res) {
                      $scope.globalErrorMessage = res.data.error
                  });
  };

  $scope.editTransaction = function(id, user){
   $scope.modalOpen = true;
   $scope.openEdit =  true;
   joinCrewService.oneTransaction(id, user)
    .then(function (response) {
                    $scope.id = response.data.id
                    $scope.user = response.data.user;
                    $scope.amount = response.data.amount;
                    $scope.currencyN = response.data.currency;
                    $scope.date = response.data.txn_date;
                  })
                  .catch(function (res) {
                      $scope.globalErrorMessage = res.data.error;
                  });
  };
  
  $scope.updateTransaction = function(id, user, amount, currency, txn_date){
     joinCrewService.updateTransaction(id, user, amount, currency, txn_date)
    .then(function (data) {
                    $scope.modalClose();
                  })
                  .catch(function (res) {
                    $scope.errorMessage = res.data.error;
                  });
  }

    $scope.createTransaction = function(user, amount, currency, txn_date){
     joinCrewService.createTransaction(user, amount, currency, txn_date)
    .then(function (data) {
                    $scope.modalClose(); 
                  })
                  .catch(function (res) {
                       $scope.errorMessage = res.data.error;
                  });
  }

  $scope.deleteTransaction = function(id, user){
    joinCrewService.deleteTransaction(id, user)
    .then(function (data) {
                    loadAllTransaction();
                  })
                  .catch(function (res) {
                      $scope.globalErrorMessage = res.data.error
                  });
  };

}]);

// directive for valid number to be put seperately in directive page

myApp.directive('validNumber', function(){
        return {
           require: '?ngModel',
            scope: {
                preDecimalMaxLength: '=?'
            },
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function (val) {
                    if (angular.isUndefined(val)) {
                        val = '';
                    }
// negative and decimal check
                    var clean = val.replace(/[^-0-9\.]/g, '');
                    var negativeCheck = clean.split('-');
                    var decimalCheck = clean.split('.');
                    if (!angular.isUndefined(negativeCheck[1])) {
                        negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);

// to allow negative using attribute allow-negative=true

                        clean = attrs.allowNegative ? negativeCheck[0] + '-' + negativeCheck[1]: negativeCheck[0] + '' + negativeCheck[1];
                        decimalCheck = clean.split('.');
                        if (negativeCheck[0].length > 0) {
                           clean = negativeCheck[0];
                        }
                    }

                    if (!angular.isUndefined(decimalCheck[1])) {
                        if (!angular.isUndefined(scope.preDecimalMaxLength)) {
                            decimalCheck[0] = decimalCheck[0].slice(0, scope.preDecimalMaxLength);
                        }                     
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                        if (!angular.isUndefined(negativeCheck[1]) && negativeCheck[0].length > 0) {
                            clean = negativeCheck[0] + '' + negativeCheck[1];
                        }
                    } else if (!angular.isUndefined(scope.preDecimalMaxLength)) {
                        clean = clean.slice(0, scope.preDecimalMaxLength);
                    }

                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }

                    return clean;
                });

                element.bind('keypress', function (event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };

});
