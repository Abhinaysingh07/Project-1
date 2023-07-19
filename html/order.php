<?php
$userName = 'root';
$password = '';
$server = 'localhost';
$db = 'swagpizzacart';

// Check if the request method is 'POST' before accessing the form data.

if ( $_SERVER[ 'REQUEST_METHOD' ] == 'POST' ) {
    $uname = $_POST[ 'uname' ];
    $orderName = $_POST[ 'orderName' ];
    $ph_num = $_POST[ 'num' ];
    $address = $_POST[ 'address' ];
    $qty = $_POST[ 'qty' ];

    // Establishing connection

    $conn = mysqli_connect( $server, $userName, $password, $db );

    // Inserting values into table
    $sql = "INSERT INTO orderdetails (customername, ordername, phonenumber, quanity, adress) VALUES ('$uname', '$orderName', '$ph_num', '$qty', '$address')";

    $data = mysqli_query( $conn, $sql );

    if ( $data ) {
        echo '<script>alert("Your order has been received")</script>'.'<br>';
    } else {
        echo 'Failed to insert data into table due to '.mysqli_connect_error();
    }

    // Close the connection
    mysqli_close( $conn );
}
?>