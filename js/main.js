
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