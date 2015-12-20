function showDiv(){
    var elem = document.getElementById("accessLevel");
    if(elem.value == "student") {
        document.getElementById('studentDivision').style.display = "block";
        document.getElementById('staffDivision').style.display = "none";
        document.getElementById('guestDivision').style.display = "none";
    }
    if(elem.value == "staff") {
        document.getElementById('studentDivision').style.display = "none";
        document.getElementById('staffDivision').style.display = "block";
        document.getElementById('guestDivision').style.display = "none";
    }
    if(elem.value == "guest") {
        document.getElementById('studentDivision').style.display = "none";
        document.getElementById('staffDivision').style.display = "none";
        document.getElementById('guestDivision').style.display = "block";
    }
}

function addNewUser() {
    var obj;

    var userId = document.getElementsByName("userID").value;
    var firstName = document.getElementsByName("firstName").value;
    var middleName = document.getElementsByName("middleName").value;
    var lastName = document.getElementsByName("lastName").value;
    var email = document.getElementsByName("email").value;
    var telephoneNumber = document.getElementsByName("telephoneNumber").value;
    var accessLevel = document.getElementsByName("accessLevel").value;
    var password1 = document.getElementsByName("password1").value;
    var password2 = document.getElementsByName("password2").value;

    window.alert(firstName);

    if (password1 == password2){
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
                    window.alert(res);
                }
            }

            obj.open("POST", "./addUser", true);
            obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            obj.send("userId=" + userId & "firstName=" + firstName &
                "middleName=" + middleName & "lastName=" + lastName &
                "email=" + email & "telephoneNumber=" + telephoneNumber &
                "accessLevel=" + accessLevel & "password1=" + password1
            );
        }
    }
    else{
        window.alert("Passwords do not match");
    }
}