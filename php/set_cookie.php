<?php
if (isset($_POST['reservations'])) {
    $reservationsJSON = $_POST['reservations'];
    $cookie_expiry = time() + (86400 * 30); // 86400 = 1 day, so this cookie will last for 30 days
    setcookie('reservations', $reservationsJSON, $cookie_expiry, "/"); // "/" means the cookie is available in the entire website
    echo "Cookie set successfully!";
} else {
    echo "Invalid request!";
}
?>