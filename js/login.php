<?php
if ( isset( $_POST ) ) {
    $userName = 'root';
    $password = '';
    $server = 'localhost';
    $db = 'swagpizzacart';

    $data = file_get_contents( 'php://input' );
    $User = json_decode( $data );

    $conn = mysqli_connect( $server, $userName, $password, $db );
    if ( $conn ) {
        $lpno = $User->lpno;
        $sql = "SELECT * FROM `userdetails` WHERE `phone` LIKE '$lpno'";
        $result = mysqli_query( $conn, $sql );
        $count = mysqli_num_rows( $result );
        if ( $count > 0 ) {
            mysqli_close( $conn );
            echo 1;
            exit();
        } else {
            echo 0;
            exit();
        }
    } else {
        die( 'Error connecting to the database' );
    }
}
?>
