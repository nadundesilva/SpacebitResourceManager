function showDiv(elem){

    if(elem.value == "student") {
        document.getElementById('studentDivision').style.display = "block";
        document.getElementById('staffDivision').style.display = "none";
        document.getElementById('guestDivision').style.display = "none";
        document.getElementById('departmentDivision').style.display = "block";
        document.getElementById("batch").required = true;
        document.getElementById("department").required = true;
        document.getElementById("designation").required = false;
        document.getElementById("title").required = false;
        document.getElementById("organizationEmail").required = false;
        document.getElementById("organizationTelephone").required = false;
        document.getElementById("nic").required = false;
        document.getElementById("organizationAddress").required = false;
        loadDepartments();
    }
    if(elem.value == "staff") {
        document.getElementById('staffDivision').style.display = "block";
        document.getElementById('studentDivision').style.display = "none";
        document.getElementById('guestDivision').style.display = "none";
        document.getElementById('departmentDivision').style.display = "block";

        document.getElementById("batch").required = false;
        document.getElementById("department").required = true;
        document.getElementById("designation").required = true;
        document.getElementById("title").required = false;
        document.getElementById("organizationEmail").required = false;
        document.getElementById("organizationTelephone").required = false;
        document.getElementById("nic").required = false;
        document.getElementById("organizationAddress").required = false;

        loadDepartments();
    }
    if(elem.value == "guest") {
        document.getElementById('guestDivision').style.display = "block";
        document.getElementById('studentDivision').style.display = "none";
        document.getElementById('staffDivision').style.display = "none";
        document.getElementById('departmentDivision').style.display = "none";

        document.getElementById("batch").required = false;
        document.getElementById("department").required = false;
        document.getElementById("designation").required = false;
        document.getElementById("title").required = true;
        document.getElementById("organizationEmail").required = true;
        document.getElementById("organizationTelephone").required = true;
        document.getElementById("nic").required = true;
        document.getElementById("organizationAddress").required = true;
    }
}

function addNewUser() {
    showLoadingOverlay();
    var obj;

    var userID = document.getElementById("userID").value;
    var firstName = document.getElementById("firstName").value;
    var middleName = document.getElementById("middleName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var telephoneNumber = document.getElementById("telephoneNumber").value;
    var passwordOne = document.getElementById("passwordOne").value;
    var passwordTwo = document.getElementById("passwordTwo").value;
    var accessLevel = document.getElementById("accessLevel").value;
    var batch;
    var designation;
    var department;
    var title;
    var organizationEmail;
    var organizationTelephone;
    var nic;
    var organizationAddress;

    if (  String(userID).length>15 || String(userID).length ==0){
        $('#userID-modal').modal();
        hideLoadingOverlay();
        return;
    }
    if (  String(firstName).length>35 || String(middleName).length>35  || String(lastName).length>35 ){
        $('#name-modal').modal();
        hideLoadingOverlay();
        return;
    }
    if (  String(email).length>255 ){
        $('#email-modal').modal();
        hideLoadingOverlay();
        return;
    }
    if (  String(telephoneNumber).length>10 || String(telephoneNumber).length<9 ){
        $('#telephoneNumber-modal').modal();
        hideLoadingOverlay();
        return;
    }
    if (  String(passwordOne) !=  String(passwordTwo) || String(passwordOne).length>128  ){
        $('#password-modal').modal();
        hideLoadingOverlay();
        document.getElementById("passwordOne").value = "";
        document.getElementById("passwordTwo").value = "";
        return;
    }

    if(accessLevel == "student") {
        accessLevel = 1;
        batch = document.getElementById("batch").value;
        department = document.getElementById("department").value;

        if (  String(batch).length != 2 ){
            $('#batch-modal').modal();
            hideLoadingOverlay();
            return;
        }
    }
    if(accessLevel == "staff") {
        accessLevel = 2;
        designation = document.getElementById("designation").value;
        department = document.getElementById("department").value;

        if (  String(designation).length>50 ){
            $('#designation-modal').modal();
            hideLoadingOverlay();
            return;
        }
    }
    if(accessLevel == "guest") {
        accessLevel = 0;
        title = document.getElementById("title").value;
        organizationEmail = document.getElementById("organizationEmail").value;
        organizationTelephone = document.getElementById("organizationTelephone").value;
        nic = document.getElementById("nic").value;
        organizationAddress = document.getElementById("organizationAddress").value;

        if (  String(organizationTelephone).length>10 || String(organizationTelephone).length<9 ){
            $('#telephoneNumber-modal').modal();
            hideLoadingOverlay();
            return;
        }
        if (  String(organizationEmail).length>255 ){
            $('#email-modal').modal();
            hideLoadingOverlay();
            return;
        }
        if (  String(nic).length != 10 || (String(nic).substr((String(nic).length-1)) != "V"  && String(nic).substr((String(nic).length-1)) != "v" && String(nic).substr((String(nic).length-1)) != "X" && String(nic).substr((String(nic).length-1)) != "x")){
            $('#nic-modal').modal();
            hideLoadingOverlay();
            return;
        }
        if (  isNaN(String(nic).substr( 0 ,(String(nic).length-1))) ){
            $('#nic-modal').modal();
            hideLoadingOverlay();
            return;
        }
        if (  String(organizationAddress).length>175 ){
            $('#address-modal').modal();
            hideLoadingOverlay();
            return;
        }
        if (  String(title).length>50 ){
            $('#title-modal').modal();
            hideLoadingOverlay();
            return;
        }
    }



    if (passwordOne == passwordTwo){
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
                    //window.alert(res);
                    if (res == "success"){
                        window.location.href = "../";
                    }
                    else{
                        $('#message-modal').modal();
                        document.getElementById("passwordOne").value = "";
                        document.getElementById("passwordTwo").value = "";
                    }
                    hideLoadingOverlay();

                }
            }

            obj.open("POST", "./addUser", true);
            obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            if (accessLevel == 0) {
                var s= "userID=" + encodeURIComponent(userID) + "& firstName=" + encodeURIComponent(firstName) + "& "+
                    "middleName=" + encodeURIComponent(middleName) + "& lastName=" + encodeURIComponent(lastName) + "& "+
                    "email=" + encodeURIComponent(email) + "& telephoneNumber=" + encodeURIComponent(telephoneNumber) + "& "+
                    "accessLevel=" + encodeURIComponent(accessLevel) + "& passwordOne=" + encodeURIComponent(passwordOne) + "& "+
                    "title=" + encodeURIComponent(title) + "& organizationEmail=" + encodeURIComponent(organizationEmail) + "& "+
                    "organizationTelephone=" + encodeURIComponent(organizationTelephone) + "& nic=" + encodeURIComponent(nic) + "& "+
                    "organizationAddress=" + encodeURIComponent(organizationAddress);

                obj.send(s);
            }
            if (accessLevel == 1) {
                var s = "userID=" + encodeURIComponent(userID) + "& firstName=" + encodeURIComponent(firstName) + "& "+
                    "middleName=" + encodeURIComponent(middleName) + "& lastName=" + encodeURIComponent(lastName) + "& "+
                    "email=" + encodeURIComponent(email) + "& telephoneNumber=" + encodeURIComponent(telephoneNumber) + "& "+
                    "accessLevel=" + encodeURIComponent(accessLevel) + " & passwordOne=" + encodeURIComponent(passwordOne) + "& "+
                    "batch=" + encodeURIComponent(batch) + "& department=" + encodeURIComponent(department);

                obj.send(s);


            }
            if (accessLevel == 2) {
                obj.send("userID=" + encodeURIComponent(userID) + "& firstName=" + encodeURIComponent(firstName) + "& " +
                    "middleName=" + encodeURIComponent(middleName) + "& lastName=" + encodeURIComponent(lastName) + "& " +
                    "email=" + encodeURIComponent(email) + "& telephoneNumber=" + encodeURIComponent(telephoneNumber) + "& " +
                    "accessLevel=" + encodeURIComponent(accessLevel) + "& passwordOne=" + encodeURIComponent(passwordOne) + "& " +
                    "designation=" + encodeURIComponent(designation) + "& department=" + encodeURIComponent(department));
            }
        }
    }
    else{
        window.alert("Passwords do not match");
        document.getElementById("passwordOne").value = "";
        document.getElementById("passwordTwo").value = "";
    }


}

function loadDepartments() {

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

                var currentDept = document.getElementById('department').value;

                var content = '<option disabled selected>Select Department</option>;';
                for (var i = 0; i < rows.length; i++) {
                    content += '<option value="' + rows[i].dept_name + '">' + rows[i].dept_name + '</option>';
                }
                document.getElementById('department').innerHTML = content;

                document.getElementById('department').disabled = false;
            }
        }


        obj.open("POST", "./loadDepartments", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send(); //pass to controller

    }
}

