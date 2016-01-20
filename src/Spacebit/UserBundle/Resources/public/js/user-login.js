
function validateUser() {
    showLoadingOverlay();
    var obj;

    var name =document.getElementById("userID").value;
    var password = document.getElementById("password").value;
    if(!name || !password){
        $('#message').show();
        return;
    }
    console.log(name);

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
                if (res == "fail"){
                    window.alert("***Please enter correct username and password***");
                    document.getElementById("password").value = "";
                    hideLoadingOverlay();
                }
                if (res == "incorrect"){
                    window.alert("***Please enter correct username and password***");
                    document.getElementById("password").value = "";
                    hideLoadingOverlay();
                }
                if (res == "success"){
                    window.location.href = "../";
                }
            }
        }

        obj.open("POST", "./validateUser", true);
        obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        obj.send("name=" + name + "& password=" + password);
    }
}


$(document).ready(function(){
    $('#message').hide();
});