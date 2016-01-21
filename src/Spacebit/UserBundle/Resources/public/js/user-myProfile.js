/**
 * Created by KeetMalin on 1/14/2016.
 */


function editProfile(id){


    var elem = document.getElementById("submitButton");

    if (elem.innerText=="Edit Profile"){
        elem.innerText = "Done Editing";
        //window.alert(elem.innerText);

        //user fields visible
        //document.getElementById('userID').disabled = false;
        document.getElementById('firstName').disabled = false;
        document.getElementById('middleName').disabled = false;
        document.getElementById('lastName').disabled = false;
        document.getElementById('email').disabled = false;
        document.getElementById('telephoneNumber').disabled = false;

        if (id == 0){
            //guest fields visible
            document.getElementById('title').disabled = false;
            document.getElementById('organizationEmail').disabled = false;
            document.getElementById('organizationTelephone').disabled = false;
            document.getElementById('nic').disabled = false;
            document.getElementById('organizationAddress').disabled = false;

            document.getElementById("batch").required = false;
            document.getElementById("department").required = false;
            document.getElementById("designation").required = false;
            document.getElementById("title").required = true;
            document.getElementById("organizationEmail").required = true;
            document.getElementById("organizationTelephone").required = true;
            document.getElementById("nic").required = true;
            document.getElementById("organizationAddress").required = true;
        }
        if (id ==1){
            //student fields visible
            document.getElementById('batch').disabled = false;
            document.getElementById('department').disabled = false;
            document.getElementById("batch").required = true;
            document.getElementById("department").required = true;
            document.getElementById("designation").required = false;
            document.getElementById("title").required = false;
            document.getElementById("organizationEmail").required = false;
            document.getElementById("organizationTelephone").required = false;
            document.getElementById("nic").required = false;
            document.getElementById("organizationAddress").required = false;
        }
        if (id >1){
            //staff fields visible
            document.getElementById('designation').disabled = false;
            document.getElementById('department').disabled = false;

            document.getElementById("batch").required = false;
            document.getElementById("department").required = true;
            document.getElementById("designation").required = true;
            document.getElementById("title").required = false;
            document.getElementById("organizationEmail").required = false;
            document.getElementById("organizationTelephone").required = false;
            document.getElementById("nic").required = false;
            document.getElementById("organizationAddress").required = false;
        }

        loadDepartments();
    }
    else {
        elem.innerText = "Edit Profile";
        //user fields visible

        document.getElementById('firstName').disabled = true;
        document.getElementById('middleName').disabled = true;
        document.getElementById('lastName').disabled = true;
        document.getElementById('email').disabled = true;
        document.getElementById('telephoneNumber').disabled = true;

        if (id == 0){
            //guest fields visible
            document.getElementById('title').disabled = true;
            document.getElementById('organizationEmail').disabled = true;
            document.getElementById('organizationTelephone').disabled = true;
            document.getElementById('nic').disabled = true;
            document.getElementById('organizationAddress').disabled = true;
        }
        if (id ==1){
            //student fields visible
            document.getElementById('batch').disabled = true;
            document.getElementById('department').disabled = true;
        }
        if (id >1){
            //staff fields visible
            document.getElementById('designation').disabled = true;
            document.getElementById('department').disabled = true;
        }
        editUser(id);
    }
}

function editUser(id) {

    //window.alert("Editing");
    showLoadingOverlay();
    var obj;

    var userID = document.getElementById("userID").value;
    var firstName = document.getElementById("firstName").value;
    var middleName = document.getElementById("middleName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var telephoneNumber = document.getElementById("telephoneNumber").value;
    //var passwordOne = document.getElementById("passwordOne").value;
    //var passwordTwo = document.getElementById("passwordTwo").value;
    var accessLevel = id;
    var batch;
    var designation;
    var department;
    var title;
    var organizationEmail;
    var organizationTelephone;
    var nic;
    var organizationAddress;

    //window.alert(firstName);
    if (  String(userID).length>15 || String(userID).length ==0){
        $('#userID-modal').modal();
        hideLoadingOverlay();
        editProfile(id)
        return;
    }
    if (  String(firstName).length>35 || String(middleName).length>35  || String(lastName).length>35 || String(firstName).length ==0 || String(lastName).length ==0){
        $('#name-modal').modal();
        hideLoadingOverlay();
        editProfile(id)
        return;
    }
    if (  String(email).length>255 || String(email).length ==0){
        $('#email-modal').modal();
        hideLoadingOverlay();
        editProfile(id)
        return;
    }

    if (  String(telephoneNumber).length>10 || String(telephoneNumber).length<9 ||String(telephoneNumber).length ==0 ){
        $('#telephoneNumber-modal').modal();
        hideLoadingOverlay();
        editProfile(id)
        return;
    }


    if(accessLevel == 1) {

        batch = document.getElementById("batch").value;
        department = document.getElementById("department").value;

        if (  String(batch).length != 2 || String(batch).length ==0){
            $('#batch-modal').modal();
            hideLoadingOverlay();
            editProfile(id)
            return;
        }
    }
    if(accessLevel >2) {
        //accessLevel = 2;
        designation = document.getElementById("designation").value;
        department = document.getElementById("department").value;

        if (  String(designation).length>50 || String(designation).length ==0){
            $('#designation-modal').modal();
            hideLoadingOverlay();
            editProfile(id)
            return;
        }
    }
    if(accessLevel == 0) {
        //accessLevel = 0;
        title = document.getElementById("title").value;
        organizationEmail = document.getElementById("organizationEmail").value;
        organizationTelephone = document.getElementById("organizationTelephone").value;
        nic = document.getElementById("nic").value;
        organizationAddress = document.getElementById("organizationAddress").value;

        if (  String(organizationTelephone).length>10 || String(organizationTelephone).length<9 ||  String(organizationTelephone).length ==0){
            $('#telephoneNumber-modal').modal();
            hideLoadingOverlay();
            editProfile(id)
            return;
        }
        if (  String(organizationEmail).length>255 ||  String(organizationEmail).length ==0){
            $('#email-modal').modal();
            hideLoadingOverlay();
            editProfile(id)
            return;
        }
        if (  String(nic).length != 10 || String(nic).substr((String(nic).length-1)) != "V"  || String(nic).substr((String(nic).length-1)) != "v" || String(nic).substr((String(nic).length-1)) != "X" || String(nic).substr((String(nic).length-1)) != "x"){
            $('#nic-modal').modal();
            hideLoadingOverlay();
            editProfile(id)
            return;
        }
        if (  isNaN(String(nic).substr( 0 ,(String(nic).length-1))) ||  String(nic).length ==0){
            $('#nic-modal').modal();
            hideLoadingOverlay();
            editProfile(id)
            return;
        }
        if (  String(organizationAddress).length>175 ||  String(organizationAddress).length ==0){
            $('#address-modal').modal();
            hideLoadingOverlay();
            editProfile(id)
            return;
        }
        if (  String(title).length>50 ||  String(title).length ==0){
            $('#title-modal').modal();
            hideLoadingOverlay();
            editProfile(id)
            return;
        }
    }




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
                    //window.alert("HEy KEtt");
                    //window.location.href = "../";
                }
                hideLoadingOverlay();

            }
        }

        obj.open("POST", "./editUser", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        if (accessLevel == 0) {
            var s= "userID=" + userID + "& firstName=" + firstName + "& "+
                "middleName=" + middleName + "& lastName=" + lastName + "& "+
                "email=" + email + "& telephoneNumber=" + telephoneNumber + "& "+
                "accessLevel=" + accessLevel + "& "+
                "title=" + title + "& organizationEmail=" + organizationEmail + "& "+
                "organizationTelephone=" + organizationTelephone + "& nic=" + nic + "& "+
                "organizationAddress=" + organizationAddress;

            obj.send(s);
        }
        if (accessLevel == 1) {
            var s = "userID=" + userID + "& firstName=" + firstName + "& "+
                "middleName=" + middleName + "& lastName=" + lastName + "& "+
                "email=" + email + "& telephoneNumber=" + telephoneNumber + "& "+
                "accessLevel=" + accessLevel + "& "+
                "batch=" + batch + "& department=" + department;

            obj.send(s);


        }
        if (accessLevel == 2) {
            obj.send("userID=" + userID + "& firstName=" + firstName + "& " +
                "middleName=" + middleName + "& lastName=" + lastName + "& " +
                "email=" + email + "& telephoneNumber=" + telephoneNumber + "& " +
                "accessLevel=" + accessLevel + "& " +
                "designation=" + designation + "& department=" + department);
        }
    }

}

function changePassswordDialog(){
    $('#message-modal').modal();

}

function changePassword(){
    showLoadingOverlay();
    var obj;


    //window.alert("keet");
    //var userID = id;
    var passwordOld = document.getElementById("passwordOld").value;
    var passwordOne = document.getElementById("passwordOne").value;
    var passwordTwo = document.getElementById("passwordTwo").value;

    if (  String(passwordOne) !=  String(passwordTwo) || String(passwordOne).length>128 || String(passwordOld).length>128 || String(passwordOld).length==0 || String(passwordOne).length==0 || String(passwordTwo).length==0){
        $('#message-modal').modal('hide');
        $('#password-modal').modal();
        hideLoadingOverlay();

        document.getElementById("passwordOld").value = "";
        document.getElementById("passwordOne").value = "";
        document.getElementById("passwordTwo").value = "";
        return;
    }

    if (  String(passwordOld) == String(passwordTwo)){
        $('#message-modal').modal('hide');
        $('#passwordSame-modal').modal();
        hideLoadingOverlay();

        document.getElementById("passwordOld").value = "";
        document.getElementById("passwordOne").value = "";
        document.getElementById("passwordTwo").value = "";
        return;
    }

    if (window.XMLHttpRequest) {
        obj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        obj = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("Browser Doesn't Support AJAX!");
    }

    //window.alert("keet");
        if (obj !== null) {
            obj.onreadystatechange = function () {
                if (obj.readyState < 4) {
                    // progress
                } else if (obj.readyState === 4) {

                    var res = obj.responseText;
                    //window.alert(res);

                    if (res == "success"){
                        //window.location.href = "../";
                        document.getElementById("passwordOld").value = "";
                        document.getElementById("passwordOne").value = "";
                        document.getElementById("passwordTwo").value = "";
                        $('#message-modal').modal('hide');
                        $('#passwordSuccess-modal').modal();
                    }
                    if (res == "incorrect"){
                        //window.location.href = "../";
                        //$('#message-modal').modal('hide');
                        $('#passwordIncorrect-modal').modal();
                        document.getElementById("passwordOld").value = "";
                        document.getElementById("passwordOne").value = "";
                        document.getElementById("passwordTwo").value = "";
                    }

                    hideLoadingOverlay();

                }
            }

            obj.open("POST", "./changePassword", true);
            obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            obj.send("passwordOld=" + passwordOld + "& passwordTwo=" + passwordTwo );
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