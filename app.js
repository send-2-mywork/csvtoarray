var app = angular.module('csvToJson', []);

app.controller('MainCtrl', function($scope) {
	$scope.name = 'World';
	var dataKeys = ["Headend1", "Headend2", "Channel", "Enabled", "Send Event Lists", "Get Logs", "Simulate Active", "AllowPastMidnightEventLists", "undefined"];
	$scope.csvObject = {};
	$scope.importData = [];
	$scope.headnet = {};
	//console.log(dataKeys);
	$scope.$watch('fileContent', function(newValue, oldValue) {
		//console.log($scope.fileContent);
		if($scope.fileContent){
			var csvData = $scope.fileContent;
			for (var i = 1; i < csvData.length; i++) {
				var currentRow = csvData[i];
				for (var j = 0; j < currentRow.length; j++) {
					var key = dataKeys[j];
					var val = currentRow[j];
					if (val != "") {
						$scope.csvObject[key] = val;
						$scope.importData.push($scope.csvObject);	
					}
				}
			}
			//console.log($scope.csvObject.Headend);
		}
		$scope.headnet.headnet = $scope.importData;
		$scope.headnet.date = new Date();
		//console.log($scope.headnet);
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
				
						function CSVToArray( strData, strDelimiter ){
							// Check to see if the delimiter is defined. If not,
							// then default to comma.
							strDelimiter = (strDelimiter || ",");

							// Create a regular expression to parse the CSV values.
							var objPattern = new RegExp(
								(
									// Delimiters.
									"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

									// Quoted fields.
									"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

									// Standard fields.
									"([^\"\\" + strDelimiter + "\\r\\n]*))"
								),
								"gi"
								);


							// Create an array to hold our data. Give the array
							// a default empty first row.
							var arrData = [[]];

							// Create an array to hold our individual pattern
							// matching groups.
							var arrMatches = null;


							// Keep looping over the regular expression matches
							// until we can no longer find a match.
							while (arrMatches = objPattern.exec( strData )){

								// Get the delimiter that was found.
								var strMatchedDelimiter = arrMatches[ 1 ];

								// Check to see if the given delimiter has a length
								// (is not the start of string) and if it matches
								// field delimiter. If id does not, then we know
								// that this delimiter is a row delimiter.
								if (
									strMatchedDelimiter.length &&
									strMatchedDelimiter !== strDelimiter
									){

									// Since we have reached a new row of data,
									// add an empty row to our data array.
									arrData.push( [] );

								}

								var strMatchedValue;

								// Now that we have our delimiter out of the way,
								// let's check to see which kind of value we
								// captured (quoted or unquoted).
								if (arrMatches[ 2 ]){

									// We found a quoted value. When we capture
									// this value, unescape any double quotes.
									strMatchedValue = arrMatches[ 2 ].replace(
										new RegExp( "\"\"", "g" ),
										"\""
										);

								} else {

									// We found a non-quoted value.
									strMatchedValue = arrMatches[ 3 ];

								}


								// Now that we have our value string, let's add
								// it to the data array.
								arrData[ arrData.length - 1 ].push( strMatchedValue );
							}

							// Return the parsed data.
							return( arrData );
						}

						function ArrayToJson( arrData ){ 
							//console.log(arrData);
							//console.log(arrData.length);
							for (var i = 0; i < arrData.length; i++) {
								console.log(arrData[i]);
							}
						}
				
						var contents = e.target.result;
						scope.$apply(function () {
							scope.fileReader = CSVToArray(contents);

							//ArrayToJson(scope.fileReader);

						});
					};
				  
					r.readAsText(files[0]);
				}
		  });
		}
	};
});





