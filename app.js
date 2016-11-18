var app = angular.module('csvToJson', []);

app.controller('MainCtrl', function($scope) {
	$scope.name = 'World';
	var dataKeys = ["Headend1", "Headend2", "Channel", "Enabled", "Send Event Lists", "Get Logs", "Simulate Active", "AllowPastMidnightEventLists", "undefined"];
	$scope.csvObject = {};
	$scope.importData = [];
	$scope.headnet = {};
	//console.log(dataKeys);
	$scope.$watch('fileContent', function(newValue, oldValue) {
		console.log($scope.fileContent);
		if($scope.fileContent){
			var csvData = $scope.fileContent;
			for (var i = 1; i < csvData.length; i++) {
				var currentRow = csvData[i];
				for (var j = 0; j < currentRow.length; j++) {
					var key = dataKeys[j];
					var val = currentRow[j];
					$scope.csvObject[key] = val;
					$scope.importData.push($scope.csvObject);
				}
			}

		}
		$scope.headnet.headnets = $scope.importData;
		$scope.headnet.date = new Date();
		console.log($scope.headnet);
	});

	
});

app.directive('fileReader', function() {
	return {
		scope: {
			fileReader:"="
		},
		link: function(scope, element) {
			$(element).on('change', function(changeEvent) {
				var files = changeEvent.target.files;
				if (files.length) {
					var r = new FileReader();
					r.onload = function(e) {
				
						function parseCSV(text) {
					    return text.split('\n').map(function(row) {
				        var r = [];
				        row.replace(/""/g, "\x01").replace(/"(.*?)"|([^\s,]+)/g, function(_, $1, $2) {
			            r.push(($1 || $2).replace(/\x01/g, '"'));
				        });
				        return r;
					    });
						}

						var contents = e.target.result;
						scope.$apply(function () {
							scope.fileReader = parseCSV(contents);
						});
					};
				  
					r.readAsText(files[0]);
				}
		  });
		}
	};
});





