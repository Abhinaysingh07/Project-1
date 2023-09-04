import { dishList, todaySpecialList } from "../data/data.js";

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
  searchResult.innerHTML = "";
  search_form.classList.toggle("search_toggle");
  document.documentElement.style.overflow = "auto"; // Disable scrolling on html element
});
// searchBtn.addEventListener("click", () => {
//   const searchBoxValue = document.getElementById("search-box").value;
//   const searchResult = document.getElementsByClassName("search-result")[0];

//   dishList.forEach((dish) => {
//     let dishName = dish.name;
//     let res = dishName.includes(searchBoxValue);

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
      searchResult.innerHTML = "";
      document.documentElement.style.overflow = "auto"; // Disable scrolling on html element
      search_form.classList.toggle("search_toggle");
    });
  });
});





// start of generating html for  dishes Section dynamically


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

// start of generating html for  dishes Section dynamically

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

// Function to get cookie value by name
function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}
// ... Your existing code ...

let btnAddToCart = document.querySelectorAll(".add-to-cart-btn");

btnAddToCart.forEach((button) => {
  button.addEventListener("click", () => {
    let dishName = button.dataset.dishName;
    let dishPrice = button.dataset.dishPrice;
    let dishImage = button.dataset.dishImage;
    let cartItems = {
      dishName: dishName,
      quantity: 1,
      price: dishPrice,
      image: dishImage,
    };

    const token = localStorage.getItem('jwtToken'); // Retrieve token from local storage


    fetch("http://localhost:5500/saveUserCartData", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token // Include the JWT token from the input field
      },
      body: JSON.stringify({ cartItems }), // Use shorthand for object property
    })
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
