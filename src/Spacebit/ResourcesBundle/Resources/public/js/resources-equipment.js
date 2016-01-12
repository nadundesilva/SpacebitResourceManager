/**
 * Created by Achini on 07/01/2016.
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

                var content = '<option disabled selected>*Please select a department*</option>;';
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

function loadEquipmentByCatagory() {
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

                alert(res);

                var tableContent = '';

                tableContent = '<h2 style="text-align: center;">' + '</h2><table class="table table-hover">';
                tableContent += '<tr><th>Equipment Catogary</th><th>Equipment Request</th></tr>';
                for (var i = 0; i < deptEquipments.length; i++) {
                    tableContent += '<tr>';
                    tableContent += '<td>' + deptEquipments[i].equipment_type + '</td>';
                    tableContent += '<td>' + '<button type="button" id = "equpimentSelect" class="btn btn-info btn-lg btn-padding" data-toggle="modal" data-target="#catagoryModal" onclick="loadModalByCatagory(\'' +deptEquipments[i].equipment_type + '\')">View</button>' + '</td>';
                    tableContent += '</tr>';
                }
                tableContent += '</table>';

                document.getElementById('equipmentTableContent').innerHTML = tableContent;
                $('#equipmentArea').modal();
            }
        }
    }

    obj.open("POST", "./equipment/getByCategory", true);
    obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    obj.send("department=" + department);
}

function loadModalByCatagory(equipmentCatagory) {
    var equipCatagory = equipmentCatagory;

    alert(equipCatagory);
    var obj1;

    if (window.XMLHttpRequest) {
        obj1 = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        obj1 = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("Browser Doesn't Support AJAX!");
    }

    if (obj1 !== null) {
        obj1.onreadystatechange = function () {
            if (obj1.readyState < 4) {
                // progress
            } else if (obj1.readyState === 4) {
                var res = obj1.responseText;

                alert(res);
                var modalContent = '';
                modalContent = '"This is the modal kkk"';

                document.getElementById('equipmentModalContent').innerHTML = modalContent;
                $('#modalArea').modal();

            }

            obj1.open("POST", "./equipment/getFromCatagory", true);
            obj1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            obj1.send("equipCatagory" + equipCatagory);

        }
    }
}

function addRequest() {
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

                var modalContent = '<div style="margin: 10px;"><p>';
                if (res == 'success') {
                    modalContent += 'You request was added successfully. An admin will review your request and accept it if possible</p><button class="btn btn-sm btn-success"';
                } else {
                    modalContent += 'An error occured in adding your request. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger"';
                }
                modalContent += ' onclick=\'$("#equipmentArea").modal("hide");\'>Ok</button><div></div>';
                document.getElementById('equipmentTableContent').innerHTML = modalContent;

                $('#equipmentArea').modal('hide');
                //$('#vehicles-modal').modal();
            }
        }

        obj.open("POST", "./equipment/addRequest", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var date = document.forms["request-form"]["request-date"].value;
        var time = document.forms["request-form"]["request-time"].value;
       // var vehicleType = document.forms["request-form"]["request-vehicle-type"].value;
       // var passengerCount = document.forms["request-form"]["request-passenger-count"].value;
       // var destination = document.forms["request-form"]["request-map-search"].value;
        //var parameter = "date=" + date + '&time=' + time + '&vehicle-type=' + vehicleType + '&passenger-count=' + passengerCount + '&destination=' + destination;
       // obj.send(parameter);
    }
}

function onAddRequestFormKeyPress(e) {
    if(e.keyCode == 13) {
        addRequest();
    }
}

function equipmentRequest(){
   //equipment is passed


}