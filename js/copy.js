// Get all beers
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from beers', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from beer table are: \n', rows)
        })
    })
})

// Get an beer
app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * FROM beers WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('The data from beer table are: \n', rows)
        })
    })
});

// Delete a beer
app.delete('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('DELETE FROM beers WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Beer with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }

            console.log('The data from beer table are: \n', rows)
        })
    })
});

// Add beer


// add data

app.post('/saveData', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const params = req.body;
        connection.query('INSERT INTO cart SET ?', params, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Beer with the record ID  has been added.`)
            } else {
                console.log(err)
            }

            console.log('The data from beer table are:11 \n', rows)

        })
    })
});

//update the data

app.put('', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id, name, tagline, description, image } = req.body

        connection.query('UPDATE beers SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?', [name, tagline, description, image, id], (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(`Beer with the name: ${name} has been added.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})

////////////////////////////////////



<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/swag_orig/css/cart.css">
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
    function f1() {
      fetch("http://localhost:5500/getCartData")
        .then((response) => response.json())
        .then((realRes) => {
          renderCartList(realRes);
          calculateTotalAmount(realRes);
        })
        .catch((error) => {
          console.error('Error fetching cart data:', error);
        });
    }

    

    function renderCartList(realRes) {
      realRes.forEach((cartItem) => {

        let Html_cart_list = "";
        let cart = document.querySelector(".block");
        realRes.forEach((object, index) => {
          console.log(object.image);
          html = ` <div class="container">
        <div class="box box1">
          <div class="innerBoxes1 imgbox ">
            <img src="${object.image}.png" alt="" />
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
          <div class="innerBoxes2 stot">${parseInt(object.price) * parseInt(object.quantity)}Rs</div>
          <button class="innerBoxes2 removeBtn" onclick="deleteItem(${obj.dishname})">Remove</button>
        </div>
      </div>
                  `;
          if (!Html_cart_list.includes(html)) {
            Html_cart_list += html;
          }
        });
        cart.innerHTML = Html_cart_list;
      })
    }

    function calculateTotalAmount(realRes) {
      let totAmtToPay = 0;
      realRes.forEach((obj, index) => {
        totAmtToPay += parseInt(obj.price) * parseInt(obj.quantity);
      });
      const subTotal = document.querySelector(".sub-total-amt");
      const taxAmt = document.querySelector(".tax-amt");
      const grandTotal = document.querySelector(".grand-total");
      const totAmtNum = document.querySelector(".totAmtNum");
      totAmtNum.innerHTML = totAmtToPay + "Rs";
      subTotal.innerHTML = totAmtToPay + "Rs";
      taxAmt.innerHTML = (totAmtToPay / 11).toFixed(2) + "Rs";
      grandTotal.innerHTML = (totAmtToPay / 11 + totAmtToPay).toFixed(2) + "Rs";
    }
    f1();
  </script>
</body>

</html>