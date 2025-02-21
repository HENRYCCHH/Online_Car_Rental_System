<?php

$strJSONContents = file_get_contents("cars.json");
$array = json_decode($strJSONContents, true);

foreach ($array["cars"] as &$car) {
    if ($car['availability_status']=="Yes") {
        echo "<div class='item'>"
                ."<h1 id='car_brand'>{$car['brand']}</h1>"
                ."<h2 id='car_model'>{$car['car_model']}</h2>"
                ."<h2 id='car_type'>{$car['type']}</h2>" 
                ."<img id='{$car['id']}' src='image/{$car['image']}' alt=''>"
                ."<div class='car-details'>"
                    ."<i class='ri-dashboard-3-line  car_icon'></i><span class='car-info' id='car_mileage'>{$car['mileage']}</span>"
                    ."<i class='ri-charging-pile-2-line  car_icon'></i><span class='car-info' id='car_fuel_type'>{$car['fuel_type']}</span>"
                    ."<i class='ri-sofa-line car_icon'></i><span class='car-info' id='car_seats'>{$car['seats']}</span>"
                ."</div>"
                ."<h3 class='price'>$ {$car['price_per_day']} /day</h3>" 
                ."<h3 class='description'>\" {$car['description']} \" </h3>"
                ."<h4 class='quantity'>Available Quantity: {$car['quantity']}</h4>"
                ."<h5 class='availability'>{$car['availability_status']}</h5>"
                ."<button class='addCart'>Rent</button>"
                ."<span class='warning'></span>"
            ."</div>";
    }
    else {
        echo "<div class='item'>"
            ."<h1 id='car_brand'>{$car['brand']}</h1>"
            ."<h2 id='car_model'>{$car['car_model']}</h2>"
            ."<h2 id='car_type'>{$car['type']}</h2>" 
            ."<img id='{$car['id']}' src='image/{$car['image']}' alt=''>"
            ."<div class='car-details'>"
                ."<i class='ri-dashboard-3-line  car_icon'></i><span class='car-info' id='car_mileage'>{$car['mileage']}</span>"
                ."<i class='ri-charging-pile-2-line  car_icon'></i><span class='car-info' id='car_fuel_type'>{$car['fuel_type']}</span>"
                ."<i class='ri-sofa-line car_icon'></i><span class='car-info' id='car_seats'>{$car['seats']}</span>"
            ."</div>"
            ."<h3 class='price'>$ {$car['price_per_day']} /day</h3>" 
            ."<h3 class='description'>\" {$car['description']} \" </h3>"
            ."<h4 class='quantity'>Available Quantity: {$car['quantity']}</h3>"
            ."<h5 class='availability'>{$car['availability_status']}</h5>"
            ."<button class='addCart' id='not_Available'>Rent</button>"
            ."<span class='warning'>Not Available</span>"
        ."</div>";

    }    
}

?> 