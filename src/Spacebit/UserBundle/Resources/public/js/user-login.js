function login() {

}

function validateUser() {
    var obj;


    var name =document.getElementById("userID").value;
    var password = document.getElementById("password").value;

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
                if (res == "fail"){
                    window.alert("***Please enter correct username and password***");
                    document.getElementById("password").value = "";
                }
                else{
                    var rows = JSON.parse(res).result;
                    //window.alert(rows[0].user_id);
                    if (rows[0].password != password){
                        window.alert("Log in failed");
                        document.getElementById("password").value = "";

                    }
                    else{
                        window.alert("Log in successful");
                    }

                }

            }
        }

        obj.open("POST", "./validateUser", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("name=" + name + "& password=" + password);
    }
}