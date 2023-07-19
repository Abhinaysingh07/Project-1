<?php
$userName = 'root';
$password = '';
$server = 'localhost';
$db = 'swagpizzacart';
$uid = 16;
if ( $_SERVER[ 'REQUEST_METHOD' ] == 'GET' ) {
    $conn = mysqli_connect( $server, $userName, $password, $db );

    if ( $conn ) {
        $sql5 = "SELECT * FROM cart WHERE uid = $uid";
        $res = mysqli_query( $conn, $sql5 );
        if ( $res ) {
            $cartData = mysqli_fetch_assoc( $res );
            echo json_encode( $cartData );
        } else {
            die( 'Error retrieving cart data from the database' );
        }
    } else {
        die( 'Connection failed with the database' );
    }
}
?>