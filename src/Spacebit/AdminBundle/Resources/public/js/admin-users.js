function changeActiveStatus(userID, status) {
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
                    modalContent += 'User with user ID ' + userID + ' was ' + (status ? "activated" : "deactivate") + ' successfully</p><button class="btn btn-xs btn-success" onclick=\'$("#messageModal").modal("hide");\'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occurred in ' + (status ? "activating" : "deactivating") + ' the user with user ID ' + userID + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-xs btn-danger" onclick=\'$("#messageModal").modal("hide");\'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button></div></div>';
                document.getElementById('messageModalContent').innerHTML = modalContent;

                $('#messageModal').modal();

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
            }
        }

        obj.open("POST", "./users/activate", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('user-id=' + userID + '&status=' + status);
    }
}

function showChangeAccessLevelModal(userID, accessLevel) {
    document.forms['access-level-form']['user-id'].value = userID;
    document.forms['access-level-form']['access-level'].value = accessLevel;
    $('#accessLevelModal').modal();
}

function changeAccessLevel() {
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
                    modalContent += 'The access level of the user with user ID ' + userID + ' was changed to ' + accessLevelName[accessLevel] + ' successfully</p><button class="btn btn-xs btn-success" onclick=\'$("#messageModal").modal("hide");\'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occurred in changing the access level to ' + accessLevelName[accessLevel] + ' of the user with user ID ' + userID + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-xs btn-danger" onclick=\'$("#messageModal").modal("hide");\'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button></div></div>';
                document.getElementById('messageModalContent').innerHTML = modalContent;

                $('#accessLevelModal').modal('hide');
                $('#messageModal').modal();

                document.getElementById('accessLevelCell' + userID).innerHTML = accessLevelName[accessLevel] + '<br><button class="btn btn-xs btn-info" onclick="showChangeAccessLevelModal(\'' + userID + '\', ' + accessLevel + ');"><span class="glyphicon glyphicon-pencil"></span> Change</button>';
            }
        }

        obj.open("POST", "./users/changeAccessLevel", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('user-id=' + userID + '&access-level=' + accessLevel);
    }
}