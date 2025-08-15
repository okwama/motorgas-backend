-- Enhanced Authentication System Migration
-- Add new fields to tokens table for better session management and security

USE motorgas_db;

-- Add new columns to tokens table
ALTER TABLE tokens 
ADD COLUMN device_id VARCHAR(255) NULL AFTER ip_address,
ADD COLUMN user_agent VARCHAR(100) NULL AFTER device_id,
ADD COLUMN device_type VARCHAR(50) NULL AFTER user_agent,
ADD COLUMN app_version VARCHAR(50) NULL AFTER device_type,
ADD COLUMN refresh_count INT DEFAULT 0 AFTER app_version,
ADD COLUMN refresh_expires_at DATETIME(3) NULL AFTER refresh_count,
ADD COLUMN is_primary TINYINT DEFAULT 0 AFTER refresh_expires_at,
ADD COLUMN location_info TEXT NULL AFTER is_primary;

-- Add indexes for better performance
CREATE INDEX idx_tokens_staff_valid ON tokens(staff_id, is_valid);
CREATE INDEX idx_tokens_refresh_valid ON tokens(refresh_token, is_valid);
CREATE INDEX idx_tokens_access ON tokens(access_token);
CREATE INDEX idx_tokens_device ON tokens(device_id);
CREATE INDEX idx_tokens_expires ON tokens(expires_at);

-- Update existing tokens to have default values
UPDATE tokens 
SET refresh_expires_at = DATE_ADD(expires_at, INTERVAL 25 DAY)
WHERE refresh_expires_at IS NULL;

-- Create a cleanup procedure for expired tokens
DELIMITER //
CREATE PROCEDURE CleanupExpiredTokens()
BEGIN
    UPDATE tokens 
    SET is_valid = 0 
    WHERE expires_at < NOW() AND is_valid = 1;
    
    SELECT ROW_COUNT() as cleaned_tokens;
END //
DELIMITER ;

-- Create a view for active sessions
CREATE VIEW active_sessions AS
SELECT 
    t.id,
    t.staff_id,
    s.name as staff_name,
    t.device_id,
    t.device_type,
    t.user_agent,
    t.app_version,
    t.ip_address,
    t.location_info,
    t.is_primary,
    t.refresh_count,
    t.last_used_at,
    t.created_at,
    t.expires_at,
    t.refresh_expires_at
FROM tokens t
JOIN staff s ON t.staff_id = s.id
WHERE t.is_valid = 1;

-- Insert sample data for testing (optional)
-- INSERT INTO tokens (staff_id, access_token, refresh_token, expires_at, refresh_expires_at, device_id, user_agent, device_type, app_version, ip_address, is_valid, is_primary) 
-- VALUES (1, 'sample_access_token', 'sample_refresh_token', DATE_ADD(NOW(), INTERVAL 5 HOUR), DATE_ADD(NOW(), INTERVAL 30 DAY), 'device_123', 'MotorGas/1.0.0', 'mobile', '1.0.0', '192.168.1.1', 1, 1);

-- Create a function to get device count per user
DELIMITER //
CREATE FUNCTION GetActiveDeviceCount(user_id INT) 
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE device_count INT;
    
    SELECT COUNT(*) INTO device_count
    FROM tokens 
    WHERE staff_id = user_id AND is_valid = 1;
    
    RETURN device_count;
END //
DELIMITER ;

-- Create a trigger to enforce device limit
DELIMITER //
CREATE TRIGGER enforce_device_limit
BEFORE INSERT ON tokens
FOR EACH ROW
BEGIN
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
END //
DELIMITER ;

-- Show migration summary
SELECT 'Enhanced Authentication System Migration Completed' as status;
SELECT COUNT(*) as total_tokens FROM tokens;
SELECT COUNT(*) as active_tokens FROM tokens WHERE is_valid = 1;
