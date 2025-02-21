# Online Car Rental System

## Overview
The Online Car Rental System is a dynamic web application designed to provide a seamless and interactive car renting experience. Leveraging AJAX and JSON, this system allows users to browse, search, and reserve cars in real time without disrupting the user interface.

## Features
- **Browse by Categories:**  
  Users can browse cars by type (e.g., Sedan, Wagon, SUV) and brand (e.g., Ford, Mazda, BMW). Clicking on a category displays all relevant cars.

- **Search Functionality:**  
  A search box is available on most pages, allowing users to quickly search for cars using keywords.

- **Grid View Display:**  
  Cars are presented in a responsive grid layout, showing key details such as car model, image, price per day, and availability. A "rent" button accompanies each listing to initiate the rental process.

- **Reservation System:**  
  Users can reserve a car by selecting it, specifying rental dates, and reviewing the total cost. Reservation details (including quantity, start and end dates) are maintained using Cookies/Sessions so that users can resume their reservation later. Note that only one car model can be reserved at a time.

- **Order Confirmation:**  
  After placing a rental request, the user is presented with a confirmation link. The rental order is finalized only when the user clicks this link, triggering an update to both the JSON file and the MySQL database.

- **Asynchronous Data Handling:**  
  Use AJAX to send and retrieve data asynchronously, ensuring a smooth user experience.

- **State Management:**  
  Manage user reservations through Cookies and Sessions.

- **Database Integration:**  
  Use PHP to interact with a MySQL database, storing and updating rental orders effectively.


## Technology Stack
- **Frontend:** HTML, CSS, JavaScript, AJAX  
- **Backend:** PHP  
- **Database:** MySQL  
- **Data Storage:** JSON (for car details) and Cookies/Sessions (for temporary reservation data)  
- **Development Environment:** Cloud9 and Visual Studio Code  
- **Deployment:** AWS Elastic Beanstalk

