-- SOS Table Migration
-- This table stores SOS alerts for emergency situations

-- Create SOS table
CREATE TABLE IF NOT EXISTS `sos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sos_type` varchar(191) NOT NULL DEFAULT 'sos' COMMENT 'Type of SOS alert',
  `latitude` double NOT NULL COMMENT 'Latitude coordinate',
  `longitude` double NOT NULL COMMENT 'Longitude coordinate',
  `status` varchar(191) NOT NULL DEFAULT 'active' COMMENT 'Status of the SOS alert',
  `staff_name` varchar(255) NOT NULL COMMENT 'Name of the staff member',
  `comment` text DEFAULT NULL COMMENT 'Additional comments about the SOS',
  `staff_id` int(11) NOT NULL COMMENT 'ID of the staff member',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_staff_id` (`staff_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_sos_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='SOS emergency alerts';

-- Insert sample data for testing
INSERT INTO `sos` (`sos_type`, `latitude`, `longitude`, `status`, `staff_name`, `comment`, `staff_id`) VALUES
('emergency', -1.2921, 36.8219, 'active', 'John Doe', 'Medical emergency at station', 1),
('security', -1.2921, 36.8219, 'resolved', 'Jane Smith', 'Suspicious activity reported', 2),
('fire', -1.2921, 36.8219, 'active', 'Mike Johnson', 'Fire alarm triggered', 1);

-- Create stored procedure for getting SOS alerts with filters
DELIMITER //
CREATE PROCEDURE GetSosAlerts(
    IN p_status VARCHAR(20),
    IN p_staff_id INT,
    IN p_page INT,
    IN p_limit INT
)
BEGIN
    DECLARE offset_val INT;
    SET offset_val = (p_page - 1) * p_limit;
    
    SELECT 
        s.id,
        s.sos_type,
        s.latitude,
        s.longitude,
        s.status,
        s.staff_name,
        s.comment,
        s.staff_id,
        s.created_at,
        s.updated_at
    FROM sos s
    WHERE (p_status IS NULL OR s.status = p_status)
        AND (p_staff_id IS NULL OR s.staff_id = p_staff_id)
    ORDER BY s.created_at DESC
    LIMIT p_limit OFFSET offset_val;
END //
DELIMITER ;

-- Create stored procedure for getting SOS alert count
DELIMITER //
CREATE PROCEDURE GetSosAlertCount(
    IN p_status VARCHAR(20),
    IN p_staff_id INT
)
BEGIN
    SELECT COUNT(*) as total
    FROM sos s
    WHERE (p_status IS NULL OR s.status = p_status)
        AND (p_staff_id IS NULL OR s.staff_id = p_staff_id);
END //
DELIMITER ;

-- Create stored procedure for inserting new SOS alert
DELIMITER //
CREATE PROCEDURE InsertSosAlert(
    IN p_sos_type VARCHAR(191),
    IN p_latitude DOUBLE,
    IN p_longitude DOUBLE,
    IN p_status VARCHAR(191),
    IN p_staff_name VARCHAR(255),
    IN p_comment TEXT,
    IN p_staff_id INT
)
BEGIN
    INSERT INTO sos (
        sos_type,
        latitude,
        longitude,
        status,
        staff_name,
        comment,
        staff_id
    ) VALUES (
        p_sos_type,
        p_latitude,
        p_longitude,
        p_status,
        p_staff_name,
        p_comment,
        p_staff_id
    );
    
    SELECT LAST_INSERT_ID() as id;
END //
DELIMITER ;

-- Create stored procedure for updating SOS alert
DELIMITER //
CREATE PROCEDURE UpdateSosAlert(
    IN p_id INT,
    IN p_sos_type VARCHAR(191),
    IN p_latitude DOUBLE,
    IN p_longitude DOUBLE,
    IN p_status VARCHAR(191),
    IN p_staff_name VARCHAR(255),
    IN p_comment TEXT,
    IN p_staff_id INT
)
BEGIN
    UPDATE sos 
    SET 
        sos_type = p_sos_type,
        latitude = p_latitude,
        longitude = p_longitude,
        status = p_status,
        staff_name = p_staff_name,
        comment = p_comment,
        staff_id = p_staff_id,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
    
    SELECT ROW_COUNT() as affected_rows;
END //
DELIMITER ;

-- Create stored procedure for deleting SOS alert
DELIMITER //
CREATE PROCEDURE DeleteSosAlert(
    IN p_id INT
)
BEGIN
    DELETE FROM sos WHERE id = p_id;
    SELECT ROW_COUNT() as affected_rows;
END //
DELIMITER ;
