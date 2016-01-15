/**
 * Created by Achini on 13/01/2016.
 */

function loadDepartments() {
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

                var content = '<option disabled selected>-**-Please select a department-**</option>;';
                for (var i = 0; i < depts.length; i++) {
                    content += '<option value="' + depts[i].dept_name + '">' + depts[i].dept_name + '</option>';
                }
                document.getElementById('department').innerHTML = content;

                document.getElementById('department').disabled = false;
            }
        }

        obj.open("POST", "./venues/getDepartments", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("faculty=" + faculty); //pass faulty to controller
    }
}

function loadEquipmentByCategory() {
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
            }
        }
    }

    obj.open("POST", "./venues/getByCategory", true);
    obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    obj.send("department=" + department);
}


function loadModalByCategory(venueCategory) {
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

                modalContent = '<h2 id = "venueCategory" style="text-align: center;">' + venueCategory + '</h2><table class="table table-hover">';
                modalContent += '<tr><th>Equipment ID</th> <th>Name</th><th>Capacity</th><th>Opening Time</th><th>Closing Time</th><th>Resource Request</th></tr>';
                for (var i = 0; i < rows.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td id="requstedVenueID">' + rows[i].resource_id + '</td>';
                    modalContent += '<td>' + rows[i].name+ '</td>';
                    modalContent += '<td>' + rows[i].capacity+ '</td>';
                    modalContent += '<td>' + rows[i].opening_time + '</td>';
                    modalContent += '<td>' + rows[i].closing_time + '</td>';
                    modalContent += '<td>' +'<button type="button" class="btn btn-info btn-xs" onclick="showRequestModal(\'' +venueCategory+ '\')"><span class="glyphicon glyphicon-pencil"></span> Request</button>'; + '</td>';
                    modalContent += '</tr>';
                }
                modalContent += '</table>';

                document.getElementById('venueModalContent').innerHTML = modalContent;
                $('#equipmentArea').modal('hide');
                setTimeout("$('#modalArea').modal();", 1000);

            }
        }

        obj.open("POST", "./venues/getFromCategory", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        var pass = "venueCategory=" + venueCategory + "&department=" +department;
        obj.send(pass);
    }
}

function showRequestModal(venueCategory) {
    $('#request-modal').modal();
}

function addRequest() {
    var obj;

    var resource_id = document.getElementById('requstedVenueID').innerHTML;
    //alert(resource_id);
    var VType = document.getElementById('venueCategory').innerHTML;
    //alert(VType);

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
                alert(res);

                var modalContent = '<div style="margin: 10px;"><p>';
                if (res == 'success') {
                    modalContent += 'You request was added successfully. An admin will review your request and accept it if possible</p><button class="btn btn-sm btn-success"';
                } else {
                    modalContent += 'An error occured in adding your request. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger"';
                }
                modalContent += ' onclick=\'$("#equipmentArea").modal("hide");\'>Ok</button><div></div>';

                document.getElementById('venueModalContent').innerHTML = modalContent;
                $('#equipmentArea').modal('hide');
                setTimeout("$('#modalArea').modal();", 1000);

            }
        }


        obj.open("POST", "./venues/addRequest", true);


        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var dateTo = document.forms["request-form"]["request-date-To"].value;
        var dateFrom = document.forms["request-form"]["request-date-From"].value;
        var timeTo = document.forms["request-form"]["request-time-To"].value;
        var timeFrom = document.forms["request-form"]["request-time-From"].value;
        var equipType = VType;
        var departmentName = document.getElementById('department').value;

        //alert(departmentName);


        var parameter = "resource_id="+ resource_id+ "&dateTo=" + dateTo + "&dateFrom=" + dateTo+ '&timeTo=' + timeTo +  '&timeFrom=' + timeFrom + '&equipType=' + equipType + '&department='+departmentName;

       // alert(parameter);
        obj.send(parameter);
    }

}

function onAddRequestFormKeyPress(e) {
    if (e.keyCode == 13) {

    }
}