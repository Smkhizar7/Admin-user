let current_User = localStorage.getItem("Current User");
let uName = document.getElementById('uname');
let uImg = document.getElementById('img');
let userData = JSON.parse(current_User);
console.log(userData);
uName.innerHTML = userData.First_Name;
uImg.src = userData.imageURL;
console.log(uImg);
console.log(userData.imageURL);
let logout = () => {
    localStorage.removeItem("Current User");
    window.location.href = "./index.html";
}
let send = () => {
    let image = document.getElementById('file').files[0];
    let imgName = image.name;
    let storage = firebase.storage().ref('images').child(imgName);
    let upload = storage.put(image).then((success) => {
        console.log("success => ", success);
        success.ref.getDownloadURL().then((success) => {
            console.log(success);
            userData = {...userData, uid: "NnwlnyLN6AP5NIdgu7uj5qVMdyl2", imageURL: success }
            firebase.database().ref('users').child("NnwlnyLN6AP5NIdgu7uj5qVMdyl2").set(userData)
        }).catch((err) => {
            console.log(err);
        })
    }).catch((err) => {
        console.log("error => ", err);
    })
    upload
    // console.log(img);
    // firebase.storage().ref('images')
}