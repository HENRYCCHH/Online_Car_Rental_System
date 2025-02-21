<?php
if(isset($_COOKIE["reservations"])) {
    $reservationsJSON = $_COOKIE['reservations'];
    echo "{$reservationsJSON}";
} else {
    echo "No reservations cookie found!";
}
?>