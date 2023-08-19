// login and signup rendering script

const cl = document.querySelectorAll(".signupContainer .close,.loginConatiner .close");
const signupLink = document.getElementsByClassName("signup-link")[1];
const loginLink = document.getElementsByClassName("signup-link")[3];
const loginBtns = document.querySelectorAll(".lbtn");
cl.forEach((cl) => {
    cl.addEventListener("click", () => {
        signupContainer.style.display = "none";//dont know why but signupContainer and loginContainer running without declaring
        loginConatiner.style.display = "none";
    });
});
loginBtns.forEach((op) => {
    op.addEventListener("click", () => {
        loginConatiner.style.display = "block";
    });
});
signupLink.addEventListener("click", () => {
    loginConatiner.style.display = "none";
    signupContainer.style.display = "block";
});
loginLink.addEventListener("click", () => {
    signupContainer.style.display = "none";
    loginConatiner.style.display = "block";
});

// login and signup fetching data script

// const loginForm = document.getElementById("login_form");

// loginForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const lpno = document.getElementById("phone").value;

//     const obj = {
//         "lpno": lpno
//     };

//     fetch("/swag_orig/js/login.php", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json;"
//         },
//         body: JSON.stringify(obj)
//     })
//         .then((res) => {
//             return res.text()
//         })
//         .then((data) => {
//             if (data == 0) {
//                 alert("This number is not registered with us");
//                 document.getElementById("pno").value = lpno;
//                 signupContainer.style.display = "block";

//             }
//             else if (data == 1) alert("OTP SENT");
//             loginConatiner.style.display = "none";
//         })
//         .catch((err) => { console.log(err) });
// });

// const signupForm = document.getElementById("signup_form");

// signupForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const s_username = document.getElementById("s_username").value;
//     const pno = document.getElementById("pno").value;

//     const obj = {
//         "s_username": s_username,
//         "pno": pno
//     };

//     fetch("/swag_orig/js/signup.php", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json; "
//         },
//         body: JSON.stringify(obj)
//     })
//         .then((res) => {
//             console.log(res);
//             return res.text()
//         })
//         .then((data) => { console.log(data); })
//         .catch((err) => { console.log(err) });
// });
