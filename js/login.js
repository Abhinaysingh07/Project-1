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
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
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
            console.log(responseData.token);

            const jwtToken = responseData.token;

            // Set the JWT token value in local storage
            localStorage.setItem('jwtToken', jwtToken);
        })
        .catch(error => {
            console.error('Request failed:', error);
        });
});
