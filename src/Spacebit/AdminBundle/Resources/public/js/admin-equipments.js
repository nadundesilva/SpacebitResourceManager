/**
 * Created by Pasindu Tennage on 2015-12-21.
 */
function showManageEquipmentModal() {
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
                modalContent += '<tr><th>Resource ID</th><th>Description</th><th>Value</th><th>Type</th></tr>';
                for (var i = 0; i < rows.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td>' + rows[i].resource_id + '</td>';
                    modalContent += '<td>' + rows[i].description + '</td>';
                    modalContent += '<td>' + rows[i].value + '</td>';
                    modalContent += '<td>' + rows[i].equipment_type + '</td>';
                    modalContent += '<td><button class="btn btn-xs btn-info" onclick="showEditEquipmentModal(\'' + rows[i].resource_id + '\')"><span class="glyphicon glyphicon-pencil"></span> Edit</button></td>';
                    modalContent += '</tr>';
                }
                modalContent += '</table>'
                document.getElementById('manageEquipmentsModalContent').innerHTML = modalContent;
                $('#manageEquipmentsModal').modal();
            }
        }

        obj.open("POST", "./equipment/getAll", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send();
    }
}

function showAddEquipmentModal() {
    document.forms['equipment-add-form']['resource_id'].value = '';
    document.forms['equipment-add-form']['description'].value = '';
    document.forms['equipment-add-form']['equipment_type'].value = '';

    document.forms['equipment-add-form']['value'].value = '';
    document.forms['equipment-add-form']['availability'].checked = false;


    document.getElementById('addEditEquipmentTitle').innerHTML = 'Add Equipment';
    document.forms['equipment-add-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-plus"></span> Add';
    $('#manageEquipmentsModal').modal('hide');
    $('#addEditEquipmentModal').modal();
}

function showEditEquipmentModal(resource_id) {
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
                var equipment = JSON.parse(res).result;

                document.forms['equipment-add-form']['resource_id'].value = equipment.resource_id;

                document.forms['equipment-add-form']['equipment_type'].value = equipment.equipment_type;
                document.forms['equipment-add-form']['value'].value = equipment.value;
                document.forms['equipment-add-form']['availability'].checked = equipment.availability;
                document.forms['equipment-add-form']['description'].checked = equipment.description;

                document.getElementById('addEditEquipmentTitle').innerHTML = 'Edit Equipment';
                document.forms['equipment-add-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-pencil"></span> Edit';
                $('#manageEquipmentsModal').modal('hide');
                $('#addEditEquipmentModal').modal();
            }
        }

        obj.open("POST", "./equipment/getByResourceID", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('resource_id=' + resource_id);
    }
}

function changeRequest(requestId) {
    $('#editEquipmentsModal').modal();
}

function addEditEquipment() {
    var resource_id = document.forms['equipment-add-form']['resource_id'].value;
    var description= document.forms['equipment-add-form']['description'].value;
    var equipment_type = document.forms['equipment-add-form']['equipment_type'].value;
    var value = document.forms['equipment-add-form']['value'].value;
    var availability = document.forms['equipment-add-form']['availability'].value;
    var updateType = document.forms['equipment-add-form']['submit-button'].value;
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
                    modalContent += 'Equipment with resource id ' + resource_id + ' was ' + (updateType == "Add" ? "added" : "edited") + ' successfully</p><button class="btn btn-sm btn-success" onclick=\'$("#messageModal").modal("hide"); showManageEquipmentsModal();\'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occured in ' + (updateType == "Add" ? "adding" : "editing") + ' the equipment with plate number ' + resource_id + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger" onclick=\'$("#messageModal").modal("hide"); showManageEquipmentsModal();\'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button><div></div>';
                document.getElementById('messageModalContent').innerHTML = modalContent;

                $('#addEditEquipmentModal').modal('hide');
                $('#messageModal').modal();
            }
        }

        obj.open("POST", "./equipment/addEdit", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("resource_id=" + resource_id+ '&equipment_type=' + type +  '&availability=' + availability + '&value=' + value + '&description=' + description + '&update-type=' + updateType);
    }
}