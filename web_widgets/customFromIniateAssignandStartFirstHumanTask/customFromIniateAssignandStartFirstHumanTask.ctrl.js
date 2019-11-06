function($scope, $interval, $window, $http, $modal) {
    var ctrl = this;
    $scope.display = "display:none";


    ctrl.firstTime = true;
    
    // Current user id
    var userId;

    // Current case id
    var caseId;

    // Get current user id by performing a call to /API/system/session
    $http.get('/API/system/session/1').
    success(function(data, status, header, config) {
        // Get the user id from REST API call answer
        userId = data.user_id;
    }).
    error(function(data, status, headers, config) {
        return;
    });
    $scope.$watch('properties.submitButtonSuccessfulResponseValue', function() {
        if (!ctrl.firstTime) {
            //console.log("Second click"); 
            //Get case ID from submit
            var counter = 0, interval = $interval(function() {
                counter++;
                if (counter > 10) {
                    $interval.cancel(interval);
                    console.log("Fail");
                }
                else {
                    $scope.warningModal();
                    caseId = $scope.properties.submitButtonSuccessfulResponseValue.caseId;
                     console.log("Case ID is " + caseId); 
                    // Call API to get pending task (limit result to one task) for current user in current case
                    $http.get('/API/bpm/humanTask?c=1&p=0&f=state=ready&f=user_id=' + userId + '&f=caseId=' + caseId).
                    success(function(data, status, headers, config) {
                        if (data[0]) {
                            //assign
                            console.log("Assign " + data[0]);
                            $http.put('/API/bpm/humanTask/' + data[0].id, {assigned_id: userId});
                            // Redirect user to task form
                        $window.location.href = '/portal/form/taskInstance/' + data[0].id;
                        }
                    }).
                    error(function(data, status, headers, config) {
                    });
                }
            }, 500);
        } 
        else {
            // This is the first time submitButtonSuccessfulResponseValue changed
            ctrl.firstTime = false;
        }
        $scope.warningModal = function() {

            var html = "<div class='spinner-grow' role='status'>" + "<span class='sr-only'>Loading...</span>";
        
            $scope.myModal = $modal.open({
              template: html,
              backdrop: 'static'
            });
          };
    });

}