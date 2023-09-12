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


loginSubmitBtn.addEventListener("click", () => {
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('pass').value;
    const requestData = { phone, password };

    fetch('http://localhost:5500/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Error:', errorData.message);
                });
            }
            // If the response is successful, parse the JSON response to get the JWT token
            return response.json();
        })
        .then(responseData => {
            // Now, you can access the JWT token in the responseData
            const jwtToken = responseData.token;
            console.log(responseData.message);
            document.cookie = `jwtToken=${jwtToken}; expires=Sun, 31 Dec 2023 23:59:59 GMT; path=/`;

    
        })
        .catch(error => {
            console.error('Request failed:', error);
        });
});
