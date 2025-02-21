<?php
   function isCarInStock($car_id) {
    $strJSONContents = file_get_contents("cars.json");
    $array = json_decode($strJSONContents, true);

    // find the car by car_id
    foreach ($array["cars"] as $car) {
        if ($car["id"] == $car_id) {
            return $car["quantity"];
        }
    }
    // If car_id is not found
    return -1;
}

   if(isset($_POST['key'])) {
        $product_search_id = $_POST['key'];
        $stock_quantity = isCarInStock(($product_search_id));
        if ($stock_quantity>=0){
        echo "{$stock_quantity}";
        }
        else {
        echo "Search key not provided.";
        }
   }  

?>