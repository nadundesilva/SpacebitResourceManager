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

    alert("Keet");

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

