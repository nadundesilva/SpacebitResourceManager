function loadVehiclesByCategory(category) {
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
                var rows = JSON.parse(res).result;

                var modalContent = '<h2 style="text-align: center;">' + category.charAt(0).toUpperCase() + category.slice(1) + '</h2><table class="table table-hover">';
                modalContent += '<button class="btn btn-sm btn-primary" style="margin: 10px;" onclick="showAddRequestModal(\'' + category + '\');"><span class="glyphicon glyphicon-plus"></span> Request ' + (category == 'Other' ? 'Vehicles' : category) + '</button>';
                modalContent += '<tr><th>License Plate No</th><th>Model</th><th>Capacity</th><th>Driver</th>' + (category == 'Other' ? '<th>Type</th>' : '') + '</tr>';
                for (var i = 0; i < rows.length; i++) {
                    modalContent += '<tr>';
                    modalContent += '<td>' + rows[i].plate_no + '</td>';
                    modalContent += '<td>' + rows[i].model + '</td>';
                    modalContent += '<td>' + rows[i].capacity + '</td>';
                    modalContent += '<td>' + rows[i].driver_first_name + ' ' + rows[i].driver_last_name + '</td>';
                    if(category == 'Other') {
                        modalContent += '<td>' + rows[i].type + '</td>';
                    }
                    modalContent += '</tr>';
                }
                modalContent += '</table>';

                document.getElementById('vehicles-modal-content').innerHTML = modalContent;
                hideLoadingOverlay();
                $('#vehicles-modal').modal();
            }
        }

        obj.open("POST", "./vehicles/getByCategory", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("category=" + encodeURIComponent(category));
    }
}

function showAddRequestModal(category) {
    showLoadingOverlay();
    document.forms['request-form']['request-date'].value = '';
    document.forms['request-form']['request-time'].value = '';
    document.forms['request-form']['request-vehicle-type'].value = (category == 'Other' ? '' : category);
    document.forms['request-form']['request-passenger-count'].value = '';
    document.forms['request-form']['request-destination'].value = '';
    document.getElementById('request-modal-title').innerHTML = 'Request a Vehicle';
    document.getElementById('back-button').style.display= 'none';
    document.getElementById('request-id-container').style.display = 'none';
    document.forms['request-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-plus"></span> Request';
    document.forms['request-form']['submit-button'].value = "Add";
    $('#vehicles-modal').modal('hide');
    setTimeout("hideLoadingOverlay(); $('#request-modal').modal();", 1000);
}

function showEditPastRequestModal(requestID, date, time, noOfPassengers, requestedTown, requestedType) {
    showLoadingOverlay();
    document.forms['request-form']['request-id'].value = requestID;
    document.forms['request-form']['request-date'].value = date;
    document.forms['request-form']['request-time'].value = time;
    document.forms['request-form']['request-vehicle-type'].value = requestedType;
    document.forms['request-form']['request-passenger-count'].value = noOfPassengers;
    document.forms['request-form']['request-destination'].value = requestedTown;
    document.getElementById('request-modal-title').innerHTML = 'Edit Past Request';
    document.getElementById('back-button').style.display= 'block';
    document.getElementById('request-id-container').style.display = 'block';
    document.forms['request-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-ok"></span> Ok';
    document.forms['request-form']['submit-button'].value = "Edit";
    search();
    $('#past-requests-modal').modal('hide');
    setTimeout("hideLoadingOverlay(); $('#request-modal').modal();", 1000);
}

function addEditRequest() {
    showLoadingOverlay();
    var date = document.forms["request-form"]["request-date"].value;
    var time = document.forms["request-form"]["request-time"].value;
    var vehicleType = document.forms["request-form"]["request-vehicle-type"].value;
    var passengerCount = document.forms["request-form"]["request-passenger-count"].value;
    var destination = document.forms["request-form"]["request-destination"].value;
    var updateType = document.forms["request-form"]["submit-button"].value;

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
                    modalContent += 'You request was ' + (updateType == 'Add' ? 'added' : 'edited') + ' successfully. An admin will review your request and accept it if possible</p><button class="btn btn-sm btn-success"';
                } else {
                    modalContent += 'An error occured in ' + (updateType == 'Add' ? 'adding' : 'editing') + ' your request. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger"';
                }
                modalContent += ' onclick=\'$("#vehicles-modal").modal("hide");\'>Ok</button><div></div>';
                document.getElementById('vehicles-modal-content').innerHTML = modalContent;

                $('#request-modal').modal('hide');
                setTimeout("hideLoadingOverlay(); $('#vehicles-modal').modal();", 1000);
            }
        }

        obj.open("POST", "./vehicles/addEditRequest", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var parameters = "date=" + encodeURIComponent(date) + '&time=' + encodeURIComponent(time) + '&vehicle-type=' + encodeURIComponent(vehicleType) + '&passenger-count=' + encodeURIComponent(passengerCount) + '&destination=' + encodeURIComponent(destination) + '&update-type=' + encodeURIComponent(updateType);
        if (updateType == 'Edit') {
            parameters += '&request-id=' + encodeURIComponent(document.forms["request-form"]["request-id"].value);
        }
        obj.send(parameters);
    }
}

function onAddRequestFormKeyPress(e) {
    if(e.keyCode == 13) {
        addRequest();
    }
}

var mapCanvas;
var map;
function initialize() {
    mapCanvas = document.getElementById("google-map");
    var mapOptions = {
        center:new google.maps.LatLng(10, 78),
        zoom:7,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);

    $("#request-modal").on('shown.bs.modal', function(){
        google.maps.event.trigger(map, 'resize')
    });
}
google.maps.event.addDomListener(window, 'load', initialize);

function search() {
    var address = document.forms["request-form"]["request-destination"].value;
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
                var result = JSON.parse(res);
                if(result.status == 'OK') {
                    var longitude = result.results[0].geometry.location.lng;
                    var latitude = result.results[0].geometry.location.lat;

                    var mapOptions = {
                        center: new google.maps.LatLng(latitude, longitude),
                        zoom: 10,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    var map = new google.maps.Map(mapCanvas, mapOptions);

                    var iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(latitude, longitude),
                        map: map,
                        icon: iconBase + 'red-circle.png'
                    });
                }
            }
        }

        obj.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address=" + address, true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send();
    }
}

function showPastRequestsModal() {
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
                var result = JSON.parse(res).result;

                var pastRequestsTableContent = '<tr><th>Request ID</th><th>Date</th><th>Time</th><th>Number of Passengers</th><th>Destination</th><th>Requested Type</th><th>Assigned Vehicle</th><th>Status</th><th></th></tr>';
                for(var i = 0; i < result.length; i++) {
                    pastRequestsTableContent += '<tr><td>' + result[i].request_id + '</td>'
                    pastRequestsTableContent += '<td>' + result[i].date + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].time + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].number_of_passengers + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].requested_town + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].requested_type + '</td>';
                    pastRequestsTableContent += '<td>' + result[i].vehicle_plate_no + '</td>';
                    if (result[i].status == 0) {
                        pastRequestsTableContent += '<td style = "color: #ff4d54;">Declined</td><td></td>';
                    } else if (result[i].status == 1) {
                        pastRequestsTableContent += '<td style = "color: #1dff46;">Accepted</td><td></td>';
                    } else {
                        pastRequestsTableContent += '<td style = "color: #624cff;">Pending</td>';
                        if (Date.parse(result[i].date) > Date.now()) {
                            pastRequestsTableContent += '<td><button class="btn btn-xs btn-primary" onclick="showEditPastRequestModal(\'' + result[i].request_id + '\', \'' + result[i].date + '\', \'' + result[i].time + '\', \'' + result[i].number_of_passengers + '\', \'' + result[i].requested_town + '\', \'' + result[i].requested_type + '\');"><span class="glyphicon glyphicon-pencil"></span> Edit</button></td>';
                        } else {
                            pastRequestsTableContent += '<td></td>';
                        }
                    }
                }

                document.getElementById('past-request-table-content').innerHTML = pastRequestsTableContent;
                hideLoadingOverlay();
                $('#past-requests-modal').modal();
            }
        }

        obj.open("GET", "./vehicles/getPastRequests", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send();
    }
}