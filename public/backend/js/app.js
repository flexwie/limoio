var app = angular.module('shopApplication', []);
app.controller('shopController', function ($scope, $http, $rootScope) {
    //Get products array for display in
    $scope.products = [];
    $http.get('https://shop.felixwie.com/products').then(function (result) {
        $scope.products = result.data;
    });
	
	$scope.media = [];
	$http.get('https://shop.felixwie.com/media').then(function (result) {
		console.log(result);
		$scope.media = result.data
	});

    //Var for token and success
    $scope.success = false;
    $scope.token = '';

    //create function for show uploader button click
    $scope.show_uploader = function () {
        if(!$('#uploader').is(':visible')) {
			$('#uploader').show('fast');
		} else {
			$('#uploader').hide('fast');
		}
    };
	
	//create edit function
	$scope.show_edit = function(i) {
		if(!$('#editForm'+i).is(':visible')) {
			$('#editForm'+i).show('fast');
		} else {
			$('#editForm'+i).hide('fast');
			if($scope.updateSuccess) {
				$scope.updateSuccess = false;
			}
		}
	}
	
	//Make new entry
	$scope.show_new_entry = function() {
		if(!$('#newEntry').is(':visible')) {
			$('#newEntry').show('fast');
		} else {
			if($scope.newEntrySuccess){$scope.newEntrySuccess = false;}
			$('#newEntry').hide('fast');
		}
	}
	
	$scope.newEntry = function() {
        var name = $('#newName').val();
        var price = $('#newPrice').val();
        $http({
            method: 'POST',
            url: 'https://shop.felixwie.com/products/',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token' : $scope.token},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {name: name, price: price}
        }).success(function (result) {
			$http.get('https://shop.felixwie.com/products').then(function (res) {
				$scope.products = res.data;
				$scope.$apply();
			});
			$('#newName').val('');
			$('#newPrice').val('');
        });
    };
	
	//Update entry
	$scope.updateSuccess = false;
	
	$scope.editProduct = function(id, index) {
        var name = $('#editName'+index).val();
        var price = $('#editPrice'+index).val();
        $http({
            method: 'POST',
            url: 'https://shop.felixwie.com/products/' + id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token' : $scope.token},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {name: name, price: price}
        }).success(function (result) {
			$scope.updateSuccess = result.success;
            console.log(result);
        });
    };

    //create upload function
    $('#upload-input').on('change', function () {
        var files = $(this).get(0).files;
        console.log(files);
        console.log(files.length);
        if (files.length > 0) {
            var formData = new FormData();
            for (var i = 0; i < files.lenght; i++) {
                var file = files[i];
                formData.append('uploads[]', file, file.name);
            }

            console.log(formData);

            $.ajax({
                url: '/media/upload/',
                type: 'POST',
                headers: {'x-access-token': $scope.token},
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log('upload successful! \n' + data);
                }
            });
        } else {
            console.error('no file selected!!!!! -.-');
        }
    });

    //Create function for delete button click
    $scope.del = function (id) {
        if (typeof $scope.token != 'undefined') {
            $http({
                method: 'DELETE',
                url: 'https://shop.felixwie.com/products/' + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token': $scope.token},
                data: {}
            }).success(function (result) {
                //TODO delete entry from current DOM
                $('#' + id).hide('slow');
                console.log(result);
            });
        } else {
            console.log('Error');
        }
    }

    //Create function for auth button click
    $scope.auth = function () {
        var name = $('#user').val();
        var password = $('#pswd').val();
        $http({
            method: 'POST',
            url: 'https://shop.felixwie.com/admin/',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {name: name, password: password}
        }).success(function (result) {
            $scope.success = result.success;
            $scope.token = result.token;
            $scope.msg = result.message;
        });
    };
});