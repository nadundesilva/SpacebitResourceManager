/**
 * Created by Pasindu Tennage on 2015-12-21.
 */
function showManageVenueModal() {
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
                modalContent += '<tr><th>Resource ID</th><th>Description</th><th>Availability</th><th>Capacity</th><th>Closing Time</th><th>Department Name</th><th>Name</th><th>Opening Time</th><th>Venue Type</th></tr>';
                for (var i = 0; i < rows.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td>' + rows[i].resource_id + '</td>';
                    modalContent += '<td>' + rows[i].description + '</td>';
                    modalContent += '<td>' + rows[i].availability + '</td>';
                    modalContent += '<td>' + rows[i].capacity + '</td>';
                    modalContent += '<td>' + rows[i].closing_time + '</td>';
                    modalContent += '<td>' + rows[i].dept_name + '</td>';
                    modalContent += '<td>' + rows[i].name + '</td>';
                    modalContent += '<td>' + rows[i].opening_time + '</td>';
                    modalContent += '<td>' + rows[i].venue_type + '</td>';
                    modalContent += '<td><button class="btn btn-xs btn-info" onclick="showEditEquipmentModal(\'' + rows[i].resource_id + '\')"><span class="glyphicon glyphicon-pencil"></span>Edit</button></td>';
                    modalContent += '</tr>';
                }
                modalContent += '</table>'
                document.getElementById('manage-venues-modal-contentt').innerHTML = modalContent;
                $('#manage-equipments-modal').modal();
            }
        }

        obj.open("POST", "./venues/getAll", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send();
    }
}

function showAddVenueModal() {
    document.forms['venue-add-form']['resource_id'].value = '';
    document.forms['venue-add-form']['description'].value = '';
    document.forms['venue-add-form']['capacity'].value = '';
    document.forms['venue-add-form']['closing_time'].value = '';
    document.forms['venue-add-form']['dept_name'].value = '';
    document.forms['venue-add-form']['name'].value = '';
    document.forms['venue-add-form']['opening_time'].value = '';
    document.forms['venue-add-form']['venue_type'].value = '';
    document.forms['venue-add-form']['availability'].checked = false;


    document.getElementById('addEditVenueTitle').innerHTML = 'Add Venue';
    document.forms['venue-add-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-plus"></span> Add';
    $('#manage-venues-modal').modal('hide');
    $('#add-edit-venue-modal').modal();
}

function showEditVenueModal(resource_id) {
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
                var venue = JSON.parse(res).result;

                document.forms['venue-add-form']['resource_id'].value = '';
                document.forms['venue-add-form']['description'].value = '';
                document.forms['venue-add-form']['capacity'].value = '';
                document.forms['venue-add-form']['closing_time'].value = '';
                document.forms['venue-add-form']['dept_name'].value = '';
                document.forms['venue-add-form']['name'].value = '';
                document.forms['venue-add-form']['opening_time'].value = '';
                document.forms['venue-add-form']['venue_type'].value = '';
                document.forms['venue-add-form']['availability'].checked = false;


                document.getElementById('addEditVenueTitle').innerHTML = 'Add Venue';


                document.forms['venue-add-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-ok"></span> OK';
                $('#manage-venues-modal').modal('hide');
                $('#add-edit-venue-modal').modal();
            }
        }

        obj.open("POST", "./venue/getByResourceID", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('resource_id=' + resource_id);
    }
}

function changeRequest(requestId) {
    $('#edit-venues-modal').modal();
}

function addEditVenue() {

    var resource_id = document.forms['venue-add-form']['resource_id'].value;
    var description= document.forms['venue-add-form']['description'].value;
    var availability = document.forms['venue-add-form']['availability'].value;
    var availability = document.forms['venue-add-form']['capacity'].value;
    var availability = document.forms['venue-add-form']['closing_time'].value;
    var availability = document.forms['venue-add-form']['dept_name'].value;
    var availability = document.forms['venue-add-form']['name'].value;
    var availability = document.forms['venue-add-form']['opening_time'].value;
    var availability = document.forms['venue-add-form']['venue_type'].value;

    var updateType = document.forms['venue-add-form']['submit-button'].value;
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
                    modalContent += 'Venue with resource id ' + resource_id + ' was ' + (updateType == "Add" ? "added" : "edited") + ' successfully</p><button class="btn btn-sm btn-success" onclick=\'$("#message-modal").modal("hide"); showManageVenuesModal();\'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occurred in ' + (updateType == "Add" ? "adding" : "editing") + ' the venue with Resource ID ' + resource_id + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger" onclick=\'$("#message-modal").modal("hide"); showManageVenuesModal();\'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button><div></div>';
                document.getElementById('message-modal-content').innerHTML = modalContent;

                $('#add-edit-venue-modal').modal('hide');
                $('#message-modal').modal();
            }
        }

        obj.open("POST", "./venue/addEdit", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("resource_id=" + resource_id+   '&availability=' + availability + '&description=' + description + '&capacity=' + capacity +  '&closing_time=' + closing_time + '&dept_name=' + dept_name + '&name=' + name +'&opening_time=' + opening_time +'&venue_type=' + venue_type + '&update-type=' + updateType);
    }
}