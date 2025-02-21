<?php
// Database connection
$conn = mysqli_connect('xxx.amazonaws.com', 'xxx', 'xxx', 'assignment2');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$product_id = isset($_POST['id']) ? mysqli_real_escape_string($conn, $_POST['id']) : '';
$cartQuantity = isset($_POST['quantity']) ? mysqli_real_escape_string($conn, $_POST['quantity']) : '';
$startDate = isset($_POST['startDate']) ? mysqli_real_escape_string($conn, $_POST['startDate']) : '';
$endDate  = isset($_POST['endDate']) ? mysqli_real_escape_string($conn, $_POST['endDate']) : '';
$name = isset($_POST['name']) ? mysqli_real_escape_string($conn, $_POST['name']) : '';
$email = isset($_POST['email']) ? mysqli_real_escape_string($conn, $_POST['email']) : '';
$phone = isset($_POST['phone']) ? mysqli_real_escape_string($conn, $_POST['phone']) : '';
$license = isset($_POST['license']) ? mysqli_real_escape_string($conn, $_POST['license']) : '';
$totalPrice = isset($_POST['totalPrice']) ? intval($_POST['totalPrice']) : 0;

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO car_rental_orders (car_id, car_order_quantity, start_date, end_date,  customer_name, email, phone_number, license, total_price, status) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, 'unconfirmed')");
$stmt->bind_param("iissssssi", $product_id, $cartQuantity,$startDate, $endDate, $name, $email, $phone, $license, $totalPrice);


if ($stmt->execute()) {
    // Get the last inserted ID
    $order_id = $stmt->insert_id;
    echo "$order_id, $product_id";
} else {
    echo json_encode(['status' => 'error', 'message' => 'Query failed: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
