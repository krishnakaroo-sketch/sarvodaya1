-- ====================================================================
-- COMPLETE DATABASE SCHEMA & DATA FOR SARVODAYA SHIKSHAN MANDAL, CHANDRAPUR
-- Target Domain: https://ssmchandrapur.in/
-- Target Hostinger Database: u855611336_Sarvodaya (MySQL / phpMyAdmin)
-- Generated on: 2026-09-12T12:22:50.735Z
--
-- INCLUDED TABLES:
-- 1. admins               - Administrative user accounts with bcrypt password hashing
-- 2. content_blocks       - All 69 rich content blocks (messages, history, vision, contacts, board)
-- 3. announcements        - Notices and news with PDF and image attachment support
-- 4. events               - Academic, cultural, and sports events calendar
-- 5. institutions         - Complete profiles and directory of all 11 schools and colleges
-- 6. careers              - Job openings, eligibility requirements, and recruitment advertisements
-- 7. job_applications     - Online applicant submissions, resumes, certificates, and tracking numbers
-- 8. inquiries            - Public contact and admission inquiries
-- 9. alumni_registrations - Alumni registration directory and member profiles
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------------------
-- 1. TABLE: admins
-- Administrative user accounts with secure bcrypt password hashing
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. TABLE: content_blocks
-- All 69 rich content blocks (executive messages, history, vision, contact details, board member data, etc.)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `content_blocks`;
CREATE TABLE `content_blocks` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `content` LONGTEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. TABLE: announcements
-- Notices and news with support for PDF and image attachments
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `content` TEXT,
  `date` VARCHAR(100),
  `is_new` TINYINT(1) DEFAULT 0,
  `display_order` INT DEFAULT 0,
  `attachmentUrl` TEXT,
  `attachmentOriginalName` VARCHAR(255),
  `attachmentType` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. TABLE: events
-- Academic, cultural, and sports events calendar
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `date` VARCHAR(50),
  `month` VARCHAR(50),
  `title` VARCHAR(500),
  `location` VARCHAR(500),
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. TABLE: institutions
-- Complete profiles and directory of all 11 schools and colleges
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `institutions`;
CREATE TABLE `institutions` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(500) NOT NULL,
  `type` VARCHAR(150),
  `description` TEXT,
  `image_url` TEXT,
  `link` VARCHAR(500),
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. TABLE: careers
-- Job openings, eligibility requirements, and recruitment advertisements
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `careers`;
CREATE TABLE `careers` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `department` VARCHAR(150),
  `location` VARCHAR(150),
  `type` VARCHAR(50),
  `description` TEXT,
  `requirements` TEXT,
  `advertisementUrl` TEXT,
  `advertisementOriginalName` VARCHAR(255),
  `advertisementType` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. TABLE: job_applications
-- Online applicant submissions, resumes, certificates, and application tracking numbers
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `job_applications`;
CREATE TABLE `job_applications` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `applicationNumber` VARCHAR(100),
  `careerId` VARCHAR(255),
  `jobTitle` VARCHAR(255),
  `name` VARCHAR(200) DEFAULT '',
  `email` VARCHAR(255) DEFAULT '',
  `phone` VARCHAR(50) DEFAULT '',
  `coverLetter` TEXT,
  `resumeUrl` TEXT,
  `resumeOriginalName` VARCHAR(255),
  `photoUrl` TEXT,
  `signatureUrl` TEXT,
  `documentsUrl` TEXT,
  `documentsOriginalName` VARCHAR(255),
  `adminNotes` TEXT,
  `details` LONGTEXT,
  `status` VARCHAR(50) DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. TABLE: inquiries
-- Public contact and admission inquiries
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `inquiries`;
CREATE TABLE `inquiries` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) DEFAULT '',
  `email` VARCHAR(255) DEFAULT '',
  `phone` VARCHAR(50) DEFAULT '',
  `program` VARCHAR(255),
  `message` TEXT,
  `status` VARCHAR(50) DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 9. TABLE: alumni_registrations
-- Alumni registration directory and member profiles
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `alumni_registrations`;
CREATE TABLE `alumni_registrations` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `fullName` VARCHAR(255) DEFAULT '',
  `email` VARCHAR(255) DEFAULT '',
  `phone` VARCHAR(50) DEFAULT '',
  `dob` VARCHAR(50),
  `gender` VARCHAR(50),
  `institution` VARCHAR(255),
  `passingYear` VARCHAR(50),
  `degree` VARCHAR(255),
  `profession` VARCHAR(255),
  `company` VARCHAR(255),
  `designation` VARCHAR(255),
  `location` VARCHAR(255),
  `linkedin` VARCHAR(500),
  `message` TEXT,
  `photoUrl` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- SEED DATA FOR ALL 9 TABLES
-- ====================================================================

-- 1. ADMIN ACCOUNTS (bcrypt hashes)
-- Username: 'admin'        -> Password: 'admin' (also accepts 'Pass')
-- Username: 'admin@ssm.edu' -> Password: 'password123'
INSERT INTO `admins` (`id`, `email`, `password_hash`, `role`) VALUES
(1, 'admin', '$2y$10$.w6MlMpEmvjO6SIV2l9vmuu98ZhBhAzpsKufbFN77s1L/hrlb6fcu', 'master'),
(2, 'admin@ssm.edu', '$2y$10$Iov2i2DmfZI5Aqo9p32mQu3q4m1wO2mq/ZErca8OgHdp78HbPL4OG', 'master');

-- 2. CONTENT BLOCKS (Total: 210 items)
INSERT INTO `content_blocks` (`id`, `content`) VALUES
('Org_ShortName', 'SSM Chandrapur'),
('Org_Name_Mr', 'सर्वोदय शिक्षण मंडळ, चंद्रपूर'),
('Org_Name_En', 'Sarvodaya Shikshan Mandal, Chandrapur'),
('Org_Subtitle_Mr', 'चंद्रपूर व गडचिरोली जिल्ह्यातील अग्रगण्य शैक्षणिक संस्था • रजि.नं F-09 (C)'),
('Org_Subtitle_En', 'Central India\'s Premier Educational Network • Reg. No. F-09 (C)'),
('Org_Location', 'Chandrapur, Maharashtra - 442401'),
('Org_Est', '1961'),
('Org_Logo_URL', '/logo.png'),
('Nav_About_Mr', 'संस्थेविषयी'),
('Nav_About_En', 'About Mandal'),
('Nav_About', 'संस्थेविषयी'),
('Nav_Institutions_Mr', 'आमच्या शिक्षण संस्था'),
('Nav_Institutions_En', 'Our Institutions'),
('Nav_Institutions', 'आमच्या शिक्षण संस्था'),
('Nav_Media_Mr', 'वृत्त व घडामोडी'),
('Nav_Media_En', 'Media & Updates'),
('Nav_Media', 'वृत्त व घडामोडी'),
('Nav_Careers_Mr', 'नोकरीच्या संधी'),
('Nav_Careers_En', 'Careers'),
('Nav_Careers', 'नोकरीच्या संधी'),
('Nav_Alumni_Mr', 'माजी विद्यार्थी'),
('Nav_Alumni_En', 'Alumni'),
('Nav_Alumni', 'माजी विद्यार्थी'),
('Nav_Alumni_URL', '/alumni'),
('Nav_StudentPortal_Mr', 'विद्यार्थी कक्ष'),
('Nav_StudentPortal_En', 'Student Portal'),
('Nav_StudentPortal', 'विद्यार्थी कक्ष'),
('Nav_StudentPortal_URL', 'https://spm.ac.in'),
('Footer_Name', 'सर्वोदय शिक्षण मंडळ, चंद्रपूर'),
('Footer_Copyright', 'सर्व हक्क सुरक्षित. Sarvodaya Shikshan Mandal, Chandrapur. All Rights Reserved.'),
('Contact_Title_Mr', 'संपर्क व मार्गदर्शन केंद्र'),
('Contact_Title_En', 'Contact & Information Center'),
('Contact_Description_Mr', 'आमच्या कोणत्याही शाखेबद्दल, प्रवेशाबद्दल किंवा अधिक माहितीसाठी खालील पत्त्यावर किंवा संपर्क क्रमांकावर संपर्क साधावा.'),
('Contact_Description_En', 'Reach out to our central society headquarters or individual institutional administrative offices for inquiries, admissions, and verifications.'),
('Contact_Phone', '07172 - 255778'),
('Contact_LibraryPhone', '07172 - 255779'),
('Contact_Email', 'chdspm@gmail.com'),
('Contact_Address_Mr', 'सर्वोदय शिक्षण मंडळ, सरदार पटेल महाविद्यालय परिसर, गंज वॉर्ड, चंद्रपूर - ४४२ ४०२ (महाराष्ट्र)'),
('Contact_Address_En', 'Sarvodaya Shikshan Mandal, Sardar Patel College Campus, Ganj Ward, Chandrapur - 442 402, Maharashtra, India'),
('Contact_Map_URL', 'https://maps.google.com/?q=Sardar+Patel+Mahavidyalaya+Chandrapur'),
('Social_Facebook', 'https://facebook.com'),
('Social_Twitter', 'https://twitter.com'),
('Social_Instagram', 'https://instagram.com'),
('Social_LinkedIn', 'https://linkedin.com'),
('Social_YouTube', 'https://youtube.com'),
('Social_WhatsApp', 'https://wa.me/917172255778'),
('Hero_PreTitle_Mr', '।। ज्ञान, शील आणि संस्कार ।।'),
('Hero_PreTitle_En', 'Knowledge • Integrity • Empowerment'),
('Hero_Title_Mr', 'ग्रामीण व दुर्गम भागातील विद्यार्थ्यांच्या उज्ज्वल भविष्यासाठी कटिबद्ध'),
('Hero_Title_En', 'Empowering Generations Through Transformative Education in Central India'),
('Hero_Description_Mr', '१९६१ पासून चंद्रपूर आणि गडचिरोली परिसरातील लाखो विद्यार्थ्यांच्या जीवनाला आकार देणारी मध्य भारतातील अग्रगण्य शैक्षणिक संस्था.'),
('Hero_Description_En', 'Established in 1961, Sarvodaya Shikshan Mandal manages 11 renowned institutions providing world-class higher education, research, social work, legal studies, and school education.'),
('Hero_Background_Image', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80'),
('Leadership_Title_Mr', 'संस्थेचे नेतृत्व व कार्यकारिणी'),
('Leadership_Title_En', 'Executive Leadership & Board of Directors'),
('Institutions_Title_Mr', 'आमच्या शैक्षणिक संस्था व महाविद्यालये'),
('Institutions_Title_En', 'Our Network of Educational Institutions'),
('Media_Title_Mr', 'ताज्या सूचना व आगामी कार्यक्रम'),
('Media_Title_En', 'Announcements & Upcoming Events'),
('Careers_Title_Mr', 'करिअर व पदभरती संधी'),
('Careers_Title_En', 'Careers & Current Opportunities'),
('Careers_PreTitle_Mr', 'संस्थेत कार्य करण्याची सुवर्णसंधी'),
('Careers_PreTitle_En', 'Join Our Prestigious Academic Network'),
('Careers_Desc_Mr', 'सर्वोदय शिक्षण मंडळाच्या विविध शाखांमध्ये प्राध्यापक, शिक्षक आणि प्रशासकीय पदांसाठी नियमित भरती प्रक्रिया राबवली जाते.'),
('Careers_Desc_En', 'Sarvodaya Shikshan Mandal invites dynamic educators and administrative professionals to shape the future with us.'),
('Careers_No_Openings_Mr', 'सध्या कोणतीही रिक्त पदे उपलब्ध नाहीत. कृपया आगामी भरतीसाठी नियमित भेट द्या.'),
('Careers_No_Openings_En', 'No current openings at this time. Please check back later for upcoming notifications.'),
('Careers_Email', 'careers@ssmchandrapur.org'),
('President_Name_Mr', 'मा. श्री. अरविंद नामदेवराव पोरेड्डीवार'),
('President_Name_En', 'Hon. Shri Arvind Namdevrao Poreddiwar'),
('President_Title_Mr', 'अध्यक्ष, सर्वोदय शिक्षण मंडळ, चंद्रपूर'),
('President_Title_En', 'President, Sarvodaya Shikshan Mandal, Chandrapur'),
('President_Image', '/images/leaders/arvind_poreddiwar.jpg'),
('President_Quote_Mr', 'ज्ञान, शील आणि संस्कारांच्या माध्यमातून सर्वोदयाचे स्वप्न साकार करणे व ग्रामीण-दुर्गम भागातील विद्यार्थ्यांना राष्ट्रउभारणीत अग्रेसर करणे हेच आमचे आद्य कर्तव्य आहे.'),
('President_Quote_En', 'To realize the vision of \'Sarvodaya\' — the upliftment of all through knowledge, character, and ethical values — and empower rural and tribal youth to become leaders in nation-building.'),
('President_Text_Mr', 'सर्वोदय शिक्षण मंडळात आपले स्वागत आहे.\n\nशिक्षण म्हणजे केवळ माहिती गोळा करणे नव्हे, तर ती जीवनाची एक पूर्वतयारी आहे. आमच्या स्थापनेपासूनच, चंद्रपूर आणि गडचिरोली सारख्या अतिदुर्गम आणि वंचित भागात उच्च शिक्षणाची ज्ञानगंगा पोहोचवण्याच्या ध्येयाशी आम्ही कटिबद्ध आहोत.\n\n\'सर्वोदय\' या आमच्या तत्त्वज्ञानाचा अर्थ आहे- सर्वांचा उदय आणि सर्वांचा विकास. आमचा असा ठाम विश्वास आहे की, आपल्या देशाची खरी प्रगती तळागाळातील, ग्रामीण आणि आदिवासी तरुणांच्या सक्षमीकरणातच दडलेली आहे. आधुनिक विज्ञान आणि आपली पारंपारिक सांस्कृतिक मूल्ये यांचा सुरेख संगम साधून केवळ यशस्वी व्यावसायिकच नव्हे, तर चारित्र्यवान आणि नीतिमान नागरिक घडवण्यासाठी आम्ही नेहमी प्रयत्नशील आहोत.\n\nमी आपणा सर्वांना या शैक्षणिक क्रांतीचा एक भाग होण्यासाठी आमंत्रित करतो. चला, एकत्र मिळून एका उज्ज्वल आणि समतापूर्ण भविष्याची निर्मिती करूया.'),
('President_Text_En', 'Welcome to Sarvodaya Shikshan Mandal.\n\nEducation is not merely the accumulation of facts; it is the preparation for life itself. Since our inception, we have been steadfast in our mission to bring the light of higher education to the most remote and underserved regions of Chandrapur and Gadchiroli.\n\nOur philosophy of \'Sarvodaya\' means the rise and awakening of everyone. We believe that true progress of our nation lies in empowering the marginalized, the rural, and the tribal youth. We strive to provide an environment where traditional cultural values harmonize perfectly with modern scientific temper, creating not just successful professionals, but morally upright citizens.\n\nI invite you to be a part of this academic revolution. Together, let us shape a brighter, more equitable future.'),
('Secretary_Name_Mr', 'मा. श्री. प्रशांत शांताराम पोटदुखे'),
('Secretary_Name_En', 'Hon. Shri Prashant Shantaram Potdukhe'),
('Secretary_Title_Mr', 'सचिव, सर्वोदय शिक्षण मंडळ, चंद्रपूर'),
('Secretary_Title_En', 'Secretary, Sarvodaya Shikshan Mandal, Chandrapur'),
('Secretary_Image', '/images/leaders/prashant_potdukhe.jpg'),
('Secretary_Quote_Mr', 'प्रचंड वारसा लाभलेल्या संस्थांची उभारणी करण्यासाठी प्रशासकीय कार्यक्षमता आणि शैक्षणिक बुद्धिमत्ता यांची सांगड घालणे आवश्यक आहे.'),
('Secretary_Quote_En', 'Administrative efficiency and academic brilliance must go hand-in-hand to forge institutions of monumental legacy.'),
('Secretary_Text_Mr', 'स्वागत आहे,\n\nमंडळाचे सचिव म्हणून, अनेक महाविद्यालये आणि शाळांच्या गरजांचे व्यवस्थापन करण्यासाठी अचूकता, दूरदृष्टी आणि बदलत्या शैक्षणिक प्रवाहांची सखोल जाण असणे आवश्यक आहे. कडक शैक्षणिक मानके आणि संवेदनशील प्रशासन यांच्यात योग्य समतोल राखणे हे आमचे ध्येय आहे.\n\nआम्ही आमची प्रशासकीय कार्यपद्धती सुलभ केली आहे, कामाचे संगणकीकरण केले आहे आणि प्रत्येक शिक्षकाला त्यांच्या उत्कृष्ट अध्यापनात मदत मिळेल याची खात्री केली आहे. आमचे व्यवस्थापन, कर्मचारी आणि विद्यार्थी यांच्यातील समन्वय हीच आमच्या मंडळाच्या अभूतपूर्व यशाची आणि प्रगतीची प्रेरक शक्ती आहे.'),
('Secretary_Text_En', 'Welcome,\n\nAs the Secretary of the Mandal, managing the dynamic needs of multiple colleges and schools requires precision, foresight, and a deep understanding of evolving educational paradigms. Our goal is to maintain a perfect balance between rigorous academic standards and compassionate administration.\n\nWe have streamlined our governance models, digitized our workflows, and ensured that every faculty member is supported in their pursuit of teaching excellence. The synergy between our management, staff, and students is the driving force behind the unprecedented success and growth of our Mandal.'),
('WorkingPresident_Name_Mr', 'मा. श्री. किशोर गजानन जोरगेवार'),
('WorkingPresident_Name_En', 'Hon. Shri Kishor Gajanan Jorgewar'),
('WorkingPresident_Title_Mr', 'कार्याध्यक्ष (Executive President)'),
('WorkingPresident_Title_En', 'Executive President, Sarvodaya Shikshan Mandal'),
('WorkingPresident_Image', '/images/leaders/kishor_jorgewar.jpg'),
('WorkingPresident_Quote_Mr', 'अंमलबजावणी हा ध्येय आणि वास्तवातील दुवा आहे. आपले शैक्षणिक आदर्श उत्कृष्ट पायाभूत सुविधा आणि गुणवत्तेत रूपांतरित करण्यासाठी आम्ही कटिबद्ध आहोत.'),
('WorkingPresident_Quote_En', 'Execution is the bridge between vision and reality. We are dedicated to translating our educational ideals into tangible, transformative infrastructure and academic excellence.'),
('WorkingPresident_Text_Mr', 'सर्वांना नमस्कार,\n\nसर्वोदय शिक्षण मंडळाचा कार्याध्यक्ष या नात्याने, संस्थेच्या दूरदृष्टीला योग्य दिशा देणे आणि तिची प्रभावी अंमलबजावणी करणे हे माझे प्रमुख उद्दिष्ट आहे. आमच्या ११ शैक्षणिक संस्थांमध्ये अद्ययावत सुविधा निर्माण करणे आणि २२,००० हून अधिक विद्यार्थ्यांना विनाअडथळा दर्जेदार शिक्षण उपलब्ध करून देणे ही एक मोठी जबाबदारी आहे.\n\nआम्ही सातत्याने तंत्रज्ञान अद्ययावत करत आहोत, प्रयोगशाळांचे आधुनिकीकरण करत आहोत आणि ग्रंथालये समृद्ध करत आहोत. आमचे प्रशासकीय आणि शिक्षक कर्मचारी प्रत्येक विद्यार्थ्याला एक शिस्तबद्ध, पोषक आणि सुरक्षित वातावरण प्रदान करण्यासाठी अथक परिश्रम करत आहेत.\n\nपारदर्शकता, नाविन्य आणि विद्यार्थ्यांच्या कल्याणासाठी आम्ही सदैव बांधील आहोत.'),
('WorkingPresident_Text_En', 'Greetings to all,\n\nAs the Executive President of Sarvodaya Shikshan Mandal, my primary focus is on ensuring that our visionary goals are met with robust execution. Establishing state-of-the-art facilities across our 11 institutions and ensuring uninterrupted, high-quality education for over 22,000 students is a monumental responsibility.\n\nWe are constantly upgrading our technological landscape, modernizing our laboratories, and enriching our libraries. Our administrative and teaching staff work tirelessly to create a seamless, disciplined, and nurturing environment for every student who steps into our campuses.\n\nWe remain committed to transparency, innovation, and an unwavering focus on student welfare.'),
('VicePresident1_Name_Mr', 'मा. श्री. सुदर्शन भगवानराव निमकर'),
('VicePresident1_Name_En', 'Hon. Shri Sudarshan Bhagwanrao Nimkar'),
('VicePresident1_Title_Mr', 'उपाध्यक्ष (Vice President)'),
('VicePresident1_Title_En', 'Vice President, Sarvodaya Shikshan Mandal'),
('VicePresident1_Image', '/images/leaders/sudarshan_nimkar.jpg'),
('VicePresident1_Text_Mr', 'नमस्कार,\n\nएक संस्था म्हणून आमची ही बांधिलकी आहे की भौगोलिक परिस्थितीमुळे कोणाचेही भवितव्य थांबू नये. सर्वोदय शिक्षण मंडळाने या परिसरातील अतिशय दुर्गम भागातही सक्षम शैक्षणिक परिसंस्था निर्माण केल्या आहेत, याचा आम्हाला सार्थ अभिमान आहे.\n\nउत्कृष्ट मार्गदर्शन, भक्कम शैक्षणिक आराखडा आणि सातत्यपूर्ण मार्गदर्शनातून आम्ही तळागाळातील विद्यार्थ्यांना मोठी स्वप्ने पाहण्यास आणि ती पूर्ण करण्यास मदत करत आहोत.'),
('VicePresident1_Text_En', 'Hello,\n\nOur commitment as an institution is to ensure that geography never dictates destiny. We are incredibly proud of the fact that Sarvodaya Shikshan Mandal has built strong educational ecosystems in the most difficult terrains of the region.\n\nBy providing superior guidance, robust academic frameworks, and continuous mentorship, we are helping students from the heartlands dream big and achieve even bigger.'),
('VicePresident2_Name_Mr', 'मा. सौ. सगुणा पेंन्टाजी तलांडी'),
('VicePresident2_Name_En', 'Hon. Smt. Saguna Pentaji Talandi'),
('VicePresident2_Title_Mr', 'उपाध्यक्षा (Vice President)'),
('VicePresident2_Title_En', 'Vice President, Sarvodaya Shikshan Mandal'),
('VicePresident2_Image', '/images/leaders/saguna_talandi.jpg'),
('VicePresident2_Text_Mr', 'नमस्कार,\n\nसामाजिक समतेसाठी शिक्षण हा सर्वात प्रभावी मार्ग आहे. सर्वोदय शिक्षण मंडळात आम्ही तरुणी आणि उपेक्षित घटकांच्या शिक्षणावर व त्यांच्या सर्वांगीण विकासावर विशेष भर देतो.\n\nमुलींसाठी एक सुरक्षित, प्रेरणादायी आणि अत्यंत पोषक वातावरण सुनिश्चित करण्यासाठी आम्ही अनेक आधारभूत यंत्रणा कार्यान्वित केल्या आहेत. जेव्हा तुम्ही एका मुलीला शिक्षित करता, तेव्हा तुम्ही संपूर्ण पिढीला उन्नत करता.'),
('VicePresident2_Text_En', 'Greetings,\n\nEducation is the most powerful catalyst for social equity. At Sarvodaya Shikshan Mandal, we place a special emphasis on the education and holistic development of young women and marginalized communities.\n\nWe have instituted numerous support systems to ensure a safe, encouraging, and highly productive environment for girls. When you educate a woman, you elevate an entire generation.'),
('JointSecretary_Name_Mr', 'मा. डॉ. कीर्तिवर्धन दीक्षित'),
('JointSecretary_Name_En', 'Hon. Dr. Kirtiwardhan Dixit'),
('JointSecretary_Title_Mr', 'सहसचिव (Joint Secretary)'),
('JointSecretary_Title_En', 'Joint Secretary, Sarvodaya Shikshan Mandal'),
('JointSecretary_Image', '/images/leaders/leader6.jpg'),
('JointSecretary_Quote_Mr', 'अध्यापनातील नाविन्य आणि आधुनिक जागतिक आव्हानांना सामोरे जाण्याची क्षमता हेच आपल्या शैक्षणिक भविष्याची दिशा ठरवतात.'),
('JointSecretary_Quote_En', 'Innovation in teaching and adaptability to modern global challenges define the future of our educational endeavors.'),
('JointSecretary_Text_Mr', 'नमस्कार,\n\nवेगाने बदलणाऱ्या जगात, आपल्या अध्यापनाच्या पद्धती स्थिर राहू शकत नाहीत. सहसचिव या नात्याने, आपल्या अभ्यासक्रमात आधुनिक पद्धती, कौशल्य-आधारित प्रशिक्षण आणि संशोधन-केंद्रीत विचारांचा समावेश करण्यासाठी मी विशेष लक्ष देत आहे.\n\nआमचे विद्यार्थी केवळ पदवीधारक न राहता ते निर्माते, विचारवंत आणि संशोधक व्हावेत हीच आमची इच्छा आहे.'),
('JointSecretary_Text_En', 'Greetings,\n\nIn a rapidly changing world, our pedagogical approaches cannot remain static. As Joint Secretary, I am deeply invested in introducing modern methodologies, skill-based training, and research-oriented thinking into our curriculums.\n\nWe want our students to not only be degree holders but to be creators, thinkers, and innovators.'),
('Treasurer_Name_Mr', 'मा. श्री. आर. एम. चिंताळवार'),
('Treasurer_Name_En', 'Hon. Shri R. M. Chintalwar'),
('Treasurer_Title_Mr', 'कोषाध्यक्ष (Treasurer)'),
('Treasurer_Title_En', 'Treasurer, Sarvodaya Shikshan Mandal'),
('Treasurer_Image', '/images/leaders/leader7.jpg'),
('Treasurer_Quote_Mr', 'आर्थिक शिस्त हे सुनिश्चित करते की, परवडणारे व जागतिक दर्जाचे शिक्षण देण्याचे आमचे मुख्य ध्येय कायमस्वरूपी शाश्वत राहील.'),
('Treasurer_Quote_En', 'Financial discipline ensures that our core mission of providing affordable, world-class education remains perpetually sustainable.'),
('Treasurer_Text_Mr', 'नमस्कार,\n\nसर्वोदय शिक्षण मंडळात, प्रत्येक संसाधनाचा वापर अत्यंत सचोटीने आणि केवळ विद्यार्थ्यांच्या भल्यासाठी केला जातो. कोषाध्यक्ष म्हणून, आर्थिक शिस्त आणि पारदर्शकता राखणे ही माझी सर्वोच्च प्राथमिकता आहे.\n\nआमच्या शाश्वत आर्थिक धोरणांमुळेच, अतिशय कमी शुल्कातही आम्ही अद्ययावत पायाभूत सुविधा, उत्कृष्ट शिक्षक आणि दर्जेदार संसाधने पुरवू शकतो.'),
('Treasurer_Text_En', 'Hello,\n\nAt Sarvodaya Shikshan Mandal, every resource is mobilized with absolute integrity and directed purely toward the betterment of our students. As Treasurer, maintaining financial discipline and transparency is paramount.\n\nOur sustainable financial practices ensure that despite minimal fees, we provide maximum infrastructure, excellent faculty, and outstanding resources.'),
('About_Title_Mr', 'चार दशकांहून अधिक काळाचा शैक्षणिक उत्कृष्टतेचा वारसा.'),
('About_Title', 'Managing educational excellence for over four decades.'),
('About_Paragraph_Mr', '१९८३ मध्ये स्थापन झालेले सर्वोदय शिक्षण मंडळ, चंद्रपूर ही या भागातील शैक्षणिक विकासाचा एक भक्कम आधारस्तंभ आहे. सर्वांसाठी दर्जेदार व सुलभ शिक्षण उपलब्ध करून देण्याच्या ध्येयाने सुरू झालेली ही संस्था आज ११ नामांकित संस्थांचे एक विशाल संकुल बनली आहे.\n\nआमचे अग्रगण्य सरदार पटेल महाविद्यालय हे विद्यार्थ्यांच्या सर्वांगीण विकासाचे मूर्तिमंत उदाहरण असून, ते कठोर शैक्षणिक निकषांची नैतिक व सांस्कृतिक मूल्यांशी यशस्वी सांगड घालते.'),
('About_Paragraph', 'Founded in 1983, Sarvodaya Shikshan Mandal has been a pillar of educational development in Chandrapur. What began as a singular vision to provide accessible, high-quality education has grown into a vast network of premier institutions.\n\nOur flagship college, Sardar Patel Mahavidyalaya, stands as a testament to our commitment to holistic student development, successfully blending rigorous academic standards with strong moral and cultural values.'),
('About_Image', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200'),
('Founder_Image', '/images/shantaram_potdukhe.jpg'),
('Founder_Bio_Mr', 'स्वर्गीय शांतारामजी पोटदुखे हे चंद्रपूर येथील सर्वोदय शिक्षण मंडळाचे (नोंदणी क्रमांक F-09 (C)) संस्थापक आणि दूरदर्शी नेते होते. संस्थापक आणि प्रदीर्घ काळ अध्यक्ष म्हणून कार्यभार सांभाळताना, त्यांनी या संस्थेला मध्य भारतातील एका अग्रगण्य शैक्षणिक नेटवर्कमध्ये रूपांतरित केले, आणि विदर्भाच्या शैक्षणिक क्षेत्रात संपूर्ण क्रांती घडवून आणली.'),
('Founder_Bio_En', 'Late Shantaram Potdukhe (former Union Minister of State for Finance) was the foundational architect and visionary leader behind Sarvodaya Shikshan Mandal (SSM), Chandrapur (Trust Registration No. F-09 (C)). Serving as its longtime President and founder, he transformed this trust into Central India\'s premier educational network, completely revolutionizing the academic landscape of the Vidarbha.'),
('Vision_Title_Mr', 'आमचे ध्येय (Vision)'),
('Vision_Title', 'Our Vision'),
('Vision_Desc_Mr', 'शैक्षणिक उत्कृष्टता, नैतिक मूल्ये आणि सामाजिक बांधिलकी जोपासणाऱ्या अग्रगण्य शैक्षणिक संकुलाची निर्मिती करणे; ज्यामुळे विद्यार्थी आजच्या गतिमान जागतिक समाजात दूरदर्शी नेतृत्व म्हणून पुढे येतील.'),
('Vision_Desc', 'To establish a premier educational network that fosters academic excellence, moral integrity, and social responsibility, empowering students to become visionary leaders in a dynamic global society.'),
('Mission_Title_Mr', 'आमची उद्दिष्टे (Mission)'),
('Mission_Title', 'Our Mission'),
('Mission_Desc_Mr', 'आधुनिक अध्यापन पद्धती व अद्ययावत सुविधांद्वारे गुणवत्तापूर्ण व सुलभ शिक्षण उपलब्ध करून देणे; तसेच विद्यार्थ्यांमध्ये बौद्धिक जिज्ञासा, नैतिक मूल्ये व सर्वांगीण विकास घडवणारे पोषक वातावरण निर्माण करणे.'),
('Mission_Desc', 'To provide accessible, high-quality education through modern pedagogy and state-of-the-art facilities, cultivating a learning environment that nurtures intellectual curiosity, ethical values, and holistic development.'),
('Stat1_Value', '11+'),
('Stat1_Label', 'शैक्षणिक संस्था व महाविद्यालये (Institutions & Colleges)'),
('Stat2_Value', '22,000+'),
('Stat2_Label', 'विद्यार्थी संख्या (Active Students)'),
('Stat3_Value', '65+'),
('Stat3_Label', 'वर्षांची समृद्ध शैक्षणिक परंपरा (Years of Academic Legacy)'),
('Stat4_Value', '50+'),
('Stat4_Label', 'विविध अभ्यासक्रम व विद्याशाखा (Undergraduate & PG Programs)'),
('Admissions_PreTitle_Mr', 'शैक्षणिक वर्ष २०२६-२७'),
('Admissions_PreTitle_En', 'Academic Session 2026-27'),
('Admissions_MainTitle_Mr', 'प्रवेश प्रक्रिया व अभ्यासक्रम'),
('Admissions_MainTitle_En', 'Admissions & Academic Programs'),
('Admissions_Title_Mr', 'प्रवेश प्रक्रियेचे ३ सोपे टप्पे'),
('Admissions_Title_En', 'Simple 3-Step Admission Process'),
('Admissions_Step1_Title_Mr', '१. ऑनलाइन नोंदणी किंवा प्रत्यक्ष भेट'),
('Admissions_Step1_Title_En', '1. Online Registration or Campus Desk'),
('Admissions_Step1_Desc_Mr', 'इच्छुक विद्यार्थ्यांनी संबंधित महाविद्यालयाच्या अधिकृत संकेतस्थळावरून किंवा थेट कार्यालयात जाऊन अर्ज करावा.'),
('Admissions_Step1_Desc_En', 'Prospective students can submit inquiries online or visit institutional admission desks directly.'),
('Admissions_Step2_Title_Mr', '२. कागदपत्र पडताळणी'),
('Admissions_Step2_Title_En', '2. Document Verification'),
('Admissions_Step2_Desc_Mr', 'मागील शैक्षणिक गुणपत्रिका, शाळा सोडल्याचा दाखला, जात प्रमाणपत्र इत्यादी आवश्यक कागदपत्रांची पडताळणी.'),
('Admissions_Step2_Desc_En', 'Original mark sheets, transfer certificates, and category documents are verified by faculty admission scrutiny committees.'),
('Admissions_Step3_Title_Mr', '३. प्रवेश निश्चिती व शुल्क भरणे'),
('Admissions_Step3_Title_En', '3. Seat Confirmation & Fee Payment'),
('Admissions_Step3_Desc_Mr', 'गुणवत्तेनुसार निवड झाल्यानंतर विहित शुल्क भरून आपला प्रवेश निश्चित करावा.'),
('Admissions_Step3_Desc_En', 'Upon merit selection, pay nominal fees to confirm admission for the academic session.'),
('Scholarships_Title_Mr', 'शासकीय व संस्थात्मक शिष्यवृत्ती'),
('Scholarships_Title_En', 'Government & Mandal Scholarships'),
('Scholarships_Desc_Mr', 'मागासवर्गीय, आर्थिकदृष्ट्या दुर्बल व गुणवंत विद्यार्थ्यांसाठी केंद्र व राज्य शासनाच्या सर्व शिष्यवृत्ती योजना उपलब्ध आहेत.'),
('Scholarships_Desc_En', 'Eligible SC/ST/OBC/EBC/Minority students receive complete fee concessions and Direct Benefit Transfer (DBT) scholarships.'),
('Scholarships_List_Mr', '• भारत सरकार मॅट्रिकोत्तर शिष्यवृत्ती\n• राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती\n• सावित्रीबाई फुले कन्या शिष्यवृत्ती\n• आदिवासी विकास विभाग शिष्यवृत्ती\n• अल्पसंख्याक गुणवत्ता शिष्यवृत्ती'),
('Scholarships_List_En', '• Government of India Post-Matric Scholarships\n• Rajarshi Chhatrapati Shahu Maharaj Tuition Fee Scholarship\n• Savitribai Phule Special Girls Scholarship\n• Tribal Development Department Aid\n• Minority Merit-cum-Means Scholarships'),
('Testimonial1_Name_Mr', 'डॉ. राजेश शर्मा'),
('Testimonial1_Name_En', 'Dr. Rajesh Sharma'),
('Testimonial1_Title_Mr', 'माजी विद्यार्थी, सरदार पटेल महाविद्यालय (वर्ग १९९८)'),
('Testimonial1_Title_En', 'Alumnus, Sardar Patel Mahavidyalaya (Class of 1998)'),
('Testimonial1_Image', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
('Testimonial1_Text_Mr', 'सरदार पटेल महाविद्यालयातील समृद्ध ग्रंथालय आणि प्राध्यापकांचे वैयक्तिक मार्गदर्शन यामुळेच माझ्या वैज्ञानिक संशोधनाला भक्कम पाया मिळाला.'),
('Testimonial1_Text_En', 'The rigorous academic standards and library facilities at SPM laid the foundation for my doctoral research career.'),
('Testimonial2_Name_Mr', 'अ‍ॅड. स्नेहा देशमुख'),
('Testimonial2_Name_En', 'Adv. Sneha Deshmukh'),
('Testimonial2_Title_Mr', 'माजी विद्यार्थिनी, विधी शाखा (वर्ग २०१२)'),
('Testimonial2_Title_En', 'Alumna, Department of Law (Class of 2012)'),
('Testimonial2_Image', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
('Testimonial2_Text_Mr', 'न्यायालयीन सराव आणि वादविवाद स्पर्धांमध्ये मिळालेल्या अनुभवाने मला उच्च न्यायालयात यशस्वी वकिली करण्यासाठी आत्मविश्वास दिला.'),
('Testimonial2_Text_En', 'Moot courts and clinical legal training gave me the confidence to practice law in the High Court successfully.'),
('Testimonial3_Name_Mr', 'श्री. अमोल बांदूरकर'),
('Testimonial3_Name_En', 'Shri Amol Bandurkar'),
('Testimonial3_Title_Mr', 'उद्योजक व माजी विद्यार्थी (वर्ग २००५)'),
('Testimonial3_Title_En', 'Entrepreneur & Alumnus (Class of 2005)'),
('Testimonial3_Image', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
('Testimonial3_Text_Mr', 'सर्वोदय शिक्षण मंडळाने केवळ पुस्तकी ज्ञान न देता सामाजिक मूल्ये आणि उद्योजकीय विचार रुजवले.'),
('Testimonial3_Text_En', 'Sarvodaya instilled ethical values and an entrepreneurial mindset that guided me in founding my enterprise.'),
('AdminStaff_Section_Title', 'प्रशासकीय कार्यालय व साहाय्यक कर्मचारी (Administrative Office & Support Staff)'),
('AdminStaff_Section_Desc', 'आमच्या विशाल शैक्षणिक संकुलाचे दैनंदिन कामकाज सुरळीत, शिस्तबद्ध व पारदर्शक पद्धतीने चालविण्यामध्ये आमच्या प्रशासकीय अधिकारी व सेवक कर्मचाऱ्यांचा मोलाचा वाटा आहे.'),
('AdminStaff_Profile1_Name', 'श्री. सतीशचंद्र डी. वांढरे'),
('AdminStaff_Profile1_Title', 'मुख्य प्रशासकीय अधिकारी (Chief Administrative Officer)'),
('AdminStaff_Profile1_Image', '/images/staff/satish_wandhare.jpg'),
('AdminStaff_Profile1_Desc', 'सर्वोदय शिक्षण मंडळाच्या केंद्रीय कार्यालयाचे प्रमुख समन्वय आणि सर्व शाखांचे प्रशासकीय संनियंत्रण.'),
('AdminStaff_Profile1_Phone', '07172 - 255778'),
('AdminStaff_Profile1_Email', 'admin.office@ssmchandrapur.org'),
('AdminStaff_Profile2_Name', 'श्री. विनायक आर. बोंडे'),
('AdminStaff_Profile2_Title', 'मुख्य लेखापाल (Chief Accounts Officer)'),
('AdminStaff_Profile2_Image', '/images/staff/vinayak_bonde.jpg'),
('AdminStaff_Profile2_Desc', 'मंडळाचे आर्थिक हिशेब, लेखापरीक्षण आणि सर्व शाखांच्या अंदाजपत्रकाचे व्यवस्थापन.'),
('AdminStaff_Profile2_Phone', '07172 - 255778'),
('AdminStaff_Profile2_Email', 'accounts@ssmchandrapur.org'),
('AdminStaff_Profile3_Name', 'श्री. राजेश एम. कावळे'),
('AdminStaff_Profile3_Title', 'आस्थापना अधीक्षक (Establishment Superintendent)'),
('AdminStaff_Profile3_Image', '/images/staff/rajesh_kawale.jpg'),
('AdminStaff_Profile3_Desc', 'कर्मचारी सेवापुस्तक, पदोन्नती, शासन मंजुरी आणि पदभरती संनियंत्रण.'),
('AdminStaff_Profile3_Phone', '07172 - 255778'),
('AdminStaff_Profile3_Email', 'establishment@ssmchandrapur.org'),
('AdminStaff_Profile4_Name', 'श्री. सुनील जी. रामटेके'),
('AdminStaff_Profile4_Title', 'वरिष्ठ लिपिक (Senior Clerk - Student Affairs)'),
('AdminStaff_Profile4_Image', '/images/staff/sunil_ramteke.jpg'),
('AdminStaff_Profile4_Desc', 'विद्यार्थी शिष्यवृत्ती, परीक्षा फॉर्म समन्वय आणि शैक्षणिक प्रमाणपत्र पडताळणी.'),
('AdminStaff_Profile4_Phone', '07172 - 255778'),
('AdminStaff_Profile4_Email', 'students@ssmchandrapur.org')
ON DUPLICATE KEY UPDATE `content` = VALUES(`content`);

-- 3. ANNOUNCEMENTS (Total: 4 notices)
INSERT INTO `announcements` (`id`, `title`, `content`, `date`, `is_new`, `display_order`, `attachmentUrl`, `attachmentOriginalName`, `attachmentType`) VALUES
(1, 'शैक्षणिक वर्ष २०२६-२७ प्रवेश प्रक्रिया सुरू (Admissions Open 2026-27)', 'सर्वोदय शिक्षण मंडळाच्या सर्व शाळा, कनिष्ठ व वरिष्ठ महाविद्यालयांमध्ये नवीन शैक्षणिक सत्रासाठी प्रवेश प्रक्रिया सुरू झाली आहे. इच्छुक विद्यार्थ्यांनी कार्यालयाशी संपर्क साधावा.', '2026-09-01', 1, 1, NULL, NULL, 'pdf'),
(2, 'गोंडवाना विद्यापीठ पदवी व पदव्युत्तर परीक्षा वेळापत्रक जाहीर', 'गोंडवाना विद्यापीठ, गडचिरोली अंतर्गत उन्हाळी/हिवाळी सत्राच्या विविध परीक्षांचे वेळापत्रक महाविद्यालयाच्या सूचना फलकावर प्रसिद्ध करण्यात आले आहे.', '2026-09-05', 1, 2, NULL, NULL, 'pdf'),
(3, 'सर्वोदय शिक्षण मंडळ अंतर्गत सहाय्यक प्राध्यापक व प्रशासकीय पदभरती जाहिरात', 'सरदार पटेल महाविद्यालय व इतर शाखांसाठी सहाय्यक प्राध्यापक व प्रशासकीय पदांसाठी अर्ज मागविण्यात येत आहेत. तपशील करिअर विभागात उपलब्ध आहे.', '2026-09-10', 1, 3, NULL, NULL, 'pdf'),
(1789199010763, 'Test from script', 'hello', '2026', 0, 0, NULL, NULL, 'image');

-- 4. EVENTS CALENDAR (Total: 4 events)
INSERT INTO `events` (`id`, `date`, `month`, `title`, `location`, `display_order`) VALUES
(1, '15', 'APR', 'वार्षिक राज्यस्तरीय विज्ञान व तंत्रज्ञान प्रदर्शन (Annual State-Level Science & Tech Exhibition)', 'सरदार पटेल महाविद्यालय सभागृह, चंद्रपूर (Central Campus Auditorium)', 1),
(2, '28', 'FEB', 'राष्ट्रीय विज्ञान दिन व्याख्यान व कार्यशाळा (National Science Day Lecture & Workshop)', 'एसपीएम सायन्स कॉम्प्लेक्स, चंद्रपूर', 2),
(3, '12', 'JAN', 'राष्ट्रीय युवा दिन व स्वामी विवेकानंद जयंती महोत्सव (National Youth Day Celebration)', 'सर्वोदय शिक्षण मंडळ मुख्य प्रांगण', 3),
(4, '15', 'AUG', 'स्वातंत्र्य दिन ध्वजारोहण व गुणवंत विद्यार्थी सत्कार सोहळा', 'क्रीडा संकुल, सरदार पटेल महाविद्यालय', 4);

-- 5. INSTITUTIONS (Total: 11 institutions)
INSERT INTO `institutions` (`id`, `name`, `type`, `description`, `image_url`, `link`, `display_order`) VALUES
(1, 'सरदार पटेल महाविद्यालय, चंद्रपूर', 'Senior College & PG Research', 'Premier multi-faculty post-graduate and research college. Principal: डॉ. पी. एम. काटकर | Contact: 9422906289 | Email: chdspm@gmail.com', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', 'https://spm.ac.in', 1),
(2, 'एस. आर. एम. महाविद्यालय सोशल वर्क पडोली चंद्रपूर', 'Social Work College', 'Professional social work college (BSW/MSW). Principal: डॉ. ममता ठाकूरवार | Contact: 9011378429 | Email: Srmcollege1988@gmail.com', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', 'https://srmcsw.edu.in', 2),
(3, 'शांताबाई पोटदुखे विधी महाविद्यालय, चंद्रपूर', 'Law College', 'Eminent legal education college affiliated to Gondwana University. Principal: डॉ. पूर्णेंदू कुमार कार | Contact: 9423416288 | Email: principalspcl@gmail.com', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80', 'https://spclchandrapur.org', 3),
(4, 'शंकरराव बेझलवार कला वाणिज्य महाविद्यालय, अहेरी', 'Arts & Commerce College', 'Arts & Commerce college empowering youth in Aheri region. Principal: डॉ. विजय सोमकुंवर | Contact: 9960429238 | Email: sbcollegeaheri@gmail.com', 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80', '#', 4),
(5, 'सौ. लिना किशोर मामीडवार इन्स्टिट्यूट ऑफ मॅनेजमेंट स्टडीज ॲण्ड रिसर्च कोसारा चंद्रपूर', 'Management & Research (MBA/MCA)', 'Premier management institute offering MBA programs. Principal: डॉ. जयेश चक्रवर्ती | Contact: 9890014670 | Email: Dmsr_sp@rediffmail.com', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', 'https://dmsr.edu.in', 5),
(6, 'नेहरू विद्यालय तथा विज्ञान कनिष्ठ महाविद्यालय, चंद्रपूर', 'School & Science Junior College', 'High school and junior college with well-equipped laboratories. Headmaster: श्री. प्रविण धोटे | Contact: 9822722898 | Email: nvchandrapur@gmail.com', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80', '#', 6),
(7, 'आदर्श किसान विद्यालय, तथा कनिष्ठ महाविद्यालय नारंडा, ता. कोरपना जि. चंद्रपूर', 'School & Junior College', 'Secondary and higher secondary education in Korpana taluka. Headmaster: श्री. अविनाश चुरमुडे | Contact: 9850697345 | Email: akvnaranda@gmail.com', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80', '#', 7),
(8, 'श्री साईनाथ विद्यालय, कढोली ता. राजुरा जि. चंद्रपूर', 'School', 'Foundational and secondary schooling founded in 1969. Headmistress: कु. ईंरगा आवळे | Contact: 9975026447 | Email: shrisainathvidyalaya1969@gmail.com', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', '#', 8),
(9, 'सरस्वती विद्यालय, तथा कनिष्ठ महाविद्यालय, वढोली, ता. गोंडपिपरी जि. चंद्रपूर', 'School & Junior College', 'Secondary and junior college education in Gondpipri. Headmaster: श्री. रंगय्य निनारनेवार | Contact: 9923180310 | Email: saraswatividyalayawadholi@gmail.com', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80', '#', 9),
(10, 'गुरुनानक विद्यालय, विरूर (स्टे) ता. राजुरा जि. चंद्रपूर', 'School', 'Rural school education at Virur Station. Headmaster: श्री. पांडुरंग मधुकर धानोरकर | Contact: 8788531126 | Email: Gurunanakvidayalya6@gmail.com', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80', '#', 10),
(11, 'इंदिरा विद्यालय तथा कनिष्ठ महाविद्यालय, वरुड (रोड) ता. राजुरा जि. चंद्रपूर', 'School & Junior College', 'Secondary and junior college campus at Warur Road. Headmistress: सौ. कुंदा लोकेश मडावी | Contact: 9922549197 | Email: indiravidyalayawarur@gmail.com', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', '#', 11);

-- 6. CAREERS (Total: 5 openings)
INSERT INTO `careers` (`id`, `title`, `department`, `location`, `type`, `description`, `requirements`, `advertisementUrl`, `advertisementOriginalName`, `advertisementType`) VALUES
('h0gswhlyt', 'Administrative officer', 'Society Central Office', 'Chandrapur', 'Full Time', 'Managing administration and institutional liaisons across Sarvodaya Shikshan Mandal institutions.', 'Graduate/Postgraduate with administrative experience.', NULL, NULL, NULL),
('e6hmv3f7p', 'Assistant Professor', 'Department of Computer Science', 'S. P. College, Chnadrapur', 'Full-Time', 'abc', 'Ph.D.', '/uploads/daf_2-1789131046404-759017.pdf', 'daf.2.pdf', 'pdf'),
('i8ylgnaml', 'Assistant Professor in Mathematics', 'Science & Mathematics Department', 'Sarvodaya Mahavidyalaya, Sindewahi', 'Full-Time', 'Requires qualified candidate for teaching undergraduate and postgraduate mathematics.', 'M.Sc. Mathematics with minimum 55% and NET/SET or Ph.D.', NULL, NULL, NULL),
('calfojjuj', 'Assistant Professor in Mechanical Engineering', 'Mechanical Engineering', 'Jaysingpur, Kolhapur', 'Full Time', 'Requires teaching experience in Thermodynamics and Fluid Mechanics.', 'M.E. / M.Tech in Mechanical Engineering with First Class.', NULL, NULL, NULL),
('jrcfpbeyo', 'Assistant Professor in Mechanical Engineering', 'Mechanical Engineering', 'Jaysingpur, Kolhapur', 'Full Time', 'Requires teaching experience in Thermodynamics and Fluid Mechanics.', 'M.E. / M.Tech in Mechanical Engineering with First Class.', NULL, NULL, NULL);

-- 7. JOB APPLICATIONS (Total: 6 applications)
INSERT INTO `job_applications` (`id`, `applicationNumber`, `careerId`, `jobTitle`, `name`, `email`, `phone`, `coverLetter`, `resumeUrl`, `resumeOriginalName`, `photoUrl`, `documentsUrl`, `details`, `status`) VALUES
('gi05bi3ny', 'SSM-2026-REC-67295', 'i8ylgnaml', 'Assistant Professor in Mathematics', 'Pooja Sharma', 'pooja.sharma@example.com', '9876543210', '', '/uploads/Pooja_Resume-1789133576609-810203.pdf', 'Pooja_Resume.pdf', NULL, NULL, '{\"id\":\"gi05bi3ny\",\"applicationNumber\":\"SSM-2026-REC-67295\",\"careerId\":\"i8ylgnaml\",\"jobTitle\":\"Assistant Professor in Mathematics\",\"institutionPreference\":\"\",\"specialization\":\"\",\"name\":\"Pooja Sharma\",\"nameMarathi\":\"\",\"fatherOrHusbandName\":\"\",\"motherName\":\"\",\"dob\":\"\",\"age\":\"\",\"gender\":\"Not Specified\",\"maritalStatus\":\"Unmarried\",\"nationality\":\"Indian\",\"domicile\":\"Yes\",\"category\":\"OBC\",\"casteValidity\":\"Not Applicable\",\"pwd\":\"No\",\"aadhaar\":\"\",\"pan\":\"\",\"email\":\"pooja.sharma@example.com\",\"phone\":\"9876543210\",\"alternatePhone\":\"\",\"address\":\"\",\"city\":\"\",\"district\":\"\",\"state\":\"Maharashtra\",\"pincode\":\"\",\"correspondenceAddress\":\"\",\"qualifications\":[],\"experience\":[],\"totalExperienceYears\":\"0\",\"currentOrganization\":\"\",\"currentDesignation\":\"\",\"publications\":\"\",\"coverLetter\":\"\",\"resumeUrl\":\"/uploads/Pooja_Resume-1789133576609-810203.pdf\",\"resumeOriginalName\":\"Pooja_Resume.pdf\",\"photoUrl\":null,\"documentsUrl\":null,\"documentsOriginalName\":null,\"status\":\"shortlisted\",\"created_at\":\"2026-09-11T13:32:56.615Z\",\"adminNotes\":\"Strong qualification in Mathematics.\",\"updated_at\":\"2026-09-11T13:33:35.250Z\"}', 'shortlisted'),
('bgosingsw', 'SSM-2026-REC-74459', '', 'General Application', '', '', '', '', NULL, NULL, NULL, NULL, '{\"id\":\"bgosingsw\",\"applicationNumber\":\"SSM-2026-REC-74459\",\"careerId\":\"\",\"jobTitle\":\"General Application\",\"institutionPreference\":\"\",\"specialization\":\"\",\"name\":\"\",\"nameMarathi\":\"\",\"fatherOrHusbandName\":\"\",\"motherName\":\"\",\"dob\":\"\",\"age\":\"\",\"gender\":\"Not Specified\",\"maritalStatus\":\"Unmarried\",\"nationality\":\"Indian\",\"domicile\":\"Yes\",\"category\":\"OPEN\",\"casteValidity\":\"Not Applicable\",\"pwd\":\"No\",\"aadhaar\":\"\",\"pan\":\"\",\"email\":\"\",\"phone\":\"\",\"alternatePhone\":\"\",\"address\":\"\",\"city\":\"\",\"district\":\"\",\"state\":\"Maharashtra\",\"pincode\":\"\",\"correspondenceAddress\":\"\",\"qualifications\":[],\"experience\":[],\"totalExperienceYears\":\"0\",\"currentOrganization\":\"\",\"currentDesignation\":\"\",\"publications\":\"\",\"coverLetter\":\"\",\"resumeUrl\":null,\"resumeOriginalName\":null,\"photoUrl\":null,\"documentsUrl\":null,\"documentsOriginalName\":null,\"status\":\"new\",\"created_at\":\"2026-09-11T13:15:28.411Z\"}', 'new'),
('cjua7pnat', 'SSM-2026-REC-87795', '', 'General Application', '', '', '', '', NULL, NULL, NULL, NULL, '{\"id\":\"cjua7pnat\",\"applicationNumber\":\"SSM-2026-REC-87795\",\"careerId\":\"\",\"jobTitle\":\"General Application\",\"institutionPreference\":\"\",\"specialization\":\"\",\"name\":\"\",\"nameMarathi\":\"\",\"fatherOrHusbandName\":\"\",\"motherName\":\"\",\"dob\":\"\",\"age\":\"\",\"gender\":\"Not Specified\",\"maritalStatus\":\"Unmarried\",\"nationality\":\"Indian\",\"domicile\":\"Yes\",\"category\":\"OPEN\",\"casteValidity\":\"Not Applicable\",\"pwd\":\"No\",\"aadhaar\":\"\",\"pan\":\"\",\"email\":\"\",\"phone\":\"\",\"alternatePhone\":\"\",\"address\":\"\",\"city\":\"\",\"district\":\"\",\"state\":\"Maharashtra\",\"pincode\":\"\",\"correspondenceAddress\":\"\",\"qualifications\":[],\"experience\":[],\"totalExperienceYears\":\"0\",\"currentOrganization\":\"\",\"currentDesignation\":\"\",\"publications\":\"\",\"coverLetter\":\"\",\"resumeUrl\":null,\"resumeOriginalName\":null,\"photoUrl\":null,\"documentsUrl\":null,\"documentsOriginalName\":null,\"status\":\"new\",\"created_at\":\"2026-09-11T13:11:10.409Z\"}', 'new'),
('j05zmi7io', 'SSM-2026-REC-51927', '', 'General Application', 'Test', '', '', '', NULL, NULL, NULL, NULL, '{\"id\":\"j05zmi7io\",\"applicationNumber\":\"SSM-2026-REC-51927\",\"careerId\":\"\",\"jobTitle\":\"General Application\",\"institutionPreference\":\"\",\"specialization\":\"\",\"name\":\"Test\",\"nameMarathi\":\"\",\"fatherOrHusbandName\":\"\",\"motherName\":\"\",\"dob\":\"\",\"age\":\"\",\"gender\":\"Not Specified\",\"maritalStatus\":\"Unmarried\",\"nationality\":\"Indian\",\"domicile\":\"Yes\",\"category\":\"OPEN\",\"casteValidity\":\"Not Applicable\",\"pwd\":\"No\",\"aadhaar\":\"\",\"pan\":\"\",\"email\":\"\",\"phone\":\"\",\"alternatePhone\":\"\",\"address\":\"\",\"city\":\"\",\"district\":\"\",\"state\":\"Maharashtra\",\"pincode\":\"\",\"correspondenceAddress\":\"\",\"qualifications\":[],\"experience\":[],\"totalExperienceYears\":\"0\",\"currentOrganization\":\"\",\"currentDesignation\":\"\",\"publications\":\"\",\"coverLetter\":\"\",\"resumeUrl\":null,\"resumeOriginalName\":null,\"photoUrl\":null,\"documentsUrl\":null,\"documentsOriginalName\":null,\"status\":\"new\",\"created_at\":\"2026-09-11T13:08:31.369Z\"}', 'new'),
('rj0kevgxe', 'SSM-2026-REC-58014', '', 'Lecturer', 'Test User', 'test@example.com', '', '', NULL, NULL, NULL, NULL, '{\"id\":\"rj0kevgxe\",\"applicationNumber\":\"SSM-2026-REC-58014\",\"careerId\":\"\",\"jobTitle\":\"Lecturer\",\"institutionPreference\":\"\",\"specialization\":\"\",\"name\":\"Test User\",\"nameMarathi\":\"\",\"fatherOrHusbandName\":\"\",\"motherName\":\"\",\"dob\":\"\",\"age\":\"\",\"gender\":\"Not Specified\",\"maritalStatus\":\"Unmarried\",\"nationality\":\"Indian\",\"domicile\":\"Yes\",\"category\":\"OPEN\",\"casteValidity\":\"Not Applicable\",\"pwd\":\"No\",\"aadhaar\":\"\",\"pan\":\"\",\"email\":\"test@example.com\",\"phone\":\"\",\"alternatePhone\":\"\",\"address\":\"\",\"city\":\"\",\"district\":\"\",\"state\":\"Maharashtra\",\"pincode\":\"\",\"correspondenceAddress\":\"\",\"qualifications\":[],\"experience\":[],\"totalExperienceYears\":\"0\",\"currentOrganization\":\"\",\"currentDesignation\":\"\",\"publications\":\"\",\"coverLetter\":\"\",\"resumeUrl\":null,\"resumeOriginalName\":null,\"photoUrl\":null,\"documentsUrl\":null,\"documentsOriginalName\":null,\"status\":\"new\",\"created_at\":\"2026-09-11T13:04:47.590Z\"}', 'new'),
('pg6evuze3', 'SSM-2026-REC-44144', '', 'General Application', '', '', '', '', NULL, NULL, NULL, NULL, '{\"id\":\"pg6evuze3\",\"applicationNumber\":\"SSM-2026-REC-44144\",\"careerId\":\"\",\"jobTitle\":\"General Application\",\"institutionPreference\":\"\",\"specialization\":\"\",\"name\":\"\",\"nameMarathi\":\"\",\"fatherOrHusbandName\":\"\",\"motherName\":\"\",\"dob\":\"\",\"age\":\"\",\"gender\":\"Not Specified\",\"maritalStatus\":\"Unmarried\",\"nationality\":\"Indian\",\"domicile\":\"Yes\",\"category\":\"OPEN\",\"casteValidity\":\"Not Applicable\",\"pwd\":\"No\",\"aadhaar\":\"\",\"pan\":\"\",\"email\":\"\",\"phone\":\"\",\"alternatePhone\":\"\",\"address\":\"\",\"city\":\"\",\"district\":\"\",\"state\":\"Maharashtra\",\"pincode\":\"\",\"correspondenceAddress\":\"\",\"qualifications\":[],\"experience\":[],\"totalExperienceYears\":\"0\",\"currentOrganization\":\"\",\"currentDesignation\":\"\",\"publications\":\"\",\"coverLetter\":\"\",\"resumeUrl\":null,\"resumeOriginalName\":null,\"photoUrl\":null,\"documentsUrl\":null,\"documentsOriginalName\":null,\"status\":\"new\",\"created_at\":\"2026-09-11T13:04:15.932Z\"}', 'new');

-- 8. INQUIRIES (Total: 3 inquiries)
INSERT INTO `inquiries` (`id`, `name`, `email`, `phone`, `program`, `message`, `status`) VALUES
(1, 'Vijay Deshpande', 'vijay.deshpande@gmail.com', '9822334455', 'Senior College Admission Enquiry (M.Sc. Chemistry)', 'Interested in post-graduate research admission details for the upcoming academic session at Sardar Patel Mahavidyalaya.', 'new'),
(2, 'Anjali Ramesh Patil', 'anjali.patil@example.com', '9422881122', 'Higher Secondary Science Stream (Junior College)', 'Please provide cutoff marks and scholarship eligibility criteria for tribal and rural students.', 'contacted'),
(3, 'Pooja Sharma', 'pooja@example.com', '9876543210', 'General Inquiry', 'Looking for admissions in B.Ed course.', 'new');

-- 9. ALUMNI REGISTRATIONS (Total: 3 distinguished alumni members)
INSERT INTO `alumni_registrations` (`id`, `fullName`, `email`, `phone`, `dob`, `gender`, `institution`, `passingYear`, `degree`, `profession`, `company`, `designation`, `location`, `linkedin`, `message`, `photoUrl`) VALUES
(1, 'Dr. Rajesh M. Sharma', 'dr.rajesh.sharma@example.com', '9822114477', '1975-06-15', 'Male', 'सरदार पटेल महाविद्यालय, चंद्रपूर (Sardar Patel Mahavidyalaya)', '1998', 'M.Sc. Chemistry (Gold Medalist)', 'Higher Education & Research', 'Rashtrasant Tukadoji Maharaj Nagpur University', 'Associate Professor & Head of Department', 'Nagpur / Chandrapur, Maharashtra', 'https://linkedin.com/in/rajesh-sharma-academic', 'Proud alumnus of Sardar Patel Mahavidyalaya. The faculty and rigorous academic atmosphere laid the strongest foundation for my doctoral and teaching career.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
(2, 'Sunita R. Deshmukh', 'sunita.deshmukh@example.com', '9422003311', '1988-11-20', 'Female', 'सरदार पटेल महाविद्यालय, चंद्रपूर (Sardar Patel Mahavidyalaya)', '2012', 'Master of Computer Applications (MCA)', 'Information Technology', 'Tata Consultancy Services (TCS)', 'Lead Solutions Architect', 'Pune, Maharashtra', 'https://linkedin.com/in/sunita-deshmukh-tech', 'Grateful to the dedicated professors at SPM Computer Department who guided us from rural backgrounds into top multinational software firms.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'),
(3, 'Amit Vinodrao Patil', 'amit.patil.deputycollector@example.com', '9158332211', '1992-04-10', 'Male', 'सरदार पटेल महाविद्यालय, चंद्रपूर (Sardar Patel Mahavidyalaya)', '2015', 'Bachelor of Commerce (B.Com)', 'Civil Services (MPSC)', 'Government of Maharashtra', 'Deputy Collector / Sub-Divisional Magistrate (SDM)', 'Mumbai / Vidarbha, Maharashtra', 'https://linkedin.com/in/amit-patil-mpsc', 'The library, study circles, and competitive guidance atmosphere at Sarvodaya Shikshan Mandal ignited my passion for public service and MPSC success.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');

SET FOREIGN_KEY_CHECKS = 1;
