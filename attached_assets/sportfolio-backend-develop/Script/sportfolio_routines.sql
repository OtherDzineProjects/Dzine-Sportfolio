-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: sportfolio
-- ------------------------------------------------------
-- Server version	5.7.34-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping events for database 'sportfolio'
--

--
-- Dumping routines for database 'sportfolio'
--
/*!50003 DROP FUNCTION IF EXISTS `generate_sfid` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `generate_sfid`() RETURNS varchar(36) CHARSET utf8mb4
    DETERMINISTIC
BEGIN
    DECLARE sfid VARCHAR(36);
    SET sfid = UUID();
    RETURN sfid;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `getActivityParentDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `getActivityParentDetails`(p_activityID INT) RETURNS json
    READS SQL DATA
    DETERMINISTIC
BEGIN

DECLARE result JSON DEFAULT JSON_ARRAY();
DECLARE currentActivityID INT;
DECLARE currentParentID INT;
DECLARE currentActivityName TEXT;

SELECT ActivityName,ParentID, ActivityId INTO currentActivityName, currentParentID, currentActivityID FROM sportfolio.tactivity where ActivityID = p_activityID;

my_loop: LOOP
        -- Increment counter
        IF currentParentID IS NULL THEN
            LEAVE my_loop;
        END IF;
        
        SELECT ActivityName, ParentID, ActivityId INTO currentActivityName, currentParentID, currentActivityID
        FROM sportfolio.tactivity
        WHERE ActivityID = currentParentID;
        
        SET result = JSON_ARRAY_INSERT(result, '$[0]', JSON_OBJECT('ActivityName', currentActivityName, 'ParentID', currentParentID, 'ActivityId', currentActivityID));
        
END LOOP;  

RETURN result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `unescape_html` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `unescape_html`(input TEXT) RETURNS text CHARSET utf8mb4
    NO SQL
    DETERMINISTIC
BEGIN
    SET input = REPLACE(input, '&amp;', '&');
    SET input = REPLACE(input, '&lt;', '<');
    SET input = REPLACE(input, '&gt;', '>');
    SET input = REPLACE(input, '&quot;', '"');
    SET input = REPLACE(input, '&#39;', '\'');
    SET input = REPLACE(input, '&#47;', '/');
    SET input = REPLACE(input, '&#96;', '`');
    SET input = REPLACE(input, '&#92;', '\\');
    
    RETURN input;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `authenticateUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `authenticateUser`(IN p_email VARCHAR(255), IN p_encryptedPassword VARCHAR(255))
BEGIN
    DECLARE v_documentStatus INT;
    DECLARE v_documentType INT;

    -- Get the 'Deleted' status for documents
    SELECT tld.LookupDetailID INTO v_documentStatus
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName = 'DocumentStatus';

    -- Get the 'User' document type for the owner
    SELECT tld.LookupDetailID INTO v_documentType
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'User' AND tlh.LookupTypeName = 'OwnerType';
    
    IF EXISTS (SELECT UserID FROM tuser WHERE Email = p_email AND Password = p_encryptedPassword) THEN
        SELECT u.UserID, u.FirstName, u.LastName, u.Email, ur.RoleID, r.RoleName, r.IsAdmin, u.SFID,

            -- Fetch user avatar if available, otherwise return an empty JSON object
            COALESCE(
                (SELECT JSON_OBJECT(
                    'documentID', d.DocumentID,
                    'path', d.DocumentUrl,
                    'fileName', d.DocumentName
                )
                FROM tdocument d 
                WHERE d.OwnerID = u.UserID 
                  AND d.Status != v_documentStatus 
                  AND d.DocumentTypeID = v_documentType
                ),
                JSON_OBJECT()
            ) AS avatar
        FROM tuser u
        INNER JOIN tuserrole ur ON u.UserID = ur.UserID
		INNER JOIN trole r ON r.RoleID = ur.RoleID 
        WHERE u.Email = p_email AND u.Password = p_encryptedPassword;
    ELSE
        SELECT NULL AS UserID, NULL AS FirstName, NULL AS LastName, NULL AS Email, NULL AS RoleID, NULL AS RoleName, NULL AS SFID, NULL AS IsAdmin;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cAccessCheck` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cAccessCheck`(
    IN p_editType VARCHAR(50),
    IN p_organizationID INT,
    IN p_userID INT
)
BEGIN

    IF p_editType = 'User' THEN
		SELECT 
			CASE WHEN IsAdmin = 1 THEN 1 ELSE 0 END AS 'canSelect',
			CASE WHEN IsAdmin = 1 THEN 1 ELSE 0 END AS 'canEdit',
			CASE WHEN IsAdmin = 1 THEN 1 ELSE 0 END AS 'canUpdate',
			CASE WHEN IsAdmin = 1 THEN 1 ELSE 0 END AS 'canDelete'
		FROM torganizationuserrole tour 
		INNER JOIN torganizationrole tor ON tor.OrganizationRoleID = tour.OrganizationRoleID 
		WHERE UserID = p_userID and tor.OrganizationID = p_organizationID;

    ELSEIF p_editType = 'Organization' THEN
    
		SELECT 
			CASE WHEN IsAdmin = 1 THEN 1 ELSE 0 END AS 'canSelect',
			CASE WHEN IsAdmin = 1 THEN 1 ELSE 0 END AS 'canEdit',
			CASE WHEN IsAdmin = 1 THEN 1 ELSE 0 END AS 'canUpdate',
			CASE WHEN IsAdmin = 1 THEN 1 ELSE 0 END AS 'canDelete'
		FROM torganizationuserrole tour 
		INNER JOIN torganizationrole tor ON tor.OrganizationRoleID = tour.OrganizationRoleID 
		WHERE UserID = p_userID and tor.OrganizationID = p_organizationID;

    ELSE
        -- Handle unexpected edit types
        SELECT 'Invalid edit type' AS Message;
    END IF;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cCheckActivityDetailExists` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cCheckActivityDetailExists`(
	IN p_activityID INT,
    IN p_name VARCHAR(255),
    IN p_activityDetailID INT
)
BEGIN

DECLARE v_delete INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';

	IF p_activityDetailID > 0 THEN
    SELECT ActivityDetailID 
    FROM tactivitydetail 
    WHERE ActivityID = p_activityID AND Name = p_name 
    AND Status != v_delete AND ActivityDetailID != p_activityDetailID;
    
    ELSE
    
    SELECT ActivityDetailID 
    FROM tactivitydetail 
    WHERE ActivityID = p_activityID AND Name = p_name 
    AND Status != v_delete ;
    
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cCheckDuplicateNotification` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cCheckDuplicateNotification`(
    IN p_subject LONGTEXT,
    IN p_notificationID INT 
)
BEGIN

    IF p_notificationID > 0 THEN

		SELECT COUNT(NotificationID) AS count
		FROM tnotification
		WHERE Subject = p_subject
        AND NotificationID != p_notificationID
		AND EndDate IS NULL;
	ELSE 
    
		SELECT COUNT(NotificationID) AS count
		FROM tnotification
		WHERE Subject = p_subject
		AND EndDate IS NULL;
          
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cCheckDuplicateQualification` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cCheckDuplicateQualification`(
    IN p_userID INT,
    IN p_qualificationTypeID INT,
    IN p_enrollmentNumber VARCHAR(255),
	IN p_userQualificationDetailID INT
)
BEGIN

	DECLARE v_status INT;
    
     SELECT ActionCodeID INTO v_status
			FROM tactioncode 
			WHERE Description = 'Delete'
			LIMIT 1;
    
    IF p_userQualificationDetailID IS NULL THEN
        SELECT COUNT(*) AS count
        FROM tuserqualificationdetail
        WHERE 
            (EnrollmentNumber = p_enrollmentNumber 
            AND UserID != p_userID 
            AND Status != v_status)
            OR (UserID = p_userID 
            AND QualificationTypeID = p_qualificationTypeID 
            AND Status != v_status);
    ELSE
        SELECT QualificationTypeID
        FROM tuserqualificationdetail
        WHERE UserQualificationDetailID != p_userQualificationDetailID
        AND UserID = p_userID
        AND Status != v_status
        AND (
            QualificationTypeID = p_qualificationTypeID
            OR (
                EnrollmentNumber = p_enrollmentNumber
                AND QualificationTypeID != p_qualificationTypeID
                AND UserQualificationDetailID != p_userQualificationDetailID
            )
        );
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cCheckOrganizationAndUserExists` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cCheckOrganizationAndUserExists`(IN p_organizationId INT , IN p_memberId INT, IN p_organizationmemberId INT)
BEGIN

    DECLARE v_user_status INT;
    DECLARE v_organization_status INT;
	DECLARE v_user_count INT;
    DECLARE v_organization_count INT;
    DECLARE v_organization_member_count INT;
    DECLARE v_organizationMemberStatus INT;
	DECLARE v_cancelID INT;

    -- Fetch the status for 'Deleted' for the `tuser` table
    SELECT LookupDetailID INTO v_cancelID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Cancel' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;

    -- Fetch the status for 'Deleted' for the `tuser` table
    SELECT LookupDetailID INTO v_user_status
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName = 'UserStatus'
    LIMIT 1;
	
	-- Fetch the status for 'Deleted' for the `torganization` table
    SELECT LookupDetailID INTO v_organization_status
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName = 'OrganizationStatus'
    LIMIT 1;
    
    -- Fetch the status for 'Deleted' for the `torganizationmember` table
	SELECT LookupDetailID INTO v_organizationMemberStatus
	FROM tlookupdetail tld
	INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
	WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName='OrganizationMemberStatus';
	
	IF p_organizationmemberId IS NULL THEN
	
	SELECT COUNT(*) INTO v_user_count FROM tuser WHERE Status != v_user_status AND UserID = p_memberId;
	
	SELECT COUNT(*) INTO v_organization_count FROM torganization WHERE Status != v_organization_status AND OrganizationID = p_organizationId;
	
    SELECT COUNT(*) INTO v_organization_member_count FROM torganizationmember WHERE OrganizationID = p_organizationId AND MemberID = p_memberId AND Status != v_organizationMemberStatus AND Status != v_cancelID  ;

	
	ELSE
	
	SELECT COUNT(*) INTO v_user_count FROM tuser WHERE Status != v_user_status AND UserID = p_memberId;
	
	SELECT COUNT(*) INTO v_organization_count FROM torganization WHERE Status != v_organization_status AND OrganizationID = p_organizationId;
    
    SELECT COUNT(*) INTO v_organization_member_count FROM torganizationmember WHERE OrganizationID = p_organizationId AND MemberID = p_memberId AND OrganizationmemberID != p_organizationmemberId AND Status != v_organizationMemberStatus   ;
	
	END IF;
	 
	-- If either user or organization count is zero, raise an error
    IF v_user_count = 0 THEN
            SELECT p_memberId AS memberID;
    ELSEIF v_organization_count = 0 THEN
            SELECT p_organizationId AS organizationID;
	ELSEIF v_organization_member_count > 0 THEN
            SELECT p_organizationmemberId AS organizationMemberID;
    END IF;
    
    
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cCheckOrganizationDepartmentDuplicate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cCheckOrganizationDepartmentDuplicate`(
    IN p_organizationID INT,
    IN p_departmentName VARCHAR(100),
    IN p_organizationDepartmentID INT
)
BEGIN
    DECLARE v_delete INT;

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';

    -- Check for duplicate department names within the same organization, excluding the current department (for updating)
    SELECT COUNT(OrganizationDepartmentID) AS count
    FROM torganizationdepartment 
    WHERE OrganizationID = p_organizationID
    AND DepartmentName = p_departmentName
    AND OrganizationDepartmentID != p_organizationDepartmentID
    AND Status != v_delete
    LIMIT 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cCheckOrganizationDepartmentMemberDuplicate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cCheckOrganizationDepartmentMemberDuplicate`(
    IN p_organizationDepartmentID INT,
    IN p_memberID INT,
    IN p_organizationDepartmentMemberID INT
)
BEGIN
    DECLARE v_delete INT;
    DECLARE v_department VARCHAR(100);

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';
    
    -- Retrieve the DepartmentName and check if it is NULL
    SELECT DepartmentName INTO v_department
    FROM torganizationdepartment
    WHERE OrganizationDepartmentID = p_organizationDepartmentID 
    AND Status != v_delete;
    
    -- If DepartmentName is NULL, raise an error
    IF v_department IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Entered Department does not exist';
    ELSE
        -- Proceed with the next SELECT statement if DepartmentName is not NULL
        SELECT COUNT(OrganizationDepartmentMemberID) AS count
        FROM torganizationdepartmentmember 
        WHERE (MemberID = p_memberID 
        AND OrganizationDepartmentID = p_organizationDepartmentID AND Status != v_delete )
        AND OrganizationDepartmentMemberID != p_organizationDepartmentMemberID 
        LIMIT 1;
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cCheckOrganizationDepartmentTeamDuplicate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cCheckOrganizationDepartmentTeamDuplicate`(
    IN p_organizationID INT,
    IN p_teamName VARCHAR(255),
    IN p_teamCategoryID INT,
    IN p_organizationDepartmentTeamID INT
)
BEGIN
    DECLARE v_delete INT;
    DECLARE v_org_exists INT;

    -- Check if p_organizationID exists in the torganization table
    SELECT COUNT(*) INTO v_org_exists
    FROM torganization
    WHERE OrganizationID = p_organizationID;

    IF v_org_exists = 0 THEN
        -- Organization ID does not exist, return an error message
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Organization does not exist, check OrganizationID';
    ELSE
        -- Get the ActionCodeID for 'Delete'
        SELECT ActionCodeID INTO v_delete
        FROM tactioncode
        WHERE Description = 'Delete';

        IF p_organizationDepartmentTeamID > 0 THEN
            -- Check for duplicate when updating an existing record
            SELECT OrganizationDepartmentTeamID 
            FROM torganizationdepartmentteam 
            WHERE OrganizationID = p_organizationID 
              AND TeamName = p_teamName 
              AND TeamCategoryID = p_teamCategoryID 
              AND Status != v_delete 
              AND OrganizationDepartmentTeamID != p_organizationDepartmentTeamID;
        ELSE
            -- Check for duplicate when inserting a new record
            SELECT OrganizationDepartmentTeamID 
            FROM torganizationdepartmentteam 
            WHERE OrganizationID = p_organizationID 
              AND TeamName = p_teamName 
              AND TeamCategoryID = p_teamCategoryID 
              AND Status != v_delete;
        END IF;
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cCheckorganizationTeamDetailDuplicate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cCheckorganizationTeamDetailDuplicate`(
    IN p_organizationTeamID INT,
    IN p_userID INT,
    IN p_activityDetailID INT,
    IN p_organizationTeamDetailID INT
)
BEGIN
    DECLARE v_delete INT;

        -- Get the ActionCodeID for 'Delete'
        SELECT ActionCodeID INTO v_delete
        FROM tactioncode
        WHERE Description = 'Delete';

        IF p_organizationTeamDetailID > 0 THEN
            -- Check for duplicate when updating an existing record
            SELECT OrganizationTeamDetailID 
            FROM torganizationteamdetail 
            WHERE OrganizationTeamID = p_organizationTeamID 
              AND UserID = p_userID 
              AND ActivityDetailID = p_activityDetailID 
              AND Status != v_delete
              AND OrganizationTeamDetailID != p_organizationTeamDetailID;
        ELSE
            -- Check for duplicate when inserting a new record
            SELECT OrganizationTeamDetailID 
            FROM torganizationteamdetail 
            WHERE OrganizationTeamID = p_organizationTeamID 
              AND UserID = p_userID 
              AND ActivityDetailID = p_activityDetailID 
              AND Status != v_delete;
        END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cCheckOrganizationTeamDuplicate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cCheckOrganizationTeamDuplicate`(
	IN p_organizationID INT,
    IN p_teamName VARCHAR(255),
    IN p_teamCategoryID INT,
    IN p_organizationTeamID INT
)
BEGIN

DECLARE v_delete INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';

	IF p_organizationTeamID > 0 THEN
    SELECT OrganizationTeamID 
    FROM torganizationteam 
    WHERE OrganizationID = p_organizationID AND TeamName = p_teamName AND TeamCategoryID = p_teamCategoryID 
    AND STATUS != v_delete AND OrganizationTeamID != p_organizationTeamID;
    
    ELSE
    
    SELECT OrganizationTeamID 
    FROM torganizationteam 
    WHERE OrganizationID = p_organizationID AND TeamName = p_teamName AND TeamCategoryID = p_teamCategoryID AND STATUS != v_delete;
    
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteActivityDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteActivityDetail`(
    IN p_activityDetailID INT
)
BEGIN
    DECLARE v_delete INT;

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';

    -- If the input ID is not null
    IF p_activityDetailID IS NOT NULL THEN
        -- Update the Status in torganizationteam
        UPDATE tactivitydetail
        SET Status = v_delete
        WHERE ActivityDetailID = p_activityDetailID;

    END IF;
select v_delete;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteNotification` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteNotification`(
    IN p_notificationID INT
)
BEGIN
    DECLARE v_deleteStatus INT;
	DECLARE v_delete INT;

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';

SELECT LookupDetailID INTO v_deleteStatus
FROM tlookupdetail tld
INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName='NotificationStatus';

    -- If the input ID is not null
    IF p_notificationID IS NOT NULL THEN
        -- Update the Status in tnotification
        UPDATE tnotification 
        SET Status = v_deleteStatus
        WHERE NotificationID = p_notificationID;
        
        UPDATE tvenuenotification 
        SET Status = v_delete
        WHERE NotificationID = p_notificationID;
        
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteOrganization` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteOrganization`(
IN p_organizationID INT 
)
BEGIN
DECLARE v_delete INT;
    
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';
    
UPDATE torganization 
SET Status = v_delete 
        WHERE OrganizationID = p_organizationID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteOrganizationDepartment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteOrganizationDepartment`(
    IN p_organizationDepartmentID INT
)
BEGIN
    DECLARE v_delete INT;

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';

    -- If the input ID is not null
    IF p_organizationDepartmentID IS NOT NULL THEN
        -- Update the Status in torganizationdepartment
        UPDATE torganizationdepartment 
        SET Status = v_delete
        WHERE OrganizationDepartmentID = p_organizationDepartmentID;

        -- Update the Status and ToDate in torganizationdepartmentarchive
        UPDATE torganizationdepartmentarchive 
        SET ToDate = NOW()
        WHERE OrganizationDepartmentID = p_organizationDepartmentID;
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteOrganizationDepartmentMember` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteOrganizationDepartmentMember`(
    IN p_organizationDepartmentMemberID INT
)
BEGIN
    DECLARE v_delete INT;

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';

    -- If the input ID is not null
    IF p_organizationDepartmentMemberID IS NOT NULL THEN
        -- Update the Status in torganizationdepartmentmember
        UPDATE torganizationdepartmentmember 
        SET Status = v_delete
        WHERE OrganizationDepartmentMemberID = p_organizationDepartmentMemberID;

        -- Update the Status and ToDate in torganizationdepartmentmemberarchive
        UPDATE torganizationdepartmentmemberarchive 
        SET Status = v_delete, ToDate = NOW()
        WHERE OrganizationDepartmentMemberID = p_organizationDepartmentMemberID;
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteOrganizationDepartmentTeam` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteOrganizationDepartmentTeam`(
    IN p_organizationDepartmentTeamID INT
)
BEGIN
    DECLARE v_delete INT;

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';

    -- If the input ID is not null
    IF p_organizationDepartmentTeamID IS NOT NULL THEN
        -- Update the Status in torganizationteam
        UPDATE torganizationdepartmentteam 
        SET Status = v_delete
        WHERE OrganizationDepartmentTeamID = p_organizationDepartmentTeamID;

    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteOrganizationExistsInActivity` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteOrganizationExistsInActivity`( IN p_organizationId INT )
BEGIN
DECLARE v_delete INT;
    
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';
    
UPDATE torganizationactivity 
SET Status = v_delete 
        WHERE OrganizationID = p_organizationId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteOrganizationMember` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteOrganizationMember`(
IN p_organizationMemberID INT 
)
BEGIN
	DECLARE v_delete INT;
    
    -- Fetch the status for 'Deleted' for the `tuser` table
    SELECT LookupDetailID INTO v_delete
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;

	UPDATE torganizationmember 
	SET Status = v_delete 
	WHERE OrganizationmemberID = p_organizationMemberID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteOrganizationTeam` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteOrganizationTeam`(
    IN p_organizationTeamID INT
)
BEGIN
    DECLARE v_delete INT;

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';

    -- If the input ID is not null
    IF p_organizationTeamID IS NOT NULL THEN
        -- Update the Status in torganizationteam
        UPDATE torganizationteam 
        SET Status = v_delete
        WHERE OrganizationTeamID = p_organizationTeamID;

    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteorganizationTeamDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteorganizationTeamDetail`(
    IN p_organizationTeamDetailID INT
)
BEGIN
    DECLARE v_delete INT;

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';

    -- If the input ID is not null
    IF p_organizationTeamDetailID IS NOT NULL THEN
        -- Update the Status in torganizationteamdetail
        UPDATE torganizationteamdetail 
        SET Status = v_delete
        WHERE OrganizationTeamDetailID = p_organizationTeamDetailID;

    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteUser`(
    IN p_userID INT,
    IN p_actionCode VARCHAR(1)
)
BEGIN
    DECLARE v_CancelStatus INT;
    DECLARE v_LastInsertedID INT;
    
    -- Retrieve the Cancel status ID
    SELECT LookupDetailID INTO v_CancelStatus
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Cancel' AND tlh.LookupTypeName = 'UserStatus';

    -- Insert action into user history and retrieve the last inserted ID
    INSERT INTO tuserhistory (UserID, ActionCodeID, CreatedDate)
    VALUES (
        p_userID,
        CASE p_actionCode
            WHEN 'X' THEN 1
            WHEN 'A' THEN 2
            WHEN 'S' THEN 3
            WHEN 'H' THEN 4
            WHEN 'D' THEN 5
            ELSE NULL
        END,
        NOW()
    );

    -- Get the last inserted ID from tuserhistory
    SET v_LastInsertedID = LAST_INSERT_ID();

    -- Update user status if action code matches specific values
    IF p_actionCode IN ('D', 'S', 'X') THEN 
        UPDATE tuser 
        SET 
            Status = v_CancelStatus
        WHERE UserID = p_userID; -- Update using the last inserted ID
        
        UPDATE tactioncode 
        SET 
            ActionNote = 'User Suspended'
        WHERE UserHistoryID = v_LastInsertedID; -- Update using the last inserted ID
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteUserBasicDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteUserBasicDetail`(
IN p_userBasicDetailID INT 
)
BEGIN
DECLARE v_delete INT;
    
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';
    
UPDATE tuserbasicdetail 
SET Status = v_delete 
        WHERE UserBasicDetailID = p_userBasicDetailID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteUserContactDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteUserContactDetail`(
IN p_userContactDetailID INT 
)
BEGIN
DECLARE v_delete INT;
    
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';
    
UPDATE tusercontactdetail 
SET Status = v_delete 
        WHERE UserContactDetailID = p_userContactDetailID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cDeleteUserQualificationDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cDeleteUserQualificationDetail`(
IN p_userQualificationDetailID INT 
)
BEGIN
DECLARE v_delete INT;
    
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';
    
UPDATE tuserqualificationdetail 
SET Status = v_delete 
        WHERE UserQualificationDetailID = p_userQualificationDetailID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cfetchTemplateForgotPassword` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cfetchTemplateForgotPassword`(
IN p_action TEXT,
IN p_email TEXT
)
BEGIN

DECLARE v_userExists INT;
DECLARE v_errorMessage TEXT;

    -- Initialize the error message to NULL
    SET v_errorMessage = NULL;
    
SELECT UserID INTO v_userExists
FROM tuser
WHERE Email = p_email;

IF v_userExists IS NOT NULL THEN
	IF p_action IS NOT NULL AND p_action = 'Forgot Password' THEN

		SELECT TemplateName, Body, PlaceHolder, FromAddress, Subject FROM temailtemplate 
		WHERE TemplateName = p_action;
	END IF;
ELSE 
		IF v_userExists IS NULL THEN
            -- No matching USER found
            SET v_errorMessage = 'Invalid EmailID.';

        END IF;

        -- Return the error message
        SELECT v_errorMessage AS errorMessage;
END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGenerateAndStoreOtp` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGenerateAndStoreOtp`(
    IN p_UserSettingsType VARCHAR(50),
    IN p_email TEXT
)
BEGIN
    DECLARE v_CurrentDate DATETIME;
    DECLARE v_ExpiryDate DATETIME;
    DECLARE v_userSettingsTypeID INT;
    DECLARE v_requestExists INT;
    DECLARE v_userID INT;
    DECLARE v_OTP INT;    
    
    -- Generate a 6-digit OTP
    SET v_OTP = FLOOR(100000 + RAND() * 900000);
    
    SELECT UserID INTO v_userID
	FROM tuser
	WHERE Email = p_email;
    
    SELECT UserSettingsID INTO v_requestExists
    FROM tusersettings 
    WHERE UserID = v_userID AND IsResetPassword = 0;

    -- Set the current date and expiry date
    SET v_CurrentDate = NOW();
    SET v_ExpiryDate = DATE_ADD(v_CurrentDate, INTERVAL 10 MINUTE);
    
    SELECT LookupDetailID INTO v_userSettingsTypeID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = p_UserSettingsType AND tlh.LookupTypeName = 'UserSettingsType'
    LIMIT 1;

IF v_requestExists IS NULL THEN 
    -- Insert the data into tusersettings
    INSERT INTO tusersettings (
        UserSettingsTypeID,
        IsResetPassword,
        PasswordExpiryTime,
        UserID,
        GeneratedPassword,
        CreatedBy,
        CreatedDate
    )
    VALUES (
        v_userSettingsTypeID,
        0,
        v_ExpiryDate,
        v_userID,
        v_OTP,
        v_userID,
        v_CurrentDate
    );
    
ELSE

	-- Update the existing OTP
        UPDATE tusersettings
        SET 
            PasswordExpiryTime = v_ExpiryDate,
            GeneratedPassword = v_OTP,
            UpdatedBy = v_userID,
            UpdatedDate = NOW()
        WHERE UserID = v_userID;

END IF;
		-- Return the generated OTP
			SELECT v_OTP AS OTP;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGetActivityDetailByID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGetActivityDetailByID`(IN p_activityDetailID INT)
BEGIN
    DECLARE v_delete INT;
	DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';
    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';
    
	SELECT 
    tad.ActivityDetailID AS activityDetailID,
    tad.Name AS name,
    tad.Description AS description,
    tad.Status AS status,
    ta.ActivityName AS activityName
    FROM tactivitydetail tad
    INNER JOIN tactivity ta ON ta.ActivityID = tad.ActivityID 
    WHERE tad.Status != v_delete AND ActivityDetailID = p_activityDetailID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGetLookupDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGetLookupDetails`(
    IN LookupType CHAR(1),
    IN LookupTypeName VARCHAR(255),
    IN UserID INT,
    IN SearchCriteria JSON
)
BEGIN
	DECLARE v_organizationTypeID VARCHAR(255);
    DECLARE v_localBodyName VARCHAR(255);
    DECLARE v_org_member_status INT;
    DECLARE v_org_status INT default 22;
    
    -- Check the value of LookupType
    IF LookupType = 'L' THEN
        -- Perform the query for LookupType 'L'
        IF LookupTypeName = 'OrganizationMemberStatus' THEN
            SELECT 
               ld.LookupDetailID as 'id',
               ld.LookupDetailName as 'name'
        FROM tlookupdetail ld
        INNER JOIN tlookupheader lh ON ld.LookupHeaderID = lh.LookupHeaderID
        WHERE lh.LookupTypeName = LookupTypeName;
        ELSE
        SELECT lh.LookupHeaderID,
               lh.LookupTypeName,
               ld.LookupDetailID,
               ld.LookupDetailName as 'name',
               ur.RoleID
        FROM tlookupheader lh
        INNER JOIN tlookupdetail ld ON lh.LookupHeaderID = ld.LookupHeaderID
        INNER JOIN tuserrole ur ON 	ur.UserID = UserID
        WHERE lh.LookupTypeName = LookupTypeName;
        END IF;
        
  ELSEIF LookupType = 'T' THEN
        -- Perform the query for LookupType 'T'
        -- If LookupTypeName is 'RegionType', perform the query for RegionType
        IF LookupTypeName = 'RegionType' THEN
            SELECT RegionTypeID, RegionTypeName AS 'name'
            FROM tregiontype
            WHERE isDisplay = 1;

        -- If LookupTypeName is 'Organization'
        ELSEIF LookupTypeName = 'Organization' THEN
                -- Extract values from the SearchCriteria JSON
               SELECT 
                    JSON_UNQUOTE(SearchCriteria->'$.organizationTypeID') AS f_organizationTypeID,
                    JSON_UNQUOTE(SearchCriteria->'$.localBodyName') AS f_localBodyName
                INTO v_organizationTypeID, v_localBodyName;

				SELECT tg.OrganizationID,
					   tg.OrganizationName as name,
                       tg.OrganizationTypeID,
					   tg.LocalBodyName,
					   tr.RegionName
				FROM torganization tg
				LEFT JOIN tregion tr ON tg.LocalBodyName = tr.RegionID
            WHERE (v_organizationTypeID IS NOT NULL AND v_organizationTypeID != '' AND tg.OrganizationTypeID = v_organizationTypeID)
               AND (v_localBodyName IS NOT NULL AND v_localBodyName != '' AND tg.LocalBodyName = v_localBodyName)
               OR (v_organizationTypeID IS NULL AND v_localBodyName IS NULL)
               OR (v_organizationTypeID = '' AND v_localBodyName = '');
		-- If LookupTypeName is 'Organization'
        ELSEIF LookupTypeName = 'MemberOrganization' THEN
				SELECT LookupDetailID INTO v_org_member_status
				FROM tlookupdetail tld
				INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
				WHERE tld.LookupDetailName = 'Active' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
				LIMIT 1;
                
				-- SELECT LookupDetailID INTO v_org_status
				-- FROM tlookupdetail tld
				-- INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
				-- WHERE tld.LookupDetailName = 'Active' AND tlh.LookupTypeName='OrganizationStatus';
        
            SELECT tog.OrganizationID as id, tog.OrganizationName as name FROM torganizationmember tom INNER JOIN torganization tog ON tom.OrganizationID = tog.OrganizationID WHERE tom.MemberID = UserID AND tom.Status = v_org_member_status AND tog.Status =  v_org_status;
        END IF;
        
    ELSE
        SELECT 'No records found or invalid LookupType' AS Message;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGetNotificationStatusCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGetNotificationStatusCount`(
    IN p_userID INT
)
BEGIN

    DECLARE v_pendingStatus TEXT;
    DECLARE v_activeStatus TEXT;
    DECLARE v_deletedStatus INT ;
    DECLARE v_sentItemsCount INT;
    DECLARE v_awaitingApprovalCount INT;
    DECLARE v_inboxCount INT;
    DECLARE isAdminFlag BOOLEAN;


    -- Fetch the notification statuses for pending and active
    SELECT tld.LookupDetailID
    INTO v_pendingStatus
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'OnHold'
    AND tlh.LookupTypeName = 'NotificationStatus';

    SELECT tld.LookupDetailID
    INTO v_activeStatus
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Active'
    AND tlh.LookupTypeName = 'NotificationStatus';
    
        SELECT tld.LookupDetailID
    INTO v_deletedStatus
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Deleted'
    AND tlh.LookupTypeName = 'NotificationStatus';

    -- Get the count for 'sentItems' (Status != v_deletedStatus AND NotificationCreated = 1)
    SELECT COUNT(DISTINCT tn.NotificationID)
    INTO v_sentItemsCount
    FROM tnotification tn
    INNER JOIN tnotificationheader tnh ON tn.NotificationID = tnh.NotificationID
	INNER JOIN torganizationmember tom ON tom.OrganizationID = tn.OrganizationID
    WHERE tn.Status != v_deletedStatus AND tn.NotificationCreated = p_userID;

    -- Get the count for 'awaitingApproval' (Status = v_pendingStatus, IsAdmin = 1, UserID = p_userID)
    SELECT COUNT(*)
    INTO v_awaitingApprovalCount
    FROM tnotification tn
    INNER JOIN torganizationrole tor ON tor.OrganizationID = tn.OrganizationID
    INNER JOIN torganizationuserrole tour ON tor.OrganizationRoleID = tour.OrganizationRoleID
    WHERE tn.Status = v_pendingStatus AND tor.IsAdmin = 1 AND tour.UserID = p_userID;

    -- Get the count for 'inbox' (Status = 59, IsAdmin = 1, UserID = p_userID)
		SELECT COUNT(DISTINCT tn.NotificationID) INTO v_inboxCount
		FROM tnotification tn INNER JOIN torganization tog ON tn.OrganizationID = tog.OrganizationID
		INNER JOIN tnotificationheader tnh ON tn.NotificationID = tnh.NotificationID
		INNER JOIN torganizationmember tom ON tom.OrganizationID = tn.OrganizationID
		WHERE tn.Status = v_activeStatus AND tom.MemberID = p_userID;


	-- Determine if the user is an admin
		SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END
		INTO isAdminFlag
		FROM torganizationuserrole tour
		INNER JOIN torganizationrole tor ON tour.OrganizationRoleID = tor.OrganizationRoleID
		WHERE tour.UserID = p_userID AND tor.IsAdmin = 1;
    
    
    -- Construct the dynamic SQL query string (just to return the counts)
    SET @sql = CONCAT(
        'SELECT ',
        v_sentItemsCount, ' AS sentItems, ',
        v_awaitingApprovalCount, ' AS awaitingApprovalCount, ',
        v_inboxCount, ' AS inboxCount, ',
        IF(isAdminFlag, 'TRUE', 'FALSE'), ' AS isAdmin'
    );

    -- Prepare and execute the SQL statement
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGetOrganizationDepartmentByID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGetOrganizationDepartmentByID`(
    IN p_organizationDepartmentID INT
)
BEGIN

    -- Base SQL Query to find details based on OrganizationDepartmentID
SELECT 
        od.OrganizationDepartmentID,
        od.DepartmentName,
        o.OrganizationID,
        o.OrganizationTypeID AS organizationTypeID,
        ot.LookupDetailName AS organizationType,
        o.OrganizationName,
        o.OrganizationEmail,
        o.PhoneNumber,
        o.Website,
        o.Pincode,
        o.About,
        o.CountryID AS countryID,
        rc.RegionName AS country,
        o.LocalBodyType AS localBodyTypeID,
        lbt.RegionTypeName AS localBodyType,
        o.LocalBodyName AS localBodyNameID,
        lbn.RegionName AS localBodyName,
        o.CityID AS cityID,
        rcy.RegionName AS city,
        o.DistrictID AS districtID,
        rd.RegionName AS district,
        o.StateID AS stateID,
        rs.RegionName AS state,
        o.WardName AS wardID,
        wa.RegionName AS wardName,
        o.PostOffice AS postOfficeID,
        po.RegionName AS postOffice,
        CASE 
            WHEN oa.FromDate IS NOT NULL AND oa.ToDate IS NOT NULL THEN 'False'
            ELSE 'True' 
        END AS isActive
    FROM 
        torganizationdepartment od
    LEFT JOIN 
        torganization o ON od.OrganizationID = o.OrganizationID 
    LEFT JOIN 
        torganizationdepartmentarchive oa ON od.OrganizationDepartmentID = oa.OrganizationDepartmentID 
    LEFT JOIN 
        tregion rc ON o.CountryID = rc.RegionID
    LEFT JOIN 
        tregion rs ON o.StateID = rs.RegionID
    LEFT JOIN 
        tregion rd ON o.DistrictID = rd.RegionID
    LEFT JOIN 
        tregion rcy ON o.CityID = rcy.RegionID
    LEFT JOIN 
        tregion wa ON o.WardName = wa.RegionID
    LEFT JOIN 
        tregion po ON o.PostOffice = po.RegionID
    LEFT JOIN 
        tlookupdetail ot ON o.OrganizationTypeID = ot.LookupDetailID
    LEFT JOIN 
        tregiontype lbt ON o.LocalBodyType = lbt.RegionTypeID
    LEFT JOIN 
        tregion lbn ON o.LocalBodyName = lbn.RegionID
    WHERE 
        od.OrganizationDepartmentID = p_organizationDepartmentID 
        AND od.Status = 1;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGetOrganizationDepartmentMemberByID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGetOrganizationDepartmentMemberByID`(
    IN p_organizationDepartmentMemberID INT
)
BEGIN
    DECLARE v_deleteId INT;

    -- Set SQL mode to avoid ONLY_FULL_GROUP_BY issues
    SET sql_mode = (SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

    -- Fetch the status for 'Deleted' for the `torganizationdepartmentmember` table
    SELECT ActionCodeID INTO v_deleteId
    FROM tactioncode 
    WHERE Description = 'Delete';

    -- Prepare the SQL query to fetch organization department member details by ID
    SET @sql = CONCAT('
        SELECT
            todm.OrganizationDepartmentMemberID AS organizationDepartmentMemberID,
            tu.UserID AS memberID,
            tu.FirstName AS firstName,
            tu.LastName AS lastName,
            tu.Email AS emailID,
            tu.PhoneNumber AS phoneNumber,
            trd.RegionName AS district,
            trd.RegionID AS districtID,
            tod.OrganizationDepartmentID AS organizationDepartmentID,
            tod.DepartmentName AS departmentName,
            tog.OrganizationID AS organizationID,
            tog.OrganizationName AS organizationName,
            todm.Status AS status,
            (
                SELECT COUNT(DISTINCT todm_inner.OrganizationDepartmentMemberID)
                FROM torganizationdepartmentmember todm_inner
                WHERE todm_inner.Status != ', v_deleteId, ' 
                  AND todm_inner.OrganizationDepartmentMemberID = ', p_organizationDepartmentMemberID, '
            ) AS total_count,
            CASE 
                WHEN oa.FromDate IS NOT NULL AND oa.ToDate IS NOT NULL THEN ''False''
                ELSE ''True'' 
            END AS isActive
        FROM torganizationdepartmentmember todm
        INNER JOIN tuser tu ON tu.UserID = todm.MemberID
        INNER JOIN torganizationdepartment tod ON tod.OrganizationDepartmentID = todm.OrganizationDepartmentID
        LEFT JOIN torganizationdepartmentmemberarchive oa ON todm.OrganizationDepartmentMemberID = oa.OrganizationDepartmentMemberID 
        LEFT JOIN tuserbasicdetail tubd ON tubd.UserID = tu.UserID
        LEFT JOIN tregion trd ON trd.RegionID = tubd.DistrictID
        INNER JOIN torganization tog ON tog.OrganizationID = tod.OrganizationID
        WHERE todm.OrganizationDepartmentMemberID = ', p_organizationDepartmentMemberID, ' 
          AND todm.Status != ', v_deleteId, ';');

    -- Debugging: Output the generated SQL statement for inspection
    -- SELECT @sql AS debug_sql;  -- This will show you the final SQL query

    -- Prepare and execute the SQL statement
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGetOrganizationDepartmentTeamByID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGetOrganizationDepartmentTeamByID`(IN p_organizationDepartmentTeamID INT)
BEGIN
    DECLARE v_delete INT;
	DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';
    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';
    
    -- Base SQL Query to find details based on OrganizationDepartmentID
    SELECT 
        odt.OrganizationDepartmentTeamID AS organizationDepartmentTeamID,
        odt.TeamName AS teamName,
        ta.ActivityID AS activityID,
        ta.ActivityName AS activityName,
        odt.Description AS description,
        odt.TeamCategoryID AS teamCategoryID,
        o.OrganizationID AS organizationID,
        o.OrganizationTypeID AS organizationTypeID,
        lt.LookupDetailName AS organizationType,
        o.OrganizationName AS organizationName,
        o.OrganizationEmail AS organizationEmail,
        o.PhoneNumber AS phoneNumber,
        o.Website AS webSite,
        o.Pincode AS pinCode,
        o.About AS about,
        o.CountryID AS countryID,
        rc.RegionName AS country,
        o.LocalBodyType AS localBodyTypeID,
        lbt.RegionTypeName AS localBodyType,
        o.LocalBodyName AS localBodyNameID,
        lbn.RegionName AS localBodyName,
        o.CityID AS cityID,
        rcy.RegionName AS city,
        o.DistrictID AS districtID,
        rd.RegionName AS district,
        o.StateID AS stateID,
        rs.RegionName AS state,
        o.WardName AS wardID,
        wa.RegionName AS wardName,
        o.PostOffice AS postOfficeID,
        po.RegionName AS postOffice,
        CASE 
            WHEN odt.FromDate IS NOT NULL AND odt.ToDate IS NOT NULL THEN 'False'
            ELSE 'True' 
        END AS isActive
    FROM 
        torganizationdepartmentteam odt
    LEFT JOIN 
        torganization o ON odt.OrganizationID = o.OrganizationID 
    LEFT JOIN 
        tregion rc ON o.CountryID = rc.RegionID
    LEFT JOIN 
        tregion rs ON o.StateID = rs.RegionID
    LEFT JOIN 
        tregion rd ON o.DistrictID = rd.RegionID
    LEFT JOIN 
        tregion rcy ON o.CityID = rcy.RegionID
    LEFT JOIN 
        tregion wa ON o.WardName = wa.RegionID
    LEFT JOIN 
        tregion po ON o.PostOffice = po.RegionID
    LEFT JOIN 
        tlookupdetail lt ON o.OrganizationTypeID = lt.LookupDetailID
    LEFT JOIN 
        tregiontype lbt ON o.LocalBodyType = lbt.RegionTypeID
    LEFT JOIN 
        tregion lbn ON o.LocalBodyName = lbn.RegionID
    LEFT JOIN 
        tactivity ta ON odt.ActivityID = ta.ActivityID
    WHERE 
        odt.OrganizationDepartmentTeamID = p_organizationDepartmentTeamID 
        AND odt.Status != v_delete;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGetOrganizationMemberByID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGetOrganizationMemberByID`(
    IN p_organizationMemberID INT
)
BEGIN
    -- Fetch organization member details by ID
    SELECT 
        tom.OrganizationMemberID AS id,
        tom.OrganizationID AS organizationID,
        tom.MemberID AS memberId, 
        tog.OrganizationName AS organizationName,
        tog.OrganizationEmail AS organizationEmail,
        tu.FirstName AS userFirstName,
        tu.LastName AS userLastName,
        tu.Email AS userEmail,
        tu.PhoneNumber AS userPhoneNumber,
		tom.Status AS statusID,
		tlds.LookupDetailName AS status,
            CASE 
                WHEN oa.FromDate IS NOT NULL AND oa.ToDate IS NOT NULL THEN 'False'
                ELSE 'True'
            END AS isActive
    FROM torganizationmember tom
    INNER JOIN torganization tog ON tog.OrganizationID = tom.OrganizationID
	LEFT JOIN torganizationmemberarchive oa ON tom.OrganizationMemberID = oa.OrganizationMemberID 
    INNER JOIN tuser tu ON tu.UserID = tom.MemberID
	LEFT JOIN tlookupdetail tlds ON tlds.LookupDetailID = tom.Status

    WHERE tom.OrganizationMemberID = p_organizationMemberID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cgetOrganizationMembersStatusCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cgetOrganizationMembersStatusCount`(
    IN p_organizationID INT,
    IN P_userID  INT
)
BEGIN

		DECLARE v_pendingStatus TEXT;
        DECLARE v_activeStatus TEXT;
        DECLARE v_pendingID TEXT;
        DECLARE v_countAdmin INT DEFAULT 0;
        DECLARE v_statusPendingID INT;
        DECLARE v_statusActiveID INT;
        DECLARE v_isAdmin INT DEFAULT 0;
        DECLARE v_isSuperAdmin INT DEFAULT 0;

		SELECT CONCAT('(tom.Status != 44 AND (tom.Status = ', GROUP_CONCAT(tld.LookupDetailID SEPARATOR ' OR tom.Status = '), '))') 
		INTO v_pendingStatus
		FROM tlookupdetail tld
		INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
		WHERE tld.LookupDetailName IN ('Inactive', 'Pending', 'Rejected','Cancel') 
		AND tlh.LookupTypeName = 'OrganizationMemberStatus';
        
		SELECT CONCAT('( tom.Status = ', GROUP_CONCAT(tld.LookupDetailID SEPARATOR ' OR tom.Status = '),')') INTO v_activeStatus
		FROM tlookupdetail tld
		INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
		WHERE (tld.LookupDetailName = 'Active' )
		AND tlh.LookupTypeName = 'OrganizationMemberStatus';
        
		SELECT CONCAT('( tom.Status = ', GROUP_CONCAT(tld.LookupDetailID SEPARATOR ' OR tom.Status = '),')') INTO v_pendingID
		FROM tlookupdetail tld
		INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
		WHERE tld.LookupDetailName = 'Pending' 
		AND tlh.LookupTypeName = 'OrganizationMemberStatus'; 
        
    SELECT LookupDetailID INTO v_statusPendingID
	FROM tlookupdetail tld
	INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
	WHERE tld.LookupDetailName = 'Pending' 
	AND tlh.LookupTypeName = 'OrganizationMemberStatus'; 
    
    
	SELECT LookupDetailID INTO v_statusActiveID
	FROM tlookupdetail tld
	INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
	WHERE tld.LookupDetailName = 'Active' 
	AND tlh.LookupTypeName = 'OrganizationMemberStatus'; 
    
    
    
	SELECT IsOwner INTO v_countAdmin FROM torganizationmember
	WHERE OrganizationID = p_organizationID AND MemberID = P_userID AND Status = v_statusActiveID ;
    
    SELECT tor.IsAdmin INTO v_isAdmin FROM torganizationrole tor
    INNER JOIN torganizationuserrole tour ON tor.OrganizationRoleID = tour.OrganizationRoleID
    WHERE organizationId = p_organizationID AND IsAdmin = 1 AND userID = P_userID;
    
    SELECT tr.IsAdmin INTO v_isSuperAdmin FROM tuser tu 
	INNER JOIN tuserrole tur ON tu.UserID = tur.UserID
	INNER JOIN trole tr ON tur.RoleID = tr.RoleID WHERE tu.UserID = P_userID;
            
    -- Construct the dynamic SQL query string
    SET @sql = CONCAT(
        'SELECT ',
        'COUNT(CASE WHEN ', v_activeStatus, ' THEN 1 END) AS existingMembers, ',
        'COUNT(CASE WHEN ', v_pendingStatus, ' AND isOrganizationInitiated = 1 THEN 1 END) AS pendingInviteSend, ',
        'COUNT(CASE WHEN ', v_pendingStatus, ' AND isOrganizationInitiated = 0 THEN 1 END) AS applicationsReceived, ',
        'COUNT(CASE WHEN ', v_pendingID , ' AND isOrganizationInitiated = 1 THEN 1 END) AS invitationsReceived, ',
		v_countAdmin, ' AS isOwner, ',
        v_isAdmin, ' AS isAdmin, ',
        v_isSuperAdmin, ' AS isSuperAdmin ',
        'FROM torganizationmember tom ',
        'WHERE tom.organizationID = ', p_organizationID  
    );
    
    -- SELECT v_pendingStatus ;
    
	-- SELECT @sql AS final_query;
    -- Prepare and execute the SQL statement
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGetOrganizationTeamByID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGetOrganizationTeamByID`(IN p_organizationTeamID INT)
BEGIN
    DECLARE v_delete INT;
	DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';
    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';
    
    -- Base SQL Query to find details based on OrganizationDepartmentID
    SELECT 
        ot.OrganizationTeamID AS organizationTeamID,
        ot.TeamName AS teamName,
        ta.ActivityID AS activityID,
        ta.ActivityName AS activityName,
        ot.Description AS description,
        ot.TeamCategoryID AS teamCategoryID,
        o.OrganizationID AS organizationID,
        o.OrganizationTypeID AS organizationTypeID,
        lt.LookupDetailName AS organizationType,
        o.OrganizationName AS organizationName,
        o.OrganizationEmail AS organizationEmail,
        o.PhoneNumber AS phoneNumber,
        o.Website AS webSite,
        o.Pincode AS pinCode,
        o.About AS about,
        o.CountryID AS countryID,
        rc.RegionName AS country,
        o.LocalBodyType AS localBodyTypeID,
        lbt.RegionTypeName AS localBodyType,
        o.LocalBodyName AS localBodyNameID,
        lbn.RegionName AS localBodyName,
        o.CityID AS cityID,
        rcy.RegionName AS city,
        o.DistrictID AS districtID,
        rd.RegionName AS district,
        o.StateID AS stateID,
        rs.RegionName AS state,
        o.WardName AS wardID,
        wa.RegionName AS wardName,
        o.PostOffice AS postOfficeID,
        po.RegionName AS postOffice,
        CASE 
            WHEN ot.FromDate IS NOT NULL AND ot.ToDate IS NOT NULL THEN 'False'
            ELSE 'True' 
        END AS isActive
    FROM 
        torganizationteam ot
    LEFT JOIN 
        torganization o ON ot.OrganizationID = o.OrganizationID 
    LEFT JOIN 
        tregion rc ON o.CountryID = rc.RegionID
    LEFT JOIN 
        tregion rs ON o.StateID = rs.RegionID
    LEFT JOIN 
        tregion rd ON o.DistrictID = rd.RegionID
    LEFT JOIN 
        tregion rcy ON o.CityID = rcy.RegionID
    LEFT JOIN 
        tregion wa ON o.WardName = wa.RegionID
    LEFT JOIN 
        tregion po ON o.PostOffice = po.RegionID
    LEFT JOIN 
        tlookupdetail lt ON o.OrganizationTypeID = lt.LookupDetailID
    LEFT JOIN 
        tregiontype lbt ON o.LocalBodyType = lbt.RegionTypeID
    LEFT JOIN 
        tregion lbn ON o.LocalBodyName = lbn.RegionID
    LEFT JOIN 
        tactivity ta ON ot.ActivityID = ta.ActivityID
    WHERE 
        ot.OrganizationTeamID = p_organizationTeamID 
        AND ot.Status != v_delete;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGetOrganizationTeamDetailByID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGetOrganizationTeamDetailByID`(IN p_organizationTeamDetailByID INT)
BEGIN
    DECLARE v_delete INT;
	DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';
    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_delete
    FROM tactioncode
    WHERE Description = 'Delete';
    
	SELECT
	totd.OrganizationTeamDetailID AS organizationTeamDetailID,
	tad.Name AS activityName,
	tot.TeamName AS teamName,
	tu.FirstName AS firstName,
	tu.LastName AS lastName,
	CASE 
		WHEN totd.FromDate IS NOT NULL AND totd.ToDate IS NOT NULL THEN 'False'
		ELSE 'True' 
	END AS isActive
	FROM sportfolio.torganizationteamdetail totd 
	INNER JOIN tuser tu ON tu.UserID = totd.UserId 
	LEFT JOIN torganizationteam tot ON tot.OrganizationTeamID = totd.OrganizationTeamID
	LEFT JOIN tactivitydetail tad ON tad.ActivityDetailID = totd.ActivityDetailID
	WHERE totd.Status != v_delete AND totd.OrganizationTeamDetailID = p_organizationTeamDetailByID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cGetUserByID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cGetUserByID`(IN p_userID INT)
BEGIN
    DECLARE v_documentStatus INT;
    DECLARE v_documentType INT;

    
    SELECT tld.LookupDetailID INTO v_documentStatus
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName = 'DocumentStatus';

    
    SELECT tld.LookupDetailID INTO v_documentType
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'User' AND tlh.LookupTypeName = 'OwnerType';

    
    IF p_userID IS NOT NULL THEN
        SELECT 
            u.UserID AS id,
            u.FirstName AS firstName,
            u.LastName AS lastName,
            u.PhoneNumber AS phoneNumber,
            u.Email AS email,
            
            COALESCE(
                (SELECT JSON_OBJECT(
                    'documentID', d.DocumentID,
                    'path', d.DocumentUrl,
                    'fileName', d.DocumentName
                )
                FROM tdocument d 
                WHERE d.OwnerID = u.UserID 
                  AND d.Status != v_documentStatus 
                  AND d.DocumentTypeID = v_documentType
                ), 
                JSON_OBJECT()
            ) AS avatar,

            
            ub.DistrictID AS districtID,
            r.RegionName AS district
        FROM tuser u
        LEFT JOIN tuserbasicdetail ub ON u.UserID = ub.UserID
        LEFT JOIN tregion r ON ub.DistrictID = r.RegionID
        WHERE u.UserID = p_userID;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CheckOrganizationNameAndEmail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckOrganizationNameAndEmail`(
    IN p_OrganizationName VARCHAR(255),
    IN p_OrganizationEmail VARCHAR(100)
)
BEGIN
    SELECT OrganizationName, OrganizationEmail 
    FROM torganization 
    WHERE OrganizationName = p_OrganizationName 
       OR OrganizationEmail = p_OrganizationEmail;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveActivity` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveActivity`(
    IN p_ActivityName VARCHAR(255),
    IN p_ActivityDescription VARCHAR(100),
    IN p_ParentID INT,
    IN p_UserID INT,
    IN p_ActivityID INT
)
BEGIN
    DECLARE v_ActivityID INT;
    DECLARE v_existingActivityCount INT;

    
    SELECT COUNT(1) INTO v_existingActivityCount
    FROM tactivity
    WHERE ActivityName = p_ActivityName
    AND (p_ActivityID IS NULL OR ActivityID != p_ActivityID);

    IF v_existingActivityCount > 0 THEN
        
        SET v_ActivityID = NULL;
    ELSE
        IF p_ActivityID IS NULL THEN
            INSERT INTO tactivity (
                ActivityName, ActivityDescription, ParentID, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
            ) VALUES (
                p_ActivityName, p_ActivityDescription, p_ParentID, p_UserID, CURDATE(), null, null
            );
            SET v_ActivityID = LAST_INSERT_ID();
        ELSE
            UPDATE tactivity
            SET
                ActivityName = p_ActivityName,
                ActivityDescription = p_ActivityDescription,
                ParentID = p_ParentID,
                UpdatedBy = IFNULL(p_UserID, UpdatedBy),
                UpdatedDate = IFNULL(CURDATE(), UpdatedDate)
            WHERE ActivityID = p_ActivityID;
            SET v_ActivityID = p_ActivityID;
        END IF;
    END IF;

    
    SELECT v_ActivityID AS ActivityID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveActivityDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveActivityDetail`(
	IN p_activityID INT,
    IN p_name VARCHAR(255),
    IN p_parentID INT,
    IN p_description VARCHAR(500),
    IN p_UserID INT,
    IN p_activityDetailID INT
)
BEGIN
	DECLARE v_activityDetailID INT;
    DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';

-- Check if p_activityDetailID is null (for insert) or not (for update)
    IF p_activityDetailID IS NULL THEN

            INSERT INTO tactivitydetail (
            ActivityID, Name, Description, ParentID, Status, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
        ) VALUES (
			p_activityID, p_name, p_description, p_parentID, v_active, p_UserID, now(), null, null
        );
        
        SET v_activityDetailID = LAST_INSERT_ID();

    -- Return the ActivityDetailID for reference
    SELECT v_activityDetailID AS ActivityDetailID;
    
   ELSE
        -- Update the existing organization Team
        UPDATE tactivitydetail
        SET 
            ActivityID = p_activityID,
            Name = p_name,
            Description = p_description, 
            ParentID = p_parentID, 
            UpdatedBy = p_UserID, 
            UpdatedDate = now()
        WHERE ActivityDetailID = p_activityDetailID;

        -- Return the updated ActivityDetailID for reference
        SELECT p_activityDetailID AS ActivityDetailID;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveBasicUserDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveBasicUserDetail`(
    IN p_firstName VARCHAR(255),
    IN p_middleName VARCHAR(255),
    IN p_lastName VARCHAR(255),
IN p_nickName VARCHAR(255),
    IN p_userID INT,
    IN p_emailID VARCHAR(255),
    IN p_phoneNumber VARCHAR(20),
IN p_alternativePhoneNumber VARCHAR(20),
    IN p_gender VARCHAR(255),
    IN p_dateOfBirth VARCHAR(20),
    IN p_bio TEXT,
    IN p_bloodGroup VARCHAR(10),
    IN p_country VARCHAR(255),
    IN p_state VARCHAR(255),
    IN p_district VARCHAR(255),
    IN p_city VARCHAR(255),
    IN p_locationID VARCHAR(20),
    IN p_representingDistricts JSON,
    IN p_houseName VARCHAR(255),
    IN p_streetName VARCHAR(255),
    IN p_place VARCHAR(255),
    IN p_localBodyType VARCHAR(255),
    IN p_localBodyName VARCHAR(255),
    IN p_wardName VARCHAR(255),
    IN p_postOffice VARCHAR(255),
    IN p_pinCode VARCHAR(20),
    IN p_userBasicDetailID INT
)
BEGIN
    DECLARE v_userBasicDetailID INT;
DECLARE v_status INT;
DECLARE v_index INT DEFAULT 0;
DECLARE v_arrayLength INT;
DECLARE v_representingDistrictID INT;
DECLARE v_representingDistrictsNames JSON DEFAULT JSON_ARRAY();


SET v_arrayLength = JSON_LENGTH(p_representingDistricts);


WHILE v_index < v_arrayLength DO

SET v_representingDistrictID = JSON_UNQUOTE(JSON_EXTRACT(p_representingDistricts, CONCAT('$[', v_index, ']')));


SET v_representingDistrictsNames = JSON_ARRAY_APPEND(v_representingDistrictsNames, '$', 
(SELECT RegionName FROM tregion WHERE RegionID = v_representingDistrictID));


SET v_index = v_index + 1;
END WHILE;


    

    SELECT ActionCodeID INTO v_status
FROM tactioncode
WHERE Description = 'Hold';

    
    SET p_firstName = NULLIF(p_firstName, 'undefined');
    SET p_middleName = NULLIF(p_middleName, 'undefined');
    SET p_lastName = NULLIF(p_lastName, 'undefined');
    SET p_nickName = NULLIF(p_nickName, 'undefined');
    SET p_emailID = NULLIF(p_emailID, 'undefined');
    SET p_phoneNumber = NULLIF(p_phoneNumber, 'undefined');
    SET p_alternativePhoneNumber = NULLIF(p_alternativePhoneNumber, 'undefined');
    SET p_gender = NULLIF(p_gender, 'undefined');
    SET p_dateOfBirth = NULLIF(p_dateOfBirth, 'undefined');
    SET p_bio = NULLIF(p_bio, 'undefined');
    SET p_bloodGroup = NULLIF(p_bloodGroup, 'undefined');
    SET p_country = NULLIF(p_country, 'undefined');
    SET p_state = NULLIF(p_state, 'undefined');
    SET p_district = NULLIF(p_district, 'undefined');
    SET p_city = NULLIF(p_city, 'undefined');
    SET p_locationID = NULLIF(p_locationID, 'undefined');
    SET p_representingDistricts = NULLIF(p_representingDistricts, 'undefined');
    SET p_houseName = NULLIF(p_houseName, 'undefined');
    SET p_streetName = NULLIF(p_streetName, 'undefined');
    SET p_place = NULLIF(p_place, 'undefined');
    SET p_localBodyType = NULLIF(p_localBodyType, 'undefined');
    SET p_localBodyName = NULLIF(p_localBodyName, 'undefined');
    SET p_wardName = NULLIF(p_wardName, 'undefined');
    SET p_postOffice = NULLIF(p_postOffice, 'undefined');
    SET p_pinCode = NULLIF(p_pinCode, 'undefined');


    IF p_userBasicDetailID IS NULL THEN
        INSERT INTO tuserbasicdetail (
            FirstName, MiddleName, LastName, NickName, UserID, EmailID, PhoneNumber, AlternativePhoneNumber, Gender, DateOfBirth, Bio, BloodGroup,
            CountryID, StateID, DistrictID, City, permanantLocationID, RepresentingDistrictID, HouseName, StreetName, Place, LocalBodyType,
            LocalBodyName, WardID, PostOffice, PinCode, Status, CreatedBy, CreatedDate
        )
        VALUES (
            NULLIF(p_firstName, ''), 
NULLIF(p_middleName, ''), 
            NULLIF(p_lastName, ''), 
            NULLIF(p_nickName, ''),
            p_userID, 
            NULLIF(p_emailID, ''), 
            NULLIF(p_phoneNumber, ''),
            NULLIF(p_alternativePhoneNumber, ''),
            NULLIF(p_gender, 0), 
            NULLIF(p_dateOfBirth, ''),
            NULLIF(p_bio, ''),
            NULLIF(p_bloodGroup, 0),
            NULLIF(p_country, 0),
            NULLIF(p_state, ''),
            NULLIF(p_district, ''),
            NULLIF(p_city, ''),
            NULLIF(NULLIF(p_locationID, ''), 0),
            NULLIF(v_representingDistrictsNames, ''),
            NULLIF(p_houseName, ''),
            NULLIF(p_streetName, ''),
            NULLIF(p_place, ''),
            NULLIF(p_localBodyType, ''),
            NULLIF(p_localBodyName, ''),
            NULLIF(p_wardName, ''),
            NULLIF(p_postOffice, ''),
            NULLIF(p_pinCode, ''),
            v_status,
            p_userID, 
            NOW()
        );

        SET v_userBasicDetailID = LAST_INSERT_ID();
        
UPDATE tuser tu
SET
tu.FirstName = p_firstName,
tu.LastName = p_lastName
WHERE
tu.UserID = p_userID;
    
    ELSE
    SET v_userBasicDetailID = p_userBasicDetailID;

    UPDATE tuserbasicdetail ub
    SET
        ub.FirstName = IF(p_firstName IS NOT NULL AND p_firstName != '', p_firstName, ub.FirstName),
        ub.MiddleName = IF(p_middleName IS NOT NULL AND p_middleName != '', p_middleName, ub.MiddleName),
        ub.LastName = IF(p_lastName IS NOT NULL AND p_lastName != '', p_lastName, ub.LastName),
        ub.NickName = IF(p_nickName IS NOT NULL AND p_nickName != '', p_nickName, ub.NickName),
        ub.UserID = p_userID,
        ub.EmailID = IF(p_emailID IS NOT NULL AND p_emailID != '', p_emailID, ub.EmailID),
        ub.PhoneNumber = IF(p_phoneNumber IS NOT NULL AND p_phoneNumber != '', p_phoneNumber, ub.PhoneNumber),
        ub.AlternativePhoneNumber = IF(p_alternativePhoneNumber IS NOT NULL AND p_alternativePhoneNumber != '', p_alternativePhoneNumber, ub.AlternativePhoneNumber),
        ub.Gender = p_gender,
        ub.DateOfBirth = IF(p_dateOfBirth IS NOT NULL AND p_dateOfBirth != '', p_dateOfBirth, ub.DateOfBirth),
        ub.Bio = p_bio,
        ub.BloodGroup = p_bloodGroup,
        ub.CountryID = IF(p_country IS NOT NULL AND p_country != '', p_country, ub.CountryID),
        ub.StateID = IF(p_state IS NOT NULL AND p_state != '', p_state, ub.StateID),
        ub.DistrictID = IF(p_district IS NOT NULL AND p_district != '', p_district, ub.DistrictID),
        ub.City = IF(p_city IS NOT NULL AND p_city != '', p_city, ub.City),
ub.RepresentingDistrictID = IF(p_representingDistricts IS NOT NULL AND p_representingDistricts != '', v_representingDistrictsNames, ub.RepresentingDistrictID),
        ub.HouseName = IF(p_houseName IS NOT NULL AND p_houseName != '', p_houseName, ub.HouseName),
        ub.StreetName = IF(p_streetName IS NOT NULL AND p_streetName != '', p_streetName, ub.StreetName),
        ub.Place = IF(p_place IS NOT NULL AND p_place != '', p_place, ub.Place),
        ub.LocalBodyType = IF(p_localBodyType IS NOT NULL AND p_localBodyType != '', p_localBodyType, ub.LocalBodyType),
        ub.LocalBodyName = IF(p_localBodyName IS NOT NULL AND p_localBodyName != '', p_localBodyName, ub.LocalBodyName),
        ub.WardID = IF(p_wardName IS NOT NULL AND p_wardName != '', p_wardName, ub.WardID),
        ub.PostOffice = IF(p_postOffice IS NOT NULL AND p_postOffice != '', p_postOffice, ub.PostOffice),
        ub.PinCode = IF(p_pinCode IS NOT NULL AND p_pinCode != '', p_pinCode, ub.PinCode),
        ub.UpdatedBy = p_userID,
        ub.UpdatedDate = NOW()
    WHERE
        ub.UserBasicDetailID = v_userBasicDetailID;

    UPDATE tuser tu
    SET
        tu.FirstName = IF(p_firstName IS NOT NULL, p_firstName, tu.FirstName),
        tu.LastName = IF(p_lastName IS NOT NULL, p_lastName, tu.LastName),
        tu.Email = IF(p_emailID IS NOT NULL, p_emailID, tu.Email)
WHERE
tu.UserID = p_userID;

END IF;

SET p_userBasicDetailID = v_userBasicDetailID;
SELECT p_userBasicDetailID AS UserBasicDetailID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveNotification` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveNotification`(
    IN p_NotificationType INT,
    IN p_Subject LONGTEXT,
    IN p_Body TEXT,
    IN p_StartDate VARCHAR(255),
    IN p_Image TEXT,
    IN removedFiles JSON,
	IN p_Country INT,
    IN p_State INT,
    IN p_District INT,
    IN p_Address VARCHAR(255),
    IN p_NotificationCreated INT,
    IN p_OrganizationID INT,
    IN p_UserID INT,
    IN p_NotifyOrganizationIDs TEXT,
    IN p_NotifyAll Boolean,
    IN p_NotificationID INT 
)
BEGIN
DECLARE v_NotificationID INT;
DECLARE v_notificationStatus INT;
DECLARE v_organizationStatus INT default 22;
DECLARE v_status INT;
DECLARE v_OrganizationIDs TEXT DEFAULT '';
DECLARE v_OrganizationCount INT DEFAULT 0;
DECLARE v_OrganizationIndex INT DEFAULT 1;
DECLARE v_OrganizationID INT;
DECLARE v_fetchStatusCondition VARCHAR(255) default 'OnHold';
DECLARE v_documentName VARCHAR(255);
DECLARE v_documentUrl VARCHAR(500);
DECLARE v_documentStatus INT;
DECLARE v_documentTypeID INT;
DECLARE v_index INT DEFAULT 0;
DECLARE v_totalFiles INT;
DECLARE v_removedFileID INT;
DECLARE v_totalRemovedFiles INT;
DECLARE v_approvedBy INT DEFAULT NULL;
DECLARE v_approvedByDate DATETIME DEFAULT NULL;


			-- Fetch the status for 'Pending'
		SELECT LookupDetailID INTO v_documentStatus
		FROM tlookupdetail tld
        INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
		WHERE tld.LookupDetailName = 'Pending' AND tlh.LookupTypeName='DocumentStatus';

		-- Fetch the document type for 'Notification'
		SELECT LookupDetailID INTO v_documentTypeID
		FROM tlookupdetail
		WHERE LookupDetailName = 'Notification';

    

SELECT CASE 
        WHEN tor.isAdmin = 1 THEN 'Active'
        ELSE 'OnHold'
END INTO v_fetchStatusCondition From torganizationrole tor INNER JOIN torganizationuserrole tour ON tor.OrganizationRoleID = tour.OrganizationRoleID WHERE tor.OrganizationID = p_OrganizationID AND tour.UserID = p_UserID;

IF v_fetchStatusCondition = 'ACTIVE' THEN
	SET v_approvedBy = p_UserID;
    SET v_approvedByDate = NOW();
END IF;

    
SELECT LookupDetailID INTO v_notificationStatus
FROM tlookupdetail tld
INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
WHERE tld.LookupDetailName = v_fetchStatusCondition AND tlh.LookupTypeName='NotificationStatus';
        
SELECT ActionCodeID INTO v_status
FROM tactioncode
WHERE Description = 'Active';

-- SELECT LookupDetailID INTO v_organizationStatus
-- FROM tlookupdetail tld
-- INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
-- WHERE tld.LookupDetailName = 'Pending' AND tlh.LookupTypeName='OrganizationStatus';


  -- Check if the JSON is valid
    IF JSON_VALID(p_Image) THEN
        -- Get the total number of files in the JSON array
        SET v_totalFiles = JSON_LENGTH(p_Image);

    
    IF p_NotificationID IS NULL THEN
    
    INSERT INTO tnotification (NotificationType, OrganizationID, Subject, Body, NotificationCreated, Image, NotifyAll, Status, ApprovedBy, ApprovedDate, StartDate,CreatedBy,CreatedDate)
	VALUES (p_notificationType, p_OrganizationID, p_subject, p_body, p_NotificationCreated, p_Image, p_NotifyAll, v_notificationStatus, v_approvedBy, v_approvedByDate, p_StartDate, p_UserID, NOW());

        
	SET v_NotificationID = LAST_INSERT_ID();
    
     -- Loop through each file in the p_uploads JSON array
            WHILE v_index < v_totalFiles DO
                -- Extract the fileName and path from each object in the JSON array
                SET v_documentName = JSON_UNQUOTE(JSON_EXTRACT(p_Image, CONCAT('$[', v_index, '].fileName')));
                SET v_documentUrl = JSON_UNQUOTE(JSON_EXTRACT(p_Image, CONCAT('$[', v_index, '].path')));

                -- Insert into tdocument table for each file
                INSERT INTO tdocument (
                    DocumentTypeID, OwnerID, DocumentName, DocumentUrl, Status, Notes, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
                ) VALUES (
                    v_documentTypeID, v_NotificationID, v_documentName, v_documentUrl, v_documentStatus, NULL, p_userID, NOW(), NULL, NULL
                );

                -- Move to the next file
                SET v_index = v_index + 1;
            END WHILE;
    
    INSERT INTO tvenuenotification (NotificationID, Country, State, District, LocalBodyType, LocalBodyName, Address, FromDate, Status, CreatedBy, CreatedDate)
	VALUES (v_NotificationID, p_Country ,  p_State, p_District, null, null, p_Address, null, v_status, p_UserID, NOW());

	IF(p_NotifyAll) THEN
		SELECT GROUP_CONCAT(OrganizationID) INTO v_OrganizationIDs
		FROM torganization
		WHERE Status = v_organizationStatus;
        
         SET v_OrganizationCount = LENGTH(v_OrganizationIDs) - LENGTH(REPLACE(v_OrganizationIDs, ',', '')) + 1;

        -- Loop through the comma-separated Organization IDs
        WHILE v_OrganizationIndex <= v_OrganizationCount DO
            SET v_OrganizationID = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(v_OrganizationIDs, ',', v_OrganizationIndex), ',', -1) AS UNSIGNED);
            
            -- Insert each OrganizationID into tnotificationheader
            INSERT INTO tnotificationheader (NotificationID, OrganizationID, CreatedBy, CreatedDate)
            VALUES (v_NotificationID, v_OrganizationID, p_UserID, NOW());

            SET v_OrganizationIndex = v_OrganizationIndex + 1;
        END WHILE;
        
        
    ELSE
		SET v_OrganizationCount = LENGTH(p_NotifyOrganizationIDs) - LENGTH(REPLACE(p_NotifyOrganizationIDs, ',', '')) + 1;

        -- Loop through the comma-separated Organization IDs
        WHILE v_OrganizationIndex <= v_OrganizationCount DO
            SET v_OrganizationID = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_NotifyOrganizationIDs, ',', v_OrganizationIndex), ',', -1) AS UNSIGNED);
            
            -- Insert each OrganizationID into tnotificationheader
            INSERT INTO tnotificationheader (NotificationID, OrganizationID, CreatedBy, CreatedDate)
            VALUES (v_NotificationID, v_OrganizationID, p_UserID, NOW());

            SET v_OrganizationIndex = v_OrganizationIndex + 1;
        END WHILE;
    END IF;

    ELSE        
       
         -- Update logic
        SET v_NotificationID = p_NotificationID;

        -- Update the notification table
        UPDATE tnotification 
        SET NotificationType = p_NotificationType,
            Subject = p_Subject,
            Body = p_Body,
            Image = p_image,
            NotificationCreated = p_NotificationCreated,
            Status = v_notificationStatus,
            StartDate = p_StartDate,
            ApprovedDate = NOW(),
            UpdatedBy = p_UserID,
            UpdatedDate = NOW()
        WHERE NotificationID = v_NotificationID;
        
        
                    -- If there are any removed files, delete them from tdocument
            IF JSON_VALID(removedFiles) THEN
                -- Get the total number of files in the removedFiles JSON array
                SET v_totalRemovedFiles = JSON_LENGTH(removedFiles);
                
                -- Loop through each DocumentID in the removedFiles JSON array
                WHILE v_index < v_totalRemovedFiles DO
                    -- Extract the DocumentID from each object in the removedFiles array
                    SET v_removedFileID = JSON_UNQUOTE(JSON_EXTRACT(removedFiles, CONCAT('$[', v_index, ']')));
                    
                    -- Delete the document from tdocument where DocumentID matches
                    DELETE FROM tdocument
                    WHERE DocumentID = v_removedFileID;
                    
                    -- Move to the next DocumentID
                    SET v_index = v_index + 1;
                END WHILE;
            END IF;

            -- Loop through each file in the p_uploads JSON array (if any new uploads)
            SET v_index = 0; -- Reset the index for the next loop
            WHILE v_index < v_totalFiles DO
                -- Extract the fileName and path from each object in the JSON array
                SET v_documentName = JSON_UNQUOTE(JSON_EXTRACT(p_Image, CONCAT('$[', v_index, '].fileName')));
                SET v_documentUrl = JSON_UNQUOTE(JSON_EXTRACT(p_Image, CONCAT('$[', v_index, '].path')));

                -- Insert into tdocument table for each new file
                INSERT INTO tdocument (
                    DocumentTypeID, OwnerID, DocumentName, DocumentUrl, Status, Notes, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
                ) VALUES (
                    v_documentTypeID, v_NotificationID, v_documentName, v_documentUrl, v_documentStatus, NULL, p_userID, NOW(), NULL, NULL
                );

                -- Move to the next file
                SET v_index = v_index + 1;
            END WHILE;



        -- Update the venue notification table
        UPDATE tvenuenotification 
        SET Country = p_Country,
			State = p_State,
            District = p_District,
            Address = p_Address,
            Status = v_status,
            UpdatedBy = p_UserID,
            UpdatedDate = NOW()
        WHERE NotificationID = v_NotificationID;

        -- Update the notification headers
        DELETE FROM tnotificationheader 
        WHERE NotificationID = v_NotificationID;

        IF (p_NotifyAll) THEN
            SELECT GROUP_CONCAT(OrganizationID) INTO v_OrganizationIDs
            FROM torganization
            WHERE Status = v_organizationStatus;

            SET v_OrganizationCount = LENGTH(v_OrganizationIDs) - LENGTH(REPLACE(v_OrganizationIDs, ',', '')) + 1;

            WHILE v_OrganizationIndex <= v_OrganizationCount DO
                SET v_OrganizationID = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(v_OrganizationIDs, ',', v_OrganizationIndex), ',', -1) AS UNSIGNED);

                INSERT INTO tnotificationheader (NotificationID, OrganizationID, CreatedBy, CreatedDate)
                VALUES (v_NotificationID, v_OrganizationID, p_UserID, NOW());

                SET v_OrganizationIndex = v_OrganizationIndex + 1;
            END WHILE;
        ELSE
            SET v_OrganizationCount = LENGTH(p_NotifyOrganizationIDs) - LENGTH(REPLACE(p_NotifyOrganizationIDs, ',', '')) + 1;

            WHILE v_OrganizationIndex <= v_OrganizationCount DO
                SET v_OrganizationID = CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_NotifyOrganizationIDs, ',', v_OrganizationIndex), ',', -1) AS UNSIGNED);

                INSERT INTO tnotificationheader (NotificationID, OrganizationID, CreatedBy, CreatedDate)
                VALUES (v_NotificationID, v_OrganizationID, p_UserID, NOW());

                SET v_OrganizationIndex = v_OrganizationIndex + 1;
            END WHILE;
        END IF;
    END IF;
		END IF;

    SELECT v_NotificationID AS NotificationID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveOrganization` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveOrganization`(
    IN p_OrganizationName VARCHAR(255),
    IN p_OrganizationEmail VARCHAR(100),
    IN p_OrganizationTypeID INT,
    IN p_RegistrationNumber VARCHAR(255),
    IN p_RegistrationValidFrom DATE,
    IN p_RegistrationValidTo DATE,
    IN p_InchargeName VARCHAR(255),
    IN p_InchargePhone VARCHAR(20),
    IN p_InchargeEmail VARCHAR(255),
    IN p_PhoneNumber VARCHAR(20),
    IN p_UserID INT,
    IN p_Website VARCHAR(500),
    IN p_CountryID INT,
    IN p_StateID INT,
    IN p_DistrictID INT,
    IN p_CityID VARCHAR(20),
    IN p_LocalBodyType INT,
    IN p_LocalBodyName VARCHAR(255),
    IN p_WardName INT,
    IN p_PostOffice INT,
    IN p_Pincode VARCHAR(20),
    IN p_About TEXT,
    IN p_CreatedBy VARCHAR(255),
    IN p_UpdatedBy VARCHAR(255),
    IN p_OrganizationID INT 
)
BEGIN
DECLARE v_OrganizationID INT;
DECLARE v_organizationStatus INT;
DECLARE v_status INT;
DECLARE v_organizationrole INT;
DECLARE v_organizationMemberStatus INT;
DECLARE v_activeStatus INT;
    
    SELECT LookupDetailID INTO v_organizationStatus
FROM tlookupdetail tld
        INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
WHERE tld.LookupDetailName = 'Pending' AND tlh.LookupTypeName='OrganizationStatus';

    SELECT LookupDetailID INTO v_organizationMemberStatus
FROM tlookupdetail tld
        INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
WHERE tld.LookupDetailName = 'Active' AND tlh.LookupTypeName='OrganizationMemberStatus';
        
        SELECT ActionCodeID INTO v_status
FROM tactioncode
WHERE Description = 'Hold';

        SELECT ActionCodeID INTO v_activeStatus
FROM tactioncode
WHERE Description = 'Active';
    
    IF p_OrganizationID IS NULL THEN
        INSERT INTO torganization (
            OrganizationName, OrganizationEmail, OrganizationTypeID, RegistrationNumber, RegistrationValidFrom, RegistrationValidTo, InchargeName, InchargePhone, InchargeEmail, PhoneNumber, UserID, Website, CountryID, StateID, DistrictID, CityID, LocalBodyType, LocalBodyName, WardName, PostOffice, Pincode, Status, About, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
        ) VALUES (
            p_OrganizationName, p_OrganizationEmail, p_OrganizationTypeID, p_RegistrationNumber, p_RegistrationValidFrom, p_RegistrationValidTo, p_InchargeName, p_InchargePhone, p_InchargeEmail, p_PhoneNumber, p_UserID, p_Website, p_CountryID, p_StateID, p_DistrictID, p_CityID, p_LocalBodyType, p_LocalBodyName, p_WardName, p_PostOffice, p_Pincode, v_organizationStatus, p_About, p_UserID, CURDATE(), p_UpdatedBy, CURDATE()
        );
        
        SET v_OrganizationID = LAST_INSERT_ID();
        INSERT INTO torganizationhistory (OrganizationID, ActionCodeID, ActionNote, CreatedDate, CreatedBy)
        VALUES (v_OrganizationID,v_status ,'Organization created.' , now(), p_UserID);
        
        
		IF NOT EXISTS(
		SELECT OrganizationMemberID FROM torganizationmember tom WHERE tom.MemberID IN (
		SELECT userID from trole tr INNER JOIN tuserrole tur ON tur.RoleID = tr.RoleID where IsAdmin = 1) AND tom.OrganizationID =  v_OrganizationID
        ) THEN
			INSERT INTO `torganizationmember` (OrganizationID, MemberID, isOrganizationInitiated, Notes, IsOwner, MembershipRequestDate, Status, CreatedBy, CreatedDate)
			SELECT v_OrganizationID,userID, 0, 'Created for super admin' , 0, now(), v_organizationMemberStatus, p_UserID, now() from trole tr 
			INNER JOIN tuserrole tur ON tur.RoleID = tr.RoleID where IsAdmin = 1;
		END IF;  
        
        INSERT INTO `torganizationrole` (OrganizationID, RoleName, IsAdmin, Heirarchy, Status, CreatedBy, CreatedDate)
		VALUES 
		(v_OrganizationID, 'Admin', 1, '1', v_activeStatus, p_UserID, NOW()),
        (v_OrganizationID, 'Member', 0, '3', v_activeStatus, p_UserID, NOW());
        
        IF(LAST_INSERT_ID()) THEN
			SELECT OrganizationRoleID INTO v_organizationrole FROM torganizationrole WHERE OrganizationID = v_OrganizationID AND IsAdmin = 1 AND RoleName = 'Admin';
        END IF;
        
        IF NOT EXISTS(SELECT OrganizationUserRoleID FROM torganizationuserrole tour WHERE tour.UserID IN (SELECT userID from trole tr INNER JOIN tuserrole tur ON tur.RoleID = tr.RoleID where IsAdmin = 1) AND tour.OrganizationRoleID =  v_organizationrole) THEN
                
            INSERT INTO `torganizationuserrole` (UserID, OrganizationRoleID, Status, Notes, CreatedBy, CreatedDate)
			SELECT userID, v_organizationrole, v_activeStatus, 'Created for super admin', p_UserID, now() from trole tr 
            INNER JOIN tuserrole tur ON tur.RoleID = tr.RoleID where IsAdmin = 1;
        END IF;    

    ELSE
        UPDATE torganization
        SET
            OrganizationName = p_OrganizationName,
OrganizationEmail = p_OrganizationEmail,
OrganizationTypeID = p_OrganizationTypeID,
PhoneNumber = p_PhoneNumber,
UserID = IFNULL(p_UserID, UserID),
Website = p_Website,
StateID = p_StateID,
DistrictID = p_DistrictID,
CityID = p_CityID,
RegistrationNumber = p_RegistrationNumber,
RegistrationValidFrom = p_RegistrationValidFrom,
RegistrationValidTo = p_RegistrationValidTo,
InchargeName = p_InchargeName,
InchargePhone = p_InchargePhone,
InchargeEmail = p_InchargeEmail,
CountryID = p_CountryID,
LocalBodyType = p_LocalBodyType,
LocalBodyName = p_LocalBodyName,
WardName = p_WardName,
PostOffice = p_PostOffice,
Pincode = p_Pincode,
            About = p_About,
UpdatedBy = IFNULL(p_UserID, UpdatedBy),
UpdatedDate = CURDATE()

        WHERE OrganizationID = p_OrganizationID;
        
        SELECT p_OrganizationID AS OrganizationID;
    END IF;
    SELECT v_OrganizationID AS OrganizationID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveOrganizationActivity` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveOrganizationActivity`(
    IN p_activityIds VARCHAR(255), -- CSV of activity IDs
    IN p_organizationId INT,
    IN p_userID INT
)
BEGIN
    DECLARE v_status INT;
    DECLARE v_delete_status INT;
    DECLARE v_activityId INT;
    DECLARE v_pos INT DEFAULT 0;
    DECLARE v_activity_csv VARCHAR(255);
	DECLARE v_existing_activityId INT;
	DECLARE v_existing_pos INT DEFAULT 0;
    DECLARE v_existing_activity_csv TEXT;
    DECLARE v_all_activities TEXT DEFAULT NULL;
    DECLARE v_organization_activity_id INT  DEFAULT NULL;
    
    -- Get the status value for 'Hold'
    SELECT ActionCodeID INTO v_status
    FROM tactioncode
    WHERE Description = 'Hold';
    
	-- Get the status value for 'Hold'
    SELECT ActionCodeID INTO v_delete_status
    FROM tactioncode
    WHERE Description = 'Delete';
    
    -- Set the CSV string to be processed
    SET v_activity_csv = p_activityIds;

    -- Loop through each activityId in the CSV string
    my_loop: LOOP
        -- Find the position of the next comma
        SET v_pos = LOCATE(',', v_activity_csv);

        -- If there is no comma, this is the last activityId
        IF v_pos = 0 THEN
            SET v_activityId = CAST(v_activity_csv AS UNSIGNED);
            SET v_activity_csv = ''; -- Clear remaining CSV string to exit loop
        ELSE
            SET v_activityId = CAST(SUBSTRING(v_activity_csv, 1, v_pos - 1) AS UNSIGNED);
            SET v_activity_csv = SUBSTRING(v_activity_csv, v_pos + 1); -- Move to the next part
        END IF;
        
        SELECT OrganizationActivityID INTO v_organization_activity_id FROM torganizationactivity 
				WHERE OrganizationID = p_organizationId AND ActivityID = v_activityId AND Status != v_delete_status;
        
		IF v_organization_activity_id IS NULL THEN
            -- Insert a new record if it doesn't already exist
            INSERT INTO torganizationactivity (OrganizationID, ActivityID, Status, CreatedBy, CreatedDate)
            VALUES (p_organizationId, v_activityId, v_status, p_userID, NOW());
                        
            IF v_all_activities IS NULL THEN 
            SET v_all_activities = LAST_INSERT_ID();
            ELSE
            SET v_all_activities = CONCAT(v_all_activities, ',', LAST_INSERT_ID());
            END IF;
            SET v_organization_activity_id = NULL;		
        ELSE 
        
        IF v_all_activities IS NULL THEN 
        SET v_all_activities = v_organization_activity_id;
        ELSE
        SET v_all_activities = CONCAT(v_all_activities, ',', v_organization_activity_id);
        END IF;
        SET v_organization_activity_id = NULL;
        END IF;
        
        IF v_activity_csv = '' THEN
            LEAVE my_loop;
        END IF;

    END LOOP;
    
    SELECT GROUP_CONCAT(OrganizationActivityID SEPARATOR ',') INTO v_existing_activity_csv
    FROM torganizationactivity
    WHERE OrganizationID = p_organizationId AND Status != v_delete_status;
    
    -- Optionally, return the final status or other relevant information
    IF v_existing_activity_csv IS NOT NULL THEN
        -- Loop through existing activity IDs
    my_existing_loop: LOOP
        SET v_existing_pos = LOCATE(',', v_existing_activity_csv);

        IF v_existing_pos = 0 THEN
            SET v_existing_activityId = CAST(v_existing_activity_csv AS UNSIGNED);
            SET v_existing_activity_csv = ''; -- Clear remaining CSV string to exit loop
        ELSE
            SET v_existing_activityId = CAST(SUBSTRING(v_existing_activity_csv, 1, v_existing_pos - 1) AS UNSIGNED);
            SET v_existing_activity_csv = SUBSTRING(v_existing_activity_csv, v_existing_pos + 1); -- Move to the next part
        END IF;
        
        
        -- Check if this existing ActivityID is in the provided p_activityIds
        IF NOT FIND_IN_SET(v_existing_activityId, v_all_activities) THEN

            -- If the ID is not found in p_activityIds, you can perform an update or take action
            
            -- Optionally, you can update the status to inactive or perform any other action
            -- Example:
			UPDATE torganizationactivity
            SET Status = v_delete_status, UpdatedBy = p_userID, UpdatedDate = NOW()
            WHERE OrganizationActivityID = v_existing_activityId LIMIT 1;
        END IF;

        -- Exit the loop if the remaining CSV string is empty
        IF v_existing_activity_csv = '' THEN
            LEAVE my_existing_loop;
        END IF;
    END LOOP;
    END IF;
    SELECT v_all_activities as OrganizationActivityID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveOrganizationAvatar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveOrganizationAvatar`(
    IN p_organizationID INT,
    IN p_uploads JSON,
    IN p_documentID INT
)
BEGIN
    DECLARE v_documentName VARCHAR(255);
    DECLARE v_documentUrl VARCHAR(500);
    DECLARE v_index INT DEFAULT 0;
    DECLARE v_totalFiles INT;
    DECLARE v_documentStatus INT;
    DECLARE v_documentTypeID INT;
    DECLARE v_existingDocCount INT;

    -- Fetch the status for 'Pending'
    SELECT LookupDetailID INTO v_documentStatus
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Pending' AND tlh.LookupTypeName = 'DocumentStatus';

    -- Fetch the document type for 'OrganizationAvatar'
    SELECT LookupDetailID INTO v_documentTypeID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Organization';

    -- Check if the JSON is valid
    IF JSON_VALID(p_uploads) THEN
        -- Get the total number of files in the JSON array
        SET v_totalFiles = JSON_LENGTH(p_uploads);

        -- If the p_documentID is NULL, insert new document records
        IF p_documentID IS NULL THEN

            -- Check for existing documents for the organization with DocumentTypeID
            SELECT COUNT(*) INTO v_existingDocCount
            FROM tdocument
            WHERE OwnerID = p_organizationID AND DocumentTypeID = v_documentTypeID;

            -- If existing document is found, delete it
            IF v_existingDocCount > 0 THEN
                DELETE FROM tdocument 
                WHERE OwnerID = p_organizationID AND DocumentTypeID = v_documentTypeID;
            END IF;

            WHILE v_index < v_totalFiles DO
                -- Extract the fileName and path from each object in the JSON array
                SET v_documentName = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].fileName')));
                SET v_documentUrl = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].path')));

                -- Insert into tdocument table for each file
                INSERT INTO tdocument (
                    DocumentTypeID, OwnerID, DocumentName, DocumentUrl, Status, Notes, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
                ) VALUES (
                    v_documentTypeID, p_organizationID, v_documentName, v_documentUrl, v_documentStatus, NULL, p_organizationID, NOW(), NULL, NULL
                );

                -- Move to the next file
                SET v_index = v_index + 1;
            END WHILE;

            -- Return the last inserted DocumentID
            SELECT LAST_INSERT_ID() AS DocumentID;

        ELSE
            -- If p_documentID is NOT NULL, update existing document records
            WHILE v_index < v_totalFiles DO
                -- Extract the fileName and path from each object in the JSON array
                SET v_documentName = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].fileName')));
                SET v_documentUrl = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].path')));

                -- Update the document details in tdocument
                UPDATE tdocument
                SET
                    DocumentName = v_documentName,
                    DocumentUrl = v_documentUrl,
                    Status = v_documentStatus,
                    UpdatedBy = p_organizationID,
                    UpdatedDate = NOW()
                WHERE DocumentID = p_documentID AND OwnerID = p_organizationID;

                -- Move to the next file
                SET v_index = v_index + 1;
            END WHILE;

            -- Return the updated DocumentID
            SELECT p_documentID AS DocumentID;

        END IF;

    ELSE
        -- Return an error message if the JSON is invalid
        SELECT 'Invalid JSON data' AS errMsg;
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveOrganizationDepartment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveOrganizationDepartment`(

    IN p_organizationID INT,
    IN p_departmentName VARCHAR(255),
    IN p_UserID INT,
    IN p_organizationDepartmentID INT
)
BEGIN
	DECLARE v_OrganizationDepartmentID INT;
    DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';

-- Check if p_organizationDepartmentID is null (for insert) or not (for update)
    IF p_organizationDepartmentID IS NULL THEN

            INSERT INTO torganizationdepartment (
            OrganizationID, DepartmentName,  Status, Notes, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
        ) VALUES (
			p_organizationID, p_departmentName, v_active, 'Organization department created', p_UserID, now(), null, null
        );
        
        SET v_OrganizationDepartmentID = LAST_INSERT_ID();
        
               -- Check if v_OrganizationDepartmentID already exists in the archive
        IF EXISTS (SELECT 1 FROM torganizationdepartmentarchive WHERE OrganizationDepartmentID = v_OrganizationDepartmentID) THEN
            -- If exists, update the record in torganizationdepartmentarchive
            UPDATE torganizationdepartmentarchive
            SET FromDate = NOW(),
                UpdatedBy = p_UserID,
                UpdatedDate = NOW()
            WHERE OrganizationDepartmentID = v_OrganizationDepartmentID;
        ELSE
            -- If not exists, insert a new record in torganizationdepartmentarchive
            INSERT INTO torganizationdepartmentarchive (
                OrganizationDepartmentID, FromDate, CreatedBy, CreatedDate
            ) VALUES (
                v_OrganizationDepartmentID, NOW(), p_UserID, NOW()
            );
        END IF;

    -- Return the OrganizationDepartmentID for reference
    SELECT v_OrganizationDepartmentID AS OrganizationDepartmentID;
    
   ELSE
        -- Update the existing organization department
        UPDATE torganizationdepartment
        SET 
            OrganizationID = p_organizationID,
            DepartmentName = p_departmentName,
            UpdatedBy = p_UserID,
            UpdatedDate = NOW()
        WHERE OrganizationDepartmentID = p_organizationDepartmentID;
        
        UPDATE torganizationdepartmentarchive
            SET FromDate = NOW(),
                UpdatedBy = p_UserID,
                UpdatedDate = NOW()
            WHERE OrganizationDepartmentID = p_organizationDepartmentID;

        -- Return the updated OrganizationDepartmentID for reference
        SELECT p_organizationDepartmentID AS OrganizationDepartmentID;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveOrganizationDepartmentMember` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveOrganizationDepartmentMember`(
    IN p_organizationDepartmentID INT,
    IN p_memberID INT,
    IN p_organizationDepartmentMemberID INT
)
BEGIN
    DECLARE v_OrganizationDepartmentMemberID INT;
    DECLARE v_status INT;

    -- If p_organizationDepartmentMemberID is NULL, execute the insert and archive logic
    IF p_organizationDepartmentMemberID IS NULL THEN

        -- Get the ActionCodeID for 'Active' status
        SELECT ActionCodeID INTO v_status
        FROM tactioncode 
        WHERE Description = 'Active'
        LIMIT 1;

        -- Insert new Organization Department Member
        INSERT INTO torganizationdepartmentmember (
            OrganizationDepartmentID, MemberID, Status, Notes, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
        ) VALUES (
            p_organizationDepartmentID, p_memberID, v_status, 'Organization department member Created', p_memberID, NOW(), NULL, NULL
        );

        -- Set the new OrganizationDepartmentMemberID
        SET v_OrganizationDepartmentMemberID = LAST_INSERT_ID();

        -- Check if OrganizationDepartmentMemberID exists in the archive
        IF EXISTS (SELECT 1 FROM torganizationdepartmentmemberarchive WHERE OrganizationDepartmentMemberID = v_OrganizationDepartmentMemberID) THEN
            -- If exists, update the archive record
            UPDATE torganizationdepartmentmemberarchive
            SET FromDate = NOW(),
                UpdatedBy = p_memberID,
                UpdatedDate = NOW()
            WHERE OrganizationDepartmentMemberID = v_OrganizationDepartmentMemberID;
        ELSE
            -- If not exists, insert a new archive record
            INSERT INTO torganizationdepartmentmemberarchive (
                OrganizationDepartmentMemberID, Status, Notes, FromDate, CreatedBy, CreatedDate
            ) VALUES (
                v_OrganizationDepartmentMemberID, v_status, 'OrganizationDepartmentMemberArchive Created', NOW(), p_memberID, NOW()
            );
        END IF;

        -- Return the OrganizationDepartmentMemberID for reference
        SELECT v_OrganizationDepartmentMemberID AS OrganizationDepartmentMemberID;

    ELSE
        -- If p_organizationDepartmentMemberID is NOT NULL
        UPDATE torganizationdepartmentmember
            SET OrganizationDepartmentID = p_organizationDepartmentID,
				MemberID = p_memberID,
                UpdatedBy = p_memberID,
                UpdatedDate = NOW()
            WHERE OrganizationDepartmentMemberID = p_organizationDepartmentMemberID;
        
        UPDATE torganizationdepartmentmemberarchive
            SET FromDate = NOW(),
                UpdatedBy = p_memberID,
                UpdatedDate = NOW()
            WHERE OrganizationDepartmentMemberID = p_organizationDepartmentMemberID;

    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveOrganizationDepartmentTeam` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveOrganizationDepartmentTeam`(
    IN p_organizationID INT,
    IN p_activityID INT,
    IN p_teamName VARCHAR(255),
    IN p_teamCategoryID INT,
    IN p_description VARCHAR(1000),
    IN p_userID INT,
    IN p_organizationDepartmentTeamID INT
)
BEGIN
    DECLARE v_organizationDepartmentTeamID INT;
    DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';

    -- Check if p_organizationDepartmentTeamID is null (for insert) or not (for update)
    IF p_organizationDepartmentTeamID IS NULL THEN

        INSERT INTO torganizationdepartmentteam (
            OrganizationID, ActivityID, TeamName, TeamCategoryID, Description, FromDate, ToDate, Status, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
        ) VALUES (
            p_organizationID, p_activityID, p_teamName, p_teamCategoryID, p_description, NOW(), NULL, v_active, p_userID, NOW(), NULL, NULL
        );
        
        SET v_organizationDepartmentTeamID = LAST_INSERT_ID();

        -- Return the new OrganizationDepartmentTeamID for reference
        SELECT v_organizationDepartmentTeamID AS OrganizationDepartmentTeamID;

    ELSE
        -- Update the existing organization department team
        UPDATE torganizationdepartmentteam
        SET 
            OrganizationID = p_organizationID,
            ActivityID = p_activityID,
            TeamName = p_teamName, 
            TeamCategoryID = p_teamCategoryID, 
            Description = p_description, 
            UpdatedBy = p_userID, 
            UpdatedDate = NOW()
        WHERE OrganizationDepartmentTeamID = p_organizationDepartmentTeamID;

        -- Return the updated OrganizationDepartmentTeamID for reference
        SELECT p_organizationDepartmentTeamID AS OrganizationDepartmentTeamID;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveOrganizationMember` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveOrganizationMember`(
    IN p_OrganizationID INT,
    IN p_MemberID INT,
    IN p_isOrganizationInitiated boolean,
    IN p_OrganizationMemberID INT 
)
BEGIN
	DECLARE v_OrganizationID INT;
	DECLARE v_organizationMemberStatus INT;
    DECLARE v_OrganizationMemberID INT;
    DECLARE v_organizationRoleID INT;
    
    
    SELECT LookupDetailID INTO v_organizationMemberStatus
		FROM tlookupdetail tld
        INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
		WHERE tld.LookupDetailName = 'Pending' AND tlh.LookupTypeName='OrganizationMemberStatus';
	    
    IF p_OrganizationMemberID IS NULL THEN
        INSERT INTO torganizationmember (
            OrganizationID, MemberID, isOrganizationInitiated, MembershipRequestDate, Status, CreatedBy, CreatedDate
        ) VALUES (
            p_OrganizationID, p_MemberID, p_isOrganizationInitiated, CURDATE(), v_organizationMemberStatus, p_MemberID, CURDATE()
        );
        
        SET v_OrganizationMemberID = LAST_INSERT_ID();
        
        SELECT OrganizationRoleID INTO v_organizationRoleID FROM torganizationrole WHERE OrganizationID = p_OrganizationID AND IsAdmin = 0 LIMIT 1;
        
        INSERT INTO `torganizationuserrole` (UserID, OrganizationRoleID, Status, CreatedBy, CreatedDate)
		VALUES (p_MemberID, v_organizationRoleID, '1', p_MemberID, now());
        
        SELECT v_OrganizationMemberID AS OrganizationMemberID;
        
    ELSE
        UPDATE torganizationmember
        SET
            OrganizationID = p_OrganizationID,
			MemberID = p_MemberID,
            isOrganizationInitiated = p_isOrganizationInitiated,
			UpdatedBy = p_MemberID,
			UpdatedDate = CURDATE()

        WHERE OrganizationmemberID = p_OrganizationMemberID;
        
        SELECT p_OrganizationMemberID AS OrganizationMemberID;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveOrganizationTeam` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveOrganizationTeam`(
    IN p_organizationID INT,
    IN p_activityID INT,
    IN p_teamName VARCHAR(255),
    IN p_teamCategoryID INT,
    IN p_description VARCHAR(1000),
    IN p_UserID INT,
    IN p_organizationTeamID INT
)
BEGIN
	DECLARE v_organizationTeamID INT;
    DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';

-- Check if p_organizationTeamID is null (for insert) or not (for update)
    IF p_organizationTeamID IS NULL THEN

            INSERT INTO torganizationteam (
            OrganizationID, ActivityID, TeamName, TeamCategoryID, Description, FromDate, ToDate, Status, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
        ) VALUES (
			p_organizationID, p_activityID, p_teamName, p_teamCategoryID, p_description, now(), null, v_active, p_UserID, now(), null, null
        );
        
        SET v_organizationTeamID = LAST_INSERT_ID();

    -- Return the OrganizationTeamID for reference
    SELECT v_organizationTeamID AS OrganizationTeamID;
    
   ELSE
        -- Update the existing organization Team
        UPDATE torganizationteam
        SET 
            OrganizationID = p_organizationID,
            ActivityID = p_activityID,
            TeamName = p_teamName, 
            TeamCategoryID = p_teamCategoryID, 
            Description = p_description, 
            UpdatedBy = p_UserID, 
            UpdatedDate = now()
        WHERE OrganizationTeamID = p_organizationTeamID;

        -- Return the updated OrganizationTeamID for reference
        SELECT p_organizationTeamID AS OrganizationTeamID;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveOrganizationTeamDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveOrganizationTeamDetail`(
   IN p_organizationTeamID INT,
    IN p_userID INT,
    IN p_activityDetailID INT,
    IN p_organizationTeamDetailID INT
)
BEGIN
	DECLARE v_organizationTeamDetailID INT;
    DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';

-- Check if p_organizationTeamDetailID is null (for insert) or not (for update)
    IF p_organizationTeamDetailID IS NULL THEN

            INSERT INTO torganizationteamdetail (
            OrganizationTeamID, UserID, ActivityDetailID, FromDate, ToDate, Status, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
        ) VALUES (
			p_organizationTeamID, p_userID, p_activityDetailID,now(), null, v_active, p_UserID, now(), null, null
        );
        
        SET v_organizationTeamDetailID = LAST_INSERT_ID();

    -- Return the OrganizationTeamDetailID for reference
    SELECT v_organizationTeamDetailID AS OrganizationTeamDetailID;
    
   ELSE
        -- Update the existing OrganizationTeamDetail
        UPDATE torganizationteamdetail
        SET 
            OrganizationTeamID = p_organizationTeamID,
            UserID = p_userID,
            ActivityDetailID = p_activityDetailID, 
            UpdatedBy = p_UserID, 
            UpdatedDate = now()
        WHERE OrganizationTeamDetailID = p_organizationTeamDetailID;

        -- Return the updated OrganizationTeamID for reference
        SELECT p_organizationTeamDetailID AS OrganizationTeamDetailID;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveUser`(
    IN p_FirstName VARCHAR(255),
    IN p_LastName VARCHAR(255),
    IN p_PhoneNumber VARCHAR(20),
    IN p_Email VARCHAR(100),
    IN p_Password VARCHAR(255),
    IN p_PasswordKey VARCHAR(255),
    IN p_SFID VARCHAR(255),
    IN p_CreatedDate DATE
)
BEGIN
DECLARE v_status INT;
    DECLARE v_userBasicDetailStatus INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A database error occurred during the operation. Rolling back the transaction.';
    END;

    
    START TRANSACTION;
    

SELECT LookupDetailID INTO v_status
FROM tlookupdetail tld
        INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
WHERE tld.LookupDetailName = 'PendingApproval' AND tlh.LookupTypeName='UserStatus';
        
        SELECT ActionCodeID INTO v_userBasicDetailStatus
FROM tactioncode
WHERE Description = 'Hold';
        
    
    INSERT INTO tuser (
        FirstName, LastName, PhoneNumber, Email, Password, PasswordKey, SFID, Status, CreatedDate
    ) VALUES (
        p_FirstName, p_LastName, p_PhoneNumber, p_Email, p_Password, p_PasswordKey, p_SFID, v_status, p_CreatedDate
    );

    
    SET @lastUserID = LAST_INSERT_ID();
    
    INSERT INTO tuserbasicdetail (FirstName, LastName, EmailID, PhoneNumber, UserID, Status, CreatedBy, CreatedDate)
    VALUES (p_FirstName, p_LastName, p_Email, p_PhoneNumber, @lastUserID, v_userBasicDetailStatus, @lastUserID, NOW());

    
    INSERT INTO tuserhistory (UserID, ActionCodeID, ActionNote, CreatedDate, CreatedBy)
    VALUES (@lastUserID, 1, 'User created.', NOW(), @lastUserID);

    
    INSERT INTO tuserrole (UserID, RoleID, CreatedBy, CreatedDate)
    VALUES (@lastUserID, 2, 'main', NOW());

    
    UPDATE tuser
    SET CreatedBy = @lastUserID
    WHERE UserID = @lastUserID;

    
    COMMIT;

    
    SELECT @lastUserID AS UserID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveUserAvatar` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveUserAvatar`(
    IN p_userID INT,
    IN p_uploads JSON,
    IN p_documentID INT
)
BEGIN
    DECLARE v_documentName VARCHAR(255);
    DECLARE v_documentUrl VARCHAR(500);
    DECLARE v_index INT DEFAULT 0;
    DECLARE v_totalFiles INT;
    DECLARE v_documentStatus INT;
    DECLARE v_documentTypeID INT;
    DECLARE v_existingDocCount INT;

    
    SELECT LookupDetailID INTO v_documentStatus
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Pending' AND tlh.LookupTypeName = 'DocumentStatus';

    
    SELECT LookupDetailID INTO v_documentTypeID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'User' ;

    
    IF JSON_VALID(p_uploads) THEN
        
        SET v_totalFiles = JSON_LENGTH(p_uploads);

        
        IF p_documentID IS NULL THEN
        
        
            SELECT COUNT(*) INTO v_existingDocCount
            FROM tdocument
            WHERE OwnerID = p_userID AND DocumentTypeID = v_documentTypeID;

            
            IF v_existingDocCount > 0 THEN
                DELETE FROM tdocument 
                WHERE OwnerID = p_userID AND DocumentTypeID = v_documentTypeID;
            END IF;
            
            WHILE v_index < v_totalFiles DO
                
                SET v_documentName = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].fileName')));
                SET v_documentUrl = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].path')));

                
                INSERT INTO tdocument (
                    DocumentTypeID, OwnerID, DocumentName, DocumentUrl, Status, Notes, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
                ) VALUES (
                    v_documentTypeID, p_userID, v_documentName, v_documentUrl, v_documentStatus, NULL, p_userID, NOW(), NULL, NULL
                );

                
                SET v_index = v_index + 1;
            END WHILE;

            
            SELECT LAST_INSERT_ID() AS DocumentID;


        ELSE
            
            WHILE v_index < v_totalFiles DO
                
                SET v_documentName = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].fileName')));
                SET v_documentUrl = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].path')));

                
                UPDATE tdocument
                SET
                    DocumentName = v_documentName,
                    DocumentUrl = v_documentUrl,
                    Status = v_documentStatus,
                    UpdatedBy = p_userID,
                    UpdatedDate = NOW()
                WHERE DocumentID = p_documentID AND OwnerID = p_userID;

                
                SET v_index = v_index + 1;
            END WHILE;

            
            SELECT p_documentID AS DocumentID;

        END IF;

    ELSE
        
        SELECT 'Invalid JSON data' AS errMsg;
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveUserContactDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveUserContactDetail`(
    IN p_userID VARCHAR(255),
    IN p_addressType VARCHAR(255),
    IN p_country VARCHAR(255),
    IN p_state VARCHAR(255),
    IN p_district VARCHAR(255),
    IN p_city VARCHAR(255),
    IN p_houseName VARCHAR(255),
    IN p_streetName VARCHAR(255),
    IN p_place VARCHAR(255),
    IN p_localBodyType VARCHAR(255),
    IN p_localBodyName VARCHAR(255),
    IN p_wardName VARCHAR(255),
    IN p_postOffice VARCHAR(255),
    IN p_pinCode VARCHAR(20),
    IN p_communicationDetails JSON,
    IN p_sameAsBasicDetail TINYINT,
    IN p_userContactDetailID INT
)
BEGIN
    
    DECLARE v_userContactDetailID INT;
    DECLARE v_existingUserIDCount INT;
    DECLARE v_existingEmailCount INT;
DECLARE v_status INT;

    
    SET p_userID = NULLIF(p_userID, 'undefined');
    SET p_addressType = NULLIF(p_addressType, 'undefined');
    SET p_country = NULLIF(p_country, 'undefined');
    SET p_state = NULLIF(p_state, 'undefined');
    SET p_district = NULLIF(p_district, 'undefined');
    SET p_city = NULLIF(p_city, 'undefined');
    SET p_houseName = NULLIF(p_houseName, 'undefined');
    SET p_streetName = NULLIF(p_streetName, 'undefined');
    SET p_place = NULLIF(p_place, 'undefined');
    SET p_localBodyType = NULLIF(p_localBodyType, 'undefined');
    SET p_localBodyName = NULLIF(p_localBodyName, 'undefined');
    SET p_wardName = NULLIF(p_wardName, 'undefined');
    SET p_postOffice = NULLIF(p_postOffice, 'undefined');
    SET p_pinCode = NULLIF(p_pinCode, 'undefined');

SELECT ActionCodeID INTO v_status
FROM tactioncode
WHERE Description = 'Hold';

        IF p_userContactDetailID IS NULL THEN
            
            INSERT INTO tusercontactdetail (
                UserID, AddressType, CountryID, StateID, DistrictID, CityID, HouseName, StreetName, Place,
                LocalBodyType, LocalBodyName, WardID, PostOffice, PinCode, CommunicationDetails, SameAsBasicDetail, Status, CreatedBy, CreatedDate
            )
            VALUES (
                p_userID,
                p_addressType,
                p_country,
                p_state,
                p_district,
                p_city,
                p_houseName,
                p_streetName,
                p_place,
                p_localBodyType,
                p_localBodyName,
                p_wardName,
                p_postOffice,
                p_pinCode,
                p_communicationDetails,
                p_sameAsBasicDetail,
                v_status,
                p_userID,
                NOW()
            );

            SET v_userContactDetailID = LAST_INSERT_ID();
        ELSE
            
            SET v_userContactDetailID = p_userContactDetailID;

            UPDATE tusercontactdetail
SET
AddressType = IF(p_addressType IS NOT NULL AND p_addressType != '', p_addressType, AddressType),
CountryID = IF(p_country IS NOT NULL AND p_country != '', p_country, CountryID),
StateID = IF(p_state IS NOT NULL AND p_state != '', p_state, StateID),
DistrictID = IF(p_district IS NOT NULL AND p_district != '', p_district, DistrictID),
CityID = IF(p_city IS NOT NULL AND p_city != '', p_city, CityID),
HouseName = IF(p_houseName IS NOT NULL AND p_houseName != '', p_houseName, HouseName),
StreetName = IF(p_streetName IS NOT NULL AND p_streetName != '', p_streetName, StreetName),
Place = IF(p_place IS NOT NULL AND p_place != '', p_place, Place),
LocalBodyType = IF(p_localBodyType IS NOT NULL AND p_localBodyType != '', p_localBodyType, LocalBodyType),
LocalBodyName = IF(p_localBodyName IS NOT NULL AND p_localBodyName != '', p_localBodyName, LocalBodyName),
WardID = IF(p_wardName IS NOT NULL AND p_wardName != '', p_wardName, WardID),
PostOffice = IF(p_postOffice IS NOT NULL AND p_postOffice != '', p_postOffice, PostOffice),
PinCode = IF(p_pinCode IS NOT NULL AND p_pinCode != '', p_pinCode, PinCode),
CommunicationDetails = IF(p_communicationDetails IS NOT NULL AND p_communicationDetails != '', p_communicationDetails, CommunicationDetails),
SameAsBasicDetail = p_sameAsBasicDetail,
                    UpdatedBy = p_userID,
UpdatedDate = NOW()
WHERE
UserContactDetailID = v_userContactDetailID;

        END IF;

        SET p_userContactDetailID = v_userContactDetailID;

    
    SELECT p_userContactDetailID AS UserContactDetailID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSaveUserQualificationDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSaveUserQualificationDetail`(
    IN p_qualificationTypeID INT ,
    IN p_userID VARCHAR(100),
    IN p_enrollmentNumber VARCHAR(100),
    IN p_organizationID INT ,
    IN p_notes VARCHAR(1000),
    IN p_uploads JSON,
    IN removedFiles JSON,
    IN p_certificateNumber VARCHAR(255),
    IN p_certificateDate DATE,
    IN p_countryID INT,
    IN p_stateID INT,
    IN p_districtID INT,
    IN p_localBodyType INT,
IN p_localBodyName INT,
    IN p_userQualificationDetailID INT
)
BEGIN
DECLARE v_userQualificationDetailID INT;
    DECLARE v_documentName VARCHAR(255);
    DECLARE v_documentUrl VARCHAR(500);
    DECLARE v_index INT DEFAULT 0;
    DECLARE v_totalFiles INT;
    DECLARE v_removedFileID INT;
    DECLARE v_totalRemovedFiles INT;
    DECLARE v_documentStatus INT;
    DECLARE v_documentTypeID INT;
    DECLARE v_status INT;


SELECT LookupDetailID INTO v_documentStatus
FROM tlookupdetail tld
        INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
WHERE tld.LookupDetailName = 'Pending' AND tlh.LookupTypeName='DocumentStatus';


SELECT LookupDetailID INTO v_documentTypeID
FROM tlookupdetail
WHERE LookupDetailName = 'UserQualification';

SELECT ActionCodeID INTO v_status
FROM tactioncode
WHERE Description = 'Hold';
    
    
    IF JSON_VALID(p_uploads) THEN
        
        SET v_totalFiles = JSON_LENGTH(p_uploads);

        IF p_userQualificationDetailID IS NULL THEN
            
            INSERT INTO tuserqualificationdetail (
                QualificationTypeID, UserID, EnrollmentNumber, OrganizationID, Notes, CertificateNumber, CertificateDate, CountryID, StateID, DistrictID, LocalBodyType, LocalBodyName, Status, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
            ) VALUES (
                p_qualificationTypeID, p_userID, p_enrollmentNumber, p_organizationID, p_notes, p_certificateNumber, p_certificateDate, p_countryID, p_stateID, p_districtID, p_localBodyType, p_localBodyName, v_status ,p_userID , CURDATE(), NULL, NULL
            );

            SET v_userQualificationDetailID = LAST_INSERT_ID();

            
            WHILE v_index < v_totalFiles DO
                
                SET v_documentName = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].fileName')));
                SET v_documentUrl = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].path')));

                
                INSERT INTO tdocument (
                    DocumentTypeID, OwnerID, DocumentName, DocumentUrl, Status, Notes, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
                ) VALUES (
                    v_documentTypeID, v_userQualificationDetailID, v_documentName, v_documentUrl, v_documentStatus, NULL, p_userID, NOW(), NULL, NULL
                );

                
                SET v_index = v_index + 1;
            END WHILE;

            SELECT v_userQualificationDetailID AS UserQualificationDetailID;
        ELSE
            
            UPDATE tuserqualificationdetail
            SET
                QualificationTypeID = IFNULL(p_qualificationTypeID, QualificationTypeID),
                UserID = IFNULL(p_userID, UserID),
                EnrollmentNumber = IFNULL(p_enrollmentNumber, EnrollmentNumber),
                OrganizationID = IFNULL(p_organizationID, OrganizationID),
                Notes = IFNULL(p_notes, Notes),
                CertificateNumber = IFNULL(p_certificateNumber, CertificateNumber),
                CertificateDate = IFNULL(p_certificateDate, CertificateDate),
                LocalBodyType = IFNULL(p_localBodyType, LocalBodyType),
                LocalBodyName = IFNULL(p_localBodyName, LocalBodyName),
                CountryID = IFNULL(p_countryID, CountryID),
                StateID = IFNULL(p_stateID, StateID),
                DistrictID = IFNULL(p_districtID, DistrictID),
                UpdatedBy = IFNULL(p_userID, UpdatedBy),
                UpdatedDate = CURDATE()
            WHERE UserQualificationDetailID = p_userQualificationDetailID;

            
            IF JSON_VALID(removedFiles) THEN
                
                SET v_totalRemovedFiles = JSON_LENGTH(removedFiles);
                
                
                WHILE v_index < v_totalRemovedFiles DO
                    
                    SET v_removedFileID = JSON_UNQUOTE(JSON_EXTRACT(removedFiles, CONCAT('$[', v_index, ']')));
                    
                    
                    DELETE FROM tdocument
                    WHERE DocumentID = v_removedFileID;
                    
                    
                    SET v_index = v_index + 1;
                END WHILE;
            END IF;

            
            SET v_index = 0; 
            WHILE v_index < v_totalFiles DO
                
                SET v_documentName = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].fileName')));
                SET v_documentUrl = JSON_UNQUOTE(JSON_EXTRACT(p_uploads, CONCAT('$[', v_index, '].path')));

                
                INSERT INTO tdocument (
                    DocumentTypeID, OwnerID, DocumentName, DocumentUrl, Status, Notes, CreatedBy, CreatedDate, UpdatedBy, UpdatedDate
                ) VALUES (
                    v_documentTypeID, p_userQualificationDetailID, v_documentName, v_documentUrl, v_documentStatus, NULL, p_userID, NOW(), NULL, NULL
                );

                
                SET v_index = v_index + 1;
            END WHILE;

            SELECT p_userQualificationDetailID AS UserQualificationDetailID;
        END IF;
    ELSE
        
        SELECT 'Invalid JSON data' AS errMsg;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchActivity` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchActivity`(
    IN p_activityID VARCHAR(255),
    IN p_activityName VARCHAR(255),
    IN p_activityDescription VARCHAR(255),
    IN p_parentID VARCHAR(255),
    IN p_page INT,
    IN p_pageSize INT
)
BEGIN
    DECLARE v_offset INT;
    DECLARE v_totalCount INT;
    DECLARE v_conditions TEXT DEFAULT '';
    
    -- Build conditions dynamically
    IF p_activityID IS NOT NULL AND p_activityID <> '' THEN
        SET v_conditions = CONCAT(v_conditions, 'ActivityID LIKE "', p_activityID, '"'); -- Use = instead of LIKE
    END IF;

    IF p_activityName IS NOT NULL AND p_activityName <> '' THEN
        IF v_conditions <> '' THEN
            SET v_conditions = CONCAT(v_conditions, ' AND ');
        END IF;
        SET v_conditions = CONCAT(v_conditions, 'ActivityName LIKE "', p_activityName, '%"');
    END IF;

    IF p_activityDescription IS NOT NULL AND p_activityDescription <> '' THEN
        IF v_conditions <> '' THEN
            SET v_conditions = CONCAT(v_conditions, ' AND ');
        END IF;
        SET v_conditions = CONCAT(v_conditions, 'ActivityDescription LIKE "', p_activityDescription, '%"');
    END IF;

    -- Handle p_parentID condition
    IF p_parentID IS NOT NULL AND p_parentID <> '' THEN
        IF v_conditions <> '' THEN
            SET v_conditions = CONCAT(v_conditions, ' AND ');
        END IF;
        SET v_conditions = CONCAT(v_conditions, 'ParentID = "', p_parentID, '"'); -- Use = instead of LIKE
    ELSE
        -- If p_parentID is NULL, only select records where ParentID is NULL
        IF v_conditions <> '' THEN
            SET v_conditions = CONCAT(v_conditions, ' AND ');
        END IF;
        SET v_conditions = CONCAT(v_conditions, 'ParentID IS NULL');
    END IF;

    -- Get the total count of records
    SET @sqlTotalCount = 'SELECT COUNT(*) INTO @v_totalCount FROM tactivity';
    IF v_conditions <> '' THEN
        SET @sqlTotalCount = CONCAT(@sqlTotalCount, ' WHERE ', v_conditions);
    END IF;
    PREPARE stmt FROM @sqlTotalCount;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Prepare the main query with dynamic conditions and pagination
    SET @sql = 'SELECT ActivityID AS activityID, ActivityName AS name, ActivityDescription AS activityDescription, 
    ParentID AS parentID, 
    (SELECT COUNT(ActivityID) > 0 FROM tactivity AS child WHERE child.ParentID = tactivity.ActivityID ) AS hasChild,
    @v_totalCount AS total_count FROM tactivity';
    
    IF v_conditions <> '' THEN
        SET @sql = CONCAT(@sql, ' WHERE ', v_conditions);
    END IF;

    -- Pagination logic
    IF p_page IS NOT NULL AND p_pageSize IS NOT NULL THEN
        SET v_offset = (p_page - 1) * p_pageSize;
        SET @sql = CONCAT(@sql, ' LIMIT ', p_pageSize, ' OFFSET ', v_offset);
    END IF;

    -- Print the resulting SQL query for debugging
    -- SELECT @sql AS resulting_query;  -- This line outputs the resulting SQL query
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchActivityDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchActivityDetail`(
    IN p_hasConditions TEXT,
    IN p_hasLimitation TEXT
)
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_deleteId
    FROM tactioncode
    WHERE Description = 'Delete';

    -- Construct the condition for v_delete
    IF p_hasConditions IS NOT NULL THEN
        SET v_conditions = CONCAT('tad.Status != ', v_deleteId, ' AND ', p_hasConditions);
    ELSE
        SET v_conditions = CONCAT('tad.Status != ', v_deleteId);
    END IF;

    IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ', p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;

    -- Prepare the dynamic SQL query
    SET @v_conditions = v_conditions; 
    SET @v_limitation = v_limitation;

    -- Modify query to aggregate representingDistricts into JSON format
    SET @sql = CONCAT(
        'SELECT
			    tad.ActivityDetailID AS activityDetailID,
				tad.Name AS name,
				tad.Description AS description,
				tad.Status AS status,
				ta.ActivityName AS activityName,
              (SELECT COUNT(*)
                FROM tactivitydetail tad	
				INNER JOIN tactivity ta ON ta.ActivityID = tad.ActivityID
			   WHERE ', @v_conditions, ') AS total_count
		FROM tactivitydetail tad
		INNER JOIN tactivity ta ON ta.ActivityID = tad.ActivityID
		WHERE ', @v_conditions, @v_limitation);

    -- Prepare and execute the dynamic SQL
    -- SELECT @sql AS final_query;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchBasicUserDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchBasicUserDetail`(
    IN p_hasConditions TEXT,
    IN p_hasLimitation TEXT
)
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;
	DECLARE v_docTypeUser INT;

        SELECT LookupDetailID INTO v_docTypeUser
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'User' AND tlh.LookupTypeName = 'OwnerType'
    LIMIT 1;
    
    SELECT ActionCodeID INTO v_deleteId
    FROM tactioncode
    WHERE Description = 'Delete';

    
    IF p_hasConditions IS NOT NULL THEN
        SET v_conditions = CONCAT('u.Status != ', v_deleteId, ' AND ', p_hasConditions);
    ELSE
        SET v_conditions = CONCAT('u.Status != ', v_deleteId);
    END IF;

    IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ', p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;

    
    SET @v_conditions = v_conditions; 
    SET @v_limitation = v_limitation;

    
    SET @sql = CONCAT(
        'SELECT 
            u.UserID as userID,
            u.UserBasicDetailID as userBasicDetailID,
            unescape_html(u.FirstName) as firstName,
            unescape_html(u.MiddleName) as middleName, 
            unescape_html(u.LastName) as lastName,
            unescape_html(u.NickName) as nickName, 
            u.EmailID as emailID,
            u.PhoneNumber as phoneNumber,
            u.AlternativePhoneNumber as alternativePhoneNumber,
            u.DateOfBirth as dateOfBirth,
			unescape_html(u.Bio) as bio,
            b.LookupDetailName as bloodGroup,
            u.BloodGroup as bloodGroupId,
            c.RegionName as country,
            c.RegionID as countryID,
            s.RegionName as state,
            s.RegionID as stateID,
            d.RegionName as district,
            d.RegionID as districtID,
            unescape_html(u.HouseName) as houseName,
            unescape_html(u.StreetName) as streetName,
            unescape_html(u.PinCode) as pinCode,
            unescape_html(u.Place) as place,
            w.RegionName as wardName,
            w.RegionId as wardId,
            p.RegionName as postOffice,
            p.RegionId as postOfficeId,
            lbt.RegionTypeID as localBodyTypeId,
            lbt.RegionTypeName as localBodyType,
            lbn.RegionId as localBodyNameId,
            lbn.RegionName as localBodyName,
            g.LookupDetailName as gender,
            u.Gender as genderId,
            unescape_html(u.City) as city,

            (SELECT JSON_ARRAYAGG(JSON_OBJECT(''id'', t.RegionID, ''name'', t.RegionName))
             FROM tregion t
             WHERE JSON_CONTAINS(u.RepresentingDistrictID, JSON_QUOTE(t.RegionName))
             AND t.RegionTypeID = 3
            ) as representingDistricts,
            
      COALESCE(
        (SELECT JSON_OBJECT(
            "documentID", td.DocumentID,
            "path", td.DocumentUrl,
            "fileName", td.DocumentName
          )
          FROM tdocument td
          JOIN tlookupdetail tl ON td.DocumentTypeID = ',v_docTypeUser,' 
          WHERE td.OwnerID = u.UserID
          LIMIT 1
        ), NULL
      ) AS avatar,

            (SELECT COUNT(*)
             FROM tuserbasicdetail u
             LEFT JOIN tlookupdetail b ON u.BloodGroup = b.LookupDetailID
             LEFT JOIN tregion c ON u.CountryID = c.RegionID
             LEFT JOIN tregion s ON u.StateID = s.RegionID
             LEFT JOIN tregion d ON u.DistrictID = d.RegionID
             LEFT JOIN tregion w ON u.WardID = w.RegionID
             LEFT JOIN tregion p ON u.PostOffice = p.RegionID
             LEFT JOIN tregiontype lbt ON u.LocalBodyType = lbt.RegionTypeID
             LEFT JOIN tregion lbn ON u.LocalBodyName = lbn.RegionID
             LEFT JOIN tlookupdetail g ON u.Gender = g.LookupDetailID
             WHERE ', @v_conditions, ') AS total_count
         FROM tuserbasicdetail u
         LEFT JOIN tlookupdetail b ON u.BloodGroup = b.LookupDetailID
         LEFT JOIN tregion c ON u.CountryID = c.RegionID
         LEFT JOIN tregion s ON u.StateID = s.RegionID
         LEFT JOIN tregion d ON u.DistrictID = d.RegionID
         LEFT JOIN tregion w ON u.WardID = w.RegionID
         LEFT JOIN tregion p ON u.PostOffice = p.RegionID
         LEFT JOIN tregiontype lbt ON u.LocalBodyType = lbt.RegionTypeID
         LEFT JOIN tregion lbn ON u.LocalBodyName = lbn.RegionID
         LEFT JOIN tlookupdetail g ON u.Gender = g.LookupDetailID
         WHERE ', @v_conditions, @v_limitation);

    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `csearchMemberForOrganizationMember` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `csearchMemberForOrganizationMember`(
    IN p_hasConditions TEXT,
	IN p_organizationID INT,
    IN p_hasLimitation TEXT
)
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;
    DECLARE v_orgMemberStatus TEXT;
    
    SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_deleteId
    FROM tactioncode
    WHERE Description = 'Delete';
    
    SELECT CONCAT('( tom.Status = ', GROUP_CONCAT(tld.LookupDetailID SEPARATOR ' OR tom.Status = '),')') INTO v_orgMemberStatus
		FROM tlookupdetail tld
		INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
		WHERE (tld.LookupDetailName = 'Active'  OR tld.LookupDetailName = 'Hold'  OR tld.LookupDetailName = 'Pending')
		AND tlh.LookupTypeName = 'OrganizationMemberStatus';
    
    

    -- Construct the condition for v_delete
    IF p_hasConditions IS NOT NULL THEN
        SET v_conditions = CONCAT('userId NOT IN (SELECT MemberID FROM torganizationmember  tom WHERE OrganizationID = ', p_organizationID ,' AND ', v_orgMemberStatus ,') AND tub.Status != ', v_deleteId, ' AND ', p_hasConditions);
    ELSE
        SET v_conditions = CONCAT('userId NOT IN (SELECT MemberID FROM torganizationmember tom WHERE OrganizationID = ', p_organizationID ,' AND ', v_orgMemberStatus ,') AND tub.Status != ', v_deleteId);
    END IF;

    IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ', p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;

    -- Prepare the dynamic SQL query
    SET @v_conditions = v_conditions; 
    SET @v_limitation = v_limitation;

    -- Modify query to aggregate representingDistricts into JSON format
    SET @sql = CONCAT(
        'SELECT 
         tub.UserID,
         tub.firstName,
         tub.lastName,
         tub.EmailID,
         tub.PhoneNumber,
		 tub.DateOfBirth,
		 c.RegionName as country,
		 c.RegionID as countryID,
		 s.RegionName as state,
		 s.RegionID as stateID,
         d.RegionName as district,
		 d.RegionID as districtID,
		 lbt.RegionTypeID as localBodyTypeId,
		 lbt.RegionTypeName as localBodyType,
		 lbn.RegionId as localBodyNameId,
		 lbn.RegionName as localBodyName, 
        
        (SELECT COUNT(DISTINCT tub.UserId)
             FROM tuserbasicdetail tub
			 LEFT JOIN tregion c ON tub.CountryID = c.RegionID
			 LEFT JOIN tregion s ON tub.StateID = s.RegionID
             LEFT JOIN tregion d ON tub.DistrictID = d.RegionID
			 LEFT JOIN tregion w ON tub.WardID = w.RegionID
             LEFT JOIN tregion p ON tub.PostOffice = p.RegionID
             LEFT JOIN tregiontype lbt ON tub.LocalBodyType = lbt.RegionTypeID
             LEFT JOIN tregion lbn ON tub.LocalBodyName = lbn.RegionID
             WHERE ', @v_conditions, ') AS total_count
		 FROM tuserbasicdetail tub
		 LEFT JOIN tregion c ON tub.CountryID = c.RegionID
		 LEFT JOIN tregion s ON tub.StateID = s.RegionID
         LEFT JOIN tregion d ON tub.DistrictID = d.RegionID
		 LEFT JOIN tregion w ON tub.WardID = w.RegionID
		 LEFT JOIN tregion p ON tub.PostOffice = p.RegionID
		 LEFT JOIN tregiontype lbt ON tub.LocalBodyType = lbt.RegionTypeID
		 LEFT JOIN tregion lbn ON tub.LocalBodyName = lbn.RegionID

		 WHERE ', @v_conditions,' GROUP BY tub.UserId', @v_limitation );
	-- SELECT @sql as query;
    -- Prepare and execute the dynamic SQL
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    SELECT @sql as query;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchNotification` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchNotification`(
IN p_hasConditions TEXT, 
IN p_hasLimitation TEXT, 
IN p_statusType varchar(10),
IN p_OrganizationID INT,
IN p_UserID INT 
)
BEGIN
    
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_fetchStatusId INT;
    DECLARE v_org_member_status INT default 45;
    DECLARE v_join_condition TEXT default '';
    DECLARE v_documentTypeID INT;
    DECLARE v_rejectedID INT;
    DECLARE v_closedID INT;
    DECLARE v_activeID INT;
    DECLARE v_inboxCount INT;

    		-- Fetch the document type for 'Notification'
		SELECT LookupDetailID INTO v_documentTypeID
		FROM tlookupdetail
		WHERE LookupDetailName = 'Notification';
        
		-- Fetch the status for 'Rejected' for the `Notification` table
        	SELECT LookupDetailID INTO v_rejectedID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Rejected' AND tlh.LookupTypeName = 'NotificationStatus'
    LIMIT 1;
    -- Fetch the status for 'Closed' for the `Notification` table
			SELECT LookupDetailID INTO v_closedID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Closed' AND tlh.LookupTypeName = 'NotificationStatus'
    LIMIT 1;
        SELECT LookupDetailID INTO v_activeID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Active' AND tlh.LookupTypeName = 'NotificationStatus'
    LIMIT 1;
        
	SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

	IF p_StatusType IS NOT NULL AND ( p_StatusType = 'I' || p_StatusType ='A')  THEN
		-- Get the ActionCodeID for 'Delete'
		SELECT LookupDetailID INTO v_fetchStatusId
		FROM tlookupdetail tld
		INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
		WHERE tld.LookupDetailName = 'OnHold' AND tlh.LookupTypeName='NotificationStatus';
    ELSE
		-- Get the ActionCodeID for 'Delete'
		SELECT LookupDetailID INTO v_fetchStatusId
		FROM tlookupdetail tld
		INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
		WHERE tld.LookupDetailName = 'Active' AND tlh.LookupTypeName='NotificationStatus';
    END IF;

    
    -- Construct the condition for v_delete
    IF p_StatusType IS NOT NULL AND p_StatusType = 'I' THEN
		IF p_hasConditions IS NOT NULL THEN
			SET v_conditions = CONCAT('tn.Status = ',v_activeID,' AND tom.MemberID =', p_UserID,' AND', p_hasConditions);
            SET v_join_condition = CONCAT(
            'INNER JOIN torganization tog ON tn.OrganizationID = tog.OrganizationID
             INNER JOIN tvenuenotification tvn ON tn.NotificationID = tvn.NotificationID 
             LEFT JOIN tregion s ON tvn.State = s.RegionID
             LEFT JOIN tregion d ON tvn.District = d.RegionID
             LEFT JOIN tregion ogd ON tog.DistrictID = ogd.RegionID
             LEFT JOIN tlookupdetail tld ON tld.LookupDetailID = tn.Status
             INNER JOIN tuser tu ON tu.UserID = tn.NotificationCreated
             INNER JOIN tnotificationheader tnh ON tn.NotificationID = tnh.NotificationID
             INNER JOIN torganizationmember tom ON tom.OrganizationID = tnh.OrganizationID');
		ELSE
			SET v_conditions = CONCAT('tn.Status = ',v_activeID,' AND tom.MemberID =', p_UserID);
			SET v_join_condition = CONCAT(
            'INNER JOIN torganization tog ON tn.OrganizationID = tog.OrganizationID
             INNER JOIN tvenuenotification tvn ON tn.NotificationID = tvn.NotificationID
             LEFT JOIN tregion s ON tvn.State = s.RegionID
             LEFT JOIN tregion d ON tvn.District = d.RegionID
             LEFT JOIN tregion ogd ON tog.DistrictID = ogd.RegionID
             LEFT JOIN tlookupdetail tld ON tld.LookupDetailID = tn.Status
             INNER JOIN tuser tu ON tu.UserID = tn.NotificationCreated
             INNER JOIN tnotificationheader tnh ON tn.NotificationID = tnh.NotificationID
             INNER JOIN torganizationmember tom ON tom.OrganizationID = tn.OrganizationID

             ');

		END IF;
	ELSEIF p_StatusType IS NOT NULL AND p_StatusType = 'S' THEN
			IF p_hasConditions IS NOT NULL THEN
			SET v_conditions = CONCAT(' tn.Status != 61  AND tn.CreatedBy =', p_UserID,' AND ', p_hasConditions);
            SET v_join_condition = CONCAT(
            'INNER JOIN torganization tog ON tn.OrganizationID = tog.OrganizationID
             INNER JOIN tvenuenotification tvn ON tn.NotificationID = tvn.NotificationID
             LEFT JOIN tregion s ON tvn.State = s.RegionID
             LEFT JOIN tregion d ON tvn.District = d.RegionID
             LEFT JOIN tregion ogd ON tog.DistrictID = ogd.RegionID
             INNER JOIN tuser tu ON tu.UserID = tn.NotificationCreated
             LEFT JOIN tlookupdetail tld ON tld.LookupDetailID = tn.Status
             INNER JOIN tnotificationheader tnh ON tn.NotificationID = tnh.NotificationID');
		ELSE
			SET v_conditions = CONCAT(' tn.Status != 61 AND tn.NotificationCreated =', p_UserID);
            SET v_join_condition = CONCAT(
            'INNER JOIN torganization tog ON tn.OrganizationID = tog.OrganizationID
             INNER JOIN tvenuenotification tvn ON tn.NotificationID = tvn.NotificationID
             LEFT JOIN tregion s ON tvn.State = s.RegionID
             LEFT JOIN tregion d ON tvn.District = d.RegionID
             LEFT JOIN tregion ogd ON tog.DistrictID = ogd.RegionID
             INNER JOIN tuser tu ON tu.UserID = tn.NotificationCreated
             LEFT JOIN tlookupdetail tld ON tld.LookupDetailID = tn.Status
			 INNER JOIN tnotificationheader tnh ON tn.NotificationID = tnh.NotificationID');
		END IF;
    ELSEIF  p_StatusType IS NOT NULL AND p_StatusType = 'A' THEN
		IF p_hasConditions IS NOT NULL THEN
			SET v_conditions = CONCAT('tn.Status = ', v_fetchStatusId,' AND tor.IsAdmin = 1 AND tor.OrganizationID AND tour.UserID = ', p_UserID,' AND ', p_hasConditions);
            SET v_join_condition = CONCAT(
            'INNER JOIN torganization tog ON tn.OrganizationID = tog.OrganizationID
            INNER JOIN torganizationrole tor ON tor.OrganizationID = tn.OrganizationID
			INNER JOIN torganizationuserrole tour ON tor.OrganizationRoleID = tour.OrganizationRoleID
            INNER JOIN tvenuenotification tvn ON tn.NotificationID = tvn.NotificationID
            LEFT JOIN tregion s ON tvn.State = s.RegionID
            LEFT JOIN tregion d ON tvn.District = d.RegionID
            LEFT JOIN tregion ogd ON tog.DistrictID = ogd.RegionID
            INNER JOIN tuser tu ON tu.UserID = tn.NotificationCreated
            LEFT JOIN tlookupdetail tld ON tld.LookupDetailID = tn.Status
			INNER JOIN tnotificationheader tnh ON tn.NotificationID = tnh.NotificationID');
		ELSE
			SET v_conditions = CONCAT('tn.Status = ', v_fetchStatusId,' AND tor.IsAdmin = 1 AND tor.OrganizationID AND tour.UserID = ', p_UserID);
            SET v_join_condition = CONCAT(
            'INNER JOIN torganization tog ON tn.OrganizationID = tog.OrganizationID
            INNER JOIN torganizationrole tor ON tor.OrganizationID = tn.OrganizationID
			INNER JOIN torganizationuserrole tour ON tor.OrganizationRoleID = tour.OrganizationRoleID
            INNER JOIN tvenuenotification tvn ON tn.NotificationID = tvn.NotificationID
            LEFT JOIN tregion s ON tvn.State = s.RegionID
            LEFT JOIN tregion d ON tvn.District = d.RegionID
            LEFT JOIN tregion ogd ON tog.DistrictID = ogd.RegionID
            INNER JOIN tuser tu ON tu.UserID = tn.NotificationCreated
            LEFT JOIN tlookupdetail tld ON tld.LookupDetailID = tn.Status
			INNER JOIN tnotificationheader tnh ON tn.NotificationID = tnh.NotificationID');
		END IF;
	ELSE 
		SELECT null  AS id;
    END IF;
    
	IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ',p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;

    -- Prepare the dynamic SQL query
    SET @v_conditions = v_conditions; -- Prepare the dynamic condition
	SET @v_limitation = v_limitation; -- Prepare the dynamic condition
    SET @v_join_condition = v_join_condition; -- Prepare the dynamic condition
	SET @v_documentTypeID = v_documentTypeID;
    
    SET @sql = CONCAT('
        SELECT
        tn.NotificationID as id,
        tn.NotificationType as notificationTypeID,
		tu.FirstName as createdByName,
        tn.CreatedDate as createdDate,
		tn.Subject as subject,
		tn.image as image,
        tn.NotifyAll as notifyAll,
        tn.ApprovedDate as approvedDate,
		tog.OrganizationName as organizationName,
        tog.OrganizationID as organizationID,
        tog.DistrictID as organizationDistrictID,
        ogd.RegionName as organizationDistrict,
        tvn.Address as address,
		tn.CreatedBy as createdBy,
		tn.Body as body,
		tn.StartDate as eventDate,
        tn.Status as statusID,
        tld.LookupDetailName as status,
		tn.NotificationCreated as notificationCreated,
        s.RegionName as state,
        s.RegionID as stateID,
        d.RegionName as district,
		d.RegionID as districtID,
        tvn.Country as country,
		CASE 
            WHEN tn.Status = ', v_rejectedID, ' OR tn.Status = ', v_activeID, ' OR tn.Status = ', v_closedID, ' THEN FALSE
            ELSE TRUE
        END AS isEditable,(
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        ''documentID'', u.DocumentID,
                        ''path'', u.DocumentUrl,
                        ''fileName'', u.DocumentName
                    )
                )
                FROM tdocument u
                WHERE u.OwnerID = tn.NotificationID AND u.DocumentTypeID = ', @v_documentTypeID, '
            ) AS image,
        (SELECT tus.FirstName FROM tuser tus 
         INNER JOIN tnotification tna ON tna.ApprovedBy = tus.UserID
         WHERE tna.ApprovedBy = tus.UserID AND tn.NotificationID = tna.NotificationID)
         as approverName ,
		COALESCE(
        (SELECT JSON_OBJECT(
            "documentID", td.DocumentID,
            "path", td.DocumentUrl,
            "fileName", td.DocumentName
          )
          FROM tdocument td
          JOIN tlookupdetail tl ON td.DocumentTypeID = tl.LookupDetailID
          WHERE td.OwnerID = tog.OrganizationID
          AND tl.LookupDetailName = ''Organization''
          LIMIT 1
        ), NULL
      ) AS organizationAvatar ,
			JSON_ARRAYAGG(
				JSON_OBJECT(
					"notificationHeaderID", tnh.NotificationHeaderID,
					"organizationID", tnh.OrganizationID,
					"createdBy", tnh.CreatedBy,
					"createdDate", tnh.CreatedDate
				)
			) AS invitedOrganizations,
	(SELECT COUNT(DISTINCT tn.NotificationID) FROM tnotification tn ', 
    @v_join_condition, ' WHERE ', @v_conditions,') AS total_count
			FROM tnotification tn ', @v_join_condition, '
			WHERE ', @v_conditions, ' GROUP BY tvn.NotificationID ORDER BY tn.ApprovedDate DESC ', @v_limitation);
    

    -- Prepare and execute the dynamic SQL
    PREPARE stmt FROM @sql;
	EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    
     SELECT @sql as message;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchOrganization` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchOrganization`(IN p_hasConditions TEXT, IN p_hasLimitation TEXT, IN p_statusType varchar(10))
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;
    DECLARE v_org_member_status INT default 45;
    DECLARE v_join_condition TEXT default '';

    -- Get the ActionCodeID for 'Delete'
	SELECT LookupDetailID INTO v_deleteId
	FROM tlookupdetail tld
	INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
	WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName='OrganizationStatus';
    
	-- SELECT LookupDetailID INTO v_org_member_status
    -- FROM tlookupdetail tld
    -- INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    -- WHERE tld.LookupDetailName = 'Active' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    -- LIMIT 1;

    -- Construct the condition for v_delete
    IF p_StatusType IS NOT NULL AND p_StatusType = 'M' THEN
		IF p_hasConditions IS NOT NULL THEN
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND togm.status =', v_org_member_status, ' AND togm.IsOwner = ''0'' AND ', p_hasConditions);
            SET v_join_condition = CONCAT('INNER JOIN torganizationmember togm ON togm.OrganizationID = tog.OrganizationID');
		ELSE
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND togm.status =', v_org_member_status,' AND togm.IsOwner = ''0''');
            SET v_join_condition = CONCAT('INNER JOIN torganizationmember togm ON togm.OrganizationID = tog.OrganizationID');
		END IF;
	ELSEIF p_StatusType IS NOT NULL AND p_StatusType = 'O' THEN
			IF p_hasConditions IS NOT NULL THEN
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND togm.status =', v_org_member_status, ' AND togm.IsOwner = ''1'' AND ', p_hasConditions);
            SET v_join_condition = CONCAT('INNER JOIN torganizationmember togm ON togm.OrganizationID = tog.OrganizationID');
		ELSE
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND togm.status =', v_org_member_status,' AND togm.IsOwner = ''1''');
            SET v_join_condition = CONCAT('INNER JOIN torganizationmember togm ON togm.OrganizationID = tog.OrganizationID');
		END IF;
    ELSEIF  p_StatusType IS NOT NULL AND p_StatusType = 'R' THEN
		IF p_hasConditions IS NOT NULL THEN
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND ', p_hasConditions);
		ELSE
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId);
		END IF;
    ELSEIF  p_StatusType IS NULL THEN
		IF p_hasConditions IS NOT NULL THEN
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND ', p_hasConditions);
		ELSE
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId);
		END IF;
    END IF;    
	IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ',p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;

    -- Prepare the dynamic SQL query
    SET @v_conditions = v_conditions; -- Prepare the dynamic condition
	SET @v_limitation = v_limitation; -- Prepare the dynamic condition
    SET @v_join_condition = v_join_condition; -- Prepare the dynamic condition
    SET @sql = CONCAT('
        SELECT 
            tog.OrganizationID as id,
            tog.OrganizationName as organizationName, 
            tog.OrganizationEmail as organizationEmail, 
            tog.OrganizationTypeID as organizationTypeID,
            tog.RegistrationNumber as registrationNumber, 
            tog.RegistrationValidFrom as registrationValidFrom, 
            tog.RegistrationValidTo as registrationValidTo, 
            tog.InchargeName as inchargeName,
            tog.InchargePhone as inchargePhone,
            tog.InchargeEmail as inchargeEmail,
            tog.Website as website,
            tog.PhoneNumber as phoneNumber,
            tog.CountryID as country,
            tog.CityID as city,
            tog.DistrictID as districtID,
            tog.StateID as stateID,
            tog.LocalBodyType as localBodyType,
            tog.LocalBodyName as localBodyName,
			tog.WardName as wardName,
			tog.PostOffice as postOffice,
			tog.Pincode as pincode,
			tog.About as about,
			tog.UserID as userID,
             COALESCE(
        (SELECT JSON_OBJECT(
            "documentID", td.DocumentID,
            "path", td.DocumentUrl,
            "fileName", td.DocumentName
          )
          FROM tdocument td
          JOIN tlookupdetail tl ON td.DocumentTypeID = tl.LookupDetailID
          WHERE td.OwnerID = tog.OrganizationID
          AND tl.LookupDetailName = ''Organization''
          LIMIT 1
        ), NULL
      ) AS avatar,
            (SELECT COUNT(*) FROM torganization tog ', v_join_condition, ' WHERE ', @v_conditions, ') AS total_count
        FROM torganization tog ', @v_join_condition, '
        WHERE ', @v_conditions, @v_limitation);
	
    -- SELECT @sql as finalQuery;

    -- Prepare and execute the dynamic SQL
    PREPARE stmt FROM @sql;
	EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
	-- SELECT @sql as finalQuery;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchOrganizationActivity` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchOrganizationActivity`(IN p_hasConditions TEXT, IN p_hasLimitation TEXT)
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;
    DECLARE v_activityHierarchy VARCHAR(1000);

    -- Get the ActionCodeID for 'Delete'
	SELECT ActionCodeID INTO v_deleteId
    FROM tactioncode
    WHERE Description = 'Delete';

    -- Construct the condition for v_delete
    IF p_hasConditions IS NOT NULL THEN
        SET v_conditions = CONCAT('Status != ', v_deleteId, ' AND ', p_hasConditions);
    ELSE
        SET v_conditions = CONCAT('Status != ', v_deleteId);
    END IF;
    
	IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ',p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;
    
    -- SET v_activityHierarchy = (SELECT my_function_loop(2, 9));

    -- Prepare the dynamic SQL query
    SET @v_conditions = v_conditions; -- Prepare the dynamic condition
	SET @v_limitation = v_limitation; -- Prepare the dynamic condition
    SET @sql = CONCAT('
        SELECT 
		toa.OrganizationActivityID AS organizationActivityID,
		toa.OrganizationID AS organizationID,
		ta.ActivityID AS activityID,
		ta.ActivityName AS activityName,
		toa.Reason AS reason,
        getActivityParentDetails(ta.ActivityID) AS parentActivities,
        (SELECT COUNT(*) as total_count FROM torganizationactivity toa WHERE ', @v_conditions, ') AS total_count
        FROM torganizationactivity toa
        INNER JOIN tactivity ta ON toa.ActivityID = ta.ActivityID
        WHERE ', @v_conditions, @v_limitation);
	-- SELECT @sql AS final_query;
    -- Prepare and execute the dynamic SQL
    PREPARE stmt FROM @sql;
	EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchOrganizationByKey` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchOrganizationByKey`(
    IN p_hasConditions TEXT,
    IN p_hasLimitation TEXT,
    IN p_statusType varchar(10)
)
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;
    DECLARE v_org_member_status INT;
    DECLARE v_join_condition TEXT default '';
    
    SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

    -- Get the ActionCodeID for 'Delete'
    SELECT LookupDetailID INTO v_deleteId
		FROM tlookupdetail tld
        INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
		WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName='OrganizationStatus';
        
	SELECT LookupDetailID INTO v_org_member_status
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Active' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;

    -- Construct the condition for v_delete
	    IF p_StatusType IS NOT NULL AND p_StatusType = 'M' THEN
		IF p_hasConditions IS NOT NULL THEN
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND togm.status =', v_org_member_status, ' AND togm.IsOwner = ''0'' AND ', p_hasConditions);
            SET v_join_condition = CONCAT('INNER JOIN torganizationmember togm ON togm.OrganizationID = tog.OrganizationID');
		ELSE
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND togm.status =', v_org_member_status,' AND togm.IsOwner = ''0''');
            SET v_join_condition = CONCAT('INNER JOIN torganizationmember togm ON togm.OrganizationID = tog.OrganizationID');
		END IF;
	ELSEIF p_StatusType IS NOT NULL AND p_StatusType = 'O' THEN
			IF p_hasConditions IS NOT NULL THEN
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND togm.status =', v_org_member_status, ' AND togm.IsOwner = ''1'' AND ', p_hasConditions);
            SET v_join_condition = CONCAT('INNER JOIN torganizationmember togm ON togm.OrganizationID = tog.OrganizationID');
		ELSE
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND togm.status =', v_org_member_status,' AND togm.IsOwner = ''1''');
            SET v_join_condition = CONCAT('INNER JOIN torganizationmember togm ON togm.OrganizationID = tog.OrganizationID');
		END IF;
    ELSEIF  p_StatusType IS NOT NULL AND p_StatusType = 'R' THEN
		IF p_hasConditions IS NOT NULL THEN
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND ', p_hasConditions);
		ELSE
			SET v_conditions = CONCAT('tog.Status != ', v_deleteId);
		END IF;
    END IF;
    
    IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ', p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;

    -- Prepare the dynamic SQL query
    SET @v_conditions = v_conditions; 
    SET @v_limitation = v_limitation;

    -- Modify query to aggregate representingDistricts into JSON format
    SET @sql = CONCAT('SELECT 
            tog.OrganizationID as id, 
            tog.OrganizationName as organizationName, 
            tog.OrganizationEmail as organizationEmail, 
            tog.OrganizationTypeID as organizationTypeID,
            tog.RegistrationNumber as registrationNumber, 
            tog.RegistrationValidFrom as registrationValidFrom, 
            tog.RegistrationValidTo as registrationValidTo, 
            tog.InchargeName as inchargeName,
            tog.InchargePhone as inchargePhone,
            tog.InchargeEmail as inchargeEmail,
            tog.Website as website,
            tog.PhoneNumber as phoneNumber,
            tog.CountryID as country,
            tog.CityID as city,
            tog.DistrictID as districtID,
            tog.StateID as stateID,
            tog.LocalBodyType as localBodyType,
            tog.LocalBodyName as localBodyName,
			tog.WardName as wardName,
			tog.PostOffice as postOffice,
			tog.Pincode as pincode,
			tog.About as about,
			tog.UserID as userID,
             COALESCE(
        (SELECT JSON_OBJECT(
            "documentID", td.DocumentID,
            "path", td.DocumentUrl,
            "fileName", td.DocumentName
          )
          FROM tdocument td
          JOIN tlookupdetail tl ON td.DocumentTypeID = tl.LookupDetailID
          WHERE td.OwnerID = tog.OrganizationID
          AND tl.LookupDetailName = ''Organization''
          LIMIT 1
        ), NULL
      ) AS avatar,
            (SELECT COUNT(*) FROM torganization tog ', v_join_condition, ' WHERE ', @v_conditions, ') AS total_count
        FROM torganization tog ', v_join_condition , '
        WHERE ', @v_conditions, @v_limitation);

	-- SELECT @sql AS finalQuery;


    -- Prepare and execute the dynamic SQL
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    

    


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchOrganizationDepartment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchOrganizationDepartment`(
    IN p_conditions TEXT,
    IN p_limitations TEXT
)
BEGIN
    DECLARE v_sql TEXT;

    -- Base SQL Query to find OrganizationID based on OrganizationName
    SET v_sql = 'SELECT 
        od.OrganizationDepartmentID,
        od.DepartmentName,
        o.OrganizationID,
		o.OrganizationTypeID AS organizationTypeID,
		ot.LookupDetailName AS organizationType,
        o.OrganizationName,
        o.OrganizationEmail,
        o.PhoneNumber,
        o.Website,
        o.Pincode,
        o.About,
		o.CountryID AS countryID,
		rc.RegionName AS country,
		o.LocalBodyType AS localBodyTypeID,
		lbt.RegionTypeName AS localBodyType,
		o.LocalBodyName AS localBodyNameID,
		lbn.RegionName AS localBodyName,
		o.CityID AS cityID,
	    rcy.RegionName AS city,
	    o.DistrictID AS districtID,
		rd.RegionName AS district,
	    o.StateID AS stateID,
	    rs.RegionName AS state,
	    o.WardName AS wardID,
	    wa.RegionName AS wardName,
	    o.PostOffice AS postOfficeID,
	    po.RegionName AS postOffice,
        CASE 
            WHEN oa.FromDate IS NOT NULL AND oa.ToDate IS NOT NULL THEN ''False''
            ELSE ''True'' 
        END AS isActive
    FROM 
        torganizationdepartment od
    LEFT JOIN 
        torganization o ON od.OrganizationID = o.OrganizationID 
    LEFT JOIN 
        torganizationdepartmentarchive oa ON od.OrganizationDepartmentID = oa.OrganizationDepartmentID 
    LEFT JOIN 
      tregion rc ON o.CountryID = rc.RegionID
    LEFT JOIN 
      tregion rs ON o.StateID = rs.RegionID
    LEFT JOIN 
      tregion rd ON o.DistrictID = rd.RegionID
    LEFT JOIN 
      tregion rcy ON o.CityID = rcy.RegionID
    LEFT JOIN 
      tregion wa ON o.WardName = wa.RegionID
    LEFT JOIN 
      tregion po ON o.PostOffice = po.RegionID
    LEFT JOIN 
      tlookupdetail ot ON o.OrganizationTypeID = ot.LookupDetailID
    LEFT JOIN 
      tregiontype lbt ON o.LocalBodyType = lbt.RegionTypeID
    LEFT JOIN 
      tregion lbn ON o.LocalBodyName = lbn.RegionID
    
    WHERE 
        o.OrganizationID IN (SELECT OrganizationID FROM torganization WHERE 1=1';

    -- Add dynamic conditions for OrganizationName and DepartmentName
    IF p_conditions IS NOT NULL AND p_conditions != '' THEN
        SET v_sql = CONCAT(v_sql, ' AND ', p_conditions);
    END IF;

    -- Close the subquery and add hardcoded Status = 1 condition
    SET v_sql = CONCAT(v_sql, ') AND od.Status = 1');

    -- Handle pagination
    IF p_limitations IS NOT NULL AND p_limitations != '' THEN
        SET v_sql = CONCAT(v_sql, ' ', p_limitations);
    END IF;

    -- Prepare the dynamic SQL query
    SET @sql = v_sql;

    -- Debugging: Optional, to check the final query
    -- SELECT @sql AS final_query;

    -- Prepare and execute the final SQL
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchOrganizationDepartmentMember` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchOrganizationDepartmentMember`(
    IN p_hasConditions TEXT,
    IN p_hasLimitation TEXT
)
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;

    -- Set SQL mode to avoid ONLY_FULL_GROUP_BY issues
    SET sql_mode = (SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

    -- Fetch the status for 'Deleted' for the `torganizationdepartmentmember` table
    SELECT ActionCodeID INTO v_deleteId
    FROM tactioncode 
    WHERE Description = 'Delete';

    -- Construct the condition for excluding deleted records
    SET v_conditions = CONCAT('todm.Status != ', v_deleteId);
    IF p_hasConditions IS NOT NULL AND p_hasConditions != '' THEN
        SET v_conditions = CONCAT(v_conditions, ' AND ', p_hasConditions);
    END IF;

    -- Handle pagination if provided
    SET v_limitation = '';
    IF p_hasLimitation IS NOT NULL AND p_hasLimitation != '' THEN
        SET v_limitation = p_hasLimitation;
    END IF;

    -- Prepare the dynamic SQL query to fetch organization department member details
    SET @sql = CONCAT('
        SELECT
            todm.OrganizationDepartmentMemberID AS organizationDepartmentMemberID,
            tu.UserID AS memberID,
            tu.FirstName AS firstName,
            tu.LastName AS lastName,
            tu.Email AS emailID,
            tu.PhoneNumber AS phoneNumber,
            trd.RegionName AS district,
            trd.RegionID AS districtID,
            tod.OrganizationDepartmentID AS organizationDepartmentID,
            tod.DepartmentName AS departmentName,
            tog.OrganizationID AS organizationID,
            tog.OrganizationName AS organizationName,
            todm.Status AS status,
            (
                SELECT COUNT(DISTINCT todm_inner.OrganizationDepartmentMemberID)
                FROM torganizationdepartmentmember todm_inner
                WHERE todm_inner.Status != ', v_deleteId, ' AND ', v_conditions, '
            ) AS total_count,
             CASE 
            WHEN oa.FromDate IS NOT NULL AND oa.ToDate IS NOT NULL THEN ''False''
            ELSE ''True'' 
        END AS isActive
        FROM torganizationdepartmentmember todm
        INNER JOIN tuser tu ON tu.UserID = todm.MemberID
        INNER JOIN torganizationdepartment tod ON tod.OrganizationDepartmentID = todm.OrganizationDepartmentID
		LEFT JOIN torganizationdepartmentmemberarchive oa ON todm.OrganizationDepartmentMemberID = oa.OrganizationDepartmentMemberID 
        LEFT JOIN tuserbasicdetail tubd ON tubd.UserID = tu.UserID
        LEFT JOIN tregion trd ON trd.RegionID = tubd.DistrictID
        INNER JOIN torganization tog ON tog.OrganizationID = tod.OrganizationID
        WHERE ', v_conditions, ' 
        GROUP BY todm.OrganizationDepartmentMemberID ', v_limitation, ';');

    -- Debugging: Output the generated SQL statement for inspection
   -- SELECT @sql AS debug_sql;  -- This will show you the final SQL query

    -- Prepare and execute the SQL statement
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchOrganizationDepartmentTeam` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchOrganizationDepartmentTeam`(
    IN p_conditions TEXT,
    IN p_limitations TEXT
)
BEGIN
    DECLARE v_sql TEXT;
    DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';

    -- Base SQL Query to find OrganizationID based on OrganizationName
    SET v_sql = 'SELECT 
                    odt.OrganizationDepartmentTeamID,
                    odt.TeamName AS teamName,
                    odt.TeamCategoryID AS teamCategoryID,
                    ta.ActivityID AS activityID,
                    ta.ActivityName AS activityName,
                    odt.Description AS description,
                    o.OrganizationID AS organizationID,
                    o.OrganizationTypeID AS organizationTypeID,
                    ol.LookupDetailName AS organizationType,
                    o.OrganizationName AS organizationName,
                    o.OrganizationEmail AS organizationEmail,
                    o.PhoneNumber AS phoneNumber,
                    o.Website AS webSite,
                    o.Pincode AS pinCode,
                    o.About AS about,
                    o.CountryID AS countryID,
                    rc.RegionName AS country,
                    o.LocalBodyType AS localBodyTypeID,
                    lbt.RegionTypeName AS localBodyType,
                    o.LocalBodyName AS localBodyNameID,
                    lbn.RegionName AS localBodyName,
                    o.CityID AS cityID,
                    rcy.RegionName AS city,
                    o.DistrictID AS districtID,
                    rd.RegionName AS district,
                    o.StateID AS stateID,
                    rs.RegionName AS state,
                    o.WardName AS wardID,
                    wa.RegionName AS wardName,
                    o.PostOffice AS postOfficeID,
                    po.RegionName AS postOffice,
                    CASE 
                        WHEN odt.FromDate IS NOT NULL AND odt.ToDate IS NOT NULL THEN ''False'' 
                        ELSE ''True'' 
                    END AS isActive 
                FROM torganizationdepartmentteam odt
                LEFT JOIN 
                    torganization o ON odt.OrganizationID = o.OrganizationID 
                LEFT JOIN 
                    tregion rc ON o.CountryID = rc.RegionID
                LEFT JOIN 
                    tregion rs ON o.StateID = rs.RegionID
                LEFT JOIN 
                    tregion rd ON o.DistrictID = rd.RegionID
                LEFT JOIN 
                    tregion rcy ON o.CityID = rcy.RegionID
                LEFT JOIN 
                    tregion wa ON o.WardName = wa.RegionID
                LEFT JOIN 
                    tregion po ON o.PostOffice = po.RegionID
                LEFT JOIN 
                    tlookupdetail ol ON o.OrganizationTypeID = ol.LookupDetailID
                LEFT JOIN 
                    tregiontype lbt ON o.LocalBodyType = lbt.RegionTypeID
                LEFT JOIN 
                    tregion lbn ON o.LocalBodyName = lbn.RegionID
                LEFT JOIN 
                    tactivity ta ON odt.ActivityID = ta.ActivityID
                WHERE 
                    o.OrganizationID IN (SELECT OrganizationID FROM torganization WHERE 1=1';

    -- Add dynamic conditions for OrganizationName and DepartmentName
    IF p_conditions IS NOT NULL AND p_conditions != '' THEN
        SET v_sql = CONCAT(v_sql, ' AND ', p_conditions);
    END IF;

    -- Close the subquery and add hardcoded Status = 1 condition
    SET v_sql = CONCAT(v_sql, ') AND odt.Status = ', v_active);

    -- Handle pagination
    IF p_limitations IS NOT NULL AND p_limitations != '' THEN
        SET v_sql = CONCAT(v_sql, ' ', p_limitations);
    END IF;

    -- Prepare the dynamic SQL query
    SET @sql = v_sql;

    -- Debugging: Optional, to check the final query
    -- SELECT @sql AS final_query;

    -- Prepare and execute the final SQL
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchOrganizationList` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchOrganizationList`(IN p_hasConditions TEXT, IN p_hasLimitation TEXT, IN p_statusType varchar(10))
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_activeId INT default 22;

    -- Get the ActionCodeID for 'Delete'
	-- SELECT LookupDetailID INTO v_activeId
	-- FROM tlookupdetail tld
	-- INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
	-- WHERE tld.LookupDetailName = 'Active' AND tlh.LookupTypeName='OrganizationStatus';

    -- Construct the condition for v_delete

		IF p_hasConditions IS NOT NULL THEN
			-- SET v_conditions = CONCAT('tog.Status != ', v_deleteId,' AND togm.status =', v_org_member_status, ' AND togm.IsOwner = ''0'' AND ', p_hasConditions);
            SET v_conditions = CONCAT('tog.Status = ', v_activeId,' AND ', p_hasConditions);
		ELSE
			SET v_conditions = CONCAT('tog.Status = ', v_activeId );
		END IF;
    
	IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ',p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;

    -- Prepare the dynamic SQL query
    SET @v_conditions = v_conditions; -- Prepare the dynamic condition
	SET @v_limitation = v_limitation; -- Prepare the dynamic condition
    SET @sql = CONCAT('
        SELECT 
            tog.OrganizationID as id, 
            tog.OrganizationName as name,
            (SELECT COUNT(*) FROM torganization tog WHERE ', @v_conditions, ') AS total_count
        FROM torganization tog
        WHERE ', @v_conditions, @v_limitation);
	

    -- Prepare and execute the dynamic SQL
    PREPARE stmt FROM @sql;
	EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
	-- SELECT @sql as finalQuery;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchOrganizationMember` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchOrganizationMember`(IN p_hasConditions TEXT, IN p_hasLimitation TEXT, IN p_StatusType varchar(10))
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;
    DECLARE v_documentTypeID INT;
    DECLARE v_statusTypeId TEXT;
	DECLARE v_rejectedID INT;
    DECLARE v_cancelID INT;
    DECLARE v_activeID INT;
    DECLARE v_docTypeUser INT;
    -- In 5.7 the sqlmode is set by default to ONLY_FULL_GROUP_BY To fix error ONLY_FULL_GROUP_BY below code is used.
	SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

	SELECT LookupDetailID INTO v_rejectedID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Rejected' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;
    -- Fetch the status for 'Deleted' for the `torganizationmember` table
    SELECT LookupDetailID INTO v_deleteId
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;
    SELECT LookupDetailID INTO v_activeID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Active' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;
        SELECT LookupDetailID INTO v_docTypeUser
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'User' AND tlh.LookupTypeName = 'OwnerType'
    LIMIT 1;
        SELECT LookupDetailID INTO v_cancelID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Cancel' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;
    
    	IF p_StatusType IS NOT NULL AND p_StatusType = 'A' THEN
			SELECT CONCAT('( tom.Status = ', GROUP_CONCAT(tld.LookupDetailID SEPARATOR ' OR tom.Status = '),')') INTO v_statusTypeId
			FROM tlookupdetail tld
			INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
			WHERE (tld.LookupDetailName = 'Active' )
			AND tlh.LookupTypeName = 'OrganizationMemberStatus';
		ELSEIF  p_StatusType IS NOT NULL AND p_StatusType = 'P' THEN
			SELECT CONCAT('( tom.Status = ', GROUP_CONCAT(tld.LookupDetailID SEPARATOR ' OR tom.Status = '),')') INTO v_statusTypeId
			FROM tlookupdetail tld
			INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
			WHERE (tld.LookupDetailName = 'Pending' OR tld.LookupDetailName = 'Rejected'  OR tld.LookupDetailName = 'Inactive'   OR tld.LookupDetailName = 'Cancel')
			AND tlh.LookupTypeName = 'OrganizationMemberStatus';
		ELSEIF  p_StatusType IS NOT NULL AND p_StatusType = 'I' THEN
			SELECT CONCAT('( tom.Status = ', GROUP_CONCAT(tld.LookupDetailID SEPARATOR ' OR tom.Status = '),')') INTO v_statusTypeId
			FROM tlookupdetail tld
			INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
			WHERE (tld.LookupDetailName = 'Pending')
			AND tlh.LookupTypeName = 'OrganizationMemberStatus';
		END IF;
	
    -- Construct the condition for v_delete
    IF p_hasConditions IS NOT NULL AND p_hasConditions != '' AND v_statusTypeId IS NULL  THEN
        SET v_conditions = CONCAT('tom.Status != ', v_deleteId, ' AND ', p_hasConditions);
	ELSEIF p_hasConditions IS NOT NULL AND p_hasConditions != '' AND v_statusTypeId IS NOT NULL  THEN
		SET v_conditions = CONCAT('tom.Status != ', v_deleteId, ' AND ', v_statusTypeId ,' AND ', p_hasConditions);
	ELSEIF p_hasConditions IS NULL AND v_statusTypeId IS NOT NULL  THEN
		SET v_conditions = CONCAT('tom.Status != ', v_deleteId, ' AND ', v_statusTypeId);
    ELSE
        SET v_conditions = CONCAT('tom.Status != ', v_deleteId);
        
    END IF;

    IF p_hasLimitation IS NOT NULL AND p_hasLimitation != '' THEN
        SET v_limitation = CONCAT(' ', p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;


    -- Prepare the dynamic SQL query to fetch user details along with the qualification flags
    SET @v_conditions = v_conditions; 
    SET @v_limitation = v_limitation;
    
    SET @sql = CONCAT('
        SELECT
            tom.OrganizationmemberID AS organizationmemberID,
            tu.UserID AS userId,
            tubd.UserBasicDetailID AS userBasicDetailID,
            tu.FirstName AS firstName,
            tu.LastName AS lastName,
            tu.Email AS emailID,
            tu.PhoneNumber AS phoneNumber,
            trd.RegionName AS district,
            trd.RegionID AS districtID,
            tog.OrganizationID AS organizationID,
            tog.OrganizationName AS organizationName,
            tog.OrganizationTypeID AS institutionTypeID,
            tldr.LookupDetailName AS institutionType,
            tom.Status AS statusID,
            tlds.LookupDetailName AS status,
            tom.MembershipRequestDate AS membershipRequestDate,
		CASE 
            WHEN isOrganizationInitiated IN (0, 1) AND (tom.Status = ', v_rejectedID ,' OR tom.Status = ', v_cancelID ,') THEN FALSE
            ELSE TRUE
        END AS showCancelInvite,
        COALESCE(
        (SELECT JSON_OBJECT(
            "documentID", td.DocumentID,
            "path", td.DocumentUrl,
            "fileName", td.DocumentName
          )
          FROM tdocument td
          WHERE td.OwnerID = tu.UserID
          AND DocumentTypeID = ',v_docTypeUser,' 
          LIMIT 1
        ), NULL
      ) AS avatar,
      tom.isOrganizationInitiated AS isOrganizationInitiated,
            tom.IsOwner AS isOwner,
			(
			SELECT tor.IsAdmin
			FROM torganizationrole tor
			INNER JOIN torganizationuserrole tour ON tour.OrganizationRoleID = tor.OrganizationRoleID
			WHERE tor.OrganizationID = 6 AND tour.UserID = 6 ) AS isAdmin,
			(
			SELECT tor.RoleName 
			FROM torganizationrole tor
			INNER JOIN torganizationuserrole tour ON tour.OrganizationRoleID = tor.OrganizationRoleID
			WHERE tor.OrganizationID = 6 AND tour.UserID = 6 ) AS membershipRole,
            (
                SELECT COUNT(DISTINCT tom.OrganizationmemberID)
                FROM torganizationmember tom
                INNER JOIN tuser tu ON tu.UserID = tom.MemberID
				INNER JOIN torganization tog ON tog.OrganizationID = tom.OrganizationID
				LEFT JOIN tuserbasicdetail tubd ON tubd.UserID = tu.UserID
				LEFT JOIN tregion trd ON trd.RegionID = tubd.DistrictID
				LEFT JOIN tlookupdetail tldr ON tldr.LookupDetailID = tog.OrganizationTypeID
                WHERE ', @v_conditions, '
            ) AS total_count
        FROM torganizationmember tom
        INNER JOIN tuser tu ON tu.UserID = tom.MemberID
		INNER JOIN torganization tog ON tog.OrganizationID = tom.OrganizationID
        LEFT JOIN tuserbasicdetail tubd ON tubd.UserID = tu.UserID
        LEFT JOIN tregion trd ON trd.RegionID = tubd.DistrictID
        LEFT JOIN tlookupdetail tldr ON tldr.LookupDetailID = tog.OrganizationTypeID
		LEFT JOIN tlookupdetail tlds ON tlds.LookupDetailID = tom.Status
        WHERE ', @v_conditions, ' GROUP BY tom.OrganizationmemberID', @v_limitation, ';');
        
        	-- SELECT @sql AS final_query;

    -- Prepare and execute the SQL statement
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

	-- SELECT @v_conditions;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchOrganizationTeam` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchOrganizationTeam`(
    IN p_conditions TEXT,
    IN p_limitations TEXT
)
BEGIN
    DECLARE v_sql TEXT;
    DECLARE v_active INT;

    -- Get the ActionCodeID for 'Active'
    SELECT ActionCodeID INTO v_active
    FROM tactioncode
    WHERE Description = 'Active';

    -- Base SQL Query to find OrganizationID based on OrganizationName
    SET v_sql = 'SELECT 
					ot.OrganizationTeamID,
					ot.TeamName,
					ta.ActivityID AS activityID,
					ta.ActivityName AS activityName,
					ot.Description AS description,
					ot.TeamCategoryID AS teamCategoryID,
					o.OrganizationID AS organizationID,
					o.OrganizationTypeID AS organizationTypeID,
					ol.LookupDetailName AS organizationType,
					o.OrganizationName AS organizationName,
					o.OrganizationEmail AS organizationEmail,
					o.PhoneNumber AS phoneNumber,
					o.Website AS webSite,
					o.Pincode AS pinCode,
					o.About AS about,
					o.CountryID AS countryID,
					rc.RegionName AS country,
					o.LocalBodyType AS localBodyTypeID,
					lbt.RegionTypeName AS localBodyType,
					o.LocalBodyName AS localBodyNameID,
					lbn.RegionName AS localBodyName,
					o.CityID AS cityID,
					rcy.RegionName AS city,
					o.DistrictID AS districtID,
					rd.RegionName AS district,
					o.StateID AS stateID,
					rs.RegionName AS state,
					o.WardName AS wardID,
					wa.RegionName AS wardName,
					o.PostOffice AS postOfficeID,
					po.RegionName AS postOffice,
        CASE 
            WHEN ot.FromDate IS NOT NULL AND ot.ToDate IS NOT NULL THEN ''False'' 
            ELSE ''True'' 
            END AS isActive 
            FROM torganizationteam ot
    LEFT JOIN 
        torganization o ON ot.OrganizationID = o.OrganizationID 
    LEFT JOIN 
      tregion rc ON o.CountryID = rc.RegionID
    LEFT JOIN 
      tregion rs ON o.StateID = rs.RegionID
    LEFT JOIN 
      tregion rd ON o.DistrictID = rd.RegionID
    LEFT JOIN 
      tregion rcy ON o.CityID = rcy.RegionID
    LEFT JOIN 
      tregion wa ON o.WardName = wa.RegionID
    LEFT JOIN 
      tregion po ON o.PostOffice = po.RegionID
    LEFT JOIN 
      tlookupdetail ol ON o.OrganizationTypeID = ol.LookupDetailID
    LEFT JOIN 
      tregiontype lbt ON o.LocalBodyType = lbt.RegionTypeID
    LEFT JOIN 
      tregion lbn ON o.LocalBodyName = lbn.RegionID
	LEFT JOIN 
	  tactivity ta ON ot.ActivityID = ta.ActivityID
    
    WHERE 
        o.OrganizationID IN (SELECT OrganizationID FROM torganization WHERE 1=1';

    -- Add dynamic conditions for OrganizationName and DepartmentName
    IF p_conditions IS NOT NULL AND p_conditions != '' THEN
        SET v_sql = CONCAT(v_sql, ' AND ', p_conditions);
    END IF;

    -- Close the subquery and add hardcoded Status = 1 condition
    SET v_sql = CONCAT(v_sql, ') AND ot.Status = ', v_active);

    -- Handle pagination
    IF p_limitations IS NOT NULL AND p_limitations != '' THEN
        SET v_sql = CONCAT(v_sql, ' ', p_limitations);
    END IF;

    -- Prepare the dynamic SQL query
    SET @sql = v_sql;

    -- Debugging: Optional, to check the final query
    -- SELECT @sql AS final_query;

    -- Prepare and execute the final SQL
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchOrganizationTeamDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchOrganizationTeamDetail`(
    IN p_hasConditions TEXT,
    IN p_hasLimitation TEXT
)
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;

    -- Get the ActionCodeID for 'Delete'
    SELECT ActionCodeID INTO v_deleteId
    FROM tactioncode
    WHERE Description = 'Delete';

    -- Construct the condition for v_delete
    IF p_hasConditions IS NOT NULL THEN
        SET v_conditions = CONCAT('totd.Status != ', v_deleteId, ' AND ', p_hasConditions);
    ELSE
        SET v_conditions = CONCAT('totd.Status != ', v_deleteId);
    END IF;

    IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ', p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;

    -- Prepare the dynamic SQL query
    SET @v_conditions = v_conditions; 
    SET @v_limitation = v_limitation;

    -- Modify query to aggregate representingDistricts into JSON format
    SET @sql = CONCAT(
        'SELECT
			totd.OrganizationTeamDetailID AS organizationTeamDetailID,
			tad.Name AS activityName,
			tot.TeamName AS teamName,
			tu.FirstName AS firstName,
			tu.LastName AS lastName,
			CASE 
				WHEN totd.FromDate IS NOT NULL AND totd.ToDate IS NOT NULL THEN ''False'' 
				ELSE ''True'' 
			END AS isActive ,

            (SELECT COUNT(*)
             FROM torganizationteamdetail totd	
             INNER JOIN 
                    tuser count_tu ON count_tu.UserID = totd.UserId
                LEFT JOIN 
                    torganizationteam count_tot ON count_tot.OrganizationTeamID = totd.OrganizationTeamID
                LEFT JOIN 
                    tactivitydetail count_tad ON count_tad.ActivityDetailID = totd.ActivityDetailID
             WHERE ', @v_conditions, ') AS total_count
         FROM torganizationteamdetail totd
             INNER JOIN 
                    tuser tu ON tu.UserID = totd.UserId
                LEFT JOIN 
                    torganizationteam tot ON tot.OrganizationTeamID = totd.OrganizationTeamID
                LEFT JOIN 
                    tactivitydetail tad ON tad.ActivityDetailID = totd.ActivityDetailID
         WHERE ', @v_conditions, @v_limitation);

    -- Prepare and execute the dynamic SQL
    -- SELECT @sql AS final_query;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    -- SELECT @sql AS final_query;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchUser`(
    IN p_firstName VARCHAR(255),
    IN p_lastName VARCHAR(255),
    IN p_phoneNumber VARCHAR(20),
    IN p_email VARCHAR(255),
    IN p_page INT,
    IN p_pageSize INT
)
BEGIN
    DECLARE v_sql VARCHAR(2000);
    DECLARE v_conditions VARCHAR(1000);
    DECLARE v_offset INT;
    DECLARE v_documentStatus INT;
    DECLARE v_documentType INT;
    DECLARE v_bioStatus INT;

    
    SELECT LookupDetailID INTO v_documentStatus
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName = 'DocumentStatus';

    SELECT LookupDetailID INTO v_documentType
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'User' AND tlh.LookupTypeName = 'OwnerType';
    
        SELECT ActionCodeID INTO v_bioStatus FROM tactioncode WHERE Description = 'Delete';

    
    SET v_sql = 'SELECT 
                    u.UserID as id, 
                    u.FirstName as firstName, 
                    u.LastName as lastName, 
                    u.PhoneNumber as phoneNumber, 
                    u.Email as email,
                    unescape_html(ub.Bio) AS bio,
                    ub.DateOfBirth AS dateOfBirth,
                    tr.RegionName as district,
                    (SELECT COUNT(*) FROM tuser) AS total_count,
                    COALESCE(
                        (SELECT (
                            JSON_OBJECT(
                                "documentID", d.DocumentID,
                                "path", d.DocumentUrl,
                                "fileName", d.DocumentName
                            )
                        )
                        FROM tdocument d 
                        WHERE d.OwnerID = u.UserID AND d.Status != ';

    
    SET v_sql = CONCAT(v_sql, v_documentStatus, ' AND d.DocumentTypeID = ', v_documentType, ' ), JSON_OBJECT()) AS avatar FROM tuser u');

    SET v_sql = CONCAT(v_sql, ' LEFT JOIN tuserbasicdetail ub ON u.UserID = ub.UserID AND ub.Status != ', v_bioStatus);
    SET v_sql = CONCAT(v_sql, ' LEFT JOIN `tregion` tr ON ub.DistrictID = tr.RegionID');
    SET v_conditions = '';

    
    IF p_firstName IS NOT NULL AND p_firstName != '' THEN
        SET v_conditions = CONCAT(v_conditions, 'u.FirstName LIKE "', p_firstName, '%"');
    END IF;

    IF p_lastName IS NOT NULL AND p_lastName != '' THEN
        IF v_conditions != '' THEN
            SET v_conditions = CONCAT(v_conditions, ' AND ');
        END IF;
        SET v_conditions = CONCAT(v_conditions, 'u.LastName LIKE "', p_lastName, '%"');
    END IF;

    IF p_phoneNumber IS NOT NULL AND p_phoneNumber != '' THEN
        IF v_conditions != '' THEN
            SET v_conditions = CONCAT(v_conditions, ' AND ');
        END IF;
        SET v_conditions = CONCAT(v_conditions, 'u.PhoneNumber LIKE "', p_phoneNumber, '%"');
    END IF;

    IF p_email IS NOT NULL AND p_email != '' THEN
        IF v_conditions != '' THEN
            SET v_conditions = CONCAT(v_conditions, ' AND ');
        END IF;
        SET v_conditions = CONCAT(v_conditions, 'u.Email LIKE "', p_email, '%"');
    END IF;

    
    IF v_conditions != '' THEN
        SET v_sql = CONCAT(v_sql, ' WHERE ', v_conditions);
    END IF;

    
    IF p_page IS NOT NULL AND p_pageSize IS NOT NULL THEN
        SET v_offset = (p_page - 1) * p_pageSize;
        SET v_sql = CONCAT(v_sql, ' LIMIT ', p_pageSize, ' OFFSET ', v_offset);
    END IF;

    
    

    
    SET @final_sql = v_sql;
    PREPARE stmt FROM @final_sql;
    EXECUTE stmt;

    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchUserByKey` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchUserByKey`(
    IN p_hasConditions TEXT,
    IN p_hasLimitation TEXT
)
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;
    
    SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

    -- Get the ActionCodeID for 'Delete'
    SELECT LookupDetailID INTO v_deleteId
		FROM tlookupdetail tld
        INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID=tld.LookupHeaderID
		WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName='UserStatus';

    -- Construct the condition for v_delete
    IF p_hasConditions IS NOT NULL THEN
        SET v_conditions = CONCAT('u.Status != ', v_deleteId, ' AND ', p_hasConditions);
    ELSE
        SET v_conditions = CONCAT('u.Status != ', v_deleteId);
    END IF;

    IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ', p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;

    -- Prepare the dynamic SQL query
    SET @v_conditions = v_conditions; 
    SET @v_limitation = v_limitation;

    -- Modify query to aggregate representingDistricts into JSON format
    SET @sql = CONCAT(
        'SELECT 
      u.userID as id,
      u.FirstName as firstName,
      u.LastName as lastName,
      u.PhoneNumber as phoneNumber,
      u.Email as email,
      unescape_html(ub.Bio) as bio,
      ub.DateOfBirth as dateOfBirth,
      tr.RegionName as district,
      (SELECT COUNT(*) FROM tuser u
      WHERE ',@v_conditions,') AS total_count,
      COALESCE(
        (SELECT JSON_OBJECT(
            "documentID", td.DocumentID,
            "path", td.DocumentUrl,
            "fileName", td.DocumentName
          )
          FROM tdocument td
          JOIN tlookupdetail tl ON td.DocumentTypeID = tl.LookupDetailID
          WHERE td.OwnerID = u.userID
          AND tl.LookupDetailName = ''User''
          LIMIT 1
        ), NULL
      ) AS avatar
    FROM tuser u
    LEFT JOIN (SELECT * FROM tuserbasicdetail GROUP BY UserID) AS ub ON u.userID = ub.UserID 
    LEFT JOIN tregion tr ON ub.DistrictID = tr.RegionID
    WHERE ', @v_conditions, @v_limitation);

	 -- SELECT @sql AS finalQuery;


    -- Prepare and execute the dynamic SQL
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchUserContactDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchUserContactDetail`(
    IN p_userID TEXT, 
    IN p_page INT, 
    IN p_pageSize INT
)
BEGIN
    DECLARE v_conditions TEXT DEFAULT '';
    DECLARE v_limitation TEXT DEFAULT '';
    DECLARE v_statusDelete INT;

    
    SELECT ActionCodeID INTO v_statusDelete
    FROM tactioncode
    WHERE Description = 'Delete';

    
    SET v_conditions = CONCAT('tc.Status != ', v_statusDelete);

    
    IF p_userID IS NOT NULL AND p_userID != '' THEN
        SET v_conditions = CONCAT(v_conditions, ' AND tc.UserID = ', QUOTE(p_userID));
    END IF;

    
    IF p_page IS NOT NULL AND p_pageSize IS NOT NULL THEN
        SET v_limitation = CONCAT('LIMIT ', p_pageSize, ' OFFSET ', (p_page - 1) * p_pageSize);
    END IF;

    
    SET @v_conditions = v_conditions;
    SET @v_limitation = v_limitation;

    SET @sql = CONCAT('
        SELECT 
            tc.UserContactDetailID AS userContactDetailID,
            tc.UserID AS userID,
            tc.AddressType AS addressTypeID,
            ad.LookupDetailName AS addressType,
            tc.CountryID AS countryID,
            c.RegionName AS country,
            tc.DistrictID AS districtID,
            d.RegionName AS district,
            tc.StateID AS stateID,
            s.RegionName AS state,
            tc.CityID AS city,
            tc.HouseName AS houseName,
            tc.StreetName AS streetName,
            tc.Place AS place,
            tc.LocalBodyType AS localBodyTypeID,
            lbt.RegionTypeName AS localBodyType,
            tc.LocalBodyName AS localBodyNameID,
            lbn.RegionName AS localBodyName,
            tc.WardID AS wardID,
            w.RegionName AS wardName,
            tc.PostOffice AS postOfficeID,
            p.RegionName AS postOffice,
            tc.PinCode AS pinCode,
            tc.CommunicationDetails AS communicationDetails,
            tc.SameAsBasicDetail AS sameAsBasicDetail
        FROM tusercontactdetail tc
        LEFT JOIN tlookupdetail ad ON tc.AddressType = ad.LookupDetailID
        LEFT JOIN tregion c ON tc.CountryID = c.RegionID
        LEFT JOIN tregion s ON tc.StateID = s.RegionID
        LEFT JOIN tregion d ON tc.DistrictID = d.RegionID
        LEFT JOIN tregion w ON tc.WardID = w.RegionID
        LEFT JOIN tregion p ON tc.PostOffice = p.RegionID
        LEFT JOIN tregiontype lbt ON tc.LocalBodyType = lbt.RegionTypeID
        LEFT JOIN tregion lbn ON tc.LocalBodyName = lbn.RegionID
        WHERE ', @v_conditions, ' ', @v_limitation);

    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    
    

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cSearchUserQualificationDetail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cSearchUserQualificationDetail`(IN p_hasConditions TEXT, IN p_hasLimitation TEXT)
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;
    DECLARE v_documentTypeID INT;
    DECLARE v_totalQualificationTypes INT;
    DECLARE v_userQualificationCount INT DEFAULT 0;

    
    SELECT ActionCodeID INTO v_deleteId
    FROM tactioncode
    WHERE Description = 'Delete';

    
    SELECT LookupDetailID INTO v_documentTypeID
    FROM tlookupdetail
    WHERE LookupDetailName = 'UserQualification';

    
    SELECT COUNT(*) INTO v_totalQualificationTypes
    FROM tlookupdetail
    WHERE LookupHeaderID = (SELECT LookupHeaderID FROM tlookupheader WHERE LookupTypeName = 'QualificationType');

    
    IF p_hasConditions IS NOT NULL AND p_hasConditions != '' THEN
        SET v_conditions = CONCAT('tuq.Status != ', v_deleteId, ' AND ', p_hasConditions);
    ELSE
        SET v_conditions = CONCAT('tuq.Status != ', v_deleteId);
    END IF;

    IF p_hasLimitation IS NOT NULL AND p_hasLimitation != '' THEN
        SET v_limitation = CONCAT(' ', p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;


    
    SET @v_conditions = v_conditions; 
    SET @v_limitation = v_limitation; 
    SET @v_documentTypeID = v_documentTypeID;

    SET @sql = CONCAT('
        SELECT 
            tuq.UserQualificationDetailID AS userQualificationDetailID,
            tuq.UserID AS userId,
            tu.FirstName AS firstName,
            tu.LastName AS lastName,
            tu.Email AS emailID,
            tu.PhoneNumber AS phoneNumber,
            trc.RegionName AS country,
            trc.RegionID AS countryID,
            trs.RegionName AS state,
            trs.RegionID AS stateID,
            trd.RegionName AS district,
            trd.RegionID AS districtID,
            tuq.LocalBodyType AS localBodyTypeID,
            trl.RegionTypeName AS localBodyType,
            tuq.LocalBodyName AS localBodyNameID,
            trn.RegionName AS localBodyName,
            tuq.QualificationTypeID AS qualificationTypeID,
            tlds.LookupDetailName AS qualificationTypeName,
            tuq.OrganizationID AS institutionID,
            tog.OrganizationName AS institution,
            tog.OrganizationTypeID AS institutionTypeID,
            tldr.LookupDetailName AS institutionType,
            unescape_html(tuq.EnrollmentNumber) AS enrollmentNumber,
            unescape_html(tuq.CertificateNumber) AS certificateNumber,
            tuq.CertificateDate AS certificateDate,
            tuq.Status AS status,
            unescape_html(tuq.Notes) AS notes,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        ''documentID'', u.DocumentID,
                        ''path'', u.DocumentUrl,
                        ''fileName'', u.DocumentName
                    )
                )
                FROM tdocument u
                WHERE u.OwnerID = tuq.UserQualificationDetailID AND u.DocumentTypeID = ', @v_documentTypeID, '
            ) AS uploads,
            (
                SELECT COUNT(DISTINCT tuq_inner.QualificationTypeID)
                FROM tuserqualificationdetail tuq_inner
                WHERE tuq_inner.UserID = tuq.UserID AND tuq_inner.Status != ', v_deleteId, '
            ) AS total_count,
            IF(
                (
                    SELECT COUNT(DISTINCT tuq_inner.QualificationTypeID)
                    FROM tuserqualificationdetail tuq_inner
                    WHERE tuq_inner.UserID = tuq.UserID AND tuq_inner.Status != ', v_deleteId, '
                ) = ', v_totalQualificationTypes, ',
                TRUE, 
                FALSE
            ) AS canCreateQualification
        FROM tuserqualificationdetail tuq
        INNER JOIN tuser tu ON tu.UserID = tuq.UserID
        LEFT JOIN tregion trc ON trc.RegionID = tuq.CountryID
        LEFT JOIN tregion trs ON trs.RegionID = tuq.StateID
        LEFT JOIN tregion trd ON trd.RegionID = tuq.DistrictID
        LEFT JOIN tregiontype trl ON trl.RegionTypeID = tuq.LocalBodyType
        LEFT JOIN tregion trn ON trn.RegionID = tuq.LocalBodyName
        LEFT JOIN torganization tog ON tog.OrganizationID = tuq.OrganizationID
        LEFT JOIN tlookupdetail tlds ON tlds.LookupDetailID = tuq.QualificationTypeID
        LEFT JOIN tlookupdetail tldr ON tldr.LookupDetailID = tog.OrganizationTypeID
        WHERE ', @v_conditions, ' ', @v_limitation, ';');

    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cShowApplyMembershipButton` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cShowApplyMembershipButton`(
IN p_organizationID int,
IN p_userID INT
)
BEGIN
	DECLARE v_activeID INT;
    DECLARE v_rejectedID INT;
    DECLARE v_pendingID INT;
	DECLARE v_cancelID INT;


		SELECT LookupDetailID INTO v_activeID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Active' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;
    	SELECT LookupDetailID INTO v_rejectedID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Rejected' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;
		SELECT LookupDetailID INTO v_pendingID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Pending' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;
    	SELECT LookupDetailID INTO v_cancelID
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Cancel' AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;

				SELECT tom.OrganizationMemberID AS organizationMemberID
                    , tom.Status AS statusID
					, tlds.LookupDetailName AS status
                    , tom.Notes AS notes
                    , CASE 
					WHEN tom.Status = v_activeID OR tom.Status = v_rejectedID OR tom.Status = v_pendingID 
                    THEN TRUE
					-- WHEN tom.Status = v_cancelID THEN FALSE
					ELSE FALSE 
				END AS isDisableApplyMembership
					, CASE 
					WHEN tom.Status = v_pendingID THEN FALSE 
					ELSE TRUE
				END AS isDisableRevokeMembership
				FROM torganizationmember tom
				LEFT JOIN tlookupdetail tlds ON tlds.LookupDetailID = tom.Status
				WHERE tom.OrganizationID = p_organizationID AND tom.MemberID = p_userID AND tom.Status != 53
	
    UNION ALL

    SELECT 
        NULL AS organizationMemberID,
        NULL AS statusID,
        NULL AS status,
        NULL AS notes,
        FALSE AS isDisableApplyMembership,
        TRUE AS isDisableRevokeMembership
    FROM DUAL
    WHERE NOT EXISTS (
        SELECT 1 
        FROM torganizationmember tom
		LEFT JOIN tlookupdetail tlds ON tlds.LookupDetailID = tom.Status
        WHERE OrganizationID = p_organizationID AND MemberID = p_userID AND tom.Status != 53
    );

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cUpdateNotificationStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cUpdateNotificationStatus`(
    IN p_notificationID INT,
    IN p_statusID INT,
    IN p_status VARCHAR(100),
    IN p_notes LONGTEXT,
    IN p_userID INT
)
BEGIN

    DECLARE v_status INT;
    DECLARE v_isApproved INT;

    -- Get the status ID based on the provided status name from the tlookupdetail table
    SELECT LookupDetailID INTO v_status
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = p_status AND tlh.LookupTypeName = 'NotificationStatus'
    LIMIT 1;
    
    -- If p_statusID is provided, use it to update the status
    IF p_statusID IS NOT NULL THEN
        UPDATE tnotification
        SET Status = p_statusID,
            Notes = p_notes,
            ApprovedBy = p_userID,
            ApprovedDate = now(),
            UpdatedBy = p_userID,
            UpdatedDate = now()
        WHERE NotificationID = p_notificationID;
        IF p_statusID = 54 THEN
		SET v_isApproved = 1;
        ELSE
		SET v_isApproved = 0;
        END IF;
    -- If p_statusID is not provided, use the status retrieved from tlookupdetail
    ELSE
        UPDATE tnotification
        SET Status = v_status,
            Notes = p_notes,
            ApprovedBy = p_userID,
            ApprovedDate = now(),
            UpdatedBy = p_userID,
            UpdatedDate = now()
        WHERE NotificationID = p_notificationID;
        
		IF p_status = 'Active' THEN
		SET v_isApproved = 1;
        ELSE
		SET v_isApproved = 0;
        END IF;
    END IF;

    -- Return the updated notification ID for confirmation
    SELECT p_notificationID AS NotificationID, v_isApproved AS IsApproved;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cUpdateOrganizationMemberOwnership` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cUpdateOrganizationMemberOwnership`(
    IN p_organizationId INT,
    IN p_userIds VARCHAR(255),
    IN p_isAdmin TINYINT
)
BEGIN
DECLARE rows_affected INT DEFAULT 0;

    SET @sql = CONCAT('UPDATE torganizationmember 
                      SET IsOwner = ', p_isAdmin, '
                      WHERE OrganizationMemberID != "" AND OrganizationID = ', p_organizationId, '
                      AND MemberID IN (', p_userIds, ') ');
                      
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    

    SELECT CONCAT('Successfully updated ownership for ', p_userIds) AS Result;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cUpdateOrganizationMemberStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cUpdateOrganizationMemberStatus`(
    IN p_organizationMemberID INT,
    IN p_statusID INT,
    IN p_status VARCHAR(100),
    IN p_notes LONGTEXT,
    IN p_userID INT
)
BEGIN

    DECLARE v_status INT;
	
    IF p_status IS NOT NULL AND p_statusID IS NULL THEN
    -- Get the status ID based on the provided status name from the tlookupdetail table
    SELECT LookupDetailID INTO v_status
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = p_status AND tlh.LookupTypeName = 'OrganizationMemberStatus'
    LIMIT 1;
    END IF;

    -- If p_statusID is provided, use it to update the status
    IF p_statusID IS NOT NULL THEN
        UPDATE torganizationmember
        SET Status = p_statusID,
            Notes = p_notes,
            UpdatedBy = p_userID,
            UpdatedDate = now()
        WHERE OrganizationMemberID = p_organizationMemberID;

    -- If p_statusID is not provided, use the status retrieved from tlookupdetail
    ELSE
        UPDATE torganizationmember
        SET Status = v_status,
            Notes = p_notes,
            UpdatedBy = p_userID,
            UpdatedDate = now()
        WHERE OrganizationMemberID = p_organizationMemberID;
    END IF;
    SELECT p_organizationMemberID AS OrganizationMemberID;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cUpdateOrganizationUserRole` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cUpdateOrganizationUserRole`(
    IN p_UserID VARCHAR(255), -- Accepts a comma-separated list of UserIDs
    IN p_IsAdmin TINYINT,
    IN p_OrganizationID INT,
    IN p_CurrentUserID INT
)
BEGIN
    DECLARE new_OrganizationRoleID INT;

    -- Fetch the OrganizationRoleID based on the input criteria
    SELECT OrganizationRoleID
    INTO new_OrganizationRoleID
    FROM torganizationrole
    WHERE IsAdmin = p_IsAdmin
      AND OrganizationID = p_OrganizationID
    LIMIT 1;

    -- Check if a valid OrganizationRoleID was found
    IF new_OrganizationRoleID IS NOT NULL THEN
        -- Split p_UserID and update each UserID
        CREATE TEMPORARY TABLE temp_userids (UserID INT);
        
        SET @query = CONCAT(
            'INSERT INTO temp_userids (UserID) VALUES ',
            (SELECT GROUP_CONCAT(CONCAT('(', t.id, ')'))
             FROM (
                 SELECT CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(p_UserID, ",", n.n), ",", -1) AS UNSIGNED) AS id
                 FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) n
                 WHERE n.n <= 1 + (LENGTH(p_UserID) - LENGTH(REPLACE(p_UserID, ",", "")))
             ) t
            )
        );
        PREPARE stmt FROM @query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
         -- Check if any UserID is not a member of the organization
        IF EXISTS (
            SELECT 1
            FROM temp_userids tu
            LEFT JOIN torganizationmember om
              ON tu.UserID = om.MemberID AND om.OrganizationID = p_OrganizationID
            WHERE om.OrganizationMemberID IS NULL
        ) THEN
            DROP TEMPORARY TABLE temp_userids;
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Only members of the specified organization can be assigned roles.';
        END IF;

        -- Update only the matching entries in torganizationuserrole
        UPDATE torganizationuserrole
        SET OrganizationRoleID = new_OrganizationRoleID,
			UpdatedBy = p_CurrentUserID,
            UpdatedDate = now()
        WHERE UserID IN (SELECT UserID FROM temp_userids)
          AND OrganizationRoleID IN (
              SELECT OrganizationRoleID
              FROM torganizationrole
              WHERE OrganizationID = p_OrganizationID
          );

        DROP TEMPORARY TABLE temp_userids;
    ELSE
        -- Handle the case where no matching record is found (optional)
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No matching OrganizationRoleID found for the given IsAdmin and OrganizationID';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cUpdateUserPassword` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cUpdateUserPassword`(
    IN p_userID INT, 
    IN p_newPassword TEXT,
    IN p_encryptedExistingPassword TEXT
)
BEGIN
    DECLARE v_userExists INT;
    DECLARE v_errorMessage TEXT;
    DECLARE v_isPasswordChange INT;
    
    SELECT COUNT(*)
        INTO v_isPasswordChange
        FROM tusersettings
        WHERE UserID = p_userID AND IsResetPassword = 1;

    IF p_encryptedExistingPassword IS NULL THEN
    
			IF v_isPasswordChange > 0 THEN
				-- Update password directly when existing password is not provided
				UPDATE tuser
				SET Password = p_newPassword
				WHERE UserID = p_userID;

				DELETE FROM tusersettings
				WHERE UserID = p_userID AND IsResetPassword = 1;
				
			ELSE
						SET v_errorMessage = 'Password reset request does not exist, try again';
                        SIGNAL SQLSTATE '45000'
						SET MESSAGE_TEXT = v_errorMessage;

			END IF;

    ELSE
        -- Check if a user exists with the provided credentials
        SELECT COUNT(*)
        INTO v_userExists
        FROM tuser
        WHERE UserID = p_userID AND Password = p_encryptedExistingPassword;

        IF v_userExists > 0 THEN
            -- Update password if user exists
            UPDATE tuser
            SET Password = p_newPassword
            WHERE UserID = p_userID;
        ELSE
            -- Raise an error if user credentials do not match
            SET v_errorMessage = 'No matching user found, wrong credentials';
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = v_errorMessage;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cValidateTemporaryPassword` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cValidateTemporaryPassword`(
    IN v_email TEXT,
    IN v_otp TEXT
)
BEGIN
    DECLARE v_isPasswordMatch INT;
    DECLARE v_isValidOtp INT;
    DECLARE v_userID INT;
    DECLARE v_errorMessage TEXT;
    DECLARE v_rowCount INT;

    -- Initialize the error message to NULL
    SET v_errorMessage = NULL;

    -- Fetch the UserID for the provided email
    SELECT UserID INTO v_userID
    FROM tuser
    WHERE Email = v_email;
    
    -- Check if the email exists
    IF v_userID IS NULL THEN
        SET v_errorMessage = 'Email not found.';
        SELECT v_errorMessage AS errorMessage;
    END IF;

    -- Check if OTP exists, is unused, and not expired
    SELECT UserSettingsID INTO v_isPasswordMatch
    FROM tusersettings 
    WHERE IsResetPassword = 0 
          AND UserID = v_userID 
          AND GeneratedPassword = v_otp
          AND PasswordExpiryTime > NOW(); -- Check against the expiry time

    -- If no valid OTP is found, determine the reason
    IF v_isPasswordMatch IS NULL THEN
        SELECT COUNT(*) INTO v_isValidOtp
        FROM tusersettings 
        WHERE UserID = v_userID 
              AND GeneratedPassword = v_otp;
        
        IF v_isValidOtp = 0 THEN
            -- No matching OTP found
            SET v_errorMessage = 'Invalid OTP.';
        ELSE
            -- Matching OTP is expired
            SET v_errorMessage = 'Password expired, try again.';
        END IF;

        -- Return the error message
        SELECT v_errorMessage AS errorMessage;
    ELSE
        -- If OTP is valid, mark it as used
        UPDATE tusersettings
        SET 
            IsResetPassword = 1,
            UpdatedBy = v_userID,
            UpdatedDate = NOW()
        WHERE UserID = v_userID AND UserSettingsID = v_isPasswordMatch;
        
        
        SET v_rowCount = ROW_COUNT();

		IF v_rowCount > 0 THEN
				-- Fetch user details if the update was successful
                SELECT u.UserID, u.FirstName, u.LastName, u.Email, ur.RoleID, r.RoleName,  u.SFID 
				FROM tuser u
				INNER JOIN tuserrole ur ON u.UserID = ur.UserID
				INNER JOIN trole r ON r.RoleID = ur.RoleID 
				WHERE u.UserID = v_userID;
		ELSE
			-- Return a message if no rows were updated
			SELECT 'No record updated' AS Message;
		END IF;

        -- Return a success message
        -- SELECT NULL AS errorMessage;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserByEmail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserByEmail`(IN userEmail VARCHAR(255))
BEGIN

    DECLARE v_status INT;
    DECLARE v_contactStatus INT;

    
    SELECT LookupDetailID INTO v_status
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName = 'UserStatus'
    LIMIT 1;

    
    SELECT ActionCodeID INTO v_contactStatus
    FROM tactioncode
    WHERE Description = 'Delete'
    LIMIT 1;

    
    SELECT 
        results.Email,
        results.userID,
        results.UserBasicDetailID
    FROM (
        SELECT 
            Email, 
            userID, 
            NULL AS UserBasicDetailID 
        FROM `tuser` 
        WHERE Email = userEmail AND Status != v_status

        UNION ALL

        SELECT 
            EmailID AS Email, 
            userID, 
            UserBasicDetailID  
        FROM `tuserbasicdetail` 
        WHERE EmailID = userEmail AND Status != v_contactStatus
    ) AS results;

    
    IF ROW_COUNT() = 0 THEN
        SELECT NULL AS Email, NULL AS userID, NULL AS UserBasicDetailID;
    END IF;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserDetailByEmail` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserDetailByEmail`(IN p_userEmail VARCHAR(255), IN p_userID VARCHAR(255), IN p_userBasicDetailID INT)
BEGIN

DECLARE v_status INT;
    DECLARE v_userStatus INT;

    
    SELECT ActionCodeID 
    INTO v_status 
    FROM tactioncode 
    WHERE Description = 'Delete'
    LIMIT 1;

    
    SELECT LookupDetailID 
    INTO v_userStatus
    FROM tlookupdetail tld
    INNER JOIN tlookupheader tlh ON tlh.LookupHeaderID = tld.LookupHeaderID
    WHERE tld.LookupDetailName = 'Deleted' AND tlh.LookupTypeName = 'UserStatus'
    LIMIT 1;

    
    IF p_userBasicDetailID IS NULL THEN

        
        SELECT UserID, FirstName, LastName, EmailID, PhoneNumber 
        FROM tuserbasicdetail 
        WHERE (EmailID = p_userEmail OR UserID = p_userID) AND Status != v_status;

        
        IF ROW_COUNT() = 0 THEN
            SELECT NULL AS UserID, NULL AS FirstName, NULL AS LastName, NULL AS EmailID, NULL AS PhoneNumber;
        END IF;

    ELSE
        
        SELECT 
            Email,
            userID,
            UserBasicDetailID
        FROM (
            
            SELECT Email, userID, NULL AS UserBasicDetailID 
            FROM `tuser` 
            WHERE Email = p_userEmail AND userID != p_userID AND Status != v_userStatus

            UNION ALL

            
            SELECT EmailID AS Email, userID, UserBasicDetailID  
            FROM `tuserbasicdetail` 
            WHERE EmailID = p_userEmail AND UserBasicDetailID != p_userBasicDetailID AND Status != v_status
        ) AS results;

        
        IF ROW_COUNT() = 0 THEN
            SELECT NULL AS Email, NULL AS userID, NULL AS UserBasicDetailID;
        END IF;
    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserDetails`()
BEGIN
    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'userQualificationDetailID', uq.UserQualificationDetailID,
            'qualificationTypeID', uq.QualificationTypeID,
            'userId', uq.UserID,
            'uploads', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'documentID', u.DocumentID,
                        'path', u.DocumentUrl,
                        'fileName', u.DocumentName
                    )
                )
                FROM tdocument u
                WHERE u.OwnerID = uq.userId
            )
        )
    ) AS result
    FROM tuserqualificationdetail uq;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `qGetCredentialSetting` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `qGetCredentialSetting`()
BEGIN
    SELECT tcd.CredentialValue AS Credential
    FROM tcredential tc
    INNER JOIN tcredentialdetail tcd ON tc.CredentialID = tcd.CredentialID
    WHERE tcd.IsLiveMode = 0 AND tcd.IsActive = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Test` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = latin1 */ ;
/*!50003 SET character_set_results = latin1 */ ;
/*!50003 SET collation_connection  = latin1_swedish_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Test`(
    IN p_hasConditions TEXT,
    IN p_hasLimitation TEXT
)
BEGIN
    DECLARE v_conditions TEXT;
    DECLARE v_limitation TEXT;
    DECLARE v_deleteId INT;

    
    SELECT ActionCodeID INTO v_deleteId
    FROM tactioncode
    WHERE Description = 'Delete';

    
    IF p_hasConditions IS NOT NULL THEN
        SET v_conditions = CONCAT('u.Status != ', v_deleteId, ' AND ', p_hasConditions);
    ELSE
        SET v_conditions = CONCAT('u.Status != ', v_deleteId);
    END IF;

    IF p_hasLimitation IS NOT NULL THEN
        SET v_limitation = CONCAT(' ', p_hasLimitation);
    ELSE
        SET v_limitation = '';
    END IF;

    
    SET @v_conditions = v_conditions; 
    SET @v_limitation = v_limitation;

    
    SET @sql = CONCAT(
        'SELECT 
            u.UserID as userID,
            u.UserBasicDetailID as userBasicDetailID,
            unescape_html(u.FirstName) as firstName,
            unescape_html(u.MiddleName) as middleName, 
            unescape_html(u.LastName) as lastName,
            unescape_html(u.NickName) as nickName, 
            u.EmailID as emailID,
            u.PhoneNumber as phoneNumber,
            u.AlternativePhoneNumber as alternativePhoneNumber,
            u.DateOfBirth as dateOfBirth,
            unescape_html(u.Bio) as bio,
            b.LookupDetailName as bloodGroup,
            u.BloodGroup as bloodGroupId,
            c.RegionName as country,
            c.RegionID as countryID,
            s.RegionName as state,
            s.RegionID as stateID,
            d.RegionName as district,
            d.RegionID as districtID,
            unescape_html(u.HouseName) as houseName,
            unescape_html(u.StreetName) as streetName,
            unescape_html(u.PinCode) as pinCode,
            unescape_html(u.Place) as place,
            w.RegionName as wardName,
            w.RegionId as wardId,
            p.RegionName as postOffice,
            p.RegionId as postOfficeId,
            lbt.RegionTypeID as localBodyTypeId,
            lbt.RegionTypeName as localBodyType,
            lbn.RegionId as localBodyNameId,
            lbn.RegionName as localBodyName,
            g.LookupDetailName as gender,
            u.Gender as genderId,
            unescape_html(u.City) as city,

            (SELECT JSON_ARRAYAGG(JSON_OBJECT(''id'', t.RegionID, ''name'', t.RegionName))
             FROM tregion t
             WHERE JSON_CONTAINS(u.RepresentingDistrictID, JSON_QUOTE(t.RegionName))
             AND t.RegionTypeID = 3
            ) as representingDistricts,

            (SELECT COUNT(*)
             FROM tuserbasicdetail u
             LEFT JOIN tlookupdetail b ON u.BloodGroup = b.LookupDetailID
             LEFT JOIN tregion c ON u.CountryID = c.RegionID
             LEFT JOIN tregion s ON u.StateID = s.RegionID
             LEFT JOIN tregion d ON u.DistrictID = d.RegionID
             LEFT JOIN tregion w ON u.WardID = w.RegionID
             LEFT JOIN tregion p ON u.PostOffice = p.RegionID
             LEFT JOIN tregiontype lbt ON u.LocalBodyType = lbt.RegionTypeID
             LEFT JOIN tregion lbn ON u.LocalBodyName = lbn.RegionID
             LEFT JOIN tlookupdetail g ON u.Gender = g.LookupDetailID
             WHERE ', @v_conditions, ') AS total_count
         FROM tuserbasicdetail u
         LEFT JOIN tlookupdetail b ON u.BloodGroup = b.LookupDetailID
         LEFT JOIN tregion c ON u.CountryID = c.RegionID
         LEFT JOIN tregion s ON u.StateID = s.RegionID
         LEFT JOIN tregion d ON u.DistrictID = d.RegionID
         LEFT JOIN tregion w ON u.WardID = w.RegionID
         LEFT JOIN tregion p ON u.PostOffice = p.RegionID
         LEFT JOIN tregiontype lbt ON u.LocalBodyType = lbt.RegionTypeID
         LEFT JOIN tregion lbn ON u.LocalBodyName = lbn.RegionID
         LEFT JOIN tlookupdetail g ON u.Gender = g.LookupDetailID
         WHERE ', @v_conditions, @v_limitation);

    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-31 15:44:40
