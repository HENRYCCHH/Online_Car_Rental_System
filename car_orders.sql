CREATE DATABASE assignment2;
USE assignment2;

-- ----------------------------
-- Table structure for car_rental_orders
-- ----------------------------
DROP TABLE IF EXISTS `car_rental_orders`;
CREATE TABLE `car_rental_orders` (
  `order_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `car_id` int(10) unsigned DEFAULT NULL,
  `car_order_quantity` int(2) DEFAULT NULL,
  `start_date` varchar(20) DEFAULT NULL,
  `end_date` varchar(20) DEFAULT NULL,
  `customer_name` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `license` varchar(5) DEFAULT NULL,
  `total_price` int(10) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of car_rental_orders
-- ----------------------------
BEGIN;
INSERT INTO `car_rental_orders` (`car_id`, `car_order_quantity`, `start_date`, `end_date`, `customer_name`, `email`, `phone_number`, `license`, `total_price`, `status`) 
VALUES (1000, 1, '2024-01-02', '2024-01-013', 'Peter', 'peter@gmail.com', '0444111222', 'Yes', 220, 'unconfirmed');
COMMIT;