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

                var content = '<option disabled selected>--Please select a department--</option>;';
                for (var i = 0; i < depts.length; i++) {
                    content += '<option value="' + depts[i].dept_name + '">' + depts[i].dept_name + '</option>';
                }
                document.getElementById('department').innerHTML = content;

                document.getElementById('department').disabled = false;
            }
        }

        obj.open("POST", "./equipment/getDepartments", true);
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
                var deptEquipments = JSON.parse(res).deptEquipment;

                //alert(deptEquipments);

                var tableContent = '<h2 style="text-align: center;">' + '</h2><table class="table table-hover">';
                tableContent += '<tr><th>Equipment Catogary</th><th></th></tr>';
                for (var i = 0; i < deptEquipments.length; i++) {
                    tableContent += '<tr>';
                    tableContent += '<td>' + deptEquipments[i].equipment_type + '</td>';
                    tableContent += '<td><button type="button" id="equipmentSelect" class="btn btn-info btn-xs" onclick="loadModalByCategory(\'' + deptEquipments[i].equipment_type+ '\')" onclick = "passDepartment(\''+ department+ '\')" ><span class="glyphicon glyphicon-pencil"></span> View</button></td>';
                    tableContent += '</tr>';
                }
                tableContent += '</table>';

                document.getElementById('equipmentTableContent').innerHTML = tableContent;
            }
        }
    }

    obj.open("POST", "./equipment/getByCategory", true);
    obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    obj.send("department=" + department);
}

function loadModalByCategory(equipCategory) {

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

                document.getElementById('equipmentModalContent').innerHTML = modalContent;
                $('#equipmentArea').modal('hide');
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
    $('#request-modal').modal();
}

function addRequest() {
    var obj;

    var EType = document.getElementById('equipmentCategory').innerHTML;

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

                document.getElementById('equipmentModalContent').innerHTML = modalContent;
                $('#equipmentArea').modal('hide');
                setTimeout("$('#modalArea').modal();", 1000);

            }
        }


        obj.open("POST", "./equipment/addRequest", true);


        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var dateTo = document.forms["request-form"]["request-date-To"].value;
        var dateFrom = document.forms["request-form"]["request-date-From"].value;
        var timeTo = document.forms["request-form"]["request-time-To"].value;
        var timeFrom = document.forms["request-form"]["request-time-From"].value;
        var equipType = EType;
        var departmentName = document.getElementById('department').value;

        alert(departmentName);


        var parameter = "dateTo=" + dateTo + "&dateFrom=" + dateTo+ '&timeTo=' + timeTo +  '&timeFrom=' + timeFrom + '&equipType=' + equipType + '&department='+departmentName;

        alert(parameter);
        obj.send(parameter);
    }

}

function onAddRequestFormKeyPress(e) {
    if (e.keyCode == 13) {

    }
}