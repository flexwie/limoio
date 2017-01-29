var app = angular.module('shopApplication', []);
app.controller('shopController', function($scope, $http) {
	$scope.currency = '€';
	console.log(window.location.href);
	$scope.product = [];
	
	$http.get('https://shop.felixwie.com/products' + ).then(function(result) {
		$scope.products = result.data;
	})
	
	console.log($scope.products);
});