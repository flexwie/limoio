var app = angular.module('shopApplication', []);
app.controller('shopController', function($scope, $http) {
	$scope.currency = '€';
	$scope.products = [];
	
	$http.get('https://shop.felixwie.com/products').then(function(result) {
		$scope.products = result.data;
	})
	
	console.log($scope.products);
});