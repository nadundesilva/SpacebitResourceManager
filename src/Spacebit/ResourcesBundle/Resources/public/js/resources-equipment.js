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
                    modalContent += '<td><button type="button" id="equipmentSelect" class="btn btn-info btn-lg btn-padding" data-toggle="modal" data-target="#catagoryModal" onclick="loadModalByCatagory(\'' + deptEquipments[i].equipment_type+ '\')"><span class="glyphicon glyphicon-pencil"></span> View</button></td>';
                    modalContent += '</tr>';
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

                alert(res);
                var modalContent = '';
                modalContent = '"This is the modal kkk"';

                document.getElementById('equipmentModalContent').innerHTML = modalContent;
                $('#modalArea').modal();

            }

            obj.open("POST", "./equipment/getFromCatagory", true);
            obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            obj.send("equipCatagory" + equipCatagory);

        }
    }
}