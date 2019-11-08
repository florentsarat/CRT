
function ($scope,$http, $window) {
    // Get current user id by performing a call to /API/system/session
    let myCustomer;

    // Current user id
    var userId;

    console.log('/API/system/session/1');
    $http.get('/API/system/session/1').
    success(function(data, status, header, config) {
        // Get the user id from REST API call answer
        userId = data.user_id;
        console.log(userId);
        let tablediv = document.querySelector("#mainTable");
        let myHeader = ["Customer", "Delivery Date", "Priority", "Status","     "];
        $http.get('/API/bdm/businessData/com.company.model.itemChangeRequestv2?q=getAllPendingByUser&p=0&c=10&f=userId='+userId).
        success(function(data, status, header, config) {
            myCustomer = data;
            console.log("TaskReceived");
            var table = document.createElement('table');
            table.type = "mytable";
            table.className = "table table-dark thead-dark table-striped";
            table.style="width:100%";

            generateTableHead(table, myHeader);
            for (let request of myCustomer) {
                let row = table.insertRow();

                let customerCell = row.insertCell();
                let customerCelltext = document.createTextNode(request["customerRequesting"]);
                customerCell.appendChild(customerCelltext);
                
                let dateCell = row.insertCell();
                let dateCelltext = document.createTextNode(request["targetDeliveryDate"]);
                dateCell.appendChild(dateCelltext);

                let priorityCell = row.insertCell();
                let priorityCelltext = document.createTextNode(request["priority"]);
                priorityCell.appendChild(priorityCelltext);

                let statusCell = row.insertCell();
                let statusCellText = document.createTextNode(request["status"]);
                statusCell.appendChild(statusCellText);
                
                let actionCell = row.insertCell();
                

                var btn = document.createElement('button');
                btn.type = "mybutton";
                var caseID = request["caseID"];
                //console.log(caseID);
                
                if (request["status"]=="Initiated")
                {
                    btn.innerHTML = "Complete";
                    btn.className = "btn btn-danger"
                    btn.onclick = function(){redirectToTaskForm(userId, caseID);};
                }
                else
                {
                    btn.innerHTML = "View Details";
                    btn.className = "btn btn-primary";
                    btn.onclick = function(){PopUpInfo(request);};
                }
                
                btn.id=request["id"];
                actionCell.appendChild(btn);
            }
            tablediv.appendChild(table);
        }).
        error(function(data, status, headers, config) {
            console.error("Fail to GET - List");
            return;
        });
    }).
    error(function(data, status, headers, config) {
        console.error("Fail to get user id");
        return;
    });

    function redirectToTaskForm(myID, caseID) {
        console.log("myfunc and my parameters: " + myID +'  ' +caseID);
        console.log ('/API/bpm/humanTask?c=1&p=0&f=state=ready&f=user_id=' + myID + '&f=caseId=' + caseID);
        $http.get('/API/bpm/humanTask?c=1&p=0&f=state=ready&f=user_id=' + myID + '&f=caseId=' + caseID).
        success(function(data, status, headers, config) {
            if (data[0]) {
                console.log("I have the url");
                $window.location.href = '/portal/form/taskInstance/' + data[0].id;
            }
        }).
        error(function(data, status, headers, config) {
            console.log("Can't find do the get"); 
        });
    }

    function PopUpInfo(request)
    {
        var modal = document.getElementById("myModal");
        var modalTitle = document.getElementById("modalTitle");
        var clossebtn = document.getElementById("ModalClose");
        clossebtn.onclick =  function(){ClosePopUp();};
        modalTitle.innerHTML= "Request N°"+ request.persistenceId_string;
        modal.style.display = "block";
        var modalContent = document.getElementById("modalContent");
        var customerInput = document.createElement('INPUT');
        customerInput.id="CustomerInfo";
        customerInput.setAttribute("type", "text");
        customerInput.className = "form-control";
        customerInput.readonly=true;
        customerInput.setAttribute("value", request.customerRequesting);
        modalContent.appendChild(customerInput);

    }

    function ClosePopUp()
    {
        var modal = document.getElementById("myModal");
        var customerInput= document.getElementById("CustomerInfo");
        customerInput.remove();
        modal.style.display = "none";
    }


    function generateTableHead(table, data) {
      let thead = table.createTHead();
      let row = thead.insertRow();
      for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
      }
    }
}