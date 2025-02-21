<?php


function searchCarQuantity($carID, $jsonData) {
    foreach ($jsonData['cars'] as $car) {
        if ($car['id'] == $carID) {
            return $car['quantity'];
        }
    }
    return 'Car not found';
}

function updateCarQuantity($carID, $newQuantity, &$jsonData) {
    foreach ($jsonData['cars'] as &$car) {
        if ($car['id'] == $carID) {
            $car['quantity'] = $newQuantity;
            return true;
        }
    }
    return false;
}

function updateCarAvailability($carID, &$jsonData) {
    foreach ($jsonData['cars'] as &$car) {
        if ($car['id'] == $carID) {
            $car['availability_status'] = 'No';
        }
    }
}



$tempFilePath = 'temp_cars.json';
$file = fopen($tempFilePath, 'w');
// Check if the file was opened successfully
if ($file === false) {
    die('Error: Unable to open the file for writing.');
}

// Write an empty JSON object to the file
$empty_json = json_encode(new stdClass());

fwrite($file, $empty_json);
fclose($file);





// Link to MySQL server
$conn = mysqli_connect('xxx.amazonaws.com', 'xxx', 'xxx', 'assignment2');
if (mysqli_connect_errno()) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to connect to MySQL: ' . mysqli_connect_error()]);
    exit;
}

// Link to JSON file
$jsonFilePath = 'cars.json';
$jsonString = file_get_contents($jsonFilePath);
$jsonData = json_decode($jsonString, true);
if ($jsonData === null) {
    echo json_encode(['status' => 'error', 'message' => 'Error decoding JSON']);
    exit;
}

$orderID = isset($_POST['orderID']) ? intval($_POST['orderID']) : 0;
$productID = isset($_POST['productID']) ? intval($_POST['productID']) : 0;

// Search car order from SQL
$stmt = $conn->prepare("SELECT * FROM car_rental_orders WHERE order_id = ?");
$stmt->bind_param("i", $orderID);
$stmt->execute();
$result = $stmt->get_result();

// Read car in stock from JSON
$current_stock = searchCarQuantity($productID, $jsonData);

if ($result && $result->num_rows == 1) {
    $currentOrder = $result->fetch_assoc();
    $car_order_quantity = intval($currentOrder['car_order_quantity']);

    if ($current_stock >= $car_order_quantity) {
        $new_stock = $current_stock - $car_order_quantity;
        if ($new_stock==0){
            updateCarAvailability($productID, $jsonData);
        }
        // Update the car quantity in JSON data
        $updated = updateCarQuantity($productID, $new_stock, $jsonData);

        if ($updated) {
            // Save updated JSON data back to file
            $writeResult = file_put_contents($tempFilePath, json_encode($jsonData, JSON_PRETTY_PRINT));
            if ($writeResult === false) {
                echo json_encode(['status' => 'error', 'message' => 'Failed to write to temp_cars.json']);
                exit;
            }

            // Rename temp file to original file
            if (!rename($tempFilePath, $jsonFilePath)) {
                echo json_encode(['status' => 'error', 'message' => 'Failed to rename temp_cars.json to cars.json']);
                exit;
            }

            $update_stmt = $conn->prepare("UPDATE car_rental_orders SET status = 'Confirmed' WHERE order_id = ?");
            $update_stmt->bind_param("i", $orderID);
            $update_result = $update_stmt->execute();

            if ($update_result) {
                echo json_encode(['status' => 'success', 'message' => 'Stock updated successfully', 'new_stock' => $new_stock]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to update order status']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update car quantity']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Product is out of stock']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Order not found']);
}

$stmt->close();
$conn->close();
?>
