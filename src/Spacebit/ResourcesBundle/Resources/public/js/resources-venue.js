/**
 * Created by Achini on 13/01/2016.
 */

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

                var content = '<option disabled selected>---Please select a department---</option>;';
                for (var i = 0; i < depts.length; i++) {
                    content += '<option value="' + depts[i].dept_name + '">' + depts[i].dept_name + '</option>';
                }
                document.getElementById('department').innerHTML = content;

                document.getElementById('department').disabled = false;
                hideLoadingOverlay();
            }
        }

        obj.open("POST", "./venues/getDepartments", true);
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
                var deptvenues = JSON.parse(res).deptVenues;

                //alert(deptvenues);

                var tableContent = '';


                    tableContent += '<div class="row" style="width: 100%; text-align: center; padding: 50px;">';
                    for (var i = 0; i < deptvenues.length; i++)
                    {imageName = deptvenues[i].venue_type;

                        tableContent += '<div class="col-lg-6 portfolio-item" style="margin: 0 auto;">' +
                            '<div class="portfolio-wrapper">' +
                            '<img class="img-portfolio" src="../../bundles/spacebitresources/images/venue/'+ imageName+ '.jpg" alt=deptvenues[i].venue_type onclick="loadModalByCategory(\'' + deptvenues[i].venue_type+ '\')" height="200" width="200" >' + ' <h3 class="text-label">' + deptvenues[i].venue_type + '</h3>' +
                            '</div>' +
                            '</div>';
                    }
                    tableContent += '</div>';


                document.getElementById('venuePictures').innerHTML = tableContent;
                hideLoadingOverlay();
            }
        }
    }

    obj.open("POST", "./venues/getByCategory", true);
    obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    obj.send("department=" + department);
}


function loadModalByCategory(venueCategory) {
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

                var modalContent = '';

                modalContent = '<h2 id = "venueCategory" style="text-align: center;">' + venueCategory + '</h2><table class="table table-hover">';
                modalContent += '<tr><th>Equipment ID</th> <th>Name</th><th>Capacity</th><th>Opening Time</th><th>Closing Time</th><th>Discription</th><th>Resource Request</th></tr>';
                for (var i = 0; i < rows.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td id="requstedVenueID">' + rows[i].resource_id + '</td>';
                    modalContent += '<td>' + rows[i].name+ '</td>';
                    modalContent += '<td>' + rows[i].capacity+ '</td>';
                    modalContent += '<td>' + rows[i].opening_time + '</td>';
                    modalContent += '<td>' + rows[i].closing_time + '</td>';
                    modalContent += '<td>' + rows[i].description + '</td>';
                    modalContent += '<td>' +'<button type="button" class="btn btn-info btn-xs" onclick="showRequestModal( \'' + rows[i].resource_id + '\' )"><span class="glyphicon glyphicon-pencil"></span> Request</button>'; + '</td>';
                    modalContent += '</tr>';
                }
                modalContent += '</table>';

                document.getElementById('venueModalContent').innerHTML = modalContent;

                hideLoadingOverlay();
                setTimeout("$('#modalArea').modal();", 1000);

            }
        }

        obj.open("POST", "./venues/getFromCategory", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        var pass = "venueCategory=" + venueCategory + "&department=" +department;
        obj.send(pass);
    }
}

function showRequestModal(resourceid) {
    showLoadingOverlay();
    document.forms['request-form']['request-date-From'].value = "";
    document.forms['request-form']['request-date-To'].value = "";
    document.forms['request-form']['request-time-From'].value = "";
    document.forms['request-form']['request-time-To'].value = "";
    document.forms['request-form']['submit-button'].value = "Add";
    document.forms['request-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-plus"></span> Request';
    document.forms['request-form']['resource-request-id'].value = resourceid;
    $('#modalArea').modal('hide');
    hideLoadingOverlay();
    setTimeout("$('#request-modal').modal();", 1000);

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
                hideLoadingOverlay();
                document.getElementById('message-modal-content').innerHTML = modalContent;
                $('#request-modal').modal('hide');
                setTimeout("hideLoadingOverlay(); $('#message-modal').modal();", 1000);
               // alert(modalContent);
            }
        }
        obj.open("POST", "./venues/addRequest", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var resource_id =document.forms["request-form"]["resource-request-id"].value;
        var dateTo = document.forms["request-form"]["request-date-To"].value;
        var dateFrom = document.forms["request-form"]["request-date-From"].value;
        var timeTo = document.forms["request-form"]["request-time-To"].value;
        var timeFrom = document.forms["request-form"]["request-time-From"].value;
        var requestType = document.forms["request-form"]["submit-button"].value;
        //alert(resource_id);

        var parameter = "dateTo=" + dateTo + "&dateFrom=" + dateTo + '&timeTo=' + timeTo + '&timeFrom=' + timeFrom + '&requestType='+ requestType+ "&resource_id="+ resource_id;
        if (requestType == 'Add'){
            var departmentName = document.getElementById('department').value;
            var VType = document.getElementById('venueCategory').innerHTML;
            parameter += '&venueType=' + VType + '&department=' + departmentName;
          //  alert(VType);
        } else if (requestType == 'Edit') {
            var requestId =  document.forms["request-form"]["request-id"].value;
            parameter += '&request-id=' + requestId;
           // alert(requestId);
           // alert(requestType);
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


                var pastRequestsTableContent = '<tr><th>Equipment</th><th hidden="true">Resource ID</th><th hidden="true">Request ID</th><th>Department</th><th>Date From</th><th>Date To</th><th>Time From</th><th>Time To</th><th>Status</th><th></th></tr>';
                for (var i = 0; i < result.length; i++) {
                    pastRequestsTableContent += '<tr ><td id = "pastEquipType">' + result[i].name+ '</td>'
                    pastRequestsTableContent += '<td hidden="true">' + result[i].resource_id+ '</td>';
                    pastRequestsTableContent += '<td hidden="true">' + result[i].request_id + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].department_name + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].date_from + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].date_to + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].time_from + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].time_to + '</td>';

                    pastRequestsTableContent += '<td hidden="true">' + result[i].status + '</td>';
                    if (result[i].status == 0) {
                        pastRequestsTableContent += '<td style = "color: #ff4d54;">Declined</td>';
                    } else if (result[i].status == 1) {
                        pastRequestsTableContent += '<td style = "color: #1dff46;">Accepted</td>';
                    } else {
                        pastRequestsTableContent += '<td style = "color: #624cff;">Pending</td>';
                        if (Date.parse(result[i].date_from) > Date.now()) {
                            pastRequestsTableContent += '<td><button class="btn btn-xs btn-primary" onclick="showEditPastRequestModal(\'' + result[i].request_id + '\', \'' + result[i].date_from + '\',\'' + result[i].date_to + '\',\'' + result[i].time_from + '\', \'' + result[i].time_to + '\',\'' + result[i].resource_id + '\');"><span class="glyphicon glyphicon-pencil"></span> Edit</button></td>';
                        }
                    }
                }
                document.getElementById('past-request-table-content').innerHTML = pastRequestsTableContent;
                hideLoadingOverlay();
                $('#past-requests-modal').modal();
            }
        }
        obj.open("GET", "./venues/getPastRequests", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send();
    }
}

function showEditPastRequestModal(requestID, date_from, date_to, time_from, time_to, resourceid) {
    showLoadingOverlay();

    document.forms['request-form']['request-id'].value = requestID;
    document.forms["request-form"]["request-date-To"].value = date_to;
    document.forms["request-form"]["request-date-From"].value = date_from
    document.forms['request-form']['request-time-To'].value = time_to;
    document.forms['request-form']['request-time-From'].value = time_from;
    document.forms['request-form']['resource-request-id'].value = resourceid;

    document.forms['request-form']['submit-button'].value = "Edit";
    document.forms['request-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-ok"></span> Ok';
    $('#past-requests-modal').modal('hide');
    hideLoadingOverlay();
    $('#request-modal').modal();
}