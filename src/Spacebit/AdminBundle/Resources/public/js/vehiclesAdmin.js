function showManageVehiclesModal() {
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
                var rows = JSON.parse(res).result;

                var modalContent = '<table class="table table-hover">';
                modalContent += '<tr><th>License Plate No</th><th>Model</th><th>Capacity</th><th>Driver</th><th>Category</th><th>Value</th><th></th></tr>';
                for (var i = 0; i < rows.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td>' + rows[i].plate_no + '</td>';
                    modalContent += '<td>' + rows[i].model + '</td>';
                    modalContent += '<td>' + rows[i].capacity + '</td>';
                    modalContent += '<td>' + rows[i].driver_first_name + ' ' + rows[i].driver_last_name + '</td>';
                    modalContent += '<td>' + rows[i].type + '</td>';
                    modalContent += '<td>' + rows[i].value + '</td>';
                    modalContent += '<td><button class="btn btn-xs btn-info" onclick="showEditVehicleModal(\'' + rows[i].plate_no + '\')">Edit</button></td>';
                    modalContent += '</tr>';
                }
                modalContent += '</table>'
                document.getElementById('manageVehiclesModalContent').innerHTML = modalContent;
                $('#manageVehiclesModal').modal();
            }
        }

        obj.open("POST", "./vehicles/getAll", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send();
    }
}

function showAddVehicleModal() {
    document.forms['vehicle-add-form']['plate-no'].value = '';
    document.forms['vehicle-add-form']['type'].value = '';
    document.forms['vehicle-add-form']['model'].value = '';
    document.forms['vehicle-add-form']['capacity'].value = '';
    document.forms['vehicle-add-form']['value'].value = '';
    document.forms['vehicle-add-form']['availability'].checked = false;
    document.forms['vehicle-add-form']['driver-first-name'].value = '';
    document.forms['vehicle-add-form']['driver-last-name'].value = '';
    document.forms['vehicle-add-form']['submit-button'].value = 'Add';
    $('#manageVehiclesModal').modal('hide');
    $('#addEditVehicleModal').modal();
}

function showEditVehicleModal(plateNo) {
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
                var vehicle = JSON.parse(res).result;

                document.forms['vehicle-add-form']['plate-no'].value = vehicle.plate_no;
                document.forms['vehicle-add-form']['type'].value = vehicle.type;
                document.forms['vehicle-add-form']['model'].value = vehicle.model;
                document.forms['vehicle-add-form']['capacity'].value = vehicle.capacity;
                document.forms['vehicle-add-form']['value'].value = vehicle.value;
                document.forms['vehicle-add-form']['availability'].checked = vehicle.availability;
                document.forms['vehicle-add-form']['driver-first-name'].value = vehicle.driver_first_name;
                document.forms['vehicle-add-form']['driver-last-name'].value = vehicle.driver_last_name;

                document.forms['vehicle-add-form']['submit-button'].value = 'Edit';
                $('#manageVehiclesModal').modal('hide');
                $('#addEditVehicleModal').modal();
            }
        }

        obj.open("POST", "./vehicles/getByPlateNo", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('plate-no=' + plateNo);
    }
}

function changeRequest(requestId, accepted) {

}

function addEditVehicle() {
    var plateNo = document.forms['vehicle-add-form']['plate-no'].value;
    var type = document.forms['vehicle-add-form']['type'].value;
    var model = document.forms['vehicle-add-form']['model'].value;
    var capacity = document.forms['vehicle-add-form']['capacity'].value;
    var value = document.forms['vehicle-add-form']['value'].value;
    var availability = document.forms['vehicle-add-form']['availability'].value;
    var driverFirstName = document.forms['vehicle-add-form']['driver-first-name'].value;
    var driverLastName = document.forms['vehicle-add-form']['driver-last-name'].value;
    var updateType = document.forms['vehicle-add-form']['submit-button'].value;
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
                    modalContent += 'Vehicle with plate number ' + plateNo + ' was ' + (updateType == "Add" ? "added" : "edited") + ' successfully</p><button class="btn btn-sm btn-success"';
                } else {
                    modalContent += 'An error occured in ' + (updateType == "Add" ? "adding" : "editing") + ' the vehicle with plate number ' + plateNo + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger"';
                }
                modalContent += ' onclick=\'$("#messageModal").modal("hide"); showManageVehiclesModal();\'>Ok</button><div></div>';
                document.getElementById('messageModalContent').innerHTML = modalContent;

                $('#addEditVehicleModal').modal('hide');
                $('#messageModal').modal();
            }
        }

        obj.open("POST", "./vehicles/addEdit", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("plate-no=" + plateNo + '&type=' + type + '&model=' + model + '&capacity=' + capacity + '&driver-first-name=' + driverFirstName + '&driver-last-name=' + driverLastName + '&availability=' + availability + '&value=' + value + '&update-type=' + updateType);
    }
}