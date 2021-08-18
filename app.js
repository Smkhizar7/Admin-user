let allUsers = [];
let usersData, users, adminData, admin;
let alert1 = document.getElementById('alert');
let alert2 = document.getElementById('s-alert');
let eError = document.getElementById('e_error');
let pError = document.getElementById('p_error');
let refresh = () => {
    adminData = firebase.database().ref("admin").once("value", (data) => {
            // allUsers.push(data.val());
            admin = data.val();
            signInCheck();
        })
        //     usersData = localStorage.getItem('users');
        //     users = JSON.parse(usersData);
        //     adminData = localStorage.getItem('admin');
        //     admin = JSON.parse(adminData);
        //     if (users !== null && users !== "") {
        //         allUsers = users;
        //     }
}
let signInCheck = () => {
    let cUser = localStorage.getItem('Current_User_Email');
    if (cUser !== "") {
        console.log(admin);
        if (cUser === admin.email) {
            window.location.href = "./admin-panel.html";
        } else {
            window.location.href = "./user-panel.html";
        }
    }
}
let validate = (email, password) => {
    let emailIsLegeal = true,
        passwordIsLegeal = true,
        valid = false;
    eError.innerHTML = "";
    pError.innerHTML = "";
    if (email.indexOf("@") == -1) {
        emailIsLegeal = false;
        eError.innerHTML = "Email should have aleast one @ character!";
    } else if (email.indexOf(".") == -1) {
        emailIsLegeal = false;
        eError.innerHTML = "Email should have aleast one '.' dot character!";
    } else if (email.indexOf("@") >= email.indexOf(".") - 3) {
        emailIsLegeal = false;
        eError.innerHTML = "'.' should be placed after 3 character of '@'!";
    } else if (email.indexOf("@") < 3) {
        emailIsLegeal = false;
        eError.innerHTML = "'@' should be placed after 3 character from staring!";
    } else if (email.indexOf(".") > email.length - 3) {
        emailIsLegeal = false;
        eError.innerHTML = "'.' should be placed before 2 character from ending!";
    }
    if (password.length < 8) {
        passwordIsLegeal = false;
        pError.innerHTML = "Password should be atleast 8 characters long!";
    }
    if (emailIsLegeal && passwordIsLegeal) {
        valid = true;
    }
    return valid;
}
let login = () => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    alert1.setAttribute("class", "hidden");
    if (email == admin.email && password == admin.password) {
        localStorage.setItem('Current_User_Email', email);
        alert1.setAttribute("class", "alert alert-success");
        alert1.innerHTML = "Admin Login Successfully!";
        setTimeout(() => {
            window.location.href = "./admin-panel.html";
        }, 2000);
    } else if (validate(email, password)) {
        // Sign In With LocalStorage
        // let filteredUsers = allUsers.filter((data) => data.email == email.value);
        // console.log(filteredUsers);
        // if (filteredUsers.length !== 0) {
        //     if (filteredUsers[0].password == password.value) {
        //         localStorage.setItem('Current_User_Email', email.value);
        //         alert1.setAttribute("class", "alert alert-success");
        //         alert1.innerHTML = "Sign In Successfully!";
        //         setTimeout(() => {
        //             window.location.href = "./user-panel.html";
        //         }, 2000);
        //     } else {
        //         alert1.setAttribute("class", "alert alert-danger")
        //         alert1.innerHTML = "Incorrect password!";
        //     }
        // } else {
        //     alert1.setAttribute("class", "alert alert-danger")
        //     alert1.innerHTML = "Incorrect email or password!";
        // }

        // Sign In With Firebase
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                let user = userCredential.user;
                localStorage.setItem('Current_User_Email', user.email);
                alert1.setAttribute("class", "alert alert-success");
                alert1.innerHTML = "Sign In Successfully!";
                setTimeout(() => {
                    window.location.href = "./user-panel.html";
                }, 2000);
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                alert1.setAttribute("class", "alert alert-danger")
                alert1.innerHTML = errorMessage;
            });
    }
}
let logout = () => {
    localStorage.setItem('Current_User_Email', "");
    window.location.href = "./index.html";
}
let signup = () => {
    let email = document.getElementById('s-email').value;
    let password = document.getElementById('s-password').value;
    alert2.setAttribute("class", "hidden")
    if (email === admin.email) {
        alert2.setAttribute("class", "alert alert-danger")
        alert2.innerHTML = "The email address is already in use by another account.";
    } else if (validate(email, password)) {
        // Sign Up With LocalStorage
        // let filteredUsers = allUsers.filter((data) => data.email == email.value);
        // console.log(filteredUsers);
        // let obj = {
        //     email: email,
        //     password: password
        //     }
        //     console.log(!(filteredUsers.length == 0));
        // allUsers.push(obj);
        // localStorage.setItem("users", JSON.stringify(allUsers));

        // Sign Up With Firebase
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                let user = userCredential.user;
                alert2.setAttribute("class", "alert alert-success");
                alert2.innerHTML = "Sign Up Successfully!";
                setTimeout(() => {
                    window.location.href = "./index.html";
                }, 2000);
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                alert2.setAttribute("class", "alert alert-danger");
                alert2.innerHTML = errorMessage;
            });
    }
    // refresh();
}