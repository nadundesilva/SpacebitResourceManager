function showDiv(elem){

    if(elem.value == "student") {
        document.getElementById('studentDivision').style.display = "block";
        document.getElementById('staffDivision').style.display = "none";
        document.getElementById('guestDivision').style.display = "none";
        document.getElementById('departmentDivision').style.display = "block";
        loadDepartments();
    }
    if(elem.value == "staff") {
        document.getElementById('staffDivision').style.display = "block";
        document.getElementById('studentDivision').style.display = "none";
        document.getElementById('guestDivision').style.display = "none";
        document.getElementById('departmentDivision').style.display = "block";
        loadDepartments();
    }
    if(elem.value == "guest") {
        document.getElementById('guestDivision').style.display = "block";
        document.getElementById('studentDivision').style.display = "none";
        document.getElementById('staffDivision').style.display = "none";
    }
}

function addNewUser() {
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



    if(accessLevel == "student") {
        accessLevel = 1;
        batch = document.getElementById("batch").value;
        department = document.getElementById("department").value;
    }
    if(accessLevel == "staff") {
        accessLevel = 2;
        designation = document.getElementById("designation").value;
        department = document.getElementById("department").value;
    }
    if(accessLevel == "guest") {
        accessLevel = 0;
        title = document.getElementById("title").value;
        organizationEmail = document.getElementById("organizationEmail").value;
        organizationTelephone = document.getElementById("organizationTelephone").value;
        nic = document.getElementById("nic").value;
        organizationAddress = document.getElementById("organizationAddress").value;
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

                }
            }

            obj.open("POST", "./addUser", true);
            obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            if (accessLevel == 0) {
                var s= "userID=" + userID + "& firstName=" + firstName + "& "+
                    "middleName=" + middleName + "& lastName=" + lastName + "& "+
                    "email=" + email + "& telephoneNumber=" + telephoneNumber + "& "+
                    "accessLevel=" + accessLevel + "& passwordOne=" + passwordOne + "& "+
                    "title=" + title + "& organizationEmail=" + organizationEmail + "& "+
                    "organizationTelephone=" + organizationTelephone + "& nic=" + nic + "& "+
                    "organizationAddress=" + organizationAddress;
                window.alert(s);
                obj.send(s);
            }
            if (accessLevel == 1) {
                var s = "userID=" + userID + "& firstName=" + firstName + "& "+
                    "middleName=" + middleName + "& lastName=" + lastName + "& "+
                    "email=" + email + "& telephoneNumber=" + telephoneNumber + "& "+
                    "accessLevel=" + accessLevel + " & passwordOne=" + passwordOne + "& "+
                    "batch=" + batch + "& department=" + department;
                window.alert(s);
                obj.send(s);


            }
            if (accessLevel == 1) {
                obj.send("userID=" + userID + "& firstName=" + firstName + "& " +
                    "middleName=" + middleName + "& lastName=" + lastName + "& " +
                    "email=" + email + "& telephoneNumber=" + telephoneNumber + "& " +
                    "accessLevel=" + accessLevel + "& passwordOne=" + passwordOne + "& " +
                    "designation=" + designation + "& department=" + department);
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

