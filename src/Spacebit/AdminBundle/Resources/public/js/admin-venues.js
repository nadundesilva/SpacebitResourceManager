/**
 * Created by Pasindu Tennage on 2015-12-21.
 */
function showManageVenueModal() {

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
                modalContent += '<tr><th>Resource ID</th><th>Description</th><th>Capacity</th><th>Department Name</th><th>Venue Type</th></tr>';
                for (var i = 0; i < rows.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td>' + rows[i].resource_id + '</td>';
                    modalContent += '<td>' + rows[i].description + '</td>';
                    modalContent += '<td>' + rows[i].capacity + '</td>';
                    modalContent += '<td>' + rows[i].dept_name + '</td>';
                    modalContent += '<td>' + rows[i].venue_type + '</td>';
                    modalContent += '<td><button class="btn btn-xs btn-info" onclick="showEditVenueModal(\'' + rows[i].resource_id + '\')"><span class="glyphicon glyphicon-pencil"></span>Edit</button></td>';
                    modalContent += '</tr>';
                }
                modalContent += '</table>'
                document.getElementById('manage-venues-modal-content').innerHTML = modalContent;
                hideLoadingOverlay();

                $('#manage-venues-modal').modal();
            }
        }

        obj.open("POST", "./venues/getAll", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send();
    }
}

function showAddVenueModal() {
    hideLoadingOverlay();

    document.forms['venue-add-form']['resource_id'].value = '';
    document.forms['venue-add-form']['description'].value = '';
    document.forms['venue-add-form']['capacity'].value = '';
    document.forms['venue-add-form']['closing_time'].value = '';
    document.forms['venue-add-form']['dept_name'].value = '';
    document.forms['venue-add-form']['name'].value = '';
    document.forms['venue-add-form']['opening_time'].value = '';
    document.forms['venue-add-form']['venue_type'].value = '';
    document.forms['venue-add-form']['availability'].checked = false;
    document.forms['venue-add-form']['submit-button'].value = 'Add';



    document.getElementById('addEditVenueTitle').innerHTML = 'Add Venue';
    document.forms['venue-add-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-plus"></span> Add';
    $('#manage-venues-modal').modal('hide');

    setTimeout("hideLoadingOverlay(); $('#add-edit-venue-modal').modal();", 1000);


}

function showEditVenueModal(resource_id) {
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
                var venue = JSON.parse(res).result;


                document.forms['venue-add-form']['resource_id'].value = venue.resource_id;
                document.forms['venue-add-form']['description'].value = venue.description;
                document.forms['venue-add-form']['capacity'].value = venue.capacity;
                document.forms['venue-add-form']['closing_time'].value = venue.closing_time;
                document.forms['venue-add-form']['dept_name'].value = venue.dept_name;
                document.forms['venue-add-form']['name'].value = venue.name;
                document.forms['venue-add-form']['opening_time'].value = venue.opening_time;
                document.forms['venue-add-form']['venue_type'].value = venue.venue_type;
                document.forms['venue-add-form']['availability'].checked =(venue.availability.toString()=='1')?true:false;
                document.forms['venue-add-form']['submit-button'].value = 'Edit';



                document.getElementById('addEditVenueTitle').innerHTML = 'Edit Venue';


                document.forms['venue-add-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-ok"></span> OK';
                $('#manage-venues-modal').modal('hide');
                setTimeout("hideLoadingOverlay(); $('#add-edit-venue-modal').modal();", 1000);
            }
        }

        obj.open("POST", "./venue/getByResourceID", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('resource_id=' + resource_id);
    }
}
function changeRequest(requestID) {
    //can't find the bug
    showLoadingOverlay();
    modalContent = '<button value="1" id="ApproveButton" class="btn btn-xs btn-success" onclick="EditRequest(' + requestID + ', 1)"><span class="glyphicon glyphicon-ok"></span> Approve</button> ';
    modalContent += '<button value="0" id="DeclineButton" class="btn btn-xs btn-danger" onclick="EditRequest(' + requestID + ',0)"><span class="glyphicon glyphicon-remove"></span> Decline</button> ';
    modalContent += '<button value="2" id="ApproveButton" class="btn btn-xs btn-primary" onclick="EditRequest(' + requestID + ',2)"><span class="glyphicon glyphicon-time"></span> Pending</button> ';


    document.getElementById('edit-request-div').innerHTML = modalContent;
    hideLoadingOverlay();
    $('#edit-venues-modal').modal();
}
function EditRequest(request_id,status) {
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
                    modalContent += 'Request with request id ' + request_id + ' was changed successfully</p><button class="btn btn-sm btn-success" onclick=\'$("#message-modal").modal("hide"); \'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occurred  Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger" onclick=\'$("#message-modal").modal("hide"); \'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button><div></div>';
                document.getElementById('message-modal-content').innerHTML = modalContent;

                $('#edit-venues-modal').modal('hide');

                setTimeout("hideLoadingOverlay();$('#message-modal').modal();", 1000);


                location.reload();           }
        }

        obj.open("POST", "./venues/changeRequestStatus", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("request_id=" + request_id + '&status=' + status);
    }
}


    function addEditVenue() {

        showLoadingOverlay();


    var resource_id = document.forms['venue-add-form']['resource_id'].value;
    var description= document.forms['venue-add-form']['description'].value;
    var availability = document.forms['venue-add-form']['availability'].checked;
    var capacity = document.forms['venue-add-form']['capacity'].value;
    var closing_time= document.forms['venue-add-form']['closing_time'].value;
    var dept_name = document.forms['venue-add-form']['dept_name'].value;
    var name = document.forms['venue-add-form']['name'].value;
    var opening_time = document.forms['venue-add-form']['opening_time'].value;
    var venue_type = document.forms['venue-add-form']['venue_type'].value;

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
                    modalContent += 'Venue with resource id ' + resource_id + ' was ' + (updateType == "Add" ? "added" : "edited") + ' successfully</p><button class="btn btn-sm btn-success" onclick=\'$("#message-modal").modal("hide"); showManageVenueModal();\'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occurred in ' + (updateType == "Add" ? "adding" : "editing") + ' the venue with Resource ID ' + resource_id + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger" onclick=\'$("#message-modal").modal("hide"); showManageVenueModal();\'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button><div></div>';
                document.getElementById('message-modal-content').innerHTML = modalContent;

                $('#add-edit-venue-modal').modal('hide');
                setTimeout("hideLoadingOverlay();  $('#message-modal').modal();", 1000);


            }
        }

        obj.open("POST", "./venues/addEdit", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("resource_id=" + resource_id+   '&availability=' + availability + '&description=' + description + '&capacity=' + capacity +  '&closing_time=' + closing_time + '&dept_name=' + dept_name + '&name=' + name +'&opening_time=' + opening_time +'&venue_type=' + venue_type + '&update-type=' + updateType);
    }
}