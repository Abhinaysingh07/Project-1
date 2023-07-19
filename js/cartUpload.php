<?php
$userName = 'root';
$password = '';
$server = 'localhost';
$db = 'swagpizzacart';
$cartItems = file_get_contents('php://input');
$user = json_decode($cartItems, true);
$uidInDatabase = 0;
$uid = 16;
// $user[0]['uid'];

if ( $_SERVER[ 'REQUEST_METHOD' ] == 'POST' ) {
    $conn = mysqli_connect($server, $userName, $password, $db);

    if ($conn) {
        $sql = "SELECT * FROM cart WHERE uid = $uid";
        $result = mysqli_query($conn, $sql);
        $uidInDatabase = mysqli_num_rows($result);
        if ($uidInDatabase) {
            $sql2 = "UPDATE cart SET cartlist = '$cartItems' WHERE uid = $uid";
            mysqli_query($conn, $sql2);
            echo '0';
        } else {
            $sql3 = "INSERT INTO cart (uid, cartlist) VALUES ($uid, '$cartItems')";
            mysqli_query($conn, $sql3);
            mysqli_close($conn);
            echo '1';
        }
    } else {
        die('Connection failed with the database');
    }
}

if ( $_SERVER[ 'REQUEST_METHOD' ] == 'GET' ) {
    $conn = mysqli_connect($server, $userName, $password, $db);

    if ($conn) {
        $sql5 = "SELECT * FROM cart WHERE uid = $uid";
        $res = mysqli_query($conn, $sql5);
        if ($res) {
            $cartData = mysqli_fetch_assoc($res);
            echo json_encode($cartData);
        } else {
            die('Error retrieving cart data from the database');
        }
    } else {
        die('Connection failed with the database');
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="/swag_orig/css/cart.css" />
  <title>Cart</title>
</head>

<body>
  <h1>Your Cart</h1>
  <div class="head">
    <center>
      <div class="container">
        <div class="box box1">
          <h3>Added Items</h3>
        </div>
        <div class="box box2">
          <h3>Quantity</h3>

          <h3>Subtotal</h3>

          <h3>Remove</h3>
        </div>
      </div>
    </center>
  </div>
  <center class="block"></center>
  <div class="foot">
    <h2 class="totAmt">
      total amount to pay: <span class="totAmtNum"></span>
    </h2>
  </div>
  <footer>
    <div class="paymentBox">
      <h1>Summary</h1>
      <div class="amount">
        <div class="subTotal">
          <h2>SUBTOTAL:</h2>
          <h2 class="sub-total-amt">0.00rs</h2>
        </div>
        <div class="tax">
          <h2>TAX:</h2>
          <h2 class="tax-amt">0.00rs</h2>
        </div>
        <div class="grandTotal">
          <h2>GRAND TOTAL:</h2>
          <h2 class="grand-total">0.00rs</h2>
        </div>
      </div>

      <div class="Checkout">
        <button class="checkout-btn">Proceed To Checkout</button>
      </div>
    </div>
  </footer>
  <script>

    let updatedArr = [];
    function f1() {
      fetch("/swag_orig/js/cartUpload.php")
        .then((res) => res.text())
        .then((data) => {
          console.log(data);
        })
        .catch();
      // updatedArr = JSON.parse(localStorage.getItem("myCartKey")); // Perform additional actions based on the updated local storage value
      renderCartList(); //function to render list items in page
      calculateTotalAmount();
    }

    function deleteItem(index) {
      // updatedArr.splice(index, 1);
      // localStorage.setItem("myCartKey", JSON.stringify(updatedArr));
      f1();
    }

    function renderCartList() {
      let Html_cart_list = "";
      let cart = document.querySelector(".block"); // access the first element in the collection
      updatedArr.forEach((object, index) => {
        html = ` <div class="container">
        <div class="box box1">
          <div class="innerBoxes1 imgbox ">
            <img src="${object.image}" alt="" />
          </div>
          <div class="innerBoxes1 textbox">
            <h3 class="itmName">${object.dishName}</h3>
            <h3 class="itmPrice">${object.price}RS</h3>
          </div>
        </div>
        <div class="box box2">
          <center>
            <div class="innerBoxes2 qty">${object.quantity}</div>
          </center>
          <div class="innerBoxes2 stot">${parseInt(object.price) * parseInt(object.quantity)
          }Rs</div>
          <button class="innerBoxes2 removeBtn" onclick="deleteItem(${index})">
            Remove
          </button>
        </div>
      </div>
                  `;
        if (!Html_cart_list.includes(html)) {
          Html_cart_list += html;
        }
      });
      cart.innerHTML = Html_cart_list;
    }

    function calculateTotalAmount() {
      let totAmtToPay = 0;
      updatedArr.forEach((obj, index) => {
        totAmtToPay += parseInt(obj.price) * parseInt(obj.quantity);
      });

      const subTotal = document.querySelector(".sub-total-amt");
      const taxAmt = document.querySelector(".tax-amt");
      const grandTotal = document.querySelector(".grand-total");
      const totAmtNum = document.querySelector(".totAmtNum");
      totAmtNum.innerHTML = totAmtToPay + "Rs";
      subTotal.innerHTML = totAmtToPay + "Rs";
      taxAmt.innerHTML = (totAmtToPay / 11).toFixed(2) + "Rs";
      grandTotal.innerHTML =
        (totAmtToPay / 11 + totAmtToPay).toFixed(2) + "Rs";
    }

    window.addEventListener("storage", f1); //on change in storage f1 will be called
    f1(); //f1 will always be running
  </script>

  
</body>

</html>