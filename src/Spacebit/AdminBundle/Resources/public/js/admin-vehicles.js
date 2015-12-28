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
                    modalContent += '<td><button class="btn btn-xs btn-info" onclick="showEditVehicleModal(\'' + rows[i].plate_no + '\')"><span class="glyphicon glyphicon-pencil"></span></span> Edit</button></td>';
                    modalContent += '</tr>';
                }
                modalContent += '</table>'
                document.getElementById('manage-vehicles-modal-content').innerHTML = modalContent;
                $('#manage-vehicles-modal').modal();
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

    document.getElementById('addEditVehicleTitle').innerHTML = 'Add Vehicle';
    document.forms['vehicle-add-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-plus"></span> Add';
    $('#manage-vehicles-modal').modal('hide');
    $('#add-edit-vehicle-modal').modal();
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

                document.getElementById('addEditVehicleTitle').innerHTML = 'Edit Vehicle';
                document.forms['vehicle-add-form']['submit-button'].innerHTML = '<span class="glyphicon glyphicon-ok"></span> OK';
                $('#manage-vehicles-modal').modal('hide');
                $('#addEditVehicleModal').modal();
            }
        }

        obj.open("POST", "./vehicles/getByPlateNo", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('plate-no=' + plateNo);
    }
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
                    modalContent += 'Vehicle with plate number ' + plateNo + ' was ' + (updateType == "Add" ? "added" : "edited") + ' successfully</p><button class="btn btn-sm btn-success" onclick=\'$("#message-modal").modal("hide"); showManageVehiclesModal();\'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occurred in ' + (updateType == "Add" ? "adding" : "editing") + ' the vehicle with plate number ' + plateNo + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger" onclick=\'$("#message-modal").modal("hide"); showManageVehiclesModal();\'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button></div></div>';
                document.getElementById('message-modal-content').innerHTML = modalContent;

                $('#add-edit-vehicle-modal').modal('hide');
                $('#message-modal').modal();
            }
        }

        obj.open("POST", "./vehicles/addEdit", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("plate-no=" + plateNo + '&type=' + type + '&model=' + model + '&capacity=' + capacity + '&driver-first-name=' + driverFirstName + '&driver-last-name=' + driverLastName + '&availability=' + availability + '&value=' + value + '&update-type=' + updateType);
    }
}

function showEditVehicleRequestModal(requestID, routeGroupID, requester, requestedDate, requestedTime, noOfPassengers, requestedVehicleType, requestedDestination, status) {
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
                var vehicles = JSON.parse(res).vehicles;
                var routeGroups = JSON.parse(res).group_names;

                document.forms['request-status-form']['request-id'].value = requestID;
                document.forms['request-status-form']['requester'].value = requester;
                document.forms['request-status-form']['requested-date'].value = requestedDate;
                document.forms['request-status-form']['requested-time'].value = requestedTime;
                document.forms['request-status-form']['no-of-passengers'].value = noOfPassengers;
                document.forms['request-status-form']['vehicle-type'].value = requestedVehicleType;
                document.forms['request-status-form']['requested-destination'].value = requestedDestination;
                document.forms['request-status-form']['route-group-id'].value = routeGroupID;
                document.forms['request-status-form']['request-status'].value = status;
                document.getElementById('requested-destination-view-location').setAttribute("onClick", "javascript: viewLocation('" + requestedDestination + "');");

                if (routeGroups.length > 0) {
                    var options = '';
                    for (var i = 0; i < routeGroups.length; i++) {
                        options += '<option>' + routeGroups[i].group_id + '</option>';
                    }
                    document.getElementById('route-group-id').innerHTML = options;

                    updateRouteTable();
                    document.forms['request-status-form']['route-assign-method'].value = 'existing';
                    document.getElementById('existing-route-selection').style.display = "block";
                    document.getElementById('existing-route-selection-division').style.display = "block";
                    document.getElementById('new-route-division').style.display = "none";
                } else {
                    document.forms['request-status-form']['route-assign-method'].value = 'new';
                    document.getElementById('existing-route-selection').style.display = "none";
                    document.getElementById('existing-route-selection-division').style.display = "none";
                    document.getElementById('new-route-division').style.display = "block";
                }
                if (vehicles.length > 0) {
                    var options = '';
                    for (var i = 0; i < vehicles.length; i++) {
                        options += '<option>' + vehicles[i].plate_no + '</option>';
                    }
                    document.getElementById('route-selection-radio-button-container').style.display = "block";
                    document.getElementById('new-route-vehicle-plate-no').innerHTML = options;
                    document.getElementById('no-vehicles-message').style.display = "none";
                    document.forms['request-status-form']['vehicle-request-submit-button'].disabled = false;
                } else {
                    document.getElementById('route-selection-radio-button-container').style.display = "none";
                    document.getElementById('existing-route-selection-division').style.display = "none";
                    document.getElementById('new-route-division').style.display = "none";
                    document.getElementById('no-vehicles-message').style.display = "block";
                    document.forms['request-status-form']['vehicle-request-submit-button'].disabled = true;
                }

                viewLocation(requestedDestination);

                $('#edit-vehicle-request-modal').modal();
            }
        }

        obj.open("POST", "./vehicles/requests/getAllGroupNamesAndVehicles", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("requested-type=" + requestedVehicleType + '&requested-date=' + requestedDate);
    }
}

function routeSelectionMethodOnClick() {
    var elem = document.forms['request-status-form']["route-assign-method"];
    if(elem.value == "new") {
        document.getElementById('existing-route-selection-division').style.display = "none";
        document.getElementById('new-route-division').style.display = "block";
    }
    if(elem.value == "existing") {
        document.getElementById('existing-route-selection-division').style.display = "block";
        document.getElementById('new-route-division').style.display = "none";
    }
}

function updateRouteTable() {
    document.getElementById('locations-table').innerHTML = '';
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
                var route = JSON.parse(res).result;

                if (route != false) {
                    var tableContent = '<tr><th>Town</th><th>Time</th><th></th></tr>';
                    for (var i = 0; i < route.length; i++) {
                        tableContent += '<tr>';
                        tableContent += '<td>' + route[i].requested_town + '</td>';
                        tableContent += '<td>' + route[i].time + '</td>';
                        tableContent += '<td><button type="button" class="btn btn-xs btn-info" onclick=\'viewLocation("' + route[i].requested_town + '");\'><span class="glyphicon glyphicon-globe"></span> View in map</button></td>';
                        tableContent += '</tr>';
                    }
                    document.getElementById('locations-table').innerHTML = tableContent;
                } else {
                    document.getElementById('locations-table').innerHTML = '';
                }
            }
        }

        obj.open("POST", "./vehicles/requests/getRouteByGroupID", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send('group-id=' + document.forms['request-status-form']["route-group-id"].value);
    }
}

function changeVehicleRequest() {
    var status = document.forms['request-status-form']['request-status'].value;
    if (status == 2) { return; }
    var requestID = document.forms['request-status-form']["request-id"].value;
    var routeAssignMethod = document.forms['request-status-form']["route-assign-method"].value;

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
                    modalContent += 'Vehicle request with request ID ' + requestID + ' was ' + status + ' successfully</p><button class="btn btn-sm btn-success" onclick=\'location.reload();\'><span class="glyphicon glyphicon-ok"></span>';
                } else {
                    modalContent += 'An error occurred in ' + (status == 1 ? "Accepting" : "Declining") + ' the vehicle request with request ID ' + requestID + '. Sorry for the inconvenience.</p><div style="text-align: center;"><button class="btn btn-sm btn-danger" onclick=\'location.reload();\'><span class="glyphicon glyphicon-warning-sign"></span>';
                }
                modalContent += ' Ok</button></div></div>';
                document.getElementById('message-modal-content').innerHTML = modalContent;

                $('#edit-vehicle-request-modal').modal('hide');
                $('#message-modal').modal();
            }
        }

        var parameters = 'request-id=' + requestID + '&status=' + status + '&route-assign-method=' + routeAssignMethod;
        if (routeAssignMethod == 'new') {
            parameters += '&plate-no=' + document.forms['request-status-form']["new-route-vehicle-plate-no"].value;
        } else {
            parameters += '&group-id=' + document.forms['request-status-form']["route-group-id"].value;
        }

        obj.open("POST", "./vehicles/requests/change", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send(parameters);
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

    $("#edit-vehicle-request-modal").on('shown.bs.modal', function(){
        google.maps.event.trigger(map, 'resize')
    });
}
google.maps.event.addDomListener(window, 'load', initialize);

function viewLocation(address) {
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

                    document.getElementById('location-name').innerHTML = address;

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