let allUsers = [];
let usersData, users, adminData, admin;
let alert2 = document.getElementById('s-alert');
let fError = document.getElementById('f_error');
let lError = document.getElementById('l_error');
let eError = document.getElementById('e_error');
let pError = document.getElementById('p_error');
let cError = document.getElementById('c_error');
let dError = document.getElementById('d_error');
let gError = document.getElementById('g_error');
let refresh = () => {
    adminData = firebase.database().ref("admin").once("value", (data) => {
        admin = data.val();
        localStorage.setItem("Admin", JSON.stringify(admin));
        console.log(admin)
            // admin = data.val();
            // signInCheck();
    })
    usersData = firebase.database().ref("users").on("child_added", (data) => {
            allUsers.push(data.val());
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
let validate = (fname, lname, email, password, cpassword, dob, gender) => {
    let genderSelected = false,
        valid = true;
    fError.innerHTML = "";
    lError.innerHTML = "";
    eError.innerHTML = "";
    pError.innerHTML = "";
    cError.innerHTML = "";
    dError.innerHTML = "";
    gError.innerHTML = "";
    if (fname == null || fname == "") {
        valid = false;
        fError.innerHTML = "First name is required*";
    }
    if (lname == null || lname == "") {
        valid = false;
        lError.innerHTML = "Last name is required*";
    }
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
    if (cpassword == null || cpassword == "") {
        valid = false;
        cError.innerHTML = "Confirm Password is required*!";
    } else if (password !== cpassword) {
        valid = false;
        cError.innerHTML = "Password is not match!";
    }
    if (dob == null || dob == "") {
        valid = false;
        dError.innerHTML = "Date of birth is required*";
    }
    for (let i = 0; i < gender.length; i++) {
        if (gender[i].checked) {
            genderSelected = true;
        }
    }
    if (!genderSelected) {
        valid = false;
        gError.innerHTML = "Gender is required*";
    }
    return valid;
}
let signup = () => {
    let fname = document.getElementById('f-name').value;
    let lname = document.getElementById('l-name').value;
    let email = document.getElementById('s-email').value;
    let password = document.getElementById('s-password').value;
    let cpassword = document.getElementById('c-password').value;
    let dob = document.getElementById('dob').value;
    let gender = document.getElementsByName('Gender');
    let genderValue;
    alert2.setAttribute("class", "hidden")
    if (email === admin.email) {
        alert2.setAttribute("class", "alert alert-danger")
        alert2.innerHTML = "The email address is already in use by another account.";
    } else if (validate(fname, lname, email, password, cpassword, dob, gender)) {
        // Sign Up With LocalStorage
        // let filteredUsers = allUsers.filter((data) => data.email == email.value);
        // console.log(filteredUsers);
        for (let i = 0; i < gender.length; i++) {
            if (gender[i].checked) {
                genderValue = gender[i].value;
            }
        }
        // console.log(genderValue)
        let obj = {
                First_Name: fname,
                Last_Name: lname,
                Email: email,
                Password: password,
                Date_Of_Birth: dob,
                Gender: genderValue
            }
            //         //     console.log(!(filteredUsers.length == 0));
            //         // allUsers.push(obj);
            //         // localStorage.setItem("users", JSON.stringify(allUsers));

        //     // Sign Up With Firebase
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                let user = userCredential.user;
                let userId = user.uid;
                allUsers.push(obj);
                firebase.database().ref('users').child(userId).set(obj);
                localStorage.setItem("Current User", JSON.stringify(obj));
                alert2.setAttribute("class", "alert alert-success");
                alert2.innerHTML = "Sign Up Successfully!";
                setTimeout(() => {
                    window.location.href = "./user-panel.html";
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