let allUsers = [];
let usersData, users, adminData, admin;
let alert1 = document.getElementById('alert');
let eError = document.getElementById('e_error');
let pError = document.getElementById('p_error');
let refresh = () => {
    adminData = firebase.database().ref("admin").once("value", (data) => {
        admin = data.val();
        localStorage.setItem("Admin", JSON.stringify(admin));
        console.log(admin)
            // admin = data.val();
        signInCheck();
    })
    usersData = firebase.database().ref("users").once("value", (data) => {
            allUsers = data.val();
            localStorage.setItem("All Users", JSON.stringify(allUsers));
            console.log(allUsers);
            // signInCheck();
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
    let cUser = localStorage.getItem('Current User');
    console.log(cUser);
    if (cUser !== null) {
        console.log(admin);
        if (cUser === admin.email) {
            window.location.href = "./admin-panel.html";
        } else {
            window.location.href = "./user-panel.html";
        }
    }
}
let validate = (email, password) => {
    let valid = true;
    eError.innerHTML = "";
    pError.innerHTML = "";
    if (email == "" || email == null) {
        valid = false;
        eError.innerHTML = "Email address is required!";
    } else if (email.lastIndexOf("@") == -1) {
        valid = false;
        eError.innerHTML = "Email should have aleast one @ character!";
    } else if (email.lastIndexOf(".") == -1) {
        valid = false;
        eError.innerHTML = "Email should have aleast one '.' dot character!";
    } else if (email.lastIndexOf("@") >= email.lastIndexOf(".") - 3) {
        valid = false;
        eError.innerHTML = "'.' should be placed after 3 character of '@'!";
    } else if (email.lastIndexOf("@") < 3) {
        valid = false;
        eError.innerHTML = "'@' should be placed after 3 character from staring!";
    } else if (email.lastIndexOf(".") > email.length - 3) {
        valid = false;
        eError.innerHTML = "'.' should be placed before 2 character from ending!";
    }
    if (password == null || password == "") {
        valid = false;
        pError.innerHTML = "Password is required*!";
    } else if (password.length < 8) {
        valid = false;
        pError.innerHTML = "Password should be atleast 8 characters long!";
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
                let userId = user.uid;
                console.log(userId);
                let data = localStorage.getItem('All Users');
                let obj = JSON.parse(data);
                console.log(obj);
                console.log(obj[userId]);
                let currentUser = JSON.stringify(obj[userId]);
                console.log(currentUser);
                localStorage.setItem("Current User", currentUser);
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