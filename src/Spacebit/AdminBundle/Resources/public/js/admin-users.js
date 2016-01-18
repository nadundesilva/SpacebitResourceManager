function changeActiveStatus(userID, status) {
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

                var modalContent = '<div style="margin: 10px;"><p>';
                if (res == 'success') {
                    modalContent += 'User with user ID ' + userID + ' was ' + (status ? "activated" : "deactivate") + ' successfully</p><button class="btn btn-xs btn-success" onclick=\'$("#message-modal").modal("hide");\'><span class="glyphicon glyphicon-ok"></span>';

                    var button = document.getElementById('changeActiveStatusButton' + userID);
                    var activeStatusCell = document.getElementById('activeStatusCell' + userID);
                    if (status) {
                        button.className = 'btn btn-xs btn-danger';
                        button.innerHTML = '<span class="glyphicon glyphicon-remove"></span> Deactivate';
                        button.setAttribute('onclick', 'changeActiveStatus("' + userID + '", false);');
                        activeStatusCell.innerHTML = '<span style="color: #55ff5e;">Activated</span>';
                    } else {
                        button.className = 'btn btn-xs btn-success';
                        button.innerHTML = '<span class="glyphicon glyphicon-ok"></span> Activate';
                        button.setAttribute('onclick', 'changeActiveStatus("' + userID + '", true);');
                        activeStatusCell.innerHTML = '<span style="color: #ff4d54;">Deactivated</span>';
                    }
                } else {
                    modalContent += 'An error occurred in ' + (status ? "activating" : "deactivating") + ' the user with user ID ' + userID + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-xs btn-danger" onclick=\'$("#message-modal").modal("hide");\'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button></div></div>';
                document.getElementById('message-modal-content').innerHTML = modalContent;

                hideLoadingOverlay();
                $('#message-modal').modal();
            }
        }

        obj.open("POST", "./users/activate", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('user-id=' + userID + '&status=' + status);
    }
}

function showChangeAccessLevelModal(userID, accessLevel) {
    showLoadingOverlay();
    document.forms['access-level-form']['user-id'].value = userID;
    document.forms['access-level-form']['access-level'].value = accessLevel;
    $('#access-level-modal').modal();
    hideLoadingOverlay();
}

function changeAccessLevel() {
    showLoadingOverlay();
    var userID = document.forms['access-level-form']['user-id'].value;
    var accessLevel = document.forms['access-level-form']['access-level'].value;

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

                var accessLevelName = ['Guest', 'Student', 'Staff', 'Low Level Admin', 'Middle Level Admin', 'High Level Admin'];
                var modalContent = '<div style="margin: 10px;"><p>';
                if (res == 'success') {
                    modalContent += 'The access level of the user with user ID ' + userID + ' was changed to ' + accessLevelName[accessLevel] + ' successfully</p><button class="btn btn-xs btn-success" onclick=\'$("#message-modal").modal("hide");\'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occurred in changing the access level to ' + accessLevelName[accessLevel] + ' of the user with user ID ' + userID + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-xs btn-danger" onclick=\'$("#message-modal").modal("hide");\'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button></div></div>';
                document.getElementById('message-modal-content').innerHTML = modalContent;

                document.getElementById('accessLevelCell' + userID).innerHTML = accessLevelName[accessLevel] + '<br><button class="btn btn-xs btn-info" onclick="showChangeAccessLevelModal(\'' + userID + '\', ' + accessLevel + ');"><span class="glyphicon glyphicon-pencil"></span> Change</button>';

                $('#access-level-modal').modal('hide');
                hideLoadingOverlay();
                $('#message-modal').modal();
            }
        }

        obj.open("POST", "./users/changeAccessLevel", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('user-id=' + userID + '&access-level=' + accessLevel);
    }
}

function showAdministrativeRightsModal(userID) {
    document.getElementById('administrative-rights-table').innerHTML = '';
    document.getElementById('admin-rights-user-id').value = userID;
    updateAdministrativeRightsTable();
    $('#admin-rights-modal').modal();
}

function addAdministrativeRights() {
    updateAdministrativeRightsTable();
}

function removeAdministrativeRights(resourceID) {

}

function updateAdministrativeRightsTable() {
    showLoadingOverlay();
    var userID = document.getElementById('admin-rights-user-id').value;

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
                responseObject = JSON.parse(res);
                var equipment_administration = responseObject.equipment_administration;
                var venue_administration = responseObject.venue_administration;
                var vehicle_administration = responseObject.vehicle_administration;

                var modalContent = '<tr><th>Main Resource Type</th><th>Resource ID</th><th>Resource Type</th><th></th></tr>';

                for (var i = 0; i < equipment_administration.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td>Equipment</td>';
                    modalContent += '<td>' + equipment_administration[i].resource_id + '</td>';
                    modalContent += '<td>' + equipment_administration[i].equipment_type + '</td>';
                    modalContent += '<td><button class="btn btn-xs btn-danger" onclick="removeAdministrativeRights(\'' + equipment_administration[i].resource_id + '\')"><span class="glyphicon glyphicon-minus"></span></span> Remove</button></td>';
                    modalContent += '</tr>';
                }

                for (var i = 0; i < venue_administration.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td>Venues</td>';
                    modalContent += '<td>' + venue_administration[i].resource_id + '</td>';
                    modalContent += '<td>' + venue_administration[i].venue_type + '</td>';
                    modalContent += '<td><button class="btn btn-xs btn-danger" onclick="removeAdministrativeRights(\'' + venue_administration[i].resource_id + '\')"><span class="glyphicon glyphicon-minus"></span></span> Remove</button></td>';
                    modalContent += '</tr>';
                }

                for (var i = 0; i < vehicle_administration.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td>Vehicles</td>';
                    modalContent += '<td>' + vehicle_administration[i].plate_no + '</td>';
                    modalContent += '<td>' + vehicle_administration[i].type + '</td>';
                    modalContent += '<td><button class="btn btn-xs btn-danger" onclick="removeAdministrativeRights(\'' + vehicle_administration[i].plate_no + '\')"><span class="glyphicon glyphicon-minus"></span></span> Remove</button></td>';
                    modalContent += '</tr>';
                }


                modalContent += '<tr><td><div class="form-group"><select id="main-request-type" name="main-request-type" class="form-control"><option>Equipments</option><option>Venues</option><option>Vehicles</option></select></div></td><td><div class="form-group"><input type="number" id="resource-id" class="form-control" name="resource-id" /></div></td><td><div class="form-group"><input type="number" id="resource-type" class="form-control" name="resource-type" /></div></td><td><button type="submit" id="submit-button" name="submit-button" class="btn btn-sm btn-success" onclick="addAdministrativeRights();"><span class="glyphicon glyphicon-plus"></span> Add</button></td></tr>';

                document.getElementById('administrative-rights-table').innerHTML = modalContent;

                hideLoadingOverlay();
                document.getElementById('administrative-rights-table').style.display = 'none';
                document.getElementById('administrative-rights-table').style.display = 'block';
            }
        }

        obj.open("POST", "./users/getAdminRights", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('user-id=' + userID);
    }
}