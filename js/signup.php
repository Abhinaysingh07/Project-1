<?php
if ( isset( $_POST ) ) {
    $userName = 'root';
    $password = '';
    $server = 'localhost';
    $db = 'swagpizzacart';

    $data = file_get_contents( 'php://input' );
    $User = json_decode( $data );
    $email = ''
    $conn = mysqli_connect( $server, $userName, $password, $db );
    if ( $conn ) {

        $sql = "SELECT * FROM `userdetails` WHERE `phone` LIKE '$pno'";
        $result = mysqli_query( $conn, $sql );
        $count = mysqli_num_rows( $result );
        if ( $count > 0 ) {
            mysqli_close( $conn );
            echo 'You already have an account with this number';
        } else {
            $sql2 = "INSERT INTO userdetails (username, phone, email) VALUES ('$User->s_username',  $User->pno, '$email')";

            $result2 = mysqli_query( $conn, $sql2 );
            mysqli_close( $conn );

            if ( $result2 ) {
                echo 'Account created';
            } else {
                echo 'Error creating account';
            }
        }
    } else {
        die( 'Error connecting to the database' );
    }
}
?>
