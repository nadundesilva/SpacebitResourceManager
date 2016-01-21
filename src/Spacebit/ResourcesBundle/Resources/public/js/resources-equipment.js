function loadDepartments() {
    showLoadingOverlay();
    var faculty = document.getElementById('faculty').value; //get the value selected via id.value & assign to variable

    var obj;

    if (window.XMLHttpRequest) {
        obj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        obj = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("Browser Doesn't Support AJAX!");
    }

    if (obj !== null) {
        obj.onreadystatechange = function () {
            if (obj.readyState < 4) {
                // progress
            } else if (obj.readyState === 4) {
                var res = obj.responseText;
                var depts = JSON.parse(res).depts;

                var content = '<option disabled selected>--Please select a department--</option>;';
                for (var i = 0; i < depts.length; i++) {
                    content += '<option value="' + depts[i].dept_name + '">' + depts[i].dept_name + '</option>';
                }
                document.getElementById('department').innerHTML = content;

                document.getElementById('department').disabled = false;
                hideLoadingOverlay();
            }
        }

        obj.open("POST", "./equipment/getDepartments", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("faculty=" + faculty); //pass faulty to controller
    }
}

function loadEquipmentByCategory() {
    showLoadingOverlay();
    var department = document.getElementById('department').value;
    var obj;

    if (window.XMLHttpRequest) {
        obj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        obj = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("Browser Doesn't Support AJAX!");
    }

    if (obj !== null) {
        obj.onreadystatechange = function () {
            if (obj.readyState < 4) {
                // progress
            } else if (obj.readyState === 4) {
                var res = obj.responseText;
                var deptEquipments = JSON.parse(res).deptEquipment;
               // var imageNumber;

                //alert(deptEquipments);

                var tableContent = '<h2 style="text-align: center;">' + '</h2><table class="table table-hover">';
                tableContent += '<tr><th></th><th>Equipment Catogary</th><th></th></tr>';
                for (var i = 0; i < deptEquipments.length; i++) {
                    tableContent += '<tr>';
                    imageNumber = i%3;

                    tableContent += '<td>' + '<img src="../../bundles/spacebitresources/images/equipment/equipmentImg' + imageNumber + '.png" alt="E" height="45" width="45">' + '</td>';

                    tableContent += '<td>' + deptEquipments[i].equipment_type + '</td>';
                    tableContent += '<td><button type="button" id="equipmentSelect" class="btn btn-info btn-xs" onclick="loadModalByCategory(\'' + deptEquipments[i].equipment_type+ '\')" onclick = "passDepartment(\''+ department+ '\')" ><span class="glyphicon glyphicon-pencil"></span> View</button></td>';
                    tableContent += '</tr>';
                }
                tableContent += '</table>';

                document.getElementById('equipmentTableContent').innerHTML = tableContent;
                hideLoadingOverlay();
            }
        }
    }

    obj.open("POST", "./equipment/getByCategory", true);
    obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    obj.send("department=" + department);
}

function loadModalByCategory(equipCategory) {
    showLoadingOverlay();

    var department = document.getElementById('department').value;
    var obj;
    if (window.XMLHttpRequest) {
        obj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        obj = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("Browser Doesn't Support AJAX!");
    }

    if (obj !== null) {
        obj.onreadystatechange = function () {
            if (obj.readyState < 4) {
                // progress
            } else if (obj.readyState === 4) {
                var res = obj.responseText;
                var rows = JSON.parse(res).categoryEquipments;

                //alert(rows);

                var modalContent = '"This is the modal"';

                modalContent = '<h2 id = "equipmentCategory" style="text-align: center;">' + equipCategory  + '</h2><table class="table table-hover">';
                modalContent += '<tr><th>Equipment ID</th><th>Description</th></tr>';
                for (var i = 0; i < rows.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td>' + rows[i].resource_id + '</td>';
                    modalContent += '<td>' + rows[i].description + '</td>';
                    modalContent += '</tr>';
                }
                modalContent += '</table>';

                modalContent +=  '<button type="button" id="equipmentRequest" class="btn btn-info btn-xs" onclick="showRequestModal(\'' +equipCategory+ '\')"><span class="glyphicon glyphicon-pencil"></span> Request Equipment</button>';

                document.getElementById('equipmentModal').innerHTML = modalContent;

                hideLoadingOverlay();
                setTimeout("$('#modalArea').modal();", 1000);

            }
        }

        obj.open("POST", "./equipment/getFromCategory", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        var pass = "equipCategory=" + equipCategory + "&department=" +department;

       // alert(pass);
        obj.send(pass);
    }
}

function showRequestModal(equipCategory) {
    showLoadingOverlay();
    document.forms['request-form']['submit-button'].value = "Add";
    document.forms['request-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-plus"></span> Request';
    $('#modalArea').modal('hide');
    setTimeout("hideLoadingOverlay(); $('#request-modal').modal();", 1000);

}

function addRequest() {
    showLoadingOverlay();
    var obj;

    if (window.XMLHttpRequest) {
        obj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        obj = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("Browser Doesn't Support AJAX!");
    }

    if (obj !== null) {
        obj.onreadystatechange = function () {
            if (obj.readyState < 4) {
                // progress
            } else if (obj.readyState === 4) {
                var res = obj.responseText;
                //alert(res);

                var modalContent = '<div style="margin: 10px;"><p>';
                if (res == 'success') {
                    modalContent += 'You request was ' + (requestType == 'Add' ? 'added' : 'edited') + ' successfully. An admin will review your request and accept it if possible</p><button class="btn btn-sm btn-success"';
                } else {
                    modalContent += 'An error occured in ' + (requestType == 'Add' ? 'adding' : 'editing') + ' your request. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger"';
                }
                modalContent += ' onclick=\'$("#message-modal").modal("hide");\'>Ok</button><div></div>';
                //alert(modalContent);
                document.getElementById('message-modal-content').innerHTML = modalContent;
                $('#request-modal').modal('hide');
                setTimeout("hideLoadingOverlay(); $('#message-modal').modal();", 1000);
                //alert(modalContent);
            }
        }
        obj.open("POST", "./equipment/addRequest", true);

        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var dateTo = document.forms["request-form"]["request-date-To"].value;
        var dateFrom = document.forms["request-form"]["request-date-From"].value;
        var timeTo = document.forms["request-form"]["request-time-To"].value;
        var timeFrom = document.forms["request-form"]["request-time-From"].value;
        var requestType = document.forms["request-form"]["submit-button"].value;


        //alert(requestType);


        var parameter = "dateTo=" + dateTo + "&dateFrom=" + dateTo + '&timeTo=' + timeTo + '&timeFrom=' + timeFrom + '&requestType='+ requestType;
        if (requestType == 'Add'){
            var departmentName = document.getElementById('department').value;
            var EType = document.getElementById('equipmentCategory').innerHTML;
            parameter += '&equipType=' + EType + '&department=' + departmentName; ;

        } else if (requestType == 'Edit') {
            var requestId =  document.forms["request-form"]["request-id"].value;
            parameter += '&request-id=' + requestId;
           // alert(requestId);

        }

        //alert(parameter);
        obj.send(parameter);
    }

}

function onAddRequestFormKeyPress(e) {
    if (e.keyCode == 13) {

    }
}


function showPastRequestsModal() {
    showLoadingOverlay();
    var obj;

    if (window.XMLHttpRequest) {
        obj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        obj = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("Browser Doesn't Support AJAX!");
    }

    if (obj !== null) {
        obj.onreadystatechange = function () {
            if (obj.readyState < 4) {
                // progress
            } else if (obj.readyState === 4) {
                var res = obj.responseText;
                var result = JSON.parse(res).allRequests;

                var pastRequestsTableContent = '<tr><th>Equipment</th><th hidden="true">ID</th><th>Department</th><th>Date From</th><th>Date To</th><th>Time From</th><th>Time To</th><th>Assigned Equipment ID</th><th>Status</th><th></th></tr>';
                for (var i = 0; i < result.length; i++) {
                    pastRequestsTableContent += '<tr ><td id = "pastEquipType">' + result[i].type+ '</td>'
                    pastRequestsTableContent += '<td hidden="true">' + result[i].request_id + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].department_name + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].date_from + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].date_to + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].time_from + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].time_to + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].resource_id+ '</td>';
                    pastRequestsTableContent += '<td hidden="true">' + result[i].status + '</td>';
                    if (result[i].status == 0) {
                        pastRequestsTableContent += '<td style = "color: #ff4d54;">Declined</td>';
                    } else if (result[i].status == 1) {
                        pastRequestsTableContent += '<td style = "color: #1dff46;">Accepted</td>';
                    } else {
                        pastRequestsTableContent += '<td style = "color: #624cff;">Pending</td>';
                        if (Date.parse(result[i].date_from) > Date.now() ) {
                            pastRequestsTableContent += '<td><button class="btn btn-xs btn-primary" onclick="showEditPastRequestModal(\'' + result[i].request_id + '\', \'' + result[i].date_from + '\',\'' + result[i].date_to + '\',\'' + result[i].time_from + '\', \'' + result[i].time_to + '\');"><span class="glyphicon glyphicon-pencil"></span> Edit</button></td>';
                        }
                    }
                }

                document.getElementById('past-request-table-content').innerHTML = pastRequestsTableContent;
                hideLoadingOverlay();
                $('#my-past-requests-modal').modal();
            }
        }

        obj.open("GET", "./equipment/getPastRequests", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send();
    }
}

function showEditPastRequestModal(requestID, date_from, date_to, time_from, time_to) {
    showLoadingOverlay();

    document.forms['request-form']['request-id'].value = requestID;
    document.forms["request-form"]["request-date-To"].value = date_to;
    document.forms["request-form"]["request-date-From"].value = date_from
    document.forms['request-form']['request-time-To'].value = time_to;
    document.forms['request-form']['request-time-From'].value = time_from;

    document.forms['request-form']['submit-button'].value = "Edit";
    document.forms['request-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-ok"></span> Ok';
    $('#my-past-requests-modal').modal('hide');
    hideLoadingOverlay();
    $('#request-modal').modal();
}