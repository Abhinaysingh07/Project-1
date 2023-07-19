<?php
$userName = 'root';
$password = '';
$server = 'localhost';
$db = 'swagpizzacart';
$cartItems = file_get_contents( 'php://input' );
$user = json_decode( $cartItems, true );
$uidInDatabase = 0;
$uid = 16;
// $user[ 0 ][ 'uid' ];

if ( $_SERVER[ 'REQUEST_METHOD' ] == 'POST' ) {
    $conn = mysqli_connect( $server, $userName, $password, $db );

    if ( $conn ) {
        $sql = "SELECT * FROM cart WHERE uid = $uid";
        $result = mysqli_query( $conn, $sql );
        $uidInDatabase = mysqli_num_rows( $result );
        if ( $uidInDatabase ) {
            $sql2 = "UPDATE cart SET cartlist = '$cartItems' WHERE uid = $uid";
            mysqli_query( $conn, $sql2 );
            echo '0';
        } else {
            $sql3 = "INSERT INTO cart (uid, cartlist) VALUES ($uid, '$cartItems')";
            mysqli_query( $conn, $sql3 );
            mysqli_close( $conn );
            echo '1';
        }
    } else {
        die( 'Connection failed with the database' );
    }
}
?>

