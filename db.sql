-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 14, 2025 at 09:05 PM
-- Server version: 10.6.22-MariaDB-cll-lve
-- PHP Version: 8.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `citlogis_forecourt`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`citlogis`@`localhost` PROCEDURE `CleanupExpiredTokens` ()   BEGIN
    UPDATE tokens 
    SET is_valid = 0 
    WHERE expires_at < NOW() AND is_valid = 1;
    
    SELECT ROW_COUNT() as cleaned_tokens;
END$$

--
-- Functions
--
CREATE DEFINER=`citlogis`@`localhost` FUNCTION `GetActiveDeviceCount` (`user_id` INT) RETURNS INT(11) DETERMINISTIC READS SQL DATA BEGIN
    DECLARE device_count INT;
    
    SELECT COUNT(*) INTO device_count
    FROM tokens 
    WHERE staff_id = user_id AND is_valid = 1;
    
    RETURN device_count;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `active_sessions`
-- (See below for the actual view)
--
CREATE TABLE `active_sessions` (
`id` int(11)
,`staff_id` int(11)
,`staff_name` varchar(200)
,`device_id` varchar(255)
,`device_type` varchar(50)
,`user_agent` varchar(100)
,`app_version` varchar(50)
,`ip_address` varchar(45)
,`location_info` text
,`is_primary` tinyint(4)
,`refresh_count` int(11)
,`last_used_at` datetime(3)
,`created_at` datetime(3)
,`expires_at` datetime(3)
,`refresh_expires_at` datetime(3)
);

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `client_id`, `name`, `address`, `phone`, `email`, `contact_person`, `created_at`, `updated_at`) VALUES
(1, 1, 'Branch 1', 'here', NULL, NULL, 'BRYAN OTIENO ONYANGOss', '2025-06-07 11:45:52', '2025-07-03 14:07:06'),
(3, 1, 'bryan otieno', 'Nairobi', '0790193625', 'bryanotieno09@gmail.com', 'BRYAN OTIENO ONYANGO', '2025-06-07 14:17:26', '2025-06-07 14:17:26'),
(4, 2, 'KDS 111A', 'Nairobi', NULL, NULL, 'BRYAN OTIENO ONYANGO', '2025-06-08 07:14:02', '2025-07-03 14:09:51'),
(5, 2, 'BRYAN OTIENO ONYANGO', 'Nairobi', '', '', '', '2025-07-03 14:19:10', '2025-07-03 14:19:10'),
(6, 2, 'BRYAN OTIENO ONYANGO', 'Nairobi', '0790193625', 'bryanotieno09@gmail.com', 'BRYAN OTIENO ONYANGO', '2025-07-03 14:19:26', '2025-07-03 14:19:26');

-- --------------------------------------------------------

--
-- Table structure for table `checkin_records`
--

CREATE TABLE `checkin_records` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `station_id` int(11) NOT NULL,
  `station_name` varchar(255) NOT NULL,
  `check_in_latitude` decimal(10,8) NOT NULL,
  `check_in_longitude` decimal(11,8) NOT NULL,
  `check_out_latitude` decimal(10,8) DEFAULT NULL,
  `check_out_longitude` decimal(11,8) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `time_in` datetime DEFAULT NULL,
  `time_out` datetime DEFAULT NULL,
  `qr_data` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `checkin_records`
--

INSERT INTO `checkin_records` (`id`, `user_id`, `user_name`, `station_id`, `station_name`, `check_in_latitude`, `check_in_longitude`, `check_out_latitude`, `check_out_longitude`, `address`, `status`, `time_in`, `time_out`, `qr_data`, `created_at`, `updated_at`) VALUES
(12, 25, 'Joseph Okwam', 1, 'Station 1', -1.30089695, 36.77774156, NULL, NULL, 'Ndemi Lane, Nairobi', 1, '2025-07-04 20:49:05', NULL, '1', '2025-07-04 17:49:10', '2025-07-04 17:49:10'),
(13, 45, 'Benjamin Okwama', 1, 'Kisumu Station', -1.30088242, 36.77773372, NULL, NULL, 'Ndemi Lane, Nairobi', 1, '2025-08-14 21:33:13', NULL, 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={\"station_id\":1,\"station_name\":\"Kisumu Station\"}', '2025-08-14 18:33:13', '2025-08-14 18:33:13');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `balance` decimal(11,2) NOT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `client_type_Id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `account_number`, `email`, `phone`, `balance`, `address`, `created_at`, `updated_at`, `client_type_Id`) VALUES
(1, 'BRYAN OTIENO ONYANGO', 'nn', 'bryanotieno09@gmail.com', '0790193625', 0.00, 'Nairobi', '2025-06-07 12:11:01', '2025-08-14 18:57:21', 2),
(2, 'Client 2', '777', 'bryanotieno09@gmail.com', '0790193625', 0.00, 'Nairobi', '2025-06-08 09:13:29', '2025-08-14 18:57:25', 2);

-- --------------------------------------------------------

--
-- Table structure for table `client_category`
--

CREATE TABLE `client_category` (
  `id` int(10) NOT NULL,
  `name` varchar(119) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_category`
--

INSERT INTO `client_category` (`id`, `name`) VALUES
(1, 'Walk In'),
(2, 'Key Account');

-- --------------------------------------------------------

--
-- Table structure for table `client_ledger`
--

CREATE TABLE `client_ledger` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `amount_in` decimal(10,2) DEFAULT 0.00,
  `amount_out` decimal(10,2) DEFAULT 0.00,
  `balance` decimal(10,2) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_ledger`
--

INSERT INTO `client_ledger` (`id`, `client_id`, `amount_in`, `amount_out`, `balance`, `reference`, `date`, `created_at`) VALUES
(1, 2, 100.00, 0.00, 100.00, 'Test payment', '2025-08-14 03:00:00', '2025-08-14 17:52:19'),
(2, 2, 0.00, 333.00, 433.00, 'Fuel sale - 1L at 333/L from station 1', '2025-08-14 03:00:00', '2025-08-14 18:50:19');

-- --------------------------------------------------------

--
-- Table structure for table `fuel_products`
--

CREATE TABLE `fuel_products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `fuel_products`
--

INSERT INTO `fuel_products` (`id`, `name`, `status`) VALUES
(1, 'Fuel', 0);

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `default_days` int(11) DEFAULT 0,
  `is_active` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `max_days_per_year` decimal(5,2) DEFAULT NULL,
  `accrues` tinyint(1) DEFAULT 0,
  `monthly_accrual` decimal(5,2) DEFAULT 0.00,
  `requires_attachment` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`id`, `name`, `description`, `default_days`, `is_active`, `created_at`, `updated_at`, `max_days_per_year`, `accrues`, `monthly_accrual`, `requires_attachment`) VALUES
(1, 'Annual Leave', NULL, 0, 1, '2025-08-13 15:14:42', '2025-08-13 15:14:42', 21.00, 1, 1.75, 0),
(2, 'Sick Leave', NULL, 0, 1, '2025-08-13 15:14:42', '2025-08-13 15:14:42', 10.00, 0, 0.00, 1),
(3, 'Maternity Leave', NULL, 0, 1, '2025-08-13 15:14:42', '2025-08-13 15:14:42', 90.00, 0, 0.00, 1),
(4, 'Paternity Leave', NULL, 0, 1, '2025-08-13 15:14:42', '2025-08-13 15:14:42', 14.00, 0, 0.00, 0),
(5, 'Compassionate Leave', NULL, 0, 1, '2025-08-13 15:14:42', '2025-08-13 15:14:42', 5.00, 0, 0.00, 0),
(6, 'Study Leave', NULL, 0, 1, '2025-08-13 15:14:42', '2025-08-13 15:14:42', 10.00, 0, 0.00, 1),
(7, 'Unpaid Leave', NULL, 0, 1, '2025-08-13 15:14:42', '2025-08-13 15:14:42', 0.00, 0, 0.00, 0);

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

CREATE TABLE `notices` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notices`
--

INSERT INTO `notices` (`id`, `title`, `content`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'Notice 12', 'Notice goes hers', '2025-06-13 17:14:36', '2025-06-13 17:14:36', 0),
(2, 'Notice 2', 'Notice goes here', '2025-06-13 17:14:39', '2025-06-13 17:14:39', 0);

-- --------------------------------------------------------

--
-- Table structure for table `pumps`
--

CREATE TABLE `pumps` (
  `id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `pumps`
--

INSERT INTO `pumps` (`id`, `station_id`, `serial_number`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'pump 1', 'ss', '2025-08-13 14:39:25', '2025-08-13 14:39:25');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Manager', 'Manager', '2025-06-06 08:38:35', '2025-08-13 07:28:57'),
(4, 'Attendant', 'Attendant', '2025-06-06 08:38:55', '2025-08-13 07:29:05');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  `quantity` decimal(11,2) NOT NULL,
  `unit_price` decimal(11,2) NOT NULL,
  `total_price` decimal(11,2) NOT NULL,
  `sale_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `staff_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `client_id`, `station_id`, `vehicle_id`, `quantity`, `unit_price`, `total_price`, `sale_date`, `created_at`, `staff_id`) VALUES
(1, 2, 1, 4, 3.00, 333.00, 999.00, '2025-08-14 00:00:00', '2025-08-14 10:37:34', NULL),
(2, 2, 1, 4, 2.00, 333.00, 666.00, '2025-08-14 00:00:00', '2025-08-14 10:54:55', NULL),
(3, 2, 1, 5, 4.00, 333.00, 1332.00, '2025-08-14 00:00:00', '2025-08-14 11:07:41', NULL),
(4, 2, 1, 5, 1.00, 333.00, 333.00, '2025-08-14 00:00:00', '2025-08-14 11:35:33', NULL),
(5, 2, 1, 5, 1.00, 333.00, 333.00, '2025-08-14 00:00:00', '2025-08-14 11:35:33', NULL),
(6, 2, 1, 5, 1.00, 333.00, 333.00, '2025-08-14 00:00:00', '2025-08-14 11:35:38', NULL),
(7, 2, 1, 4, 1.00, 333.00, 333.00, '2025-08-14 00:00:00', '2025-08-14 11:37:00', NULL),
(8, 2, 1, 4, 1.00, 333.00, 333.00, '2025-08-14 00:00:00', '2025-08-14 12:00:05', NULL),
(9, 2, 1, 4, 1.99, 333.00, 662.67, '2025-08-14 03:00:00', '2025-08-14 12:17:25', NULL),
(10, 2, 1, 4, 1.00, 333.00, 333.00, '2025-08-14 03:00:00', '2025-08-14 12:18:13', NULL),
(11, 2, 1, 4, 1.00, 333.00, 333.00, '2025-08-14 03:00:00', '2025-08-14 17:35:05', NULL),
(12, 2, 1, 4, 1.00, 333.00, 333.00, '2025-08-14 03:00:00', '2025-08-14 17:42:53', NULL),
(13, 2, 1, 4, 1.00, 333.00, 333.00, '2025-08-14 03:00:00', '2025-08-14 17:47:34', NULL),
(14, 2, 1, 4, 33.00, 333.00, 10989.00, '2025-08-14 03:00:00', '2025-08-14 17:48:59', NULL),
(15, 2, 1, 4, 1.00, 333.00, 333.00, '2025-08-14 03:00:00', '2025-08-14 17:54:36', NULL),
(16, 2, 1, 4, 4.00, 333.00, 1332.00, '2025-08-14 03:00:00', '2025-08-14 18:19:25', NULL),
(17, 2, 1, 4, 1.00, 333.00, 333.00, '2025-08-14 03:00:00', '2025-08-14 18:22:00', NULL),
(18, 2, 1, 4, 1.00, 333.00, 333.00, '2025-08-14 03:00:00', '2025-08-14 18:26:10', NULL),
(19, 2, 1, 4, 1.00, 333.00, 333.00, '2025-08-14 03:00:00', '2025-08-14 18:50:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `seals`
--

CREATE TABLE `seals` (
  `id` int(11) NOT NULL,
  `seal_number` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `confirmed` tinyint(1) NOT NULL DEFAULT 0,
  `confirmed_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `confirmed_by_id` int(11) NOT NULL,
  `status` enum('broken','assigned','re_assigned') NOT NULL DEFAULT 'assigned'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role_id` int(11) NOT NULL DEFAULT 0,
  `role` varchar(200) NOT NULL,
  `station_id` int(11) NOT NULL,
  `empl_no` varchar(100) NOT NULL,
  `id_no` int(11) DEFAULT NULL,
  `salary` decimal(11,2) NOT NULL,
  `photo_url` varchar(200) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `name`, `phone`, `password`, `role_id`, `role`, `station_id`, `empl_no`, `id_no`, `salary`, `photo_url`, `status`, `created_at`, `updated_at`) VALUES
(45, 'Benjamin Okwama', '+254706166875', '$2b$10$ojLoI8eO6UTNI0atYIGGReCB/FckufT3qvedQUPcVS4nysZo5VxxS', 4, 'Attendant', 0, '34056', NULL, 0.00, NULL, 1, '2025-08-14 19:06:05.510', '2025-08-14 18:48:48');

-- --------------------------------------------------------

--
-- Table structure for table `staff_leaves`
--

CREATE TABLE `staff_leaves` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_half_day` tinyint(1) DEFAULT 0,
  `reason` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `approved_by` int(11) DEFAULT NULL,
  `attachment_url` text DEFAULT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `staff_leaves`
--

INSERT INTO `staff_leaves` (`id`, `staff_id`, `leave_type_id`, `start_date`, `end_date`, `is_half_day`, `reason`, `status`, `approved_by`, `attachment_url`, `applied_at`, `updated_at`) VALUES
(4, 25, 1, '2025-07-04', '2025-07-19', 1, 'ggghhuijjj', 'pending', NULL, NULL, '2025-07-04 14:26:56', '2025-07-04 14:26:56'),
(5, 25, 3, '2025-07-05', '2025-07-12', 1, 'feerr', 'pending', NULL, '/data/user/0/com.cit.motorgas/cache/file_picker/1751639332388/Tax Form 03.pdf', '2025-07-04 14:28:56', '2025-07-04 14:28:56'),
(6, 45, 5, '2025-08-21', '2025-08-29', 0, 'tyyyyyfg', 'pending', NULL, NULL, '2025-08-14 17:53:17', '2025-08-14 17:53:17');

-- --------------------------------------------------------

--
-- Table structure for table `staff_leave_balances`
--

CREATE TABLE `staff_leave_balances` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `accrued` decimal(5,2) DEFAULT 0.00,
  `used` decimal(5,2) DEFAULT 0.00,
  `carried_forward` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `staff_leave_balances`
--

INSERT INTO `staff_leave_balances` (`id`, `staff_id`, `leave_type_id`, `year`, `accrued`, `used`, `carried_forward`) VALUES
(2, 25, 1, 2025, 12.25, 0.00, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

CREATE TABLE `stations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `current_fuel_price` decimal(11,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id`, `name`, `address`, `phone`, `email`, `current_fuel_price`, `created_at`, `updated_at`) VALUES
(1, 'Kisumu Station', 'Nairobi', '0790193625', 'bryanotieno09@gmail.com', 333.00, '2025-07-03 16:48:10', '2025-08-14 09:35:02'),
(2, 'Ngong road', '14300', '0790193625', 'bryanotieno09@gmail.com', 0.00, '2025-07-03 16:54:40', '2025-07-03 16:54:40'),
(3, 'Westlands Station', 'Westlands, Nairobi', '0712345678', 'westlands@motorgas.com', 0.00, '2025-07-04 17:38:28', '2025-07-04 17:38:28'),
(4, 'Mombasa Station', 'Mombasa City', '0723456789', 'mombasa@motorgas.com', 0.00, '2025-07-04 17:38:28', '2025-07-04 17:38:28');

-- --------------------------------------------------------

--
-- Table structure for table `station_price`
--

CREATE TABLE `station_price` (
  `id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `price_id` decimal(11,2) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `station_price`
--

INSERT INTO `station_price` (`id`, `station_id`, `price_id`, `start_date`, `end_date`) VALUES
(9, 1, 333.00, '2025-08-14 01:34:00', '2025-08-23 12:34:00');

-- --------------------------------------------------------

--
-- Table structure for table `station_stock_ledger`
--

CREATE TABLE `station_stock_ledger` (
  `id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `quantity_in` decimal(11,2) DEFAULT 0.00,
  `quantity_out` decimal(11,2) DEFAULT 0.00,
  `balance` decimal(11,2) NOT NULL,
  `date` datetime NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `station_stock_ledger`
--

INSERT INTO `station_stock_ledger` (`id`, `station_id`, `quantity_in`, `quantity_out`, `balance`, `date`, `description`, `created_at`) VALUES
(1, 1, 0.00, 1.00, 505.00, '2025-08-14 00:00:00', 'Fuel sale - 1L to client 2, vehicle 4', '2025-08-14 12:00:06'),
(2, 1, 0.00, 1.99, 503.01, '2025-08-14 03:00:00', 'Fuel sale - 1.99L to client 2, vehicle 4', '2025-08-14 12:17:25'),
(3, 1, 0.00, 1.00, 502.01, '2025-08-14 03:00:00', 'Fuel sale - 1L to client 2, vehicle 4', '2025-08-14 12:18:13'),
(4, 1, 0.00, 1.00, 501.01, '2025-08-14 03:00:00', 'Fuel sale - 1L to client 2, vehicle 4', '2025-08-14 17:35:05'),
(5, 1, 0.00, 1.00, 500.01, '2025-08-14 03:00:00', 'Fuel sale - 1L to client 2, vehicle 4', '2025-08-14 17:42:53'),
(6, 1, 0.00, 1.00, 499.01, '2025-08-14 03:00:00', 'Fuel sale - 1L to client 2, vehicle 4', '2025-08-14 17:47:34'),
(7, 1, 0.00, 33.00, 466.01, '2025-08-14 03:00:00', 'Fuel sale - 33L to client 2, vehicle 4', '2025-08-14 17:48:59'),
(8, 1, 0.00, 1.00, 465.01, '2025-08-14 03:00:00', 'Fuel sale - 1L to client 2, vehicle 4', '2025-08-14 17:54:36'),
(9, 1, 0.00, 4.00, 461.01, '2025-08-14 03:00:00', 'Fuel sale - 4L to client 2, vehicle 4', '2025-08-14 18:19:26'),
(10, 1, 0.00, 1.00, 460.01, '2025-08-14 03:00:00', 'Fuel sale - 1L to client 2, vehicle 4', '2025-08-14 18:22:00'),
(11, 1, 0.00, 1.00, 459.01, '2025-08-14 03:00:00', 'Fuel sale - 1L to client 2, vehicle 4', '2025-08-14 18:26:10'),
(12, 1, 0.00, 1.00, 458.01, '2025-08-14 03:00:00', 'Fuel sale - 1L to client 2, vehicle 4', '2025-08-14 18:50:19');

-- --------------------------------------------------------

--
-- Table structure for table `station_store`
--

CREATE TABLE `station_store` (
  `id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `qty` decimal(11,2) NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `station_store`
--

INSERT INTO `station_store` (`id`, `station_id`, `product_id`, `qty`, `updated_at`) VALUES
(1, 1, 1, 459.01, '2025-08-14 20:50:19');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `access_token` text NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `is_valid` tinyint(1) NOT NULL DEFAULT 1,
  `last_used_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `device_info` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `user_agent` varchar(100) DEFAULT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `app_version` varchar(50) DEFAULT NULL,
  `refresh_count` int(11) DEFAULT 0,
  `refresh_expires_at` datetime(3) DEFAULT NULL,
  `is_primary` tinyint(4) DEFAULT 0,
  `location_info` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `staff_id`, `access_token`, `refresh_token`, `expires_at`, `created_at`, `updated_at`, `is_valid`, `last_used_at`, `device_info`, `ip_address`, `device_id`, `user_agent`, `device_type`, `app_version`, `refresh_count`, `refresh_expires_at`, `is_primary`, `location_info`) VALUES
(10, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4MzExMDUsImV4cCI6MTc0OTg1OTkwNX0.zeGTDZKTeRhOrunlB17MeAuccImFNjDDmfaPDsbGwec', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTgzMTEwNSwiZXhwIjoxNzUwNDM1OTA1fQ.Y3W5zGtUOpK0ZbEAk-nZm0lXX4n08ezG4A7rVNHFmsc', '2025-06-14 00:11:45.758', '2025-06-13 16:11:45.760', '2025-06-13 16:16:52.859', 0, '2025-06-13 16:11:45.760', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 00:11:45.758', 0, NULL),
(11, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4MzE0MTMsImV4cCI6MTc0OTg2MDIxM30.8evdTtEkSS0n0dbtGpi6zwPnQf7vjgBbWY2vN8p4PJo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTgzMTQxMywiZXhwIjoxNzUwNDM2MjEzfQ.RO0ljplq-_Rqb8b6txpHfysseQmph17yKBwZCB4DNVM', '2025-06-14 00:16:53.396', '2025-06-13 16:16:53.404', '2025-06-13 16:59:38.186', 0, '2025-06-13 16:56:21.874', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 00:16:53.396', 0, NULL),
(12, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4MzM5NzgsImV4cCI6MTc0OTg2Mjc3OH0.CFHxfk9k72STNQ6kHl_0b--x4IOdEXmVDNaQ_U3AEW0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTgzMzk3OCwiZXhwIjoxNzUwNDM4Nzc4fQ.wTedI2GDRidM16OnoXFXEoJKMVSHu8X6rqb6DZZi6ao', '2025-06-14 00:59:38.698', '2025-06-13 16:59:38.702', '2025-06-13 17:14:40.394', 0, '2025-06-13 17:00:58.410', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 00:59:38.698', 0, NULL),
(13, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4MzQ4ODEsImV4cCI6MTc0OTg2MzY4MX0.rAjJllwouls0rO79jbQLxrcKHRjJXlYovmN5ZG_F2aM', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTgzNDg4MSwiZXhwIjoxNzUwNDM5NjgxfQ.nh2B1Oa2-ZC8Kh1qN_PbEZyZ6vsYfk8_vws6KWhxOG8', '2025-06-14 01:14:41.241', '2025-06-13 17:14:41.243', '2025-06-13 19:41:02.370', 0, '2025-06-13 19:37:11.543', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-09 01:14:41.241', 0, NULL),
(14, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NDM2NjMsImV4cCI6MTc0OTg3MjQ2M30.psQR_w0UsFevswIW7cqZzwuOmbDl5T-xW4nFaZQHn5w', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg0MzY2MywiZXhwIjoxNzUwNDQ4NDYzfQ._xiz0POuJFnRLIdwULpU2hm6BbpcCCoUKPOMs8RJZPs', '2025-06-14 03:41:03.207', '2025-06-13 19:41:03.220', '2025-06-13 21:09:04.337', 0, '2025-06-13 21:01:20.315', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 03:41:03.207', 0, NULL),
(15, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NDg5NDUsImV4cCI6MTc0OTg3Nzc0NX0._uP5T6byFkVZYEt1EP8nyRAkac-Y07BXktZd_XJzbD8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg0ODk0NSwiZXhwIjoxNzUwNDUzNzQ1fQ.vqr32NUFSf4u31OsGRZ8auTyMHJBgzqiOG7glHV8AoA', '2025-06-14 05:09:05.729', '2025-06-13 21:09:05.735', '2025-06-13 21:26:48.536', 0, '2025-06-13 21:09:41.457', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 05:09:05.729', 0, NULL),
(16, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTAwMDksImV4cCI6MTc0OTg3ODgwOX0.flzAEhSnj2wrIkQ9xr0DpuOZC42VbZ-QXluqg8gg92U', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1MDAwOSwiZXhwIjoxNzUwNDU0ODA5fQ.JCAGCKrLGCvt2HczOFjc0EnLfR9ZMPj0vfTT_OnAM2s', '2025-06-14 05:26:49.369', '2025-06-13 21:26:49.374', '2025-06-13 21:37:12.276', 0, '2025-06-13 21:30:54.387', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 05:26:49.369', 0, NULL),
(17, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTA2MzMsImV4cCI6MTc0OTg3OTQzM30.k5eRRYtDPhMziPSUUdrzwNr3ro4SY4y-6zg32ix-1CQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1MDYzMywiZXhwIjoxNzUwNDU1NDMzfQ.62A3mg8xk0ci3pc5rbqNcdJt8G3CTEgTOp6VmxvN0cs', '2025-06-14 05:37:13.092', '2025-06-13 21:37:13.096', '2025-06-13 21:38:17.801', 0, '2025-06-13 21:37:20.035', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 05:37:13.092', 0, NULL),
(18, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTA2OTgsImV4cCI6MTc0OTg3OTQ5OH0.NHcTJZTO6MGD-HXcasrFZT2tSKBqOeLk1gTKMl3GjM0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1MDY5OCwiZXhwIjoxNzUwNDU1NDk4fQ.kDFQAywsoZ0Ls7kgPMn1KG90u_k7pK2168qzCn9jjho', '2025-06-14 05:38:18.408', '2025-06-13 21:38:18.410', '2025-06-13 21:53:21.465', 0, '2025-06-13 21:45:57.043', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 05:38:18.408', 0, NULL),
(19, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTE2MDMsImV4cCI6MTc0OTg4MDQwM30.obuRXuNHpkxrxAE0fGye93KXmP_k9dzoHtf9NgUZ1AQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1MTYwMywiZXhwIjoxNzUwNDU2NDAzfQ.yo8-auAZ2qx3yUaluOFy7THrjHcZZieB8GOi1CuhP90', '2025-06-14 05:53:23.134', '2025-06-13 21:53:23.150', '2025-06-13 22:07:13.119', 0, '2025-06-13 22:06:34.570', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 05:53:23.134', 0, NULL),
(20, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTI0MzMsImV4cCI6MTc0OTg4MTIzM30.t7sTSejBassEgbo32glijTJN9FYEGmdIEoeF39rlJ8Q', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1MjQzMywiZXhwIjoxNzUwNDU3MjMzfQ.78tFs0ScMq02gRdDqOvoYRxnlvrO61MlCOqR1LGAcEw', '2025-06-14 06:07:13.965', '2025-06-13 22:07:13.971', '2025-06-13 22:22:17.894', 0, '2025-06-13 22:21:34.104', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 06:07:13.965', 0, NULL),
(21, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTMzMzksImV4cCI6MTc0OTg4MjEzOX0.5CQSdWzPl-u3eGYSzUvilsTZm2dio1eZB2d9Ib04KQA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1MzMzOSwiZXhwIjoxNzUwNDU4MTM5fQ.6pepWxbmxHcv0PufbCNCySWurkT_X9wsawD6raprfr0', '2025-06-14 06:22:19.547', '2025-06-13 22:22:19.557', '2025-06-13 22:37:22.415', 0, '2025-06-13 22:29:21.473', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 06:22:19.547', 0, NULL),
(22, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTQyNDQsImV4cCI6MTc0OTg4MzA0NH0.A-wlAKoeGHp1zJam4ia5ytIdBK7Mr3SRMJU7dxP6HTI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1NDI0NCwiZXhwIjoxNzUwNDU5MDQ0fQ.r4xq_f-Ro-tZxxicce4gr23P5JGhOMJvPatENsx3uS0', '2025-06-14 06:37:24.008', '2025-06-13 22:37:24.012', '2025-06-13 22:52:12.273', 0, '2025-06-13 22:43:58.811', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 06:37:24.008', 0, NULL),
(23, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTUxMzMsImV4cCI6MTc0OTg4MzkzM30.qgIvH0qQs2eqRCIqM4nwtUI-4HLBtzxoOxWuMfWY7Mk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1NTEzMywiZXhwIjoxNzUwNDU5OTMzfQ.YOV-pYSbggt3npueC0cUJVLpNGuTmeACHs0hwLLpec0', '2025-06-14 06:52:13.076', '2025-06-13 22:52:13.079', '2025-06-13 22:54:52.392', 0, '2025-06-13 22:52:23.497', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 06:52:13.076', 0, NULL),
(24, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTUyOTIsImV4cCI6MTc0OTg4NDA5Mn0.I068toNoMiBrnyYxMwJ3oi5UiczU2AZCKcojnp9IRcw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1NTI5MiwiZXhwIjoxNzUwNDYwMDkyfQ.u337EeszYrxkhVA0nKs_sA5lz97pD1TbmKL0pJI-R1M', '2025-06-14 06:54:52.988', '2025-06-13 22:54:52.990', '2025-06-13 22:57:51.661', 0, '2025-06-13 22:56:57.354', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 06:54:52.988', 0, NULL),
(25, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTU0NzIsImV4cCI6MTc0OTg4NDI3Mn0.jnggMUr4ANalhH6rIzVGmlTnJJ1aVeJfJMSU8U5BDYI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1NTQ3MiwiZXhwIjoxNzUwNDYwMjcyfQ.A1FT51f3v9KWUrjv0eCaEN6aqcL39t-6ajc-RWRFPyM', '2025-06-14 06:57:52.257', '2025-06-13 22:57:52.259', '2025-06-13 23:12:25.750', 0, '2025-06-13 22:58:57.359', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 06:57:52.257', 0, NULL),
(26, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTYzNDYsImV4cCI6MTc0OTg4NTE0Nn0.Zysmi-7uosyDrS7RWWbyHM1nefbq46QwiYUID2-Qxnc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1NjM0NiwiZXhwIjoxNzUwNDYxMTQ2fQ.UAOMeQDF_Kxu04JrG6jZ8BJ59avqU8FWxWsKdt1krOg', '2025-06-14 07:12:26.546', '2025-06-13 23:12:26.548', '2025-06-13 23:27:29.598', 0, '2025-06-13 23:14:29.549', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 07:12:26.546', 0, NULL),
(27, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTcyNTEsImV4cCI6MTc0OTg4NjA1MX0._d9TZ3DkpwE3IJaAYGCyU7jgpOpQvnhTw8eQoNwVW1Q', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1NzI1MSwiZXhwIjoxNzUwNDYyMDUxfQ.Oz0FI36CyF112q3Og21BTuxMmgJsuul70teznkWZKKA', '2025-06-14 07:27:31.674', '2025-06-13 23:27:31.678', '2025-06-13 23:42:35.240', 0, '2025-06-13 23:27:31.678', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 07:27:31.674', 0, NULL),
(28, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTgxNTcsImV4cCI6MTc0OTg4Njk1N30.NQRKbBYXootdIAofWorz_vSUtHmQFpR6rRqvKcEMuko', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1ODE1NywiZXhwIjoxNzUwNDYyOTU3fQ.t1gJRnjHF-Bw53oasuF9d1CsJhwOJhVB1gzB00-2Oqo', '2025-06-14 07:42:37.758', '2025-06-13 23:42:37.761', '2025-06-13 23:57:41.673', 0, '2025-06-13 23:42:37.761', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 07:42:37.758', 0, NULL),
(29, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTkwNjQsImV4cCI6MTc0OTg4Nzg2NH0.V7JCjr8c-2E0f9qj-3LsLrH0mkBxRQW6wHmhn35eRDI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1OTA2NCwiZXhwIjoxNzUwNDYzODY0fQ.QSb1E28CSbGJtr8vI9M4oPhND-0xQ7qglVVAEy1zcJ0', '2025-06-14 07:57:44.246', '2025-06-13 23:57:44.249', '2025-06-14 00:12:48.442', 0, '2025-06-13 23:57:44.249', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 07:57:44.246', 0, NULL),
(30, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NTk5NzAsImV4cCI6MTc0OTg4ODc3MH0.uQICi8V6lTBbz49OlnzCreu0SxhFAx3BV2rebfUjHPs', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg1OTk3MCwiZXhwIjoxNzUwNDY0NzcwfQ.Dw2Rd8B5VSDbhhZYxcLyemEwFJaulDmdJpAdHxvQ8AM', '2025-06-14 08:12:50.506', '2025-06-14 00:12:50.510', '2025-06-14 00:27:54.481', 0, '2025-06-14 00:12:50.510', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 08:12:50.506', 0, NULL),
(31, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NjA4NzYsImV4cCI6MTc0OTg4OTY3Nn0.obwlAh0XyO1s3SrWgz1yJP1HuApM8PQON0BFHdrsUaw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg2MDg3NiwiZXhwIjoxNzUwNDY1Njc2fQ.tRrBsQBm3t2SF_oZJYVvbbmrGDhhy0LotvO_E3GrbUw', '2025-06-14 08:27:56.121', '2025-06-14 00:27:56.123', '2025-06-14 00:42:59.088', 0, '2025-06-14 00:27:56.123', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 08:27:56.121', 0, NULL),
(32, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NjE3ODAsImV4cCI6MTc0OTg5MDU4MH0.TZbMSIHCMdCVs0yjlahEGytszAKQnmQ-8qUEa8NONmU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg2MTc4MCwiZXhwIjoxNzUwNDY2NTgwfQ.cbyGtadIVqvDOzITNfg1eKHWKRBkS8tsMoWrrr-S_PI', '2025-06-14 08:43:00.861', '2025-06-14 00:43:00.864', '2025-06-14 00:58:07.181', 0, '2025-06-14 00:43:00.864', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 08:43:00.861', 0, NULL),
(33, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NjI2ODksImV4cCI6MTc0OTg5MTQ4OX0.USFhR-iHqSF2jX9XzkGeex-g5amGS-RnrTTQX2PkdDU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg2MjY4OSwiZXhwIjoxNzUwNDY3NDg5fQ.osYS23s9C0abRHGBKUKJeej40ek5XRo2sgRLWZ5emeg', '2025-06-14 08:58:09.242', '2025-06-14 00:58:09.248', '2025-06-14 01:13:12.001', 0, '2025-06-14 00:58:09.248', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 08:58:09.242', 0, NULL),
(34, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NjM1OTMsImV4cCI6MTc0OTg5MjM5M30.bxZZjmNjovE2iX2nZR_s-tzoXHZdkrPfIVCx7l2tE0M', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg2MzU5MywiZXhwIjoxNzUwNDY4MzkzfQ.PloEWRrHLJSNvoNQ3v-Hy6Du5OVOc40XLcgjJo8p9AY', '2025-06-14 09:13:13.644', '2025-06-14 01:13:13.647', '2025-06-14 01:28:19.357', 0, '2025-06-14 01:13:13.647', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 09:13:13.644', 0, NULL),
(35, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NjQ1MDEsImV4cCI6MTc0OTg5MzMwMX0.qQK1layFPtH8rjgOVf3SmUyOQmouf8osBJxignUHR30', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg2NDUwMSwiZXhwIjoxNzUwNDY5MzAxfQ.Djh0VPaNzRI-kCgLA8sV87YdvEFsDC0vaZIAmu4hEYA', '2025-06-14 09:28:21.010', '2025-06-14 01:28:21.013', '2025-06-14 01:43:49.585', 0, '2025-06-14 01:28:21.013', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 09:28:21.010', 0, NULL),
(36, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NjU0MzEsImV4cCI6MTc0OTg5NDIzMX0.qY64io0NzlzQyR-DrF3gvGu78QtpeYs-VL1NZc9yXgE', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg2NTQzMSwiZXhwIjoxNzUwNDcwMjMxfQ.c843m_dVHO1D0G3A9QGg1YP23TclWy3IfXvZ4uFAwUs', '2025-06-14 09:43:51.232', '2025-06-14 01:43:51.237', '2025-06-14 02:01:23.803', 0, '2025-06-14 01:43:51.237', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 09:43:51.232', 0, NULL),
(37, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4NjY0ODUsImV4cCI6MTc0OTg5NTI4NX0.ezOJgmsEyQtG_jtrv3BrKALHPjXqO8hO0usO3vZ21AQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg2NjQ4NSwiZXhwIjoxNzUwNDcxMjg1fQ.DYt5Kxl2Db8EXGAReu21DACxMeRzjKBQM2WLb7o2TjQ', '2025-06-14 10:01:25.463', '2025-06-14 02:01:25.471', '2025-06-14 02:19:29.661', 0, '2025-06-14 02:01:25.471', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 10:01:25.463', 0, NULL),
(38, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4Njc1NzEsImV4cCI6MTc0OTg5NjM3MX0.I8aUgvRV9GqmgUKOqG99CPuP5GRDDTuC0o7CgPnyg3I', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg2NzU3MSwiZXhwIjoxNzUwNDcyMzcxfQ.vVjdyuNLbciwnrrHCUfe7B0U03N_uFqTx1WnkJhTRuw', '2025-06-14 10:19:31.302', '2025-06-14 02:19:31.305', '2025-06-14 02:38:13.204', 0, '2025-06-14 02:19:31.305', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 10:19:31.302', 0, NULL),
(39, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4Njg2OTUsImV4cCI6MTc0OTg5NzQ5NX0.1ek61l9682Lymvi1hLWweExf7b8pBX6__yadVEVZgxU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg2ODY5NSwiZXhwIjoxNzUwNDczNDk1fQ.cS-MF_9ALfUj6AXtfIjkoob_EnsKHwqR_DmaJOGSfNY', '2025-06-14 10:38:15.112', '2025-06-14 02:38:15.115', '2025-06-14 05:04:21.515', 0, '2025-06-14 02:38:15.115', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.16', NULL, NULL, NULL, NULL, 0, '2025-07-09 10:38:15.112', 0, NULL),
(40, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4Nzc0NjEsImV4cCI6MTc0OTkwNjI2MX0.QtCtpcLzdFCwY1XcNR9L0mgLYPfyaC6vvyAUNoNnfhk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg3NzQ2MSwiZXhwIjoxNzUwNDgyMjYxfQ.x7DHahGvyqFNlXpvhsC2oVnr_zEOAkRkJ5Zk1YkHjDk', '2025-06-14 13:04:21.942', '2025-06-14 05:04:21.944', '2025-06-14 05:07:38.726', 0, '2025-06-14 05:07:38.725', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 13:04:21.942', 0, NULL),
(41, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4Nzc2ODUsImV4cCI6MTc0OTkwNjQ4NX0.OIKyTsXcuK8S6plnQbxrGy9yuTvwM_YD1EdYxoR6Zv4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg3NzY4NSwiZXhwIjoxNzUwNDgyNDg1fQ.zBzyjIDnOxC0jRHgLe-vBEgLxpUfXfO0ykJ3vPp2UE4', '2025-06-14 13:08:05.634', '2025-06-14 05:08:05.638', '2025-06-14 05:09:51.390', 0, '2025-06-14 05:09:50.875', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 13:08:05.634', 0, NULL),
(42, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4Nzc4MDIsImV4cCI6MTc0OTkwNjYwMn0.VKxCoOREJMk-XuK760CYn__DsctVD8YjvLdgyE4CINc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg3NzgwMiwiZXhwIjoxNzUwNDgyNjAyfQ.kMNph73oqVAijcbU8mOoxRIDyg6Q1MCl5bd3G1i9Twk', '2025-06-14 13:10:02.471', '2025-06-14 05:10:02.479', '2025-06-14 05:22:45.714', 0, '2025-06-14 05:22:44.890', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 13:10:02.471', 0, NULL),
(43, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4Nzg1ODMsImV4cCI6MTc0OTkwNzM4M30.G2au2e08LawaC0L18yUrMT5qj4QecuMeiCRJCgdg0Ag', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg3ODU4MywiZXhwIjoxNzUwNDgzMzgzfQ.vVXlHZYscEMEd90KWqfRofJJjLfsVw51YEIXxltgEvw', '2025-06-14 13:23:03.804', '2025-06-14 05:23:03.808', '2025-06-14 05:37:00.008', 0, '2025-06-14 05:23:06.320', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 13:23:03.804', 0, NULL),
(44, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4Nzk0MjAsImV4cCI6MTc0OTkwODIyMH0.Ueu0y8VWdYMJiIL68yn75dI09IGqDS71UFBNcPmX-B4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg3OTQyMCwiZXhwIjoxNzUwNDg0MjIwfQ.bhFZXFUuPQZHlUaiYoV48P52cLAyBG44QaBvJge8dvc', '2025-06-14 13:37:00.428', '2025-06-14 05:37:00.430', '2025-06-14 05:52:02.139', 0, '2025-06-14 05:52:00.217', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 13:37:00.428', 0, NULL),
(45, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODAzMjMsImV4cCI6MTc0OTkwOTEyM30.bNWrKhg6l3zcq5TLvuNmzUn2NREXWooq2z16epeAidE', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4MDMyMywiZXhwIjoxNzUwNDg1MTIzfQ.MDMlx0qboTsmWghQS7zJ2Q0nMfVWJ6KFTAIqSIY-1BY', '2025-06-14 13:52:03.009', '2025-06-14 05:52:03.012', '2025-06-14 06:07:04.689', 0, '2025-06-14 06:07:00.177', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-09 13:52:03.009', 0, NULL),
(46, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODEyMjUsImV4cCI6MTc0OTkxMDAyNX0.tNL2oRHlJ-vtBT8SPC6UpHjZeF6hHhDhduifGi_5zu4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4MTIyNSwiZXhwIjoxNzUwNDg2MDI1fQ.eNxHn6bOxmTFRUTxoY9P1N-ANy3R0V-FX9l08EvU50I', '2025-06-14 14:07:05.538', '2025-06-14 06:07:05.542', '2025-06-14 06:22:06.990', 0, '2025-06-14 06:22:00.210', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-09 14:07:05.538', 0, NULL),
(47, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODIxMjcsImV4cCI6MTc0OTkxMDkyN30.aDZyw3reIZCiWmgyOeZmmwqt4XiOaLLHsEubu6XFVAk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4MjEyNywiZXhwIjoxNzUwNDg2OTI3fQ.fQ7s03Dd3KsQwtIzMtvm57A1VinIL2NaOGO57AVabNw', '2025-06-14 14:22:07.826', '2025-06-14 06:22:07.828', '2025-06-14 06:37:10.070', 0, '2025-06-14 06:37:00.411', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-09 14:22:07.826', 0, NULL),
(48, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODMwMzAsImV4cCI6MTc0OTkxMTgzMH0.-sJBSZwFwc4MatS6hSoHiK4WRheT_FnKs9XZrKt1LSU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4MzAzMCwiZXhwIjoxNzUwNDg3ODMwfQ.p1diXZsdXnAynY3_8WjtIm5p6N1v88_-mE3fpeG5GYY', '2025-06-14 14:37:10.913', '2025-06-14 06:37:10.914', '2025-06-14 06:52:12.790', 0, '2025-06-14 06:52:00.212', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-09 14:37:10.913', 0, NULL),
(49, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODM5MzMsImV4cCI6MTc0OTkxMjczM30.keTb2E_50-w2u5ZbE5DkpxDQWk-IdHMHfHU_LxGiqRc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4MzkzMywiZXhwIjoxNzUwNDg4NzMzfQ.hnUPDUWB9zi0LBmhqUYgf-Hf5WFyk5LdCTtqb8cPUKk', '2025-06-14 14:52:13.758', '2025-06-14 06:52:13.761', '2025-06-14 07:07:15.738', 0, '2025-06-14 06:58:12.104', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-09 14:52:13.758', 0, NULL),
(50, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODQ4MzYsImV4cCI6MTc0OTkxMzYzNn0.GakB1i-FMjysKob7_WotOXtpihWlpVil7UUQisDWKb4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4NDgzNiwiZXhwIjoxNzUwNDg5NjM2fQ.ywbZonif0k9iCQ5CwwQPCXnFB2RZsFcFCyV5KbMFHRk', '2025-06-14 15:07:16.584', '2025-06-14 07:07:16.592', '2025-06-14 07:26:48.390', 0, '2025-06-14 07:20:00.116', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-09 15:07:16.584', 0, NULL),
(51, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODYwMDgsImV4cCI6MTc0OTkxNDgwOH0.F9QtC26Zdy1VnBUU-EP62uPF8_75EgQES_qYA2_BVto', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4NjAwOCwiZXhwIjoxNzUwNDkwODA4fQ.HvTK-fd0gzfG6QNlquD18LTD7LX61oCBkd0zSRkFcdU', '2025-06-14 15:26:48.831', '2025-06-14 07:26:48.834', '2025-06-14 07:41:50.877', 0, '2025-06-14 07:37:21.415', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 15:26:48.831', 0, NULL),
(52, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODY5MTEsImV4cCI6MTc0OTkxNTcxMX0.87Ki381jlX1GWqWhC6DRdw_vJkaHFHSSEe8vGuwKij0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4NjkxMSwiZXhwIjoxNzUwNDkxNzExfQ.o8tsAmAJycldqHfObT9TVXUEC8GJNBFP0N45BplRiTc', '2025-06-14 15:41:51.853', '2025-06-14 07:41:51.860', '2025-06-14 07:56:54.045', 0, '2025-06-14 07:56:47.104', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-09 15:41:51.853', 0, NULL),
(53, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODc4MTUsImV4cCI6MTc0OTkxNjYxNX0.TPemUwB4ftwedAWQ4y98Js7V5FqgNv3B_jD87eAXPfw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4NzgxNSwiZXhwIjoxNzUwNDkyNjE1fQ.9f9I6XPBPpclpcvTYGWOxlvoYho7RnTUF7ud8OZCPP4', '2025-06-14 15:56:55.190', '2025-06-14 07:56:55.195', '2025-06-14 08:05:25.872', 0, '2025-06-14 08:02:47.431', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-09 15:56:55.190', 0, NULL),
(54, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODgzMjYsImV4cCI6MTc0OTkxNzEyNn0.9odS4Imzc50dC3teGrASmOQSBRaB_HlkOKjAPGhYW5o', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4ODMyNiwiZXhwIjoxNzUwNDkzMTI2fQ.LEk07cKrPu4CpQ69pYYN51ZFvQ7MvDSaTT_A8JW8JZ0', '2025-06-14 16:05:26.465', '2025-06-14 08:05:26.472', '2025-06-14 08:20:28.485', 0, '2025-06-14 08:20:11.444', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 16:05:26.465', 0, NULL),
(55, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4ODkyMjksImV4cCI6MTc0OTkxODAyOX0.r1518W58jOQmrCmxvY7luGQj0-9cClEEqE8XNUh7DFE', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg4OTIyOSwiZXhwIjoxNzUwNDk0MDI5fQ.WJnTJS8pc-X6yWRIgEgnPtphcaIKDEWaL8qaj49Vi-8', '2025-06-14 16:20:29.560', '2025-06-14 08:20:29.563', '2025-06-14 09:27:08.352', 0, '2025-06-14 08:28:12.132', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-09 16:20:29.560', 0, NULL),
(56, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTMyMjgsImV4cCI6MTc0OTkyMjAyOH0.Oe-6GrzT-94BL1nv-MozLVTO3fsSZi6N5rDZDSOo1QA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5MzIyOCwiZXhwIjoxNzUwNDk4MDI4fQ.o8LaLXcpeYtM2af3MQM4177wpcBSAooObKst59DD0EE', '2025-06-14 17:27:08.896', '2025-06-14 09:27:08.916', '2025-06-14 09:32:24.342', 0, '2025-06-14 09:27:21.380', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:27:08.896', 0, NULL),
(57, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTM1NDQsImV4cCI6MTc0OTkyMjM0NH0.67lSUHfZX2FwotujLmlQVBhfPOq4G4jatbFipeNhDr0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5MzU0NCwiZXhwIjoxNzUwNDk4MzQ0fQ.g55v18RF8GmnAcLBdMMX1K2sm4W_THF8st5gnXb_WGM', '2025-06-14 17:32:24.888', '2025-06-14 09:32:24.903', '2025-06-14 09:33:35.398', 0, '2025-06-14 09:33:34.164', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:32:24.888', 0, NULL),
(58, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTM2MjQsImV4cCI6MTc0OTkyMjQyNH0.I_ab_thwF_wGwdI8zKRkj5DDnW8HZMiyrDxfrd9V5Y0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5MzYyNCwiZXhwIjoxNzUwNDk4NDI0fQ.4Wx4QEb6kmK99LE4jETJawh4KJIihSoVjP25POcX4n0', '2025-06-14 17:33:44.983', '2025-06-14 09:33:44.994', '2025-06-14 09:35:12.067', 0, '2025-06-14 09:35:11.308', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:33:44.983', 0, NULL),
(59, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTM3MjIsImV4cCI6MTc0OTkyMjUyMn0.WjEugjLpSxEdopshEd12sRVidaHXl-SjsvWNJ2VHnvg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5MzcyMiwiZXhwIjoxNzUwNDk4NTIyfQ.rIEjmVRNML78KFqBz3kXnjWFffQGzeofKBE13b5XWL0', '2025-06-14 17:35:22.319', '2025-06-14 09:35:22.322', '2025-06-14 09:36:49.477', 0, '2025-06-14 09:36:48.946', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:35:22.319', 0, NULL),
(60, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTM4MjIsImV4cCI6MTc0OTkyMjYyMn0.DG1Tu2MyExYBy2Oj3FLrzRkqZA4uoaOHXIH1dAA4Mo4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5MzgyMiwiZXhwIjoxNzUwNDk4NjIyfQ.DJj5aT8_juT4nkFtC8KpA1XXN_v1pJh_9_o6SwiDo1g', '2025-06-14 17:37:02.913', '2025-06-14 09:37:02.919', '2025-06-14 09:45:20.086', 0, '2025-06-14 09:45:20.156', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:37:02.913', 0, NULL),
(61, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTQzMzIsImV4cCI6MTc0OTkyMzEzMn0.aAEJDVWhNT96TekTgufEFGEaGaneSsLD2aTMrEjz3Kg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NDMzMiwiZXhwIjoxNzUwNDk5MTMyfQ.TRkL8P6uoErcRvlPzofFmRWn4KcMDpfpRuoV9vqOBtU', '2025-06-14 17:45:32.759', '2025-06-14 09:45:32.763', '2025-06-14 09:46:38.643', 0, '2025-06-14 09:46:38.152', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:45:32.759', 0, NULL),
(62, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTQ0NzEsImV4cCI6MTc0OTkyMzI3MX0.JAfZSjJ7MMhv6akBzN2VhIlB_FzjZGtR9IrPksm_Png', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NDQ3MSwiZXhwIjoxNzUwNDk5MjcxfQ.E_odWbdXxa-WLsATDc5s5avSc2eAt5ucpmCVGa9cQMQ', '2025-06-14 17:47:51.193', '2025-06-14 09:47:51.195', '2025-06-14 09:49:00.644', 0, '2025-06-14 09:49:00.641', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:47:51.193', 0, NULL),
(63, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTQ1NDksImV4cCI6MTc0OTkyMzM0OX0.Lg_A3MLFrlcvd_EvEb7IvSZkE9KPOb0wL7kgI3birlg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NDU0OSwiZXhwIjoxNzUwNDk5MzQ5fQ.mXIgYdTENWeToKuVSqTPe4q30A50630PxwEueDIQDs8', '2025-06-14 17:49:09.782', '2025-06-14 09:49:09.784', '2025-06-14 09:50:21.099', 0, '2025-06-14 09:50:20.588', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:49:09.782', 0, NULL),
(64, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTQ2MzEsImV4cCI6MTc0OTkyMzQzMX0.yyPAaqNVjZrKeTNYQqU6ym9KRsBiomYf4cLacLKDVCQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NDYzMSwiZXhwIjoxNzUwNDk5NDMxfQ.Rw8FI7kFxvIuMeuoIUdS_Gg7vz_Ho4OoeKBlFqw3x5Y', '2025-06-14 17:50:31.036', '2025-06-14 09:50:31.037', '2025-06-14 09:52:48.728', 0, '2025-06-14 09:52:48.185', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:50:31.036', 0, NULL),
(65, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTQ4MTksImV4cCI6MTc0OTkyMzYxOX0.4KSHl1xnDwI0BhDACJIIPgn9S4Imq3-2UsaUXYS0I8U', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NDgxOSwiZXhwIjoxNzUwNDk5NjE5fQ.4zLKOw3RA-smsNLFyymW61byrK2aw8UzguID3rrDyrk', '2025-06-14 17:53:39.521', '2025-06-14 09:53:39.523', '2025-06-14 09:53:55.172', 0, '2025-06-14 09:53:40.494', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:53:39.521', 0, NULL),
(66, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTQ4MzUsImV4cCI6MTc0OTkyMzYzNX0.B_xnz_3OttFjnjnlT9J7lpA4A67jvg-HnS5G9g-M7Zw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NDgzNSwiZXhwIjoxNzUwNDk5NjM1fQ.1SaXMc2RyK28S0Y5Y5j4ew-ljdkQfzDZv3UCdSw7BhM', '2025-06-14 17:53:55.477', '2025-06-14 09:53:55.490', '2025-06-14 09:55:05.881', 0, '2025-06-14 09:55:05.374', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:53:55.477', 0, NULL),
(67, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTQ5MTUsImV4cCI6MTc0OTkyMzcxNX0.Ys1ggiaXgo5OZtr1-K6BToN7xypSFWIvBOFMIhti6CM', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NDkxNSwiZXhwIjoxNzUwNDk5NzE1fQ.QfE1g-Elj4LIH5ZAZ5KSdJrC-3g1afQB6fE1gXSXLiM', '2025-06-14 17:55:15.341', '2025-06-14 09:55:15.343', '2025-06-14 09:55:54.493', 0, '2025-06-14 09:55:53.982', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:55:15.341', 0, NULL),
(68, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTQ5NjIsImV4cCI6MTc0OTkyMzc2Mn0.HtfPjtEMB6z0tJMrV3zPnnmv9QVFbZdCm-he4DEk7Tg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NDk2MiwiZXhwIjoxNzUwNDk5NzYyfQ.qj_QP933mzmq1rOpyGD6mYhJpPrg-glKOTUmXWpr5xs', '2025-06-14 17:56:02.731', '2025-06-14 09:56:02.733', '2025-06-14 10:02:58.284', 0, '2025-06-14 10:02:57.442', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 17:56:02.731', 0, NULL),
(69, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTUzODcsImV4cCI6MTc0OTkyNDE4N30.QZA0eVxw6h__ZjDfA8sLcXmzdd3aWMYzXtbP43ZB6Wc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NTM4NywiZXhwIjoxNzUwNTAwMTg3fQ.tF5Tw2WlVCYqwfdgilcu-VmDQ71gPaoyESkVqPuSPAo', '2025-06-14 18:03:07.396', '2025-06-14 10:03:07.398', '2025-06-14 10:03:36.649', 0, '2025-06-14 10:03:36.123', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 18:03:07.396', 0, NULL),
(70, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTU0MjgsImV4cCI6MTc0OTkyNDIyOH0.lYJ3ewjfZFAWLu0T89mGrSJyjfKPjq5ry5vEQguKQ_8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NTQyOCwiZXhwIjoxNzUwNTAwMjI4fQ.ICh9xcwXj6cFyGrdcgOchQ-nQR_HW3cQDc9SDuT82XQ', '2025-06-14 18:03:48.925', '2025-06-14 10:03:48.928', '2025-06-14 10:04:31.226', 0, '2025-06-14 10:04:30.710', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 18:03:48.925', 0, NULL),
(71, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTU0ODEsImV4cCI6MTc0OTkyNDI4MX0.PiZuTwxzRdW-0-GM9gubk4wxq6MofIWakEcjUoapvbk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NTQ4MSwiZXhwIjoxNzUwNTAwMjgxfQ.8tl5og7OYZyRFEjQoePbDUoHeG44bcnIcujhWh4d9hw', '2025-06-14 18:04:41.197', '2025-06-14 10:04:41.200', '2025-06-14 10:04:51.046', 0, '2025-06-14 10:04:50.525', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 18:04:41.197', 0, NULL),
(72, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTU1MDEsImV4cCI6MTc0OTkyNDMwMX0.ln77u04ub1ZdygzNbbknl-JmE-pEMwsIZPlfL1IAbpw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NTUwMSwiZXhwIjoxNzUwNTAwMzAxfQ.KHLICQvYqYjEukjD7aEL7jPGy7Nq0iqhJasnJpmbQ6s', '2025-06-14 18:05:01.463', '2025-06-14 10:05:01.467', '2025-06-14 10:20:03.081', 0, '2025-06-14 10:05:02.468', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 18:05:01.463', 0, NULL),
(73, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk4OTY0MDMsImV4cCI6MTc0OTkyNTIwM30.LG0b14S_BRYZk3Q1s8Oo18NazRizm74PVu-XzzV8lTY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTg5NjQwMywiZXhwIjoxNzUwNTAxMjAzfQ.lIrb92WKTvWA_j0lzRNgTFx98_7YoA53jRnWrcgGUWg', '2025-06-14 18:20:03.993', '2025-06-14 10:20:03.995', '2025-06-14 11:36:20.447', 0, '2025-06-14 10:20:03.995', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-09 18:20:03.993', 0, NULL),
(74, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDA5ODAsImV4cCI6MTc0OTkyOTc4MH0.3C_l5mbRWsFnMwVxoN63lhZNfM2SFjTY1WA_phO9WIQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwMDk4MCwiZXhwIjoxNzUwNTA1NzgwfQ.HzFGeAAusI1O7-gflv7qMsoVsvraSYmgN3rk8lE2Yj8', '2025-06-14 19:36:20.829', '2025-06-14 11:36:20.841', '2025-06-14 11:41:49.139', 0, '2025-06-14 11:41:48.630', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 19:36:20.829', 0, NULL),
(75, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDEzNjksImV4cCI6MTc0OTkzMDE2OX0.x2DDxE2tptp-vK72d2eCGaYlx2jH6kIxbbhJoTz-X7E', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwMTM2OSwiZXhwIjoxNzUwNTA2MTY5fQ.ZrDIdreSugchSILY7Wyxqy7p_XzuCgHqdsr3hymKGrk', '2025-06-14 19:42:49.965', '2025-06-14 11:42:49.969', '2025-06-14 11:51:55.814', 0, '2025-06-14 11:51:55.111', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 19:42:49.965', 0, NULL),
(76, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDE5MjQsImV4cCI6MTc0OTkzMDcyNH0.oZvOzzwCCywlDb-0eHoA_ujykqp_MlVSGzbvOtfQ9mY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwMTkyNCwiZXhwIjoxNzUwNTA2NzI0fQ.MFs4fePh0KjgwBcsWgSJmareleqK2gPPGDoP5CWAV9E', '2025-06-14 19:52:04.608', '2025-06-14 11:52:04.613', '2025-06-14 11:52:34.788', 0, '2025-06-14 11:52:05.419', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 19:52:04.608', 0, NULL),
(77, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDE5NTQsImV4cCI6MTc0OTkzMDc1NH0.MZFLSUjI6k27U6B6LxreHb6I5M4sXMJman0Y-fG25jQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwMTk1NCwiZXhwIjoxNzUwNTA2NzU0fQ.yIaFspTrL5IeJ-SX5pisLUiUo7oaRmlYU6D2ADcO2ck', '2025-06-14 19:52:34.984', '2025-06-14 11:52:34.987', '2025-06-14 11:56:17.386', 0, '2025-06-14 11:55:33.508', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 19:52:34.984', 0, NULL),
(78, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDIxNzcsImV4cCI6MTc0OTkzMDk3N30.6qEqBJqI2ll3RuGZe8fdNpvwE9ZSvfbIBBH5nHMRQ7M', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwMjE3NywiZXhwIjoxNzUwNTA2OTc3fQ.qFEKeTIj4MOTdi3nTxZvG9COOhuVvxSORBQ8x7nEgzw', '2025-06-14 19:56:17.589', '2025-06-14 11:56:17.591', '2025-06-14 12:00:53.562', 0, '2025-06-14 12:00:07.332', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 19:56:17.589', 0, NULL),
(79, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDI0NTMsImV4cCI6MTc0OTkzMTI1M30.hTDu4exCg8TuM_MOW2Oczgtpsf35vyR0J7Xug4GUkyY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwMjQ1MywiZXhwIjoxNzUwNTA3MjUzfQ.g9gCW8a_uEjJ71pncjVkVgYtl_2DtPglyG4HCxKKZ3E', '2025-06-14 20:00:53.757', '2025-06-14 12:00:53.759', '2025-06-14 12:05:24.616', 0, '2025-06-14 12:05:24.335', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 20:00:53.757', 0, NULL),
(80, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDI3MzksImV4cCI6MTc0OTkzMTUzOX0.9dxVjeHsTX0etr6jhXN6S_KgQ6DF154aNoOKXt0fS-c', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwMjczOSwiZXhwIjoxNzUwNTA3NTM5fQ.ERQ3tnF5cVzahQfUFGzR-UawZ_FTEwwCa2-tJHKTlEQ', '2025-06-14 20:05:39.313', '2025-06-14 12:05:39.316', '2025-06-14 12:10:27.508', 0, '2025-06-14 12:08:54.583', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 20:05:39.313', 0, NULL),
(81, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDMwMjcsImV4cCI6MTc0OTkzMTgyN30.OeGFmR0up7iJfWUny780W31ksDiLMz-BCoNNQT6g78c', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwMzAyNywiZXhwIjoxNzUwNTA3ODI3fQ.SfOw7LNwJuF8JncXqBBm-t45DEehrbUydTkH2KEqu30', '2025-06-14 20:10:27.731', '2025-06-14 12:10:27.734', '2025-06-14 12:11:54.175', 0, '2025-06-14 12:11:37.909', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 20:10:27.731', 0, NULL),
(82, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDMxMTQsImV4cCI6MTc0OTkzMTkxNH0.8xqUSOJERbdI4cexk5kL-5525CiEbFvwibr_m8D2Qi0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwMzExNCwiZXhwIjoxNzUwNTA3OTE0fQ._77V0QSX7xWJW4M0SYjc343EyqgHm2JdimeEfS3VbMc', '2025-06-14 20:11:54.370', '2025-06-14 12:11:54.373', '2025-06-14 12:20:18.546', 0, '2025-06-14 12:14:40.957', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 20:11:54.370', 0, NULL),
(83, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDM2MTgsImV4cCI6MTc0OTkzMjQxOH0.7hpcBHtXrxOHHaV90lxCofCOr0qJjWnlhJO8Jqto0fI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwMzYxOCwiZXhwIjoxNzUwNTA4NDE4fQ.8bvf3h4ABLM1G-i7EcdfAK0_TyGbRHJ60VHWqe3vK-A', '2025-06-14 20:20:18.840', '2025-06-14 12:20:18.843', '2025-06-14 12:35:19.914', 0, '2025-06-14 12:35:12.913', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 20:20:18.840', 0, NULL),
(84, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDQ1MjAsImV4cCI6MTc0OTkzMzMyMH0.h3CaewQflLq4wVWJHwqP6V7oq0MZgPUQWGnXx8g-77M', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwNDUyMCwiZXhwIjoxNzUwNTA5MzIwfQ.4Q4oHCA3N2ir7TmPjXqF0aY0i0-feOpi-IKwpq9s-88', '2025-06-14 20:35:20.435', '2025-06-14 12:35:20.439', '2025-06-14 12:50:21.602', 0, '2025-06-14 12:48:40.038', 'Dart/3.6 (dart:io)', '::ffff:192.168.0.112', NULL, NULL, NULL, NULL, 0, '2025-07-09 20:35:20.435', 0, NULL),
(85, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDU0MjIsImV4cCI6MTc0OTkzNDIyMn0.KUoiCN2j3MdB3C3jlv-gCllW7sCo9IYTGNO4QLhKPNs', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwNTQyMiwiZXhwIjoxNzUwNTEwMjIyfQ.eTTtUg7IsVaOl-HBXt2-esplHn59ceF4eO4UC6Tro5E', '2025-06-14 20:50:22.116', '2025-06-14 12:50:22.119', '2025-06-14 13:05:55.187', 0, '2025-06-14 13:04:39.906', 'Dart/3.6 (dart:io)', '::ffff:192.168.0.112', NULL, NULL, NULL, NULL, 0, '2025-07-09 20:50:22.116', 0, NULL),
(86, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDYzNTUsImV4cCI6MTc0OTkzNTE1NX0.zI4uphx1iNL5CknNv8-OrzVhUVd2EibFv8ltqHUBKuo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwNjM1NSwiZXhwIjoxNzUwNTExMTU1fQ.NaHaQWA8SWwUzLjlqMUaJZwJaCQ9iDn7FBfsGgR0ne8', '2025-06-14 21:05:55.716', '2025-06-14 13:05:55.731', '2025-06-14 13:20:57.028', 0, '2025-06-14 13:20:40.176', 'Dart/3.6 (dart:io)', '::ffff:192.168.0.112', NULL, NULL, NULL, NULL, 0, '2025-07-09 21:05:55.716', 0, NULL),
(87, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDcyNTcsImV4cCI6MTc0OTkzNjA1N30.zmfGVjfQFm9VKnuFaHpqzc-xxSU6HaRlz4UpIbgAXQc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwNzI1NywiZXhwIjoxNzUwNTEyMDU3fQ.f6_djRc_pX990ut8u_lYBMqU1oUqvofQpGGCxjVxlkU', '2025-06-14 21:20:57.647', '2025-06-14 13:20:57.655', '2025-06-14 13:26:05.664', 0, '2025-06-14 13:24:40.233', 'Dart/3.6 (dart:io)', '::ffff:192.168.0.112', NULL, NULL, NULL, NULL, 0, '2025-07-09 21:20:57.647', 0, NULL),
(88, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NDk5MDc1NjUsImV4cCI6MTc0OTkzNjM2NX0.iWUo0bcsalogdn7VJhHxAhAgPc2qPCTCtbDpBSrmmvI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0OTkwNzU2NSwiZXhwIjoxNzUwNTEyMzY1fQ.exx789RvUhZC9MaO0KF_0Uc0fsropxLBx0aM2U7EdPg', '2025-06-14 21:26:05.932', '2025-06-14 13:26:05.936', '2025-06-15 17:16:08.365', 0, '2025-06-14 13:26:39.899', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-09 21:26:05.932', 0, NULL),
(89, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTAwMDc3NjksImV4cCI6MTc1MDAzNjU2OX0.1Ln9GgDn-EVjVqr_oFksWeljvNXpp_lX63FOnPOGNMo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDAwNzc2OSwiZXhwIjoxNzUwNjEyNTY5fQ.vH67Zrl1elzJc-ljKjIyGHU7wEsRAIpJwnM4OJTZCM8', '2025-06-16 01:16:09.229', '2025-06-15 17:16:09.240', '2025-06-23 07:28:30.286', 0, '2025-06-15 17:16:09.240', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-11 01:16:09.229', 0, NULL),
(90, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NjM3MTAsImV4cCI6MTc1MDY5MjUxMH0.keys4rxAINuVbsEm09sqfm-YRRYvH_6X-apOumKUM5U', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY2MzcxMCwiZXhwIjoxNzUxMjY4NTEwfQ.aOVOcwsYoLs3XUpoQyzSWx-_XjKqGCWYpYCRTZo8EPU', '2025-06-23 15:28:30.743', '2025-06-23 07:28:30.757', '2025-06-23 07:38:27.367', 0, '2025-06-23 07:29:01.342', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-18 15:28:30.743', 0, NULL),
(91, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NjQzMDgsImV4cCI6MTc1MDY5MzEwOH0.QNye0W9nxtWk5lK68iGKd9ZrvdGRByY2NBKENqQA-vc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY2NDMwOCwiZXhwIjoxNzUxMjY5MTA4fQ.O09oqB5dpB1TvTi-t4hSl7jxQZcRR_a0yM6xcrmc8lA', '2025-06-23 15:38:28.176', '2025-06-23 07:38:28.180', '2025-06-23 07:53:29.894', 0, '2025-06-23 07:38:36.703', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-18 15:38:28.176', 0, NULL),
(92, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NjUyMTAsImV4cCI6MTc1MDY5NDAxMH0.TtYbRqikl5rFWvv5lg5SGj09HX6AzplsAqXyw4TPqMM', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY2NTIxMCwiZXhwIjoxNzUxMjcwMDEwfQ.FUb8epq0v7D549aryqxYMzWzOoVvYuG8oiesobVteng', '2025-06-23 15:53:30.728', '2025-06-23 07:53:30.730', '2025-06-23 08:09:00.252', 0, '2025-06-23 07:53:30.730', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-18 15:53:30.728', 0, NULL),
(93, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NjYxNDEsImV4cCI6MTc1MDY5NDk0MX0.vbLoG8k1qiR-GcWJUq84OUMOxcZh9ajMW9qipDxoY_w', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY2NjE0MSwiZXhwIjoxNzUxMjcwOTQxfQ.8yLLdA1jBHBvujyUoGAKmxvXIoSUbJW_U8A3dNmIolE', '2025-06-23 16:09:01.622', '2025-06-23 08:09:01.636', '2025-06-23 08:14:33.584', 0, '2025-06-23 08:14:32.698', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-18 16:09:01.622', 0, NULL);
INSERT INTO `tokens` (`id`, `staff_id`, `access_token`, `refresh_token`, `expires_at`, `created_at`, `updated_at`, `is_valid`, `last_used_at`, `device_info`, `ip_address`, `device_id`, `user_agent`, `device_type`, `app_version`, `refresh_count`, `refresh_expires_at`, `is_primary`, `location_info`) VALUES
(94, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NjY0OTAsImV4cCI6MTc1MDY5NTI5MH0.5CpeBnms1Wf3rdybEOC6aKXstcPQIBkkzg5clZnFjl8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY2NjQ5MCwiZXhwIjoxNzUxMjcxMjkwfQ.KnL4OwG2cQrQm5QCHm39DrOtdsNmxuLW4OxGRSSKX5I', '2025-06-23 16:14:50.286', '2025-06-23 08:14:50.289', '2025-06-23 08:29:51.859', 0, '2025-06-23 08:28:58.080', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-18 16:14:50.286', 0, NULL),
(95, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NjczOTIsImV4cCI6MTc1MDY5NjE5Mn0.YCRYRQmh6CnLl-Ks9QgMwVCc8B2skc2TY1FWyAck48w', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY2NzM5MiwiZXhwIjoxNzUxMjcyMTkyfQ.RIb_PJ6kqfe6JSnc1KQZPSxGZfoxO4epktwRpcLvPck', '2025-06-23 16:29:52.731', '2025-06-23 08:29:52.743', '2025-06-23 08:44:54.411', 0, '2025-06-23 08:42:58.413', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-18 16:29:52.731', 0, NULL),
(96, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NjgyOTUsImV4cCI6MTc1MDY5NzA5NX0.RVIEMNhLqMCeOYEs3Qc5RQ77jH-H_ZVRwHOBJhsYODw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY2ODI5NSwiZXhwIjoxNzUxMjczMDk1fQ.UqnR7WLFWwiwU4nHZ6UTfrj0OGksd3cnBaN30gR39QA', '2025-06-23 16:44:55.263', '2025-06-23 08:44:55.296', '2025-06-23 08:50:58.078', 0, '2025-06-23 08:50:58.077', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-18 16:44:55.263', 0, NULL),
(97, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NjkzNDAsImV4cCI6MTc1MDY5ODE0MH0.-0v26MuRmxTChUuGNvUSMuWF_Q_jiGHpuAna9kPlEFo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY2OTM0MCwiZXhwIjoxNzUxMjc0MTQwfQ.x67BU15E1thWKmH2A9TYAysuikpCJLSG-o3UPcOOtMU', '2025-06-23 17:02:20.416', '2025-06-23 09:02:20.424', '2025-06-23 09:02:20.424', 0, '2025-06-23 09:10:58.213', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-18 17:02:20.416', 0, NULL),
(98, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NzAyNTgsImV4cCI6MTc1MDY5OTA1OH0._7Q8uY6T11Z9Ousin-Sr82CDwz0sPwsyJKQcBiWi0TY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3MDI1OCwiZXhwIjoxNzUxMjc1MDU4fQ.l0jtbg00T2_SADCsFLSk-2-Gc63UsPTOOCtLsbCA6Yw', '2025-06-23 17:17:38.153', '2025-06-23 09:17:38.194', '2025-06-23 09:17:38.194', 0, '2025-06-23 09:30:58.882', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-18 17:17:38.153', 0, NULL),
(99, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NzExNjAsImV4cCI6MTc1MDY5OTk2MH0.0XCdKlMcRniT3lH4lHjBBDNtbc1LjJbG8DNV0aSE8zo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3MTE2MCwiZXhwIjoxNzUxMjc1OTYwfQ.-22i3mCbIC1X4_DayZfbvwJLyJqGd4yA2nusUF4BPCo', '2025-06-23 17:32:40.405', '2025-06-23 09:32:40.447', '2025-06-23 09:32:40.447', 0, '2025-06-23 09:46:58.356', 'Dart/3.6 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-18 17:32:40.405', 0, NULL),
(100, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NzQwMDUsImV4cCI6MTc1MDcwMjgwNX0.CBV-FyFFzbm4KX4RBqhGipB84LKWtdT1WqdkHpbQTpU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3NDAwNSwiZXhwIjoxNzUxMjc4ODA1fQ.M3D6OPCaC4lo09LF4Ltx5f4zwrNT8ftEqjhbD3jjbOM', '2025-06-23 18:20:05.614', '2025-06-23 10:20:05.625', '2025-06-23 10:20:05.625', 0, '2025-06-23 10:33:14.689', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-18 18:20:05.614', 0, NULL),
(101, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NzQ4NzIsImV4cCI6MTc1MDcwMzY3Mn0.7IDOACD9gsfhdLAOw-B3-8tEvQm1ClBMBa7nxAENVSs', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3NDg3MiwiZXhwIjoxNzUxMjc5NjcyfQ.iJx1cHurMODr0HMqYl53EB8yp63DQFlyz3bXjWLgRlU', '2025-06-23 18:34:32.815', '2025-06-23 10:34:32.820', '2025-06-23 10:34:32.820', 0, '2025-06-23 10:35:58.203', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-18 18:34:32.815', 0, NULL),
(102, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NzQ5NjgsImV4cCI6MTc1MDcwMzc2OH0.4eO_z-e9CbtWugM_BgGPwRQ1uepkIbS15FOAHK3MRSY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3NDk2OCwiZXhwIjoxNzUxMjc5NzY4fQ.5kmIGSHguPhN-byGf7xC_NeTI_VI99ET8FqQBN2qkwY', '2025-06-23 18:36:08.450', '2025-06-23 10:36:08.452', '2025-06-23 10:36:08.452', 0, '2025-06-23 10:41:07.802', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-18 18:36:08.450', 0, NULL),
(103, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NzUyNzgsImV4cCI6MTc1MDcwNDA3OH0.XPOdPEqkRA_rOIre9aFHApx3CEWyW8L1hk5nbNDTPgg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3NTI3OCwiZXhwIjoxNzUxMjgwMDc4fQ.SIOlUuYxbv_skExx8oUDwShqHqjdQM8sbeQy4d8iAXE', '2025-06-23 18:41:18.338', '2025-06-23 10:41:18.342', '2025-06-23 10:41:18.342', 0, '2025-06-23 10:42:43.440', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-18 18:41:18.338', 0, NULL),
(104, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NzYxODAsImV4cCI6MTc1MDcwNDk4MH0.W7pdfg7hzOMUykeAYPzFnN9821M1GY1JiJTLKJWTqLc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3NjE4MCwiZXhwIjoxNzUxMjgwOTgwfQ._iEza_83w1NZw7RHfG5tyCkGo0BuHe6SmXO1a7QZbTg', '2025-06-23 18:56:20.780', '2025-06-23 10:56:20.782', '2025-06-23 10:56:20.782', 0, '2025-06-23 10:56:20.782', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-18 18:56:20.780', 0, NULL),
(105, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2NzcwODMsImV4cCI6MTc1MDcwNTg4M30.6Ny3GpacgNmHU4XILn9bOgQVP8Lv93h3jlCTKuHqZWs', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3NzA4MywiZXhwIjoxNzUxMjgxODgzfQ.0kMhH8I-tyJBuDVMUD_08woq8jbYtaM-Hgl0GROUNRk', '2025-06-23 19:11:23.295', '2025-06-23 11:11:23.323', '2025-06-23 11:11:23.323', 0, '2025-06-23 11:11:23.323', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-18 19:11:23.295', 0, NULL),
(106, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2Nzc5OTAsImV4cCI6MTc1MDcwNjc5MH0.wzZ2yA0fJPemX2vT3DuV5DjvVCb_TIhMaTrb1fh062o', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3Nzk5MCwiZXhwIjoxNzUxMjgyNzkwfQ.syPV2fZLPd3TG6hVgyTaiu5UigJ0M9KjAobLwX5q5iw', '2025-06-23 19:26:30.965', '2025-06-23 11:26:30.971', '2025-06-23 11:26:30.971', 0, '2025-06-23 11:26:30.971', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-18 19:26:30.965', 0, NULL),
(107, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2Nzg2NTAsImV4cCI6MTc1MDcwNzQ1MH0.NygtEcRIBbr32G7yBA2bUuwtPW9yVsWifWK_pGAbqx8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3ODY1MCwiZXhwIjoxNzUxMjgzNDUwfQ.N9corbwB1lWJs0oV8KMAUGaJg8PHvPrODi9h4yonIek', '2025-06-23 19:37:30.163', '2025-06-23 11:37:30.166', '2025-06-23 11:37:30.166', 0, '2025-06-23 11:38:09.416', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-18 19:37:30.163', 0, NULL),
(108, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2Nzg3ODQsImV4cCI6MTc1MDcwNzU4NH0.xgfrZa7B0o8fEeUaJ24ty3SNbuQziAch0XPeSQUFcvQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY3ODc4NCwiZXhwIjoxNzUxMjgzNTg0fQ.rUVNX9IpITExufI1RdZ-8vClDcDP0VQvr35aNOmuIgs', '2025-06-23 19:39:44.116', '2025-06-23 11:39:44.118', '2025-06-23 11:39:44.118', 0, '2025-06-23 12:06:49.537', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-18 19:39:44.116', 0, NULL),
(109, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2ODA0NTksImV4cCI6MTc1MDcwOTI1OX0.yJGZ2-GO4qHrRpyavtwjWyrGvtco1DBBoYLXHjiFRD0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY4MDQ1OSwiZXhwIjoxNzUxMjg1MjU5fQ.Et7cMF07jnhFn7oilj4h7sNR-D5LdZwby9zmj9UhmUY', '2025-06-23 20:07:39.012', '2025-06-23 12:07:39.014', '2025-06-23 12:07:39.014', 0, '2025-06-23 12:32:22.774', 'Dart/3.6 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-18 20:07:39.012', 0, NULL),
(110, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2ODIwNTcsImV4cCI6MTc1MDcxMDg1N30.2j-P0hZ12BBlSA9JAC6Q5JU82yGYYwuGZZCrsqCxXnM', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY4MjA1NywiZXhwIjoxNzUxMjg2ODU3fQ.6WtZbbEPOS7Ti85S8DnNb9RKvT7QrYJk7og2SP-ONto', '2025-06-23 20:34:17.027', '2025-06-23 12:34:17.030', '2025-06-23 12:34:17.030', 0, '2025-06-23 12:48:22.474', 'Dart/3.6 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-18 20:34:17.027', 0, NULL),
(111, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA2ODI5NjEsImV4cCI6MTc1MDcxMTc2MX0.iEnAtKwQN8rVHjZB6QcovlA5spgx7W-5N1-ztSDRahw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDY4Mjk2MSwiZXhwIjoxNzUxMjg3NzYxfQ.CJDTGTgN8Zc77Riln3EK3n2EKSVQv9RtyzFOr1VK5tQ', '2025-06-23 20:49:21.042', '2025-06-23 12:49:21.043', '2025-06-23 12:49:21.043', 0, '2025-06-23 13:07:09.051', 'Dart/3.6 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-18 20:49:21.042', 0, NULL),
(112, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA3NTIwMDIsImV4cCI6MTc1MDc4MDgwMn0.qq7IySd2cg5Lvzey0vWKlbR_Q9F-khQLLBaw79eICmw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDc1MjAwMiwiZXhwIjoxNzUxMzU2ODAyfQ.GrXbURBpF5MEyaEHHLM_X1xenoNp8mew7Vwi5fwN4BI', '2025-06-24 16:00:02.231', '2025-06-24 08:00:02.234', '2025-06-24 08:00:02.234', 0, '2025-06-24 08:31:57.187', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-19 16:00:02.231', 0, NULL),
(113, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTA3ODI5MzYsImV4cCI6MTc1MDgxMTczNn0.10LV3-O8zvOQomtE8qA41gAB0PeuM2Pubvy5A9ExmBI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MDc4MjkzNiwiZXhwIjoxNzUxMzg3NzM2fQ.OlqNzryAMuLVRhbP3Zr__cUDC8JWYkpjnmwGuh9qRqo', '2025-06-25 00:35:36.311', '2025-06-24 16:35:36.314', '2025-06-24 16:35:36.314', 0, '2025-06-24 16:36:11.067', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-20 00:35:36.311', 0, NULL),
(114, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMTExMzYsImV4cCI6MTc1MTEzOTkzNn0.IHJhlUwXipCJF8vzlpZ2pSt7kocta94as-pa9ID0a6Q', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTExMTEzNiwiZXhwIjoxNzUxNzE1OTM2fQ.prhaVQNPjKhRC017pnbI3vMhzHEBGPrAkYfQwjoanhg', '2025-06-28 19:45:36.817', '2025-06-28 11:45:36.820', '2025-06-28 11:45:36.820', 0, '2025-06-28 12:00:02.214', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 19:45:36.817', 0, NULL),
(115, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMTIxMDAsImV4cCI6MTc1MTE0MDkwMH0.rlghL7H3nX7fSGpG5JIyX3uHYl2tH7i3pbKtc8Y3oAw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTExMjEwMCwiZXhwIjoxNzUxNzE2OTAwfQ.4lEEOumTnkgih3LFG2VAM__wYLk_yuQRLZSecUpyO8A', '2025-06-28 20:01:40.841', '2025-06-28 12:01:40.845', '2025-06-28 12:01:40.845', 0, '2025-06-28 12:16:05.787', 'Dart/3.6 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-23 20:01:40.841', 0, NULL),
(116, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMTMwMDQsImV4cCI6MTc1MTE0MTgwNH0.lJaBgPIszcQnmX14JrfOE5owYXxyxWxOUhDY0RBpPT4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTExMzAwNCwiZXhwIjoxNzUxNzE3ODA0fQ.NHi2zXgpTQcsaW0VQ2cIn7cZZCyVlKReA6pG7OAvCuM', '2025-06-28 20:16:44.573', '2025-06-28 12:16:44.575', '2025-06-28 12:16:44.575', 0, '2025-06-28 12:18:06.373', 'Dart/3.6 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-23 20:16:44.573', 0, NULL),
(117, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMTMxMzIsImV4cCI6MTc1MTE0MTkzMn0.yNXbPmAPmfjFXpdyZWGa5q8-aiiRwnRlpnmnZ-GEXk8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTExMzEzMiwiZXhwIjoxNzUxNzE3OTMyfQ.n7XJkqDMgMSOmwhSSguIgePzdy7G2BqVQMidwBLqyu0', '2025-06-28 20:18:52.771', '2025-06-28 12:18:52.772', '2025-06-28 12:18:52.772', 0, '2025-06-28 12:31:53.982', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 20:18:52.771', 0, NULL),
(118, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMTQzNTMsImV4cCI6MTc1MTE0MzE1M30.kwUEGd0vCGiDQyNpbDNMRL513yZwanSHnr7YP5nC9io', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTExNDM1MywiZXhwIjoxNzUxNzE5MTUzfQ.y6B4Zgxn3bYMTz0smIBaCESm5gOpsjEK6oPbt3-A_S8', '2025-06-28 20:39:13.866', '2025-06-28 12:39:13.868', '2025-06-28 12:39:13.868', 0, '2025-06-28 12:40:37.753', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-23 20:39:13.866', 0, NULL),
(119, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMTcwNTcsImV4cCI6MTc1MTE0NTg1N30.2m8ubCqNAsWDBYl1dO61falcwqqb1Z_cJgiZKbOOVro', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTExNzA1NywiZXhwIjoxNzUxNzIxODU3fQ.u_AEXTCOEh2ej5yEgHokuik7-tsFmVimxgKeu8U4iFc', '2025-06-28 21:24:17.875', '2025-06-28 13:24:17.879', '2025-06-28 13:24:17.879', 0, '2025-06-28 13:24:29.351', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 21:24:17.875', 0, NULL),
(120, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMTc5NTksImV4cCI6MTc1MTE0Njc1OX0.qP_V9Y9OXKsMWLsl1a52WkLRHWRaLbL44xufSMhwIgQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTExNzk1OSwiZXhwIjoxNzUxNzIyNzU5fQ.hiSnWRjJFQcbHUBcunkMOVgcnRoZZqbOAab2y-0uK0U', '2025-06-28 21:39:19.399', '2025-06-28 13:39:19.401', '2025-06-28 13:39:19.401', 0, '2025-06-28 13:39:19.401', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-23 21:39:19.399', 0, NULL),
(121, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMTgzNTQsImV4cCI6MTc1MTE0NzE1NH0.A83XWW6TlYO3Q9QJfp_4N-32uI34o1M_5E4laUm5Mx0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTExODM1NCwiZXhwIjoxNzUxNzIzMTU0fQ.9F6jAk_ATAhkVx99cWdBE24-vYNBoyKuU573PXwqQSE', '2025-06-28 21:45:54.118', '2025-06-28 13:45:54.121', '2025-06-28 13:45:54.121', 0, '2025-06-28 13:49:40.561', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 21:45:54.118', 0, NULL),
(122, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMTg5MjUsImV4cCI6MTc1MTE0NzcyNX0.x3Ggo5QbAAKuwEW8hy-2i7E2EveReIYc_sUqWBxJjqI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTExODkyNSwiZXhwIjoxNzUxNzIzNzI1fQ.gyxsuyjjwREHLycerwb2dRIaHImjo-IgP5cms2cY49k', '2025-06-28 21:55:25.706', '2025-06-28 13:55:25.711', '2025-06-28 13:55:25.711', 0, '2025-06-28 13:59:27.573', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 21:55:25.706', 0, NULL),
(123, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMTk4MjcsImV4cCI6MTc1MTE0ODYyN30.mj5nvw0rGWHEKY2s23pO6mvVh7sMYEQMNxOVgVkJUOg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTExOTgyNywiZXhwIjoxNzUxNzI0NjI3fQ.9Pq1AGz_No0nu2x2tvLUo9onIak2pYi10oPpw0nYSjk', '2025-06-28 22:10:27.140', '2025-06-28 14:10:27.143', '2025-06-28 14:10:27.143', 0, '2025-06-28 14:19:22.155', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-23 22:10:27.140', 0, NULL),
(124, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjAzNzIsImV4cCI6MTc1MTE0OTE3Mn0.V7twMPRaGgVFJqCK4O3hwtU1FoPmYPp5HP5sefiGmSk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyMDM3MiwiZXhwIjoxNzUxNzI1MTcyfQ.6wnHsvqF_lpp6LzrmKMTFZr9Ku4reR6pgod92KylGXc', '2025-06-28 22:19:32.601', '2025-06-28 14:19:32.604', '2025-06-28 14:19:32.604', 0, '2025-06-28 14:21:41.419', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 22:19:32.601', 0, NULL),
(125, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjA1MzIsImV4cCI6MTc1MTE0OTMzMn0.5EiZD5dFBDNmgrmCAwa57SV8CE4f-bcJnF0kUud6R-I', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyMDUzMiwiZXhwIjoxNzUxNzI1MzMyfQ.JI_YmuhLF9z3ZhWYgJy5NibwA15ag7SyCU3qyH-fmag', '2025-06-28 22:22:12.880', '2025-06-28 14:22:12.883', '2025-06-28 14:22:12.883', 0, '2025-06-28 14:34:59.338', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 22:22:12.880', 0, NULL),
(126, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjE0MzMsImV4cCI6MTc1MTE1MDIzM30.Aw9YMeSV1FM-iCin1ViOEs-kNma2T5oivY0SNM3ODGY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyMTQzMywiZXhwIjoxNzUxNzI2MjMzfQ.Q8cYrekjuHOh6cM6dbzBFM5DOsPAa6BCoAZ8bBaJMug', '2025-06-28 22:37:13.951', '2025-06-28 14:37:13.955', '2025-06-28 14:37:13.955', 0, '2025-06-28 14:37:13.955', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-23 22:37:13.951', 0, NULL),
(127, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjUwNDQsImV4cCI6MTc1MTE1Mzg0NH0.LZssDgxVFJYpqewpBRSD15mG6Djm8woqcSdvFzkuL8g', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyNTA0NCwiZXhwIjoxNzUxNzI5ODQ0fQ.QUxZfYR3DljHBkwH9pLn-8uvH9oyYz43WW86FHWYCxw', '2025-06-28 23:37:24.538', '2025-06-28 15:37:24.540', '2025-06-28 15:37:24.540', 0, '2025-06-28 15:45:20.313', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 23:37:24.538', 0, NULL),
(128, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjU1NTIsImV4cCI6MTc1MTE1NDM1Mn0.hk-x93dl6ejXjo1gCrzErIYG6v6DUDOocJ5qC1r_rFs', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyNTU1MiwiZXhwIjoxNzUxNzMwMzUyfQ.fFQq88nR9JgewXFdwOiD78x0Lfm33vOu5yQBtII0mGU', '2025-06-28 23:45:52.574', '2025-06-28 15:45:52.576', '2025-06-28 15:45:52.576', 0, '2025-06-28 15:53:28.923', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 23:45:52.574', 0, NULL),
(129, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjYwNDksImV4cCI6MTc1MTE1NDg0OX0.huUMq5ShNNcugbwFl4Mf_HbYzGVW3cjk4L8Zpc8iKWA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyNjA0OSwiZXhwIjoxNzUxNzMwODQ5fQ.1reuVgke5yNSDmtyDS4WsGDDYZuaFSvlq-xZJULh4JQ', '2025-06-28 23:54:09.827', '2025-06-28 15:54:09.829', '2025-06-28 15:54:09.829', 0, '2025-06-28 15:54:28.652', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 23:54:09.827', 0, NULL),
(130, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjYwNzIsImV4cCI6MTc1MTE1NDg3Mn0.BWwCYNyItxG7CUmOYVcexSIGiojFP6TNlLcD0DnxNp4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyNjA3MiwiZXhwIjoxNzUxNzMwODcyfQ.QrfUfQ5WgYP8UrjlH_S2lfOQscAY-OUHgGYLQ8d5uYg', '2025-06-28 23:54:32.550', '2025-06-28 15:54:32.552', '2025-06-28 15:54:32.552', 0, '2025-06-28 15:55:55.201', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 23:54:32.550', 0, NULL),
(131, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjYyMzgsImV4cCI6MTc1MTE1NTAzOH0.33e3K50gs4Vavb365drwoGiuxD6hSP0BGXledQ-MjoA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyNjIzOCwiZXhwIjoxNzUxNzMxMDM4fQ.4RjnG561FQaMQlkulnGqow0wdwdSfZOI7472VYwcHLY', '2025-06-28 23:57:18.420', '2025-06-28 15:57:18.422', '2025-06-28 15:57:18.422', 0, '2025-06-28 16:12:15.990', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-23 23:57:18.420', 0, NULL),
(132, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjcxMzksImV4cCI6MTc1MTE1NTkzOX0.ufDqabPuMTqGnx46HoUiUQptNTF5jOq2jXigDoL-ZUE', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyNzEzOSwiZXhwIjoxNzUxNzMxOTM5fQ.T6WDjbNMnlk4PoPfNXN96zAJjsnbCCyqHK2U-kaaK8g', '2025-06-29 00:12:19.304', '2025-06-28 16:12:19.308', '2025-06-28 16:12:19.308', 0, '2025-06-28 16:12:19.308', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-24 00:12:19.304', 0, NULL),
(133, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjczNDgsImV4cCI6MTc1MTE1NjE0OH0.OpEZAGsmA_43KGvrMLUOe4jrw4xDX6c4TGmaULkziFQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyNzM0OCwiZXhwIjoxNzUxNzMyMTQ4fQ.HAM3Qi4IIaDoUPiOmtnUYapekoDD4Pf-a6dnMTRDxfo', '2025-06-29 00:15:48.759', '2025-06-28 16:15:48.764', '2025-06-28 16:15:48.764', 0, '2025-06-28 16:22:36.142', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 00:15:48.759', 0, NULL),
(134, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjc3NjYsImV4cCI6MTc1MTE1NjU2Nn0.d604chhw65HletX-lv2TCtt_trSF5qC4t2Ufpj3jzSU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyNzc2NiwiZXhwIjoxNzUxNzMyNTY2fQ.ZjvkOtAukcn9HwL3snfoyX2Q5S-m4X6Euy6M97KSE8Y', '2025-06-29 00:22:46.232', '2025-06-28 16:22:46.233', '2025-06-28 16:22:46.233', 0, '2025-06-28 16:24:33.769', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 00:22:46.232', 0, NULL),
(135, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjc4ODcsImV4cCI6MTc1MTE1NjY4N30.ikYylXMojIuPqauT2-EsqIBf4ytABWNOV-fAqxU5z9s', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyNzg4NywiZXhwIjoxNzUxNzMyNjg3fQ.kjUEsTl-Lk91Eo2jKUN5moc7uYbBTIGLumbqqr-VUaA', '2025-06-29 00:24:47.929', '2025-06-28 16:24:47.931', '2025-06-28 16:24:47.931', 0, '2025-06-28 16:26:14.413', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 00:24:47.929', 0, NULL),
(136, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjc5OTAsImV4cCI6MTc1MTE1Njc5MH0.5vYitjeUnxauI2fUz1V1mUSkyFsd84EyiirnxCuXxU8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyNzk5MCwiZXhwIjoxNzUxNzMyNzkwfQ.FWIM2hUSkFSwadsOid6zGEwXbn-1zc7cDUWG9ty8-Q4', '2025-06-29 00:26:30.831', '2025-06-28 16:26:30.833', '2025-06-28 16:26:30.833', 0, '2025-06-28 16:30:29.355', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 00:26:30.831', 0, NULL),
(137, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjgyNTQsImV4cCI6MTc1MTE1NzA1NH0.7pl-TMD7s348Jfl8iKZehfObnsopNanlDlnlMiCNYAA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyODI1NCwiZXhwIjoxNzUxNzMzMDU0fQ.B0q6y5vwTy_VZ2TyitvBX_75kaGDfTqPfDlABFUVYSw', '2025-06-29 00:30:54.520', '2025-06-28 16:30:54.523', '2025-06-28 16:30:54.523', 0, '2025-06-28 16:32:24.248', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 00:30:54.520', 0, NULL),
(138, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjkxNTUsImV4cCI6MTc1MTE1Nzk1NX0.eW0ehuq0GF5OQXRjL1StKD3_wXPLJsgA-PltznD0ONk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyOTE1NSwiZXhwIjoxNzUxNzMzOTU1fQ.z09QjJXs4fKSBwT_HDBf2IfBscap7Ub9_cVelmQ1LNE', '2025-06-29 00:45:55.949', '2025-06-28 16:45:55.951', '2025-06-28 16:45:55.951', 0, '2025-06-28 16:47:24.635', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-24 00:45:55.949', 0, NULL),
(139, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMjkyNTYsImV4cCI6MTc1MTE1ODA1Nn0.uwIb2Gu4Fp8k_v7H2bq9LPJEFQzuY4WXh8gpW_2JSug', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEyOTI1NiwiZXhwIjoxNzUxNzM0MDU2fQ.vEeeXk6ZIBMVV_sbMSdHbQX8o2zXUbadmssmqE-rb_g', '2025-06-29 00:47:36.006', '2025-06-28 16:47:36.009', '2025-06-28 16:47:36.009', 0, '2025-06-28 17:00:09.901', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 00:47:36.006', 0, NULL),
(140, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMzAwMzgsImV4cCI6MTc1MTE1ODgzOH0.H0lsyZTOk7bDK6r-CRWviCBuIKWIOujBvti5FdYIc0Q', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEzMDAzOCwiZXhwIjoxNzUxNzM0ODM4fQ.DTHWcDa_7Z1Hk-qaQJwTsqSkvpcKII63wguJFMiGsWc', '2025-06-29 01:00:38.549', '2025-06-28 17:00:38.552', '2025-06-28 17:00:38.552', 0, '2025-06-28 17:14:39.809', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 01:00:38.549', 0, NULL),
(141, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMzA5MzksImV4cCI6MTc1MTE1OTczOX0.mm-D1LH86SaRMSwLZPQMvSykH7W8IB3xD2QXXQ72aZM', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEzMDkzOSwiZXhwIjoxNzUxNzM1NzM5fQ.92kA305b8siPVmbY0htNQe3Lt2EAHazHpssKvB22O8g', '2025-06-29 01:15:39.665', '2025-06-28 17:15:39.668', '2025-06-28 17:15:39.668', 0, '2025-06-28 17:27:25.296', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-24 01:15:39.665', 0, NULL),
(142, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMzE3NTksImV4cCI6MTc1MTE2MDU1OX0.q4xCBiViU1t-N3Oc8SQejukBqQk74VV5YkL3hEfM2WA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEzMTc1OSwiZXhwIjoxNzUxNzM2NTU5fQ.3-cSU1gIc-IV29SzIQtsCGXMFFj1w88ofxeUR2ApU_0', '2025-06-29 01:29:19.774', '2025-06-28 17:29:19.783', '2025-06-28 17:29:19.783', 0, '2025-06-28 17:33:06.315', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 01:29:19.774', 0, NULL),
(143, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMzIxMjQsImV4cCI6MTc1MTE2MDkyNH0.nXtzscuneamwNJ-6TOkU46n9H_fyuF31I4xsgNdPxOU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEzMjEyNCwiZXhwIjoxNzUxNzM2OTI0fQ.zsTgQqxT35X1HAIGafcha8RvLuKtXE7K7jrcUBkPd4M', '2025-06-29 01:35:24.347', '2025-06-28 17:35:24.355', '2025-06-28 17:35:24.355', 0, '2025-06-28 17:38:20.375', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 01:35:24.347', 0, NULL),
(144, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMzIzMTIsImV4cCI6MTc1MTE2MTExMn0.zk3Ce32jjJpPcvCR5FXDtPTFznP2a3TuJoR-fmz6_Cc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEzMjMxMiwiZXhwIjoxNzUxNzM3MTEyfQ.waqatbt8sad5afEBBpa78vDGUBrYlV3UC-Bmozs-JCI', '2025-06-29 01:38:32.852', '2025-06-28 17:38:32.855', '2025-06-28 17:38:32.855', 0, '2025-06-28 17:39:01.364', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 01:38:32.852', 0, NULL),
(145, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMzIzNTksImV4cCI6MTc1MTE2MTE1OX0.xDZEg9kPYOIWSo4JmXjakTphzHsQ0kzIDDQj99ciNSo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEzMjM1OSwiZXhwIjoxNzUxNzM3MTU5fQ.Jw97UnyvurxpMSEiT_XKfIW1iCyv3JxyN58FU73PtIU', '2025-06-29 01:39:19.981', '2025-06-28 17:39:19.986', '2025-06-28 17:39:19.986', 0, '2025-06-28 17:42:24.393', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 01:39:19.981', 0, NULL),
(146, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMzI1NjIsImV4cCI6MTc1MTE2MTM2Mn0.biBNn_qjJnGAPsCKW-gFkKHnHKPawYhLNDMsxkDtvJo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEzMjU2MiwiZXhwIjoxNzUxNzM3MzYyfQ.yklpoznp1a5KjUZ4aqALJmpY45QewFQaLch5Js-bvHg', '2025-06-29 01:42:42.565', '2025-06-28 17:42:42.570', '2025-06-28 17:42:42.570', 0, '2025-06-28 17:57:38.653', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 01:42:42.565', 0, NULL),
(147, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMzM0NjMsImV4cCI6MTc1MTE2MjI2M30.G5yMu_8sW0LfSZ7kUzXylchMs1Su3pQaFR35VYY-3V4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEzMzQ2MywiZXhwIjoxNzUxNzM4MjYzfQ.MoHVFmuEVz-xNtruNU91y2JYXghKlVYY5SG2M-ZKF-A', '2025-06-29 01:57:43.560', '2025-06-28 17:57:43.571', '2025-06-28 17:57:43.571', 0, '2025-06-28 18:09:22.774', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-24 01:57:43.560', 0, NULL),
(148, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExMzQzNjQsImV4cCI6MTc1MTE2MzE2NH0.rJeBOWSYULOfS96PdDpYNF_V4ivvjelKthLJCl_9ulU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTEzNDM2NCwiZXhwIjoxNzUxNzM5MTY0fQ.0jtJxewcUcL9_zy75vX1_xF0l4iZ3P3ZZpBRRihIuzs', '2025-06-29 02:12:44.672', '2025-06-28 18:12:44.675', '2025-06-28 18:12:44.675', 0, '2025-06-28 18:12:44.675', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '::ffff:192.168.100.10', NULL, NULL, NULL, NULL, 0, '2025-07-24 02:12:44.672', 0, NULL),
(149, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExNDE1NjAsImV4cCI6MTc1MTE3MDM2MH0.Pou8PSk-ax6SeZhXXqnwswD_BXT_wDuvhhDocpmTPTY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTE0MTU2MCwiZXhwIjoxNzUxNzQ2MzYwfQ.J1LLt_ESAkwrsnSB43xGSlDj_82z_qGLyC_POohoIfs', '2025-06-29 04:12:40.523', '2025-06-28 20:12:40.526', '2025-06-28 20:12:40.526', 0, '2025-06-28 20:13:06.519', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 04:12:40.523', 0, NULL),
(150, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExNDIyODMsImV4cCI6MTc1MTE3MTA4M30.Oy17wy9rLwdWaHGT2z20keB1--Ytq8UrMkSaZKsCxBE', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTE0MjI4MywiZXhwIjoxNzUxNzQ3MDgzfQ.YAZ1rZzzMeOAk2shDkoYVPSDbdTtoAFNfNdgMygfgcQ', '2025-06-29 04:24:43.323', '2025-06-28 20:24:43.326', '2025-06-28 20:24:43.326', 0, '2025-06-28 20:39:48.049', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 04:24:43.323', 0, NULL),
(151, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExNDMxODgsImV4cCI6MTc1MTE3MTk4OH0.YxP832jIRmHm8WFacW1zYatmqcpjOUPKPtWsE-SPUE8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTE0MzE4OCwiZXhwIjoxNzUxNzQ3OTg4fQ.DdThPIyaFLW432WXPSgvid-4qx-tYLjPDl_9f1mOmnI', '2025-06-29 04:39:48.838', '2025-06-28 20:39:48.840', '2025-06-28 20:39:48.840', 0, '2025-06-28 20:54:15.125', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-24 04:39:48.838', 0, NULL),
(152, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExNDQwOTksImV4cCI6MTc1MTE3Mjg5OX0.sVEh2PnYaGNsSo0GS8ZY0REodh8tWL2QX9HaBRvC2qY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTE0NDA5OSwiZXhwIjoxNzUxNzQ4ODk5fQ.iqi2A9ecM2voZGdrIwZDDC5D_e1Q25idW1oDfnjjTBw', '2025-06-29 04:54:59.982', '2025-06-28 20:54:59.984', '2025-06-28 20:54:59.984', 0, '2025-06-28 21:05:07.039', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-24 04:54:59.982', 0, NULL),
(153, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExNDUwMDQsImV4cCI6MTc1MTE3MzgwNH0.Ak76OCYLEpUehnGk_i4v871FJFuIhJW-6A58Z1xGuQM', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTE0NTAwNCwiZXhwIjoxNzUxNzQ5ODA0fQ.uTNMKTcBqCbi9C9Y3UQ-uZWXYm0xeihqXnDNnjwh8EE', '2025-06-29 05:10:04.165', '2025-06-28 21:10:04.168', '2025-06-28 21:10:04.168', 0, '2025-06-28 21:11:38.751', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-24 05:10:04.165', 0, NULL),
(154, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExNDU5MTAsImV4cCI6MTc1MTE3NDcxMH0.EMnrzxE1oCT_X4KY7BS5l0MC0_v_RrBLo3Iyt9g1WtA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTE0NTkxMCwiZXhwIjoxNzUxNzUwNzEwfQ.dR95Q3vdEU1RMAgID9tfT_p_ltzd8C3Shf4oe0IV0YU', '2025-06-29 05:25:10.912', '2025-06-28 21:25:10.915', '2025-06-28 21:25:10.915', 0, '2025-06-28 21:25:10.915', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-24 05:25:10.912', 0, NULL),
(155, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTExNDY4MTcsImV4cCI6MTc1MTE3NTYxN30.arTKvEZmQoiIgqAfVUl-xtzwSyjLrjIm-UctEWilY-U', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTE0NjgxNywiZXhwIjoxNzUxNzUxNjE3fQ.OKeOSflHj2qjiPb5lrTyA4Q2DsyYAqQ3wEQWs_ACfoU', '2025-06-29 05:40:17.697', '2025-06-28 21:40:17.700', '2025-06-28 21:40:17.700', 0, '2025-06-28 21:56:29.258', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-24 05:40:17.697', 0, NULL),
(156, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyMTE0NDQsImV4cCI6MTc1MTI0MDI0NH0.gLzRDR3iV0Dpo39zvJZBPrNNMcA7be_arFpis-96CiA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTIxMTQ0NCwiZXhwIjoxNzUxODE2MjQ0fQ.B31tcJ8IuMWEYfktW_8BvBjsYqYbaLxAIIH3vazGc60', '2025-06-29 23:37:24.090', '2025-06-29 15:37:24.093', '2025-06-29 15:37:24.093', 0, '2025-06-29 15:51:34.054', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-24 23:37:24.090', 0, NULL),
(157, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyMTIzNDgsImV4cCI6MTc1MTI0MTE0OH0.iidaNN0DoW4A_922K9b6SpzqUDuDuhLgIqKaXRlZicw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTIxMjM0OCwiZXhwIjoxNzUxODE3MTQ4fQ.W3dEhV_PxefHZULUOxbGJjYHfxrMgw0EfQoCQwQ4cS4', '2025-06-29 23:52:28.380', '2025-06-29 15:52:28.381', '2025-06-29 15:52:28.381', 0, '2025-06-29 15:55:34.221', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-24 23:52:28.380', 0, NULL),
(158, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNjgyNzAsImV4cCI6MTc1MTI5NzA3MH0.JSapx9VpV_ErAxfwRXG4BFnRpzX5ofB2OSCS058eaFc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI2ODI3MCwiZXhwIjoxNzUxODczMDcwfQ.BW7JlIp8EkqmS8CaPLevGWgDZL6fFv6Dfcv1BlWQYhk', '2025-06-30 15:24:30.175', '2025-06-30 07:24:30.178', '2025-06-30 07:24:30.178', 0, '2025-06-30 07:25:03.222', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 15:24:30.175', 0, NULL),
(159, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNjgzOTEsImV4cCI6MTc1MTI5NzE5MX0.O0FeJdIVPq9W4V0oGACXmtKv3pzr43H7PyXordNkDw4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI2ODM5MSwiZXhwIjoxNzUxODczMTkxfQ.qtVGdVl8L_EZNrEFoqZbGz72ujfrITZ8LxGXUHcXJUc', '2025-06-30 15:26:31.251', '2025-06-30 07:26:31.254', '2025-06-30 07:26:31.254', 0, '2025-06-30 07:38:00.499', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 15:26:31.251', 0, NULL),
(160, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNjkyOTUsImV4cCI6MTc1MTI5ODA5NX0.TKzz2jKyEL5jUMTIn4njC9g2PVbC6c8_QP-NCqPaXlw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI2OTI5NSwiZXhwIjoxNzUxODc0MDk1fQ.6cUvHqGpcJcGAIsuqob2hxOds-YT4vUL-ZM0Wl9KHOg', '2025-06-30 15:41:35.945', '2025-06-30 07:41:35.947', '2025-06-30 07:41:35.947', 0, '2025-06-30 07:56:00.432', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-25 15:41:35.945', 0, NULL),
(161, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzAyMDAsImV4cCI6MTc1MTI5OTAwMH0.lEZZuyahrn9rYo4B36amjG5NnLcnx6w58Pv7EuL7xtw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3MDIwMCwiZXhwIjoxNzUxODc1MDAwfQ.Z5nJaoOMV52K_SygPObBsgJYRHsUTj6xP7zPpKeEyz4', '2025-06-30 15:56:40.034', '2025-06-30 07:56:40.037', '2025-06-30 07:56:40.037', 0, '2025-06-30 08:07:59.294', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-25 15:56:40.034', 0, NULL),
(162, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzExMDQsImV4cCI6MTc1MTI5OTkwNH0.IzfStFb-qU0zVLWLWRxyKedmFI1UvrooVhy4krUPSQA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3MTEwNCwiZXhwIjoxNzUxODc1OTA0fQ.7CODsGCRLkrqW7XxY5hbAKlbNNout0y6sUdMLptj318', '2025-06-30 16:11:44.033', '2025-06-30 08:11:44.036', '2025-06-30 08:11:44.036', 0, '2025-06-30 08:24:32.509', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-25 16:11:44.033', 0, NULL),
(163, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzE4OTUsImV4cCI6MTc1MTMwMDY5NX0.tHeNU6rJQg9EMFxTGukUj74NgRsybJy-t8HnvdZCTh4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3MTg5NSwiZXhwIjoxNzUxODc2Njk1fQ.UI-a-q0m3JoWwcKCpdTfjOYCVomR6HKkmpGVm7xrvXo', '2025-06-30 16:24:55.292', '2025-06-30 08:24:55.294', '2025-06-30 08:24:55.294', 0, '2025-06-30 08:39:12.904', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 16:24:55.292', 0, NULL),
(164, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzI3OTksImV4cCI6MTc1MTMwMTU5OX0.ENOzlejdDfR6ZHdr1xAcqybjY_bq8MpR1DoVqEExdr8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3Mjc5OSwiZXhwIjoxNzUxODc3NTk5fQ.aJpU810XktZqiDN6asmvan7-OsiSYEXb6d306VfNfTw', '2025-06-30 16:39:59.408', '2025-06-30 08:39:59.410', '2025-06-30 08:39:59.410', 0, '2025-06-30 08:51:12.727', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-25 16:39:59.408', 0, NULL),
(165, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzM1NzksImV4cCI6MTc1MTMwMjM3OX0.AUQhFy1ywDqEAocJqeQ5n_rw7v1AP8vGlQx7qv45xL0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3MzU3OSwiZXhwIjoxNzUxODc4Mzc5fQ.M2mYxpS-urMCsXSJoJ_XaCU1YmzfJ9xJtY7nfCnG7KM', '2025-06-30 16:52:59.709', '2025-06-30 08:52:59.710', '2025-06-30 08:52:59.710', 0, '2025-06-30 08:56:47.706', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 16:52:59.709', 0, NULL),
(166, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzQ0NDAsImV4cCI6MTc1MTMwMzI0MH0.XnQmgHh9kWsXzGoBU2G5TwrenMKe2Q_BZp5RBF00CHQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3NDQ0MCwiZXhwIjoxNzUxODc5MjQwfQ.ZXKnHZHEvnEydx9dXHb1leXio-Mknijmc6ky9_eL08Y', '2025-06-30 17:07:20.415', '2025-06-30 09:07:20.416', '2025-06-30 09:07:20.416', 0, '2025-06-30 09:19:26.746', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 17:07:20.415', 0, NULL),
(167, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzUzNDIsImV4cCI6MTc1MTMwNDE0Mn0.vWGZlLs3k4XojqsdWZP-szrKg49RDnFkpXfYJNBTgKU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3NTM0MiwiZXhwIjoxNzUxODgwMTQyfQ.UeQH62W2SA18PWvJ4vySPqj5J6IIysMGCLTjuliPAv0', '2025-06-30 17:22:22.950', '2025-06-30 09:22:22.952', '2025-06-30 09:22:22.952', 0, '2025-06-30 09:36:53.702', 'Dart/3.8 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-25 17:22:22.950', 0, NULL),
(168, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzYyNDUsImV4cCI6MTc1MTMwNTA0NX0.xwdVfChzA2Byq5pp5_qkDd0Z1Z0rEoI6aJlzJ06U5Ic', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3NjI0NSwiZXhwIjoxNzUxODgxMDQ1fQ.wKRQ9hdkwfwUPzCTlK_gIn1Uzb2zhTynTna5JhomxGI', '2025-06-30 17:37:25.409', '2025-06-30 09:37:25.410', '2025-06-30 09:37:25.410', 0, '2025-06-30 09:51:24.962', 'Dart/3.8 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-25 17:37:25.409', 0, NULL),
(169, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzcxNDcsImV4cCI6MTc1MTMwNTk0N30.4bUCYBILsFuihXuX3mqy7RQWfNqPwR5GS2xa-jX6BFM', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3NzE0NywiZXhwIjoxNzUxODgxOTQ3fQ.I9pewShsbrzccMjjaKByti2eSxInMvStK23p67yVtOw', '2025-06-30 17:52:27.323', '2025-06-30 09:52:27.324', '2025-06-30 09:52:27.324', 0, '2025-06-30 10:02:55.356', 'Dart/3.8 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-25 17:52:27.323', 0, NULL),
(170, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzgzNjYsImV4cCI6MTc1MTMwNzE2Nn0.fMcLVrLgPZmgvolqlcwBMr7GvjK2qq_krN8slib7GUM', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3ODM2NiwiZXhwIjoxNzUxODgzMTY2fQ.g5iN0-zyU0H7N6jPeRLOMMh_nkORl45VnfhCd-WH5j4', '2025-06-30 18:12:46.005', '2025-06-30 10:12:46.007', '2025-06-30 10:12:46.007', 0, '2025-06-30 10:19:58.418', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 18:12:46.005', 0, NULL),
(171, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzg4MTAsImV4cCI6MTc1MTMwNzYxMH0.OoHzoGwxucHpJO63ajpJn3tftqHlQC-eYV_tyvQa2wQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3ODgxMCwiZXhwIjoxNzUxODgzNjEwfQ.rbR5qdnQMtidyT9c1RQ52WHF69bf6ZfahPe34BNupY8', '2025-06-30 18:20:10.198', '2025-06-30 10:20:10.199', '2025-06-30 10:20:10.199', 0, '2025-06-30 10:28:01.216', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 18:20:10.198', 0, NULL),
(172, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzk3MTMsImV4cCI6MTc1MTMwODUxM30.UmCDqnl57Vyq4mPHZku3fiAt3RrhQABAlcVVMRxqUfI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3OTcxMywiZXhwIjoxNzUxODg0NTEzfQ.1FSwcCmrZ8Dx2Mm6XSdo97KxI-TSBPDLMdpxCGo85-M', '2025-06-30 18:35:13.751', '2025-06-30 10:35:13.756', '2025-06-30 10:35:13.756', 0, '2025-06-30 10:35:13.756', 'Dart/3.8 (dart:io)', '::ffff:192.168.100.15', NULL, NULL, NULL, NULL, 0, '2025-07-25 18:35:13.751', 0, NULL),
(173, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyNzk5MzksImV4cCI6MTc1MTMwODczOX0.OXgO7pZ0aNoghWR5yJwDKSIge3EnTGI72m4Wz3RG7QA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI3OTkzOSwiZXhwIjoxNzUxODg0NzM5fQ.HgP3f0Zodf1pHsevOxp7qjG8tLYMs2uxghcCF9nMIwg', '2025-06-30 18:38:59.328', '2025-06-30 10:38:59.330', '2025-06-30 10:38:59.330', 0, '2025-06-30 10:38:59.330', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 18:38:59.328', 0, NULL),
(174, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyODAyODcsImV4cCI6MTc1MTMwOTA4N30.AE5iz_EYrPcnlUcy0KIqRNTKZesTobgVLofh8GqPdS8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI4MDI4NywiZXhwIjoxNzUxODg1MDg3fQ.LLgK_02GhDsdPdvp-f9dNz4tTvMkM5lmsB3w0Tdj0No', '2025-06-30 18:44:47.555', '2025-06-30 10:44:47.557', '2025-06-30 10:44:47.557', 0, '2025-06-30 10:44:47.557', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 18:44:47.555', 0, NULL),
(175, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyODI4ODEsImV4cCI6MTc1MTMxMTY4MX0.L3jSNfRK3X3TYut_vnFc6eE7n3x-Nu0-L1GvYKHSQJk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI4Mjg4MSwiZXhwIjoxNzUxODg3NjgxfQ.naUFRYO55P79ju1-LmB1khKediXCZ_9b1aHziw5_t9Y', '2025-06-30 19:28:01.685', '2025-06-30 11:28:01.686', '2025-06-30 11:28:01.686', 0, '2025-06-30 11:28:01.686', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 19:28:01.685', 0, NULL),
(176, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyODM1OTQsImV4cCI6MTc1MTMxMjM5NH0.g1kqSVJ9EqWvFoZhQpvQGf8QNqZcG3l-N7w0Ts3UvRk', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI4MzU5NCwiZXhwIjoxNzUxODg4Mzk0fQ.YkhJwQamQbYA1XFJXW3aP__7X0Mud-9EyX9dFO7wduI', '2025-06-30 19:39:54.877', '2025-06-30 11:39:54.878', '2025-06-30 11:39:54.878', 0, '2025-06-30 11:39:54.878', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 19:39:54.877', 0, NULL);
INSERT INTO `tokens` (`id`, `staff_id`, `access_token`, `refresh_token`, `expires_at`, `created_at`, `updated_at`, `is_valid`, `last_used_at`, `device_info`, `ip_address`, `device_id`, `user_agent`, `device_type`, `app_version`, `refresh_count`, `refresh_expires_at`, `is_primary`, `location_info`) VALUES
(177, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyODQ1MDEsImV4cCI6MTc1MTMxMzMwMX0.jV0Lf6azcGhNSQHSV59-UkT3m2ZhFgAwpfo-nDVh9Sc', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI4NDUwMSwiZXhwIjoxNzUxODg5MzAxfQ.MARROpo23Us5NvTFWP5IGV6DNPJcnCcI3xdx67mn0Nw', '2025-06-30 19:55:01.129', '2025-06-30 11:55:01.130', '2025-06-30 11:55:01.130', 0, '2025-06-30 11:55:01.130', 'Dart/3.8 (dart:io)', '127.0.0.1', NULL, NULL, NULL, NULL, 0, '2025-07-25 19:55:01.129', 0, NULL),
(178, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyODk3MDIsImV4cCI6MTc1MTMxODUwMn0.JjgAjBAI4Fb6Ao71aN8a43IOQFLVHSzJ5cHN3G6zH3Q', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI4OTcwMiwiZXhwIjoxNzUxODk0NTAyfQ.kFndNVyjy1XpWAPsSZQ8b6p82-sAIZ2tmA4Em2HCy4I', '2025-06-30 21:21:42.169', '2025-06-30 13:21:42.170', '2025-06-30 13:21:42.170', 0, '2025-06-30 13:21:42.170', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 21:21:42.169', 0, NULL),
(179, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyODk4MDIsImV4cCI6MTc1MTMxODYwMn0.4F7KfC0--b_75DH1m4V6nI7PvCLr9QI_Bq_e4bhLNLs', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI4OTgwMiwiZXhwIjoxNzUxODk0NjAyfQ.vd56zkR6tcKRgQKcQ8CyZcevvF7syXzvUr3iF--e26I', '2025-06-30 21:23:22.681', '2025-06-30 13:23:22.682', '2025-06-30 13:23:22.682', 0, '2025-06-30 13:23:22.682', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 21:23:22.681', 0, NULL),
(180, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJUZWFtIExlYWRlciIsImVtcGxObyI6IkVNUDAwMSIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJpYXQiOjE3NTEyOTEwMTQsImV4cCI6MTc1MTMxOTgxNH0.iogNAI_s9g7dilqX-ZcS8Az7VcllSusGKFAX89hMh9k', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc1MTI5MTAxNCwiZXhwIjoxNzUxODk1ODE0fQ.PjOK2j7GaikSL3kThyn_pfafPtx8Uu6bfncpSP4Za5k', '2025-06-30 21:43:34.665', '2025-06-30 13:43:34.666', '2025-06-30 13:43:34.666', 1, '2025-06-30 13:43:34.666', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-25 21:43:34.665', 0, NULL),
(181, 40, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQwLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAyIiwibmFtZSI6IlRlc3QgVXNlciAyIiwiaWF0IjoxNzU1MDk2NTE3LCJleHAiOjE3NTUxMTQ1MTd9.ezNLqHslQjqgN1ToLsjW6Yo0QTDyDiltSWgxaylY9aA', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQwLCJpYXQiOjE3NTUwOTY1MTcsImV4cCI6MTc1NTcwMTMxN30.joNPuEaXwHrbDrefAI_zyWRCZSMSWI3qKl7rWqIN4Cw', '2025-08-13 22:48:37.007', '2025-08-13 16:48:36.914', '2025-08-13 16:48:36.914', 1, '2025-08-13 16:48:36.914', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-07 22:48:37.007', 0, NULL),
(182, 40, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQwLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAyIiwibmFtZSI6IlRlc3QgVXNlciAyIiwiaWF0IjoxNzU1MDk2NzMzLCJleHAiOjE3NTUxMTQ3MzN9.e2IpesVExX3rsyYITJY1R13kc-p1H9lLU2tBPw__UOY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQwLCJpYXQiOjE3NTUwOTY3MzMsImV4cCI6MTc1NTcwMTUzM30.EndDAWGnTKq_ZZOJc7LJFkXSav3FW4ZZOLe6CiuT3O8', '2025-08-13 22:52:13.674', '2025-08-13 16:52:13.594', '2025-08-13 16:52:13.594', 1, '2025-08-13 16:52:13.594', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-07 22:52:13.674', 0, NULL),
(183, 40, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQwLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAyIiwibmFtZSI6IlRlc3QgVXNlciAyIiwiaWF0IjoxNzU1MDk2NzQzLCJleHAiOjE3NTUxMTQ3NDN9.UlL-UOw_d0QhlU3TIRBfXSoKPFGjBMi7ohWKyIANTfI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQwLCJpYXQiOjE3NTUwOTY3NDMsImV4cCI6MTc1NTcwMTU0M30.SKGPZ02HFR_3JhJvGHQFPEw7Vwg4-AnhdqdC9eqLkZw', '2025-08-13 22:52:23.520', '2025-08-13 16:52:23.450', '2025-08-13 16:52:23.450', 1, '2025-08-13 16:52:23.450', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-07 22:52:23.520', 0, NULL),
(184, 42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAxIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc1NTA5NzQ0MCwiZXhwIjoxNzU1MTE1NDQwfQ.9wlBT0m_XzkecUY_ucU17HUTESr02qvfanqWccegBH0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE3NTUwOTc0NDAsImV4cCI6MTc1NTcwMjI0MH0.QnWshgrnTNaqNDU0XllMtkJsiYfdQMO9vkxlcXTZGyo', '2025-08-13 23:04:00.133', '2025-08-13 17:04:00.159', '2025-08-13 17:04:00.159', 1, '2025-08-13 17:04:00.159', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-07 23:04:00.133', 0, NULL),
(185, 42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAxIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc1NTA5NzgxNSwiZXhwIjoxNzU1MTE1ODE1fQ.OXeOhYo3-Q-3QbrByy1mc8BWpKtBgj964Kr026MxYC0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE3NTUwOTc4MTUsImV4cCI6MTc1NTcwMjYxNX0.8PJgQqk0Qm5XP1B7lNL1erC9u6ffrQC_nD6_Ynw6H6w', '2025-08-13 23:10:15.650', '2025-08-13 17:10:15.514', '2025-08-13 17:10:15.514', 1, '2025-08-13 17:10:15.514', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-07 23:10:15.650', 0, NULL),
(186, 42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAxIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc1NTA5ODUzNywiZXhwIjoxNzU1MTE2NTM3fQ.mrF1x5kx3MU3ytOLdxJiCPJYW4YsITzH8iQ--fM-5d8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE3NTUwOTg1MzcsImV4cCI6MTc1NTcwMzMzN30.P6mYKlgwcBKJ9LSMLMJCEWF_pi9l8ZXazXxKrhT0H0Q', '2025-08-13 23:22:17.960', '2025-08-13 17:22:17.906', '2025-08-13 17:22:17.906', 1, '2025-08-13 17:22:17.906', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-07 23:22:17.960', 0, NULL),
(187, 42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAxIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc1NTA5OTI4OCwiZXhwIjoxNzU1MTE3Mjg4fQ.bG69tCcaO1oXrjZNXkfFMRjRVbEsYO4Tof8ZpEuRh_s', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE3NTUwOTkyODgsImV4cCI6MTc1NTcwNDA4OH0.ZP4f-AGBpBXFgudTbO5ezCjGnEwQoXvgEAsV8rA_jZI', '2025-08-13 23:34:48.991', '2025-08-13 17:34:49.401', '2025-08-13 17:34:49.401', 1, '2025-08-13 17:34:49.401', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-07 23:34:48.991', 0, NULL),
(188, 42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAxIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc1NTEwMDUwMiwiZXhwIjoxNzU1MTE4NTAyfQ.tY8jMSQ1cHjgco1J77YHl13Bhn-cxbbQ8utQEFUILmU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE3NTUxMDA1MDIsImV4cCI6MTc1NTcwNTMwMn0.BR8ZYB45_IxMAJkl53m-rfCkHmvfsxPbcWnL2kTdsZ4', '2025-08-13 23:55:02.695', '2025-08-13 17:55:03.027', '2025-08-13 17:55:03.027', 1, '2025-08-13 17:55:03.027', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-07 23:55:02.695', 0, NULL),
(189, 42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAxIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc1NTEwMjMwMiwiZXhwIjoxNzU1MTIwMzAyfQ.lUKOBoQHVfdRVh09ojeEPvYcZnInw-Ji8ZYMBTcLsmo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE3NTUxMDIzMDIsImV4cCI6MTc1NTcwNzEwMn0.nqK6R4c7sLcG-guoKqaZpSpAQ-sJ_JSpFH3DgLcdZcQ', '2025-08-14 00:25:02.892', '2025-08-13 18:25:02.871', '2025-08-13 18:25:02.871', 1, '2025-08-13 18:25:02.871', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-08 00:25:02.892', 0, NULL),
(190, 42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAxIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc1NTEwMzYzOSwiZXhwIjoxNzU1MTIxNjM5fQ.1ww0UFRE6PvLxcC3H-jp9paDAqL0HVPtm8gwhUV2HYg', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE3NTUxMDM2MzksImV4cCI6MTc1NTcwODQzOX0.GpvSI_V-UW712vpAhzOlHVUERlF6723-I9_KooVtA18', '2025-08-14 00:47:19.368', '2025-08-13 18:47:19.138', '2025-08-13 18:47:19.138', 1, '2025-08-13 18:47:19.138', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-08 00:47:19.368', 0, NULL),
(191, 42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiJURVNUMDAxIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc1NTEwMzcyOSwiZXhwIjoxNzU1MTIxNzI5fQ.tshzAF1YyyuryOAekDkLb3UdYg0j-L2oRHnxpkUHT8Q', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE3NTUxMDM3MjksImV4cCI6MTc1NTcwODUyOX0.0EQoS2kf-0-uj3Hnb4D-RXFZ7Fk0XdaK8GqVfzUw_dY', '2025-08-14 00:48:49.442', '2025-08-13 18:48:49.165', '2025-08-13 18:48:49.165', 1, '2025-08-13 18:48:49.165', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-09-08 00:48:49.442', 0, NULL),
(192, 44, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0LCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiIzNDA1MTYzIiwibmFtZSI6IkJlbmphbWluIG9rd2FtYSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTUxNzQ5MzgsImV4cCI6MTc1NTE5MjkzOH0.zOwr7qu6-G2UHpbwDXj74O7r9rQTJ9E666EjxvjyewY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0LCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1NTE3NDkzOCwiZXhwIjoxNzU3NzY2OTM4fQ.2xvErZxPDKJQLjWAoeDxbjpxp4Ysy_QuhtzDlhrflRI', '2025-08-14 20:35:38.658', '2025-08-14 14:35:38.935', '2025-08-14 14:35:38.935', 1, '2025-08-14 14:35:38.935', NULL, '::ffff:192.168.100.2', 'Y3VybC84LjcuMS06OmZmZmY6MTkyLjE2', 'curl/8.7.1', 'desktop', '1.0.0', 0, '2025-09-13 15:35:38.658', 1, NULL),
(193, 44, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0LCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiIzNDA1MTYzIiwibmFtZSI6IkJlbmphbWluIG9rd2FtYSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTUxNzQ5OTksImV4cCI6MTc1NTE5Mjk5OX0.q9LSJTaHNfvUxD4SQuwIbmsEah8ahJW2CIDoPbWgnxI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0LCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1NTE3NDk5OSwiZXhwIjoxNzU3NzY2OTk5fQ.v5hImFwMbRDfq-2RRKHq_O4gAfoJtoitpwtmy1IkttE', '2025-08-14 20:36:39.406', '2025-08-14 14:36:39.716', '2025-08-14 14:36:39.716', 1, '2025-08-14 14:36:39.716', NULL, '::ffff:192.168.100.2', 'Y3VybC84LjcuMS06OmZmZmY6MTkyLjE2', 'curl/8.7.1', 'desktop', '1.0.0', 0, '2025-09-13 15:36:39.406', 0, NULL),
(194, 44, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0LCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiIzNDA1MTYzIiwibmFtZSI6IkJlbmphbWluIG9rd2FtYSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NTUxNzUxMDUsImV4cCI6MTc1NTE5MzEwNX0.RPgBPCLuEkHX90UnhI64WG87jXjowi8wV3D7nds8kAo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0LCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1NTE3NTEwNSwiZXhwIjoxNzU3NzY3MTA1fQ.F3JM1fRzj9wdkKuBpYTmQh99SwkmyRye7DWXLO4MOKs', '2025-08-14 20:38:25.757', '2025-08-14 14:38:26.021', '2025-08-14 14:38:26.021', 1, '2025-08-14 14:38:26.021', NULL, '::ffff:192.168.100.15', '52cd94a543259d0eae7d9a56855ed180', 'Dart/3.8 (dart:io)', 'desktop', '1.0.0', 0, '2025-09-13 15:38:25.757', 0, NULL),
(195, 45, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ1LCJyb2xlIjoiVGVhbSBMZWFkZXIiLCJlbXBsTm8iOiIzNDA1NiIsIm5hbWUiOiJCZW5qYW1pbiBPa3dhbWEiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzU1MTg3NjA0LCJleHAiOjE3NTUyMDU2MDR9.YfxFdfRCN3AmYGnXYRywA9gG1as0wkW5-wqzlX2T4l4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ1LCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc1NTE4NzYwNCwiZXhwIjoxNzU3Nzc5NjA0fQ.Im1o4_Sq1PpAf6biQ_2COAR6AIUZrmtR4vqgMA7Up7E', '2025-08-15 00:06:44.593', '2025-08-14 18:06:44.656', '2025-08-14 18:06:44.656', 1, '2025-08-14 18:06:44.656', NULL, '::ffff:192.168.100.3', 'e8ec03c937d5b9eea97b177bdd8e4868', 'Dart/3.8 (dart:io)', 'desktop', '1.0.0', 0, '2025-09-13 19:06:44.593', 1, NULL);

--
-- Triggers `tokens`
--
DELIMITER $$
CREATE TRIGGER `enforce_device_limit` BEFORE INSERT ON `tokens` FOR EACH ROW BEGIN
    DECLARE device_count INT;
    
    SELECT GetActiveDeviceCount(NEW.staff_id) INTO device_count;
    
    IF device_count >= 3 THEN
        -- Remove oldest session
        UPDATE tokens 
        SET is_valid = 0 
        WHERE staff_id = NEW.staff_id 
        AND is_valid = 1 
        AND id = (
            SELECT id FROM (
                SELECT id FROM tokens 
                WHERE staff_id = NEW.staff_id AND is_valid = 1 
                ORDER BY created_at ASC 
                LIMIT 1
            ) AS oldest_session
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `created_at`, `updated_at`) VALUES
(7, 'admin', '$2a$10$EZ0JqGFCZ90/cmijwcW1V.lRnw.TEFtWD4wA/fntMWMH9rC1XUATy', 'admin@example.com', 'admin', '2025-06-05 18:34:36.371', '2025-06-05 18:34:36.371');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `checkin_records`
--
ALTER TABLE `checkin_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_station_id` (`station_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_time_in` (`time_in`),
  ADD KEY `idx_time_out` (`time_out`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_number` (`account_number`),
  ADD KEY `client_typ` (`client_type_Id`);

--
-- Indexes for table `client_category`
--
ALTER TABLE `client_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client_ledger`
--
ALTER TABLE `client_ledger`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_client_date` (`client_id`,`date`),
  ADD KEY `idx_client_balance` (`client_id`,`balance`);

--
-- Indexes for table `fuel_products`
--
ALTER TABLE `fuel_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `notices`
--
ALTER TABLE `notices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pumps`
--
ALTER TABLE `pumps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `station_id` (`station_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `station_id` (`station_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `staff` (`staff_id`);

--
-- Indexes for table `seals`
--
ALTER TABLE `seals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `seals_seal_number_key` (`seal_number`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `staff_empl_no_key` (`empl_no`),
  ADD KEY `role_i` (`role_id`);

--
-- Indexes for table `staff_leaves`
--
ALTER TABLE `staff_leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_staff_leave_type` (`leave_type_id`),
  ADD KEY `fk_staff_leave_approver` (`approved_by`),
  ADD KEY `idx_staff_leaves_staff_id` (`staff_id`),
  ADD KEY `idx_staff_leaves_status` (`status`),
  ADD KEY `idx_staff_leaves_date_range` (`start_date`,`end_date`);

--
-- Indexes for table `staff_leave_balances`
--
ALTER TABLE `staff_leave_balances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `staff_id` (`staff_id`,`leave_type_id`,`year`),
  ADD KEY `fk_staff_leave_balance_type` (`leave_type_id`),
  ADD KEY `idx_staff_leave_balances_staff_year` (`staff_id`,`year`);

--
-- Indexes for table `stations`
--
ALTER TABLE `stations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `station_price`
--
ALTER TABLE `station_price`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `station_stock_ledger`
--
ALTER TABLE `station_stock_ledger`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_station_date` (`station_id`,`date`);

--
-- Indexes for table `station_store`
--
ALTER TABLE `station_store`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `token_staff_id_fkey` (`staff_id`),
  ADD KEY `token_refresh_token_idx` (`refresh_token`),
  ADD KEY `idx_tokens_staff_valid` (`staff_id`,`is_valid`),
  ADD KEY `idx_tokens_refresh_valid` (`refresh_token`,`is_valid`),
  ADD KEY `idx_tokens_access` (`access_token`(768)),
  ADD KEY `idx_tokens_device` (`device_id`),
  ADD KEY `idx_tokens_expires` (`expires_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `checkin_records`
--
ALTER TABLE `checkin_records`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `client_category`
--
ALTER TABLE `client_category`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `client_ledger`
--
ALTER TABLE `client_ledger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `fuel_products`
--
ALTER TABLE `fuel_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notices`
--
ALTER TABLE `notices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pumps`
--
ALTER TABLE `pumps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `seals`
--
ALTER TABLE `seals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `staff_leaves`
--
ALTER TABLE `staff_leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `staff_leave_balances`
--
ALTER TABLE `staff_leave_balances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stations`
--
ALTER TABLE `stations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `station_price`
--
ALTER TABLE `station_price`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `station_stock_ledger`
--
ALTER TABLE `station_stock_ledger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `station_store`
--
ALTER TABLE `station_store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=196;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

-- --------------------------------------------------------

--
-- Structure for view `active_sessions`
--
DROP TABLE IF EXISTS `active_sessions`;

CREATE ALGORITHM=UNDEFINED DEFINER=`citlogis`@`localhost` SQL SECURITY DEFINER VIEW `active_sessions`  AS SELECT `t`.`id` AS `id`, `t`.`staff_id` AS `staff_id`, `s`.`name` AS `staff_name`, `t`.`device_id` AS `device_id`, `t`.`device_type` AS `device_type`, `t`.`user_agent` AS `user_agent`, `t`.`app_version` AS `app_version`, `t`.`ip_address` AS `ip_address`, `t`.`location_info` AS `location_info`, `t`.`is_primary` AS `is_primary`, `t`.`refresh_count` AS `refresh_count`, `t`.`last_used_at` AS `last_used_at`, `t`.`created_at` AS `created_at`, `t`.`expires_at` AS `expires_at`, `t`.`refresh_expires_at` AS `refresh_expires_at` FROM (`tokens` `t` join `staff` `s` on(`t`.`staff_id` = `s`.`id`)) WHERE `t`.`is_valid` = 1 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `checkin_records`
--
ALTER TABLE `checkin_records`
  ADD CONSTRAINT `checkin_records_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`),
  ADD CONSTRAINT `checkin_records_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `staff` (`id`);

--
-- Constraints for table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `client_typ` FOREIGN KEY (`client_type_Id`) REFERENCES `client_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pumps`
--
ALTER TABLE `pumps`
  ADD CONSTRAINT `pumps_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`);

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `role_i` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `staff_leaves`
--
ALTER TABLE `staff_leaves`
  ADD CONSTRAINT `fk_staff_leave_approver` FOREIGN KEY (`approved_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_staff_leave_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_staff_leave_type` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `staff_leave_balances`
--
ALTER TABLE `staff_leave_balances`
  ADD CONSTRAINT `fk_staff_leave_balance_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_staff_leave_balance_type` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `station_stock_ledger`
--
ALTER TABLE `station_stock_ledger`
  ADD CONSTRAINT `station_stock_ledger_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
