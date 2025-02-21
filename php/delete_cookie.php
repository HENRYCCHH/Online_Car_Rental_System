<?php
// Delete the 'reservations' cookie by setting its expiration time to a past time
if (isset($_COOKIE['reservations'])) {
    setcookie('reservations', '', time() - 3600, '/'); // Set the cookie with an expiration time in the past
    echo "Cookie deleted successfully!";
} else {
    echo "No cookie named 'reservations' found.";
}
?>