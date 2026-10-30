-- DMRC ONE Seed Data
-- Run this in Supabase SQL Editor or psql to populate the tables

INSERT INTO metro_lines (id, line_name, line_code, line_color, text_color, status, description, operating_hours)
VALUES
('yellow', 'Yellow Line', 'YL', '#FBC02D', '#000000', 'Normal Service', 'Connects North Delhi to Gurugram via Central Delhi (Rajiv Chowk, Kashmere Gate)', '05:30 AM - 11:30 PM'),
('blue', 'Blue Line', 'BL', '#1976D2', '#FFFFFF', 'Normal Service', 'Major East-West corridor connecting Dwarka, West Delhi, Connaught Place, and Noida/Vaishali', '05:30 AM - 11:15 PM'),
('red', 'Red Line', 'RL', '#D32F2F', '#FFFFFF', 'Normal Service', 'Historical first line connecting Northwest Delhi to Ghaziabad via Kashmere Gate', '05:30 AM - 11:00 PM'),
('violet', 'Violet Line', 'VL', '#7B1FA2', '#FFFFFF', 'Normal Service', 'Heritage line connecting Old Delhi heritage sites, Central Delhi to Faridabad', '06:00 AM - 11:00 PM'),
('pink', 'Pink Line', 'PK', '#EC407A', '#FFFFFF', 'Normal Service', 'The expansive Ring Road orbital corridor providing seamless cross-line interchanges', '06:00 AM - 11:00 PM'),
('magenta', 'Magenta Line', 'MG', '#880E4F', '#FFFFFF', 'Minor Delay', 'Southern orbital corridor linking West Delhi, Domestic Airport (T1), and South Delhi to Noida', '05:40 AM - 11:20 PM'),
('airport', 'Airport Express Line', 'AE', '#FF6F00', '#FFFFFF', 'Normal Service', 'High-speed direct premium transit connecting New Delhi Railway Station to IGI Airport T3', '04:45 AM - 11:40 PM'),
('green', 'Green Line', 'GL', '#388E3C', '#FFFFFF', 'Normal Service', 'Connects West Delhi to Bahadurgarh via Inderlok and Punjabi Bagh', '06:00 AM - 11:00 PM'),
('grey', 'Grey Line', 'GY', '#757575', '#FFFFFF', 'Normal Service', 'Suburban link connecting urban Dwarka to rural Najafgarh and Dhansa', '06:00 AM - 10:30 PM')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- Sample Seed for Announcements
INSERT INTO announcements (title, title_hi, description, announcement_type, line_id, status, is_demo)
VALUES
('Extended Train Timings for Trade Fair / Special Events', 'व्यापार मेले हेतु विशेष ट्रेन समय', 'Delhi Metro services operate at enhanced frequencies across Yellow, Blue, and Violet lines to facilitate passenger movement.', 'General', 'yellow', 'Active', TRUE),
('Pre-scheduled Night Maintenance: Botanical Garden to Kalindi Kunj', 'नियमित रात्रि रखरखाव', 'Track maintenance scheduled during non-revenue night hours. Regular morning operations commence normally at 05:40 AM.', 'Maintenance', 'magenta', 'Active', TRUE),
('Travel Advisory: National Common Mobility Card (NCMC) Integration', 'यात्रा परामर्श: एनसीएमसी कार्ड स्वीकृति', 'All AFC automatic gates support RuPay NCMC debit/prepaid cards and mobile QR tickets alongside conventional DMRC Smart Cards.', 'Advisory', NULL, 'Active', FALSE);

