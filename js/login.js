// login and signup rendering script
const closeBtns = document.querySelectorAll(".signupContainer .close,.loginConatiner .close");
const signupLink = document.getElementsByClassName("signup-link")[1];
const loginLink = document.getElementsByClassName("signup-link")[3];
const loginBtns = document.querySelectorAll(".login-button");
const loginSubmitBtn = document.getElementsByClassName("login-submit-button")[0];
closeBtns.forEach((button) => {
    button.addEventListener("click", () => {
        signupContainer.style.display = "none";//dont know why but signupContainer and loginContainer running without declaring
        loginConatiner.style.display = "none";
    });
});
loginBtns.forEach((button) => {
    button.addEventListener("click", () => {
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


// Get references to the user icon and the user sidebar
const userIcon = document.getElementById("user-icon");
const userSidebar = document.getElementById("user-sidebar");

// Add a click event listener to the user icon
userIcon.addEventListener("click", () => {
    // Toggle the sidebar's visibility by changing its left position
    if (userSidebar.style.top === "12rem") {
        userSidebar.style.top = "-30rem";
    } else {
        userSidebar.style.top = "12rem";
    }
});

// Function to get the value of a cookie by its name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Get the userData cookie
const userDataJSON = getCookie("userData");
let userData;
if (userDataJSON) {
    userData = JSON.parse(userDataJSON);
}

// Check if the user is already logged in when the page loads
window.addEventListener("load", () => {

    // Get the userData cookie
    if (userData) {
        if (userData.isLoggedIn === true) {
            document.querySelector('.fa-user').style.display = "inline";
            // Update the username , phone and cart
            document.getElementById('username').innerText = userData.username;
            document.getElementById('userphone').innerText = userData.phone;
            document.querySelector(".fa-shopping-cart").innerHTML = userData.quant;

            // Hide all elements with the class 'login-button'
            const loginButtons = document.getElementsByClassName('login-button');
            for (let i = 0; i < loginButtons.length; i++) {
                loginButtons[i].style.display = "none";
            }

        }
    }
});

//network req on login button submit
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
        .then(res => {
            // If the response is successful, parse the JSON response to get the JWT token
            return res.json();
        })
        .then(data => {
            console.log(data);

            loginConatiner.style.display = "none";
            // Display the  message
            const customAlert = document.querySelector("#custom-alert");
            customAlert.innerText = data.message;
            customAlert.style.display = "block";

            // Automatically hide the message after 3 seconds (3000 milliseconds)
            setTimeout(function () {
                customAlert.style.display = "none";
            }, 3000);

            if (data.message == "Login successful") {

                const jwtToken = data.token; // Get the JWT token
                document.cookie = `jwtToken=${jwtToken}; expires=Sun, 31 Dec 2023 23:59:59 GMT; path=/`;

                // Store other user data in a single object
                const userData = {
                    quant: data.quant,
                    isLoggedIn: true,
                    username: data.username,
                    phone: data.phone
                };

                const userDataJSON = JSON.stringify(userData); // Convert the object to a JSON string
                document.cookie = `userData=${userDataJSON}; expires=Sun, 31 Dec 2023 23:59:59 GMT; path=/`;  // Save the JSON string in a single cookie

                location.reload(); //refresh the page 

            }
        })
        .catch(error => {
            console.error('Request failed:', error);
        });
});

// Logout functionality
const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", () => {
    // Function to delete a cookie by setting its expiration date to the past
    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    // Clearing all user data from the cookie and local storage
    deleteCookie("jwtToken");
    deleteCookie("userData");
    // Delay the page reload to ensure the logout data is set before reloading
    setTimeout(() => {
        location.reload(); // Use location.reload() to refresh the page
    }, 200); // You can adjust the delay time if needed
});

