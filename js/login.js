// login and signup rendering script

const cl = document.querySelectorAll(".signupContainer .close,.loginConatiner .close");
const signupLink = document.getElementsByClassName("signup-link")[1];
const loginLink = document.getElementsByClassName("signup-link")[3];
const loginBtns = document.querySelectorAll(".lbtn");
const loginSubmitBtn = document.getElementsByClassName("login-btn")[0];
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


// login key

function setJwtToken(token) {
    document.getElementById('jwtToken').value = token;
}

loginSubmitBtn.addEventListener("click", () => {

    const phone = document.getElementById('phone').value; // Get the phone value from the input
    const password = document.getElementById('pass').value; // Get the password value from the input

    const requestData = { phone, password }; // Create an object with the data

    fetch('http://localhost:5500/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify JSON content type
        },
        body: JSON.stringify(requestData) // Convert the data to JSON string
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Error:', errorData.message);
                });
            }
            return response.json();
        })
        .then(responseData => {
            console.log( responseData.token);

            const jwtToken = responseData.token;
            setJwtToken(jwtToken);

            // Perform further actions as needed
        })
        .catch(error => {
            console.error('Request failed:', error);
        });

})






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
