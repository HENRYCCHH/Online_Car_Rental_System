$(document).ready(function(){
    let iconCart = document.querySelector('.icons');
    let body = document.querySelector('body');
    let closeCart = document.querySelector('.close');
    let listCartHTML = document.querySelector('.listCart');
    let carts= [];
    let tempOrder = '';
    let receivedData = '';
    let totalCartPrice = document.querySelector('#priceSum');
    let cartWarning = document.querySelector('#cart_warning');
    let cartStartDate = document.querySelector('#startDateTag');
    let cartEndDate = document.querySelector('#endDateTag');
    let deliveryItem = document.querySelector('.deliveryItem');
    let orderID = -1;
    let productID = -1;
    let carData = { cars: [] };
    let typingTimer; 
    const doneTypingInterval = 500; // Time in ms (0.5 second)


    document.getElementById('license').value = 'Choose..';

    const nameBox = $('#name');
    const emailAddressBox = $('#emailAddress');
    const phoneBox = $('#phone');
    const licenseBox = $('#license');

    const searchBox = document.getElementById('search_keyword');
    const recentKeywords = document.getElementById('recentKeywords');
    const inputElements = document.querySelectorAll('.inputClass');
    



    // ----- event handling ----- //


    // Event listener for focus on search box
    searchBox.addEventListener('focus', () => {
        if (searchBox.value === '') {
            displayRecentKeywords();
        }
    });

    // Event listener for input on search box
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.trim();
        if (query === '') {
            displayRecentKeywords();
        } else {
            displaySuggestions(query);
        }
    });

    // Store the search keyword when a search is performed
    document.getElementById('search_form').addEventListener('submit', (event) => {
        event.preventDefault();
        const keyword = searchBox.value.trim();
        if (keyword !== '') {
            let keywords = getRecentKeywords();
            if (!keywords.includes(keyword)) {
                keywords.push(keyword);
                if (keywords.length > 3) { // Limit to 4 recent keywords
                    keywords.shift();
                }
                localStorage.setItem('recentKeywords', JSON.stringify(keywords));
            }
            recentKeywords.style.display = 'none';
        }
    });


    // Hide recent keywords dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.first_row')) {
            recentKeywords.style.display = 'none';
        }
    });



    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    })

    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    })

    listCartHTML.addEventListener('click', () => {
        clickPlusMinus();
    })

    

    // ----------clicking "brands"-----------//
    $('.branddropdown').click(function(){
        if ($('body').hasClass('showtype')) {
            body.classList.toggle('showtype');
        }    
        body.classList.toggle('showbrand');
    });   
    
    // ----------clicking "types"-----------//
    $('.typedropdown').click(function(){
        if ($('body').hasClass('showbrand')) {
            body.classList.toggle('showbrand');
        }  
        body.classList.toggle('showtype');
    }); 



    //----------pressing the "home" tab-----//
    $('#home_tag').click(function(){
        $('#contentList').load('read_json.php');
        $('#productlistTitle').text("CAR FOR RENTAL");
    });


    //--------when clicking "brands" or "types" and then search-------//
    $('.megamenu_link a').click(function(){
        var textContent = $(this).text();
            $.ajax({
                url: 'postform_submitted.php',
                method: 'POST',
                data: { key: textContent },
                success: function(response){
                    $('#productlistTitle').text(textContent);
                    $('#contentList').empty();
                    $('#contentList').html(response);
                },
                error: function(xhr, status, error){
                    // Handle errors
                    console.error(error);
                }
            });   
    });
    


    // *******inital load data to the web page *******////
    $('#contentList').load('read_json.php', function(response, status, xhr){
        if (status == "success") {
            //  load content to receivedData for later use
            receivedData = response;
        }
        else {
            console.error("Error loading content: " + status);
        }
        getReservationCookie(addReservationToList);    
    });




    
    // when search is performed
    $('#search_form').submit(function(event){
        event.preventDefault();
        // Get the search keyword from the input field
        var keyword = $('#search_keyword').val();
        
        // Send the keyword to getform_submitted.php using AJAX
        $.ajax({
            url: 'postform_submitted.php',
            method: 'POST',
            data: { key: keyword },
            success: function(response){

                // Handle the response from the PHP script
                if (keyword ==""){
                    $('#productlistTitle').text("CAR FOR RENTAL");
                }
                else {
                    $('#productlistTitle').text('Search result for "' + keyword + '"');
                }    
                $('#contentList').empty();
                $('#contentList').html(response);
            },
            error: function(xhr, status, error){
                // Handle errors
                console.error(error);
            }
        });
    });


    // handle add to cart clicking
    $('.listProduct').on('click', '.addCart', function(event){
        let thisProduct = $(this);
        let car_id = $(this).closest('.item').find('img').attr('id');
        let car_availability = $(this).closest('.item').find('h5').text().trim();
        let positionThisProductInCart = carts.findIndex((value) => value.product_id == car_id);

        inStockSearch(car_id, positionThisProductInCart, function(canAdd){
            let reachMaximum = document.querySelector('.reachMaximum');
            if (car_availability=="Yes"){
                if (!canAdd){
                    thisProduct.siblings('.warning').text("Reaching Maximum Availability");
                    $('#' + car_id).siblings('.addCart').css('color', '#eee');
                    $('#' + car_id).siblings('.addCart').css('background-color','lightgrey');
                    $('#' + car_id).siblings('.addCart').hover(function() {
                        $(this).css('color', '#eee');
                        $(this).css('background-color','lightgrey');
                    }, function() {
                        $(this).css('color', '#eee'); 
                        $(this).css('background-color','lightgrey');
                    });
                    if (reachMaximum){
                        reachMaximum.textContent = "*Reaching Maximum Availability";
                    }    
                }
                else{
                    thisProduct.siblings('.warning').text("");
                    thisProduct.siblings('.addCart').css('background-color','#2774e1');
                    thisProduct.siblings('.addCart').hover(function() {
                        $(this).css('background-color', '#999');
                        $(this).css('color', 'black');
                    }, function() {
                        $(this).css('background-color', '#2774e1'); 
                        $(this).css('color', '#eee'); 
                    });
                    if (reachMaximum){
                        reachMaximum.textContent = "";
                    }
                } 
            }
        }); 

        if (!$('body').hasClass('showCart')) {
            body.classList.toggle('showCart');
        }     
    });



    //clicking on starting date in cart
    $(document).on('input', '#startDateTag', function() {
            carts[0].startDate = $(this).val();
            addCartToHTML();
    });



    //clicking on end date in cart
    $(document).on('input', '#endDateTag', function() {
        carts[0].endDate = $(this).val();
        addCartToHTML();

});

    //clicking on main logo
    $('#mainLogo').click(function(){
        $('#contentList').load('read_json.php');
        $('#productlistTitle').text("CAR FOR RENTAL");
    })

    // clear cart when clicked
    $('.clearCart').click(function(){
        clearCart();
    });


    //------clearCart function---//
    const clearCart = () =>{
        carts= [];
        addCartToHTML();
        $.post('php/delete_cookie.php', function(response) {
        });
        nameBox.val("");
        emailAddressBox.val("");
        phoneBox.val("");
        licenseBox.val("");
        body.classList.toggle('showCart');
        $('#cart_warning').text(""); 
        $('.inputCheck').text("");

        $('#contentList').load('read_json.php', function(response, status, xhr){
            if (status == "success") {
                //  load content to receivedData for later use
                receivedData = response;
            }
            else {
                console.error("Error loading content: " + status);
            }
            getReservationCookie(addReservationToList);    
        });
    }



    $('#home_tag').hover(
        function() {
          $(this).css('transform', 'scale(1.2)');
        },
        function() {
          $(this).css('transform', 'scale(1)');
        }
      );


    $('.buttonSubmit').hover(
        function(){
            $(this).css('background-color', 'rgb(0, 255, 128)');
        },
        function(){
            $(this).css('background-color', '#E8BC0E');
        }    
    );  


 // ----- function ----- //



    // Function to load car data from JSON file
    async function loadCarData() {
        try {
            const response = await fetch('cars.json');
            carData = await response.json();
        } catch (error) {
            console.error('Error loading car data:', error);
        }
    }



    // Function to get recent keywords from local storage
    function getRecentKeywords() {
        let keywords = localStorage.getItem('recentKeywords');
        if (keywords) {
            return JSON.parse(keywords);
        }
        return [];
    }

    // Function to display recent keywords
    function displayRecentKeywords() {
        const keywords = getRecentKeywords();
        recentKeywords.innerHTML = '';
        if (keywords.length > 0) {
            recentKeywords.style.display = 'block';
            // Add "Recent Searches" header
            const header = document.createElement('div');
            header.textContent = 'Recent Searches';
            header.classList.add('header');
            recentKeywords.appendChild(header);
            // Add recent keywords
            keywords.forEach(keyword => {
                const div = document.createElement('div');
                div.textContent = keyword;
                div.addEventListener('click', () => {
                    searchBox.value = keyword;
                    recentKeywords.style.display = 'none';
                });
                recentKeywords.appendChild(div);
            });
        } else {
            recentKeywords.style.display = 'none';
        }
    }


    // Function to display suggestions based on user input
    function displaySuggestions(query) {
        recentKeywords.innerHTML = '';
        if (!carData || !carData.cars) {
            console.error('Car data is not loaded correctly');
            return;
        }
        const matchesSet = carData.cars.reduce((acc, car) => {
            if (car.type.toLowerCase().includes(query.toLowerCase())) {
                acc.add(car.type);
            }
            if (car.brand.toLowerCase().includes(query.toLowerCase())) {
                acc.add(car.brand);
            }
            if (car.car_model.toLowerCase().includes(query.toLowerCase())) {
                acc.add(car.car_model);
            }
            return acc;
        }, new Set());
        
        const matches = Array.from(matchesSet);

        
        if (matches.length > 0) {
            recentKeywords.style.display = 'block';
            // Add "Best Matches" header
            const header = document.createElement('div');
            header.textContent = 'Suggestions';
            header.classList.add('header');
            recentKeywords.appendChild(header);
            // Add matches
            matches.forEach(car => {
                const div = document.createElement('div');
                const matchText = `${car}`;
                div.innerHTML = matchText;
                div.addEventListener('click', () => {
                    searchBox.value = matchText;
                    recentKeywords.style.display = 'none';
                });
                recentKeywords.appendChild(div);
            });
        } else {
            recentKeywords.style.display = 'none';
        }
    }



    const inStockSearch = (product_id, positionThisProductInCart, callback) =>{
        let canAdd = false;
        $.ajax({
            url: 'postform_in_stock.php',
            method: 'POST',
            data: { key: product_id },
            success: function(response){
                let inStockQuantity = parseInt(response);
                if (positionThisProductInCart < 0){
                    let cartQuantity = 0;
                    if (inStockQuantity > cartQuantity){
                        addToCart(product_id);
                        if (inStockQuantity - cartQuantity == 1){
                        canAdd = false;
                        }
                        else {
                            canAdd = true;
                        }
                    } 
                    else {
                        canAdd = false;
                    }
                     
                }
                else {
                    let cartQuantity = carts[positionThisProductInCart].quantity;
                    if (inStockQuantity > cartQuantity){
                        addToCart(product_id);
                        if (inStockQuantity - cartQuantity == 1){
                        canAdd = false;
                        }
                        else {
                            canAdd = true;
                        }
                    } 
                    else {
                        canAdd = false;
                    }
                }     
                callback(canAdd);
            },
            error: function(xhr, status, error){
                // Handle errors
                console.error(error);
                callback(false);
            }
        });
    }



    const clickPlusMinus = () => {
        let positionClick = event.target;
        if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = 'minus';
            if(positionClick.classList.contains('plus')){
                type = 'plus';
            }
            changeQuantity(product_id, type);
        }
    }
 
    

    //add to cart function
    const addToCart = (product_id) => {
        let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
        if(carts.length <= 0){
            carts = [{
                product_id: product_id,
                quantity: 1
            }]
        }
        else if (positionThisProductInCart < 0){
            carts[0].product_id = product_id;
            carts[0].quantity = 1;
        }
        else {
            carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
        }
        addCartToHTML();
    }



    // display to cart function
    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        let totalSummingPrice = 0;
        let pricePerDay = 0;
        let totalPricePerday = 0;
        let totalPrice = 0;
        let foundItem = {};

        if (carts.length > 0){
            carts.forEach(cart =>{
                if (cart.quantity && cart.product_id){
                    totalQuantity = totalQuantity + cart.quantity;
                    let newCart = document.createElement('div');
                    newCart.classList.add('item');
                    newCart.dataset.id = cart.product_id;

                    foundItem = getObjectByProductId(cart.product_id);
                    pricePerDay = parseInt(foundItem.car_unit_price.split(' ')[0], 10);
                    //console.log(foundItem);
                    totalPricePerday = pricePerDay * cart.quantity;
                    //console.log(totalPricePerday);
                    newCart.innerHTML = `
                    <div class="image">
                        <img id='${cart.product_id}' src='${foundItem.car_image_directory || ''}'>
                    </div> 
                    <div class="car_brand">
                        Brand: ${foundItem.car_brand_name || ''} 
                    </div> 
                    <div class="car_model">
                        Model: ${foundItem.car_model_name || ''}
                    </div>
                    <div class="car_type">
                        Type: ${foundItem.car_type_name || ''}   
                    </div>

                    <div class="Price">
                        $${foundItem.car_unit_price || ''} 
                    </div>
                    <div id="car_mileage">
                        Mileage: ${foundItem.car_mileage_name || ''} km
                    </div>
                    <div id="car_fuel_type">
                        Fuel type: ${foundItem.car_fuel_type_name || ''} 
                    </div>
                    <div id="car_seats">
                        Seats:  ${foundItem.car_seats_name || ''} 
                    </div>  

                    <form>
                        <label for="start">Start date:</label>
                        <input type="date" id="startDateTag" name="start" value="${cart.startDate}">
                    </form>
                    <form>
                        <label for="end">End date: </label>
                        <input type="date" id="endDateTag" name="end" value="${cart.endDate}">
                
                    </form>

                    <div class="quantity">
                        Quantity: 
                        <span class="minus">-</span>
                        <span>${cart.quantity}</span>
                        <span class="plus">+</span>
                    </div> 
                    <div class="reachMaximum">
                    </div> 
                    `;
                    listCartHTML.appendChild(newCart); 
                    
                    var startDate = document.getElementById('startDateTag').value;
                    var endDate = document.getElementById('endDateTag').value;

                }

                nameBox.val(cart.name);
                emailAddressBox.val(cart.email);
                phoneBox.val(cart.phone);
                licenseBox.val(cart.license); // Selects the option with value "Yes"

                if (startDate && endDate) {
                    var start = new Date(startDate);
                    var end = new Date(endDate);
        
                    if (end >= start) {
                        var days = calculateNumberOfDays(startDate, endDate);
                        totalPrice = totalPricePerday * days;
                        cart.totalPrice = totalPrice; 
                        $('#cart_warning').text("");   
                    }
                    else {
                        $('#cart_warning').text("* Invalid End date");
                    }
                }
                else if (document.getElementById('image')){
                    $('#cart_warning').text("* Please choose the date of rental");
                }

                setReservationCookie(cart);
            })

            $('.checkOut').css('background-color', '#E8BC0E');
            $('.checkOut').hover(function() {
                $(this).css('background-color', 'rgb(0, 255, 128)');
            }, function() {
                $(this).css('background-color', '#E8BC0E');
            });
        }
        else {
            $('.checkOut').css('background-color', 'lightgrey');
            $('.checkOut').hover(function() {
                $(this).css('background-color', 'lightgrey');
            }, function() {
                $(this).css('background-color', 'lightgrey');
            });
        }
        totalSummingPrice += totalPrice;
        totalCartPrice.textContent = '$ ' + totalSummingPrice.toFixed(2);
    }


    function calculateNumberOfDays(startDate, endDate) {
        var start = new Date(startDate);
        var end = new Date(endDate);
        var differenceInTime = end.getTime() - start.getTime();
        var differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays + 1; // Include the start date
    }



    const changeQuantity = (product_id, type) => {
        let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
        if (positionItemInCart>=0){
            switch (type) {
                case 'plus':
                    inStockSearch(product_id, positionItemInCart, function(canAdd){
                        //console.log(canAdd);
                        let reachMaximum = document.querySelector('.reachMaximum');
                        if (!canAdd){
                            $('#' + product_id).siblings('.warning').text("Reaching Maximum Availability");
                            $('#' + product_id).siblings('.addCart').css('color', '#eee');
                            $('#' + product_id).siblings('.addCart').css('background-color','lightgrey');
                            $('#' + product_id).siblings('.addCart').hover(function() {
                                $(this).css('color', '#eee');
                                $(this).css('background-color','lightgrey');
                            }, function() {
                                $(this).css('color', '#eee'); 
                                $(this).css('background-color','lightgrey');
                            });
                            if (reachMaximum) {
                                reachMaximum.textContent = "*Reaching Maximum Availability";
                            }
                        }

                    });    
                    break;

                default:   
                    let valueChange = carts[positionItemInCart].quantity - 1;
                    carts[positionItemInCart].quantity = valueChange;
   
                    $.ajax({
                        url: 'postform_in_stock.php',
                        method: 'POST',
                        data: { key: product_id },
                        success: function(response){
                           let inStockQuantity = parseInt(response);
                            if (carts[positionItemInCart]){
                                let cartQuantity = carts[positionItemInCart].quantity;
                                if (inStockQuantity > cartQuantity){
                                    let reachMaximum = document.querySelector('.reachMaximum');
                                    $('#' + product_id).siblings('.warning').text("");
                                    $('#' + product_id).siblings('.addCart').css('background-color','#2774e1');
                                    $('#' + product_id).siblings('.addCart').hover(function() {
                                        $(this).css('background-color', '#999');
                                        $(this).css('color', 'black');
                                    }, function() {
                                        $(this).css('background-color', '#2774e1'); 
                                        $(this).css('color', '#eee'); 
                                    });
                                    if (reachMaximum){
                                        reachMaximum.textContent = "";
                                    }    
                                } 
                            }
                            // when after minus , there is nothing in the cart
                            else {
                                    let reachMaximum = document.querySelector('.reachMaximum');
                                    $('#' + product_id).siblings('.warning').text("");
                                    $('#' + product_id).siblings('.addCart').css('background-color','#2774e1');
                                    $('#' + product_id).siblings('.addCart').hover(function() {
                                        $(this).css('background-color', '#999');
                                        $(this).css('color', 'black');
                                    }, function() {
                                        $(this).css('background-color', '#2774e1'); 
                                        $(this).css('color', '#eee'); 
                                    });
                                    if (reachMaximum){
                                        reachMaximum.textContent = "";
                                    }    
                            }    
                        },
                        error: function(xhr, status, error){
                            // Handle errors
                            console.error(error);
                            callback(false);
                        }
                    });
                    if (valueChange <= 0) {
                        carts.splice(positionItemInCart, 1);
                    } 
                    break;
            }
        }
        addCartToHTML();
    }




    // Function to search for an object by product_id
    const getObjectByProductId = (productId) => {
        let tempElement = $('<div></div>').html(receivedData);
        let foundElement = tempElement.find(`#${productId}`);
        let parentItem = foundElement.closest('.item');
        if (parentItem.length > 0) {
            return {
                car_product_id: parentItem.find('img').attr('id'),
                car_brand_name: parentItem.find('#car_brand').text(),
                car_model_name: parentItem.find('#car_model').text(),
                car_type_name: parentItem.find('#car_type').text(),
                car_mileage_name: parentItem.find('#car_mileage').text(),
                car_fuel_type_name: parentItem.find('#car_fuel_type').text(),
                car_seats_name: parentItem.find('#car_seats').text(),
                car_image_directory: parentItem.find('img').attr('src'),
                car_unit_quantity: parentItem.find('.quantity').text().trim(),
                car_unit_price: parentItem.find('.price').text().replace('$', '').trim(),
                car_description: parentItem.find('.description').text(),
            };
        } else {
            return null;
        }
    }



/*====================COOKIE=============*/

function setReservationCookie(reservations) {
    $.post("php/set_cookie.php", { reservations: JSON.stringify(reservations) }, function(data) {
    });
}

function getReservationCookie(addReservationToList) {
    $.post("php/get_cookie.php", function(data) {
        try {
            var reservations = JSON.parse(data);
            // Check if reservations is a valid array or object
            if (reservations && typeof reservations === 'object') {
                // Call the callback function with the reservations data
                addReservationToList(reservations);
            } else {
                console.error('Invalid reservation data:', data);
            }
        } catch (e) {
            console.error('Failed to parse reservations:', e, data);
        }
    });
}

function addReservationToList(reservations) {
    carts[0] = reservations;
    addCartToHTML();
}



// submit reservation, validation ,in stock checking and update
$('.checkOut').click(function() {
    var isValid = true;
    var email = $('#emailAddress').val();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    $('.group input').each(function() {
        var inputValue = $(this).val().trim();
        var $inputCheck = $(this).siblings('.inputCheck');
        
        if (inputValue === '') {
            $inputCheck.text('*This field is required');
            isValid = false;
        } else {
            $inputCheck.text('');
        }
    });
    if (!emailRegex.test(email) && !(email === '')) {
        $('.emailCheck').text('*Invalid email address');
        isValid = false;
    }

    var phone = $('#phone').val();
    var regex = /^(0)[23478]\d{8}$/;
    if (!regex.test(phone) && !(phone === '')) {
        $('.phoneCheck').text('*Invalid phone number');
        isValid = false;
    }

    if ($('#license').val()==null ||$('#license').val()=="Choose..."){
        $('.optionCheck').text('*please select an option');
        isValid = false;
    }
    else {
        $('.optionCheck').text('');
    }
    var startDateElement = document.getElementById('startDateTag');
    if (startDateElement) {
        var startDate = document.getElementById('startDateTag').value;
        var endDate = document.getElementById('endDateTag').value;
        if (endDate < startDate){
            isValid = false;
            $('#cart_warning').text('* Invalid End Date');        
        }

        if (!endDate || !startDate){
            isValid = false;
            $('#cart_warning').text('*Please Choose The Date Of Rental');  
        }
    }
    else {
        isValid = false;
    } 

    if (isValid) {
        tempOrder = carts[0];
        finalStockSearchAndUpdate(carts[0].product_id, parseInt(carts[0].quantity), carts[0].name, carts[0].email, carts[0].phone, carts[0].license, carts[0].totalPrice, carts[0].startDate, carts[0].endDate);
    } 

});


//-------check action of the input of personal information---//
inputElements.forEach(input => {
    input.addEventListener('input', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    input.addEventListener('keydown', () => {
        clearTimeout(typingTimer);
    });
});



function doneTyping() {
    if (!carts[0]) {
        carts[0] = {};
    }
    carts[0].name = nameBox.val();
    carts[0].email = emailAddressBox.val();
    carts[0].phone= phoneBox.val();
    carts[0].license = licenseBox.val();
    addCartToHTML();
}


//-------------stock check and update----//
const finalStockSearchAndUpdate = (product_id, cartQuantity, name, email, phone, license, totalPrice, startDate, endDate) =>{
    $.ajax({
        url: 'postform_in_stock.php',
        method: 'POST',
        data: { key: product_id },
        success: function(response){
            let inStockQuantity = parseInt(response);
            let foundItem = getObjectByProductId(product_id);
            let carBrandName = foundItem.car_brand_name;
            let carModelName = foundItem.car_model_name;
            if (inStockQuantity >= cartQuantity){
                addUnconfirmedStock(product_id, cartQuantity, name, email, phone, license, totalPrice, startDate, endDate);
                $("#myDelivery").css("display", "block");
                confirmDetails();
                clearCart();
            } 
            else{
                denySubmit(carBrandName,carModelName);
            }     
        },
        error: function(xhr, status, error){
            // Handle errors
            console.error(error);
            callback(false);
        }
    });    
}


const addUnconfirmedStock = (product_id, cartQuantity, name, email, phone, license, totalPrice, startDate, endDate)=>{
    $.ajax({
        url: 'addUnconfirmedStock.php', // PHP script to handle the database query
        method: 'POST',
        data: {
            id: product_id,
            quantity: cartQuantity,
            name: name, 
            email: email,
            phone: phone,
            license: license,
            totalPrice: totalPrice,
            startDate: startDate,
            endDate: endDate
        },
        success: function(response) {
            // Handle the response from the serve
            const ids = response.split(',');
            orderID = parseInt(ids[0]);
            productID = parseInt(ids[1]);

        },
        error: function(xhr, status, error) {
            // Handle errors
            console.error(error);
        }
    });
}





const updateStock = (orderID, productID)=>{
    $.ajax({
        url: 'updateStock.php', // PHP script to handle the database query
        method: 'POST',
        data: {
            orderID: orderID,
            productID: productID
        },
        success: function(response) {
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.error(error);
        }
    });
}



const confirmDetails = () =>{
    deliveryItem.innerHTML = '';

    if (carts.length > 0){
        carts.forEach(cart =>{
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;

            let foundItem = getObjectByProductId(cart.product_id);
            newCart.innerHTML = `
                <div class="item">
                    <div class="car_brand">
                        Brand: ${foundItem.car_brand_name || ''} 
                    </div> 
                    <div class="car_model">
                        Model: ${foundItem.car_model_name || ''}
                    </div>
                    <div class="car_type">
                        Type: ${foundItem.car_type_name || ''}   
                    </div>

                    <div id="car_mileage">
                        Mileage: ${foundItem.car_mileage_name || ''} 
                    </div>
                    <div id="car_fuel_type">
                        Fuel type: ${foundItem.car_fuel_type_name || ''} 
                    </div>
                    <div id="car_seats">
                        Seats:  ${foundItem.car_seats_name || ''} 
                    </div>  

                    </div>
                    <div id="startDateInfo">
                        Start Date:  ${cart.startDate|| ''} 
                    </div> 

                    <div id="endDateInfo">
                        End Date:  ${cart.endDate|| ''} 
                    </div> 

                    <div id="orderQuantity">
                    Quantity:   ${cart.quantity|| ''} 
                    </div>

                    <div id="TotalFinalPrice">
                    Price: $  ${cart.totalPrice|| ''} 
                    </div>
                </div>     
            `;
            deliveryItem.appendChild(newCart);    
        })
    }
}


const denySubmit = (carBrandName,carModelName) =>{
    alert("Sorry, " + carBrandName + " : " + carModelName +  " is currently out of stock!\nThis item has been removed from your cart.\n");
    clearCart();
}



$('.buttonSubmit').click(function(){
    updateStock(orderID, productID);
});



// Load car data on page load
loadCarData();

});