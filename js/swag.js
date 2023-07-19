// Perform any cleanup or execute specific actions here

window.addEventListener("beforeunload", function () {
  localStorage.clear();
});

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
srch.addEventListener("click", () => {
  search_form.classList.toggle("search_toggle");
});
close.addEventListener("click", () => {
  search_form.classList.toggle("search_toggle");
});

// start of generating html for  dishes Section dynamically

html = "";
dishList.forEach((dish) => {
  html += `
  <div class="dish">
    <div class="desc1">
      <i class="fas fa-heart"></i>
      <i class="fas fa-eye"  onclick="eyee()"></i>
      <div class="imgbox">  <img src="${dish.image}" alt="" />      </div>
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

html2 = "";
todaySpecialList.forEach((dish) => {
  html2 += `
        <div class="box">
          <div class="specaial_dish_image">
            <img class="image" src="${dish.image}" alt="" />
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

// starting adding dishes to cartItems array on click of addToCart button

let cartItems = [];

let btnAddToCart = document.querySelectorAll(".add-to-cart-btn");
btnAddToCart.forEach((button) => {
  button.addEventListener("click", () => {
    let dishName = button.dataset.dishName;
    let dishPrice = button.dataset.dishPrice;
    let dishImage = button.dataset.dishImage;
    let matchingItem = 0;
    cartItems.forEach((item) => {
      if (dishName === item.dishName) {
        matchingItem = item;
      }
    });
    if (matchingItem) {
      matchingItem.quantity += 1;
    } else {
      cartItems.push({
        uid: 17,
        dishName: dishName,
        quantity: 1,
        price: dishPrice,
        image: dishImage,
      });
    }
    function uploadCartToDatabase() {
      const requestBody = JSON.stringify(cartItems);

      fetch("/swag_orig/js/cartUpload.php", {
        method: "post",
        headers: {
          "Content-Type": "application/json", // fixed the header name to "Content-Type"
        },
        body: requestBody, // pass the JSON string as the request body
      })
        .then((res) => {
          return res.text();
        })
        .then((data) => {
          if (data == "1") {
            console.log("added");
          } else if (data == "0") {
            alert("hrr")
            console.log("updated");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } uploadCartToDatabase();


    // localStorage.setItem('myCartKey', JSON.stringify(cartItems));
  });
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
