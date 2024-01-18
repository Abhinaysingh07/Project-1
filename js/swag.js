import { dishList, todaySpecialList } from "../data/data.js";

// start of generating html for  dishes Section dynamically
let html = "";
dishList.forEach((dish) => {
  html += `
  <div class="dish" id="${dish.id}">
    <div class="desc1">
      <i class="fas fa-heart"></i>
      <i class="fas fa-eye"  onclick="eyee()"></i>
      <div class="imgbox">  <img loading="lazy" src="${dish.image}" alt="" />      </div>
      <h3 class = "item-title dish_Name">${dish.name}</h3>
      <div class="stars">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star-half-alt"></i>
      </div>
    </div>
    <div class="desc2">
       <span class="item_price">${dish.price}Rs</span>
    <button
          class="add-to-cart-btn"
          data-dish-name="${dish.name}"
          data-dish-price="${dish.price}"
          data-dish-image="${dish.image}"
        >
          Add To Cart
        </button>
    </div>
  </div>
`;
});
const dishes = document.querySelector(".dishes");
dishes.innerHTML = html;

let html2 = "";
todaySpecialList.forEach((dish) => {
  html2 += `
        <div class="box" id="${dish.id}">
          <div class="specaial_dish_image">
            <img loading="lazy" class="image" src="${dish.image}" alt="" />
            <a href="" class="fas fa-heart"></a>
          </div>
          <div class="stars">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
          </div>
          <h3 class = "dish_Name">${dish.name}</h3>
          <p>
           ${dish.description}
          </p>
          <div class="div2">
            <button
              class="add-to-cart-btn"
              data-dish-name="${dish.name}"
              data-dish-price="${dish.price}"
              data-dish-image="${dish.image}"
            >
              Add To Cart
            </button>
            <span>${dish.price}Rs</span>
          </div>
        </div>
  `;
});
const boxes = document.querySelector(".boxes");
boxes.innerHTML = html2;


// making search and nav toggle bar script
const bars = document.getElementById("bars");
const n_bars = document.getElementsByClassName("navbar")[0];
const n_list = document.getElementsByClassName("nav_list")[0];
const nav_title = document.querySelectorAll(".nav_title");

bars.addEventListener("click", () => {
  bars.classList.toggle("fa-times");
  n_bars.classList.toggle("active");
  n_bars.classList.toggle("temp");
  n_list.classList.toggle("active");
  for (let i = 0; i < nav_title.length; i++) {
    nav_title[i].classList.toggle("active");
  }
});
const srch = document.getElementById("srch");
const search_form = document.getElementById("search-form");
const close = document.getElementById("close");
const searchBtn = document.getElementById("search-btn");
const searchResult = document.getElementsByClassName("search-result")[0];

srch.addEventListener("click", () => {
  search_form.classList.toggle("search_toggle");
  document.documentElement.style.overflow = "hidden"; // Disable scrolling on html element
});
close.addEventListener("click", () => {
  searchBox.value = "";
  searchResult.innerHTML = "";
  document.documentElement.style.overflow = "auto"; // Disable scrolling on html element
  search_form.classList.toggle("search_toggle");
});

//searching an item 
const searchBox = document.getElementById("search-box");
searchBox.addEventListener("input", () => {
  const searchBoxValue = searchBox.value.toLowerCase();
  let html = '';

  dishList.forEach((dish) => {
    let dishName = dish.name.toLowerCase();
    if (dishName.includes(searchBoxValue)) {
      html +=
        `<a href="#${dish.id}" class="dishess">
          <div class="img"><img src="${dish.image}" alt=""></div>
          <div class="desc">
            <div class="name">${dish.name}</div>
            <div class="innerdesc">
              <div class="price">${dish.price}RS</div>
              <div class="rating"><p>3.5</p></div>
            </div>
          </div>
        </a>`;
    }
  });

  todaySpecialList.forEach((dish) => {
    let dishName = dish.name.toLowerCase();
    if (dishName.includes(searchBoxValue)) {
      html +=
        `<a href="#${dish.id}" class="dishess">
          <div class="img"><img src="${dish.image}" alt=""></div>
          <div class="desc">
            <div class="name">${dish.name}</div>
            <div class="innerdesc">
              <div class="price">${dish.price}RS</div>
              <div class="rating"><p>3.5</p></div>
            </div>
          </div>
        </a>`;
    }
  });

  searchResult.innerHTML = html;

  let a = document.querySelectorAll(".dishess");
  a.forEach((dish) => {
    dish.addEventListener("click", () => {
      searchBox.value = "";
      searchResult.innerHTML = "";
      document.documentElement.style.overflow = "auto"; // Disable scrolling on html element
      search_form.classList.toggle("search_toggle");
    });
  });
});


// Function to get the value of a cookie by its name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to handle adding items to the cart
function addToCart(button) {
  if (userData) {
    if (userData.isLoggedIn === true) {
      let dishName = button.dataset.dishName;
      let dishPrice = button.dataset.dishPrice;
      let dishImage = button.dataset.dishImage;
      let cartItems = {
        dishName: dishName,
        quantity: 1,
        price: dishPrice,
        image: dishImage,
      };

      // Get the jwtToken from the jwtToken cookie
      const jwtToken = getCookie("jwtToken");

      // Now you can use jwtToken in the Authorization header
      fetch("http://localhost:5500/saveUserCartData", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`, // Use Authorization header for JWT
        },
        body: JSON.stringify({ cartItems }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // Update the userData 
          userData.quant = data.quant;
          document.cookie = `userData=${JSON.stringify(userData)}; expires=Sun, 31 Dec 2030 23:59:59 GMT; path=/`;

          document.querySelector(".fa-shopping-cart").innerHTML = data.quant;
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  } else {
    // Show the message
    const customAlert = document.querySelector("#custom-alert");
    customAlert.innerText = "Please Login First";
    customAlert.style.display = "block";
    // Automatically hide the message after 3 seconds (3000 milliseconds)
    setTimeout(function () {
      customAlert.style.display = "none";
    }, 3000);
  }
}

// Event listener to add items to the cart
document.body.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart-btn")) {
    addToCart(event.target);
  }
});




function eyee() {
  let eye = document.getElementsByClassName("eyes")[0];
  eye.style.display = "flex";
  let eye1 = document.getElementById("eye1");
  eye1.style.display = "block";

  const cl = document.getElementById("closed");
  cl.addEventListener("click", () => {
    let eye = document.getElementsByClassName("eyes")[0];
    eye.style.display = "none";
  });
}

