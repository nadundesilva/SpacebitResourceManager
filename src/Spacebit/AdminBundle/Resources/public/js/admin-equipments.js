/**
 * Created by Pasindu Tennage on 2015-12-21.
 */
function showManageEquipmentsModal() {
    var obj;
    showLoadingOverlay();
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
                document.getElementById('manage-equipments-modal-content').innerHTML = modalContent;
                hideLoadingOverlay();
                $('#manage-equipments-modal').modal();
            }
        }

        obj.open("POST", "./equipment/getAll", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send();
    }
}

function showAddEquipmentModal() {
    showLoadingOverlay();

    document.forms['equipment-add-form']['resource_id'].value = '';
    document.forms['equipment-add-form']['description'].value = '';
    document.forms['equipment-add-form']['equipment_type'].value = '';
    document.forms['equipment-add-form']['department_name'].value = '';

    document.forms['equipment-add-form']['submit-button'].value = 'Add';

    document.forms['equipment-add-form']['value'].value = '';
    document.forms['equipment-add-form']['availability'].checked = false;


    document.getElementById('addEditEquipmentTitle').innerHTML = 'Add Equipment';
    document.forms['equipment-add-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-plus"></span> Add';
    $('#manage-equipments-modal').modal('hide');
    setTimeout("hideLoadingOverlay(); $('#add-edit-equipment-modal').modal();", 1000);

}

function showEditEquipmentModal(resource_id) {
    var obj;
    showLoadingOverlay();
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
                document.forms['equipment-add-form']['resource_id'].readonly="readonly";


                document.forms['equipment-add-form']['equipment_type'].value = equipment.equipment_type;
                document.forms['equipment-add-form']['value'].value = equipment.value;
                document.forms['equipment-add-form']['availability'].checked = (equipment.availability.toString()=='1')? true:false;
                document.forms['equipment-add-form']['description'].value = equipment.description;
                document.forms['equipment-add-form']['department_name'].value = equipment.department_name;
                document.forms['equipment-add-form']['submit-button'].value="Edit";

                document.getElementById('addEditEquipmentTitle').innerHTML = 'Edit Equipment';
                document.forms['equipment-add-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-ok"></span> OK';
                $('#manage-equipments-modal').modal('hide');
                setTimeout("hideLoadingOverlay(); $('#add-edit-equipment-modal').modal();", 1000);

            }
        }

        obj.open("POST", "./equipment/getByResourceID", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('resource_id=' + resource_id);
    }
}

function changeRequest(requestId,department_name,type) {
    var obj;
    showLoadingOverlay();

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

                var modalContent = '';
                for (var i = 0; i < rows.length; i++) {
                    modalContent += '<option value="'+rows[i].resource_id+'">'+rows[i].resource_id+'</option>';
                }

                document.getElementById('select_equipment').innerHTML = modalContent;
                document.getElementById('accept_equipment_request_id').innerHTML = requestId+'';
                hideLoadingOverlay();
                $('#accept-equipment-modal').modal();

            }
        }

        obj.open("POST", "./equipment/getByResourceType", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        obj.send('department_name=' + department_name + '&type=' + type );
    }

}

function EditRequest(status){
    showLoadingOverlay();
    $('#accept-equipment-modal').modal('hide');
    var request_id = document.getElementById('accept_equipment_request_id').value;
    var resource_id = document.getElementById('select_equipment').value;


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
                    modalContent += 'Request with request id ' + request_id + ' was changed successfully</p><button class="btn btn-sm btn-success" onclick=\'$("#message-modal").modal("hide"); \'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occurred  Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger" onclick=\'$("#message-modal").modal("hide"); \'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button><div></div>';
               document.getElementById('message-modal-content').innerHTML = modalContent;

                $('#edit-equipments-modal').modal('hide');
                setTimeout("hideLoadingOverlay(); $('#message-modal').modal();", 1000);
                location.reload();
            }
        }

        obj.open("POST", "./equipment/changeRequestStatus", true);
       obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("request_id=" + request_id+ '&status=' + status+ '&resource_id=' + resource_id );
    }
}

function addEditEquipment() {

    showLoadingOverlay();
    var resource_id = document.forms['equipment-add-form']['resource_id'].value;
    var description= document.forms['equipment-add-form']['description'].value;
    var equipment_type = document.forms['equipment-add-form']['equipment_type'].value;
    var value = document.forms['equipment-add-form']['value'].value;
    var availability = document.forms['equipment-add-form']['availability'].checked;

    var department_name = document.forms['equipment-add-form']['department_name'].value;
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
            } else if (obj.readyState == 4) {
                var res = obj.responseText;
    alert(res);
                var modalContent = '<div style="margin: 10px;"><p>';
                if (res == 'success') {
                    modalContent += 'Equipment with resource id ' + resource_id + ' was ' + (updateType == "Add" ? "added" : "edited") + ' successfully</p><button class="btn btn-sm btn-success" onclick=\'$("#message-modal").modal("hide"); showManageEquipmentsModal();\'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occurred in ' + (updateType == "Add" ? "adding" : "editing") + ' the equipment with Resource ID ' + resource_id + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger" onclick=\'$("#message-modal").modal("hide"); showManageEquipmentsModal();\'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button><div></div>';
                document.getElementById('message-modal-content').innerHTML = modalContent;

                $('#add-edit-equipment-modal').modal('hide');
                setTimeout("hideLoadingOverlay(); $('#message-modal').modal();", 1000);

            }
        }

        obj.open("POST", "./equipment/addEdit", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("resource_id=" + resource_id+ '&equipment_type=' + equipment_type + '&department_name=' + department_name +  '&availability=' + availability + '&value=' + value + '&description=' + description + '&update-type=' + updateType);
    }
}