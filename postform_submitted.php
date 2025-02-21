<?php

    $strJSONContents = file_get_contents("cars.json");
    $arrays = json_decode($strJSONContents, true);


    // Function to search for the key in any field
    function searchCars($arrays, $searchKey) {
        $results = [];
        foreach ($arrays as $cars) {
            foreach ($cars as $car) {
                foreach ($car as $key => $value){
                    if (stripos($value, $searchKey) !== false) {
                        $results[] = $car;
                        break;
                    }
                }    
            }
        }
        return $results;
    }




   // initial get data from database
    if(isset($_POST['key'])) {
        $searchKey = trim($_POST['key']);
        if($searchKey==""){
            foreach ($arrays["cars"] as &$car) {
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
                            ."<h4 class='quantity'>Available Quantity: {$car['quantity']}</h3>"
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
                        ."<button class='addCart' id='not_Available'>Rent</button>"
                        ."<span class='warning'>Not Available</span>"
                    ."</div>";
            
                }    
            }
    
        }        
    
        else {
            $matching_cars = searchCars($arrays, $searchKey);
            if (empty($matching_cars)) {
                foreach ($arrays["cars"] as &$car) {
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
                                ."<h4 class='quantity'>Available Quantity: {$car['quantity']}</h3>"
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
                            ."<button class='addCart' id='not_Available'>Rent</button>"
                            ."<span class='warning'>Not Available</span>"
                        ."</div>";
                
                    } 
                }    
            } 
            else {
                foreach ($matching_cars as &$car) {
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
                                ."<h4 class='quantity'>Available Quantity: {$car['quantity']}</h3>"
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
                            ."<button class='addCart' id='not_Available'>Rent</button>"
                            ."<span class='warning' >Not Available</span>"
                        ."</div>";
                
                    } 
                }
            }
            
        } 
    }    



?>