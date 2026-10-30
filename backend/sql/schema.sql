-- DMRC ONE: PostgreSQL Schema (Supabase compatible)
-- Unified Delhi Metro Digital Experience Database

-- 1. Metro Lines Table
CREATE TABLE IF NOT EXISTS metro_lines (
    id VARCHAR(32) PRIMARY KEY,
    line_name VARCHAR(100) NOT NULL,
    line_code VARCHAR(20) NOT NULL,
    line_color VARCHAR(20) NOT NULL,
    text_color VARCHAR(20) DEFAULT '#FFFFFF',
    status VARCHAR(50) DEFAULT 'Normal Service',
    description TEXT,
    operating_hours VARCHAR(100) DEFAULT '06:00 AM - 11:00 PM',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Stations Table
CREATE TABLE IF NOT EXISTS stations (
    id VARCHAR(64) PRIMARY KEY,
    station_name VARCHAR(150) NOT NULL,
    station_name_hi VARCHAR(150),
    station_code VARCHAR(20) UNIQUE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    primary_line_id VARCHAR(32) REFERENCES metro_lines(id),
    is_interchange BOOLEAN DEFAULT FALSE,
    connected_lines JSONB DEFAULT '[]'::jsonb,
    accessibility_information JSONB DEFAULT '{}'::jsonb,
    gates JSONB DEFAULT '[]'::jsonb,
    first_train VARCHAR(20) DEFAULT '06:00 AM',
    last_train VARCHAR(20) DEFAULT '11:00 PM',
    layout_type VARCHAR(50) DEFAULT 'Elevated', -- Elevated, Underground, At-Grade
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Connections (Graph Edges between Stations)
CREATE TABLE IF NOT EXISTS connections (
    id SERIAL PRIMARY KEY,
    source_station_id VARCHAR(64) REFERENCES stations(id) ON DELETE CASCADE,
    destination_station_id VARCHAR(64) REFERENCES stations(id) ON DELETE CASCADE,
    line_id VARCHAR(32) REFERENCES metro_lines(id) ON DELETE CASCADE,
    distance_km NUMERIC(5,2) NOT NULL,
    estimated_travel_time_min INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_connection UNIQUE (source_station_id, destination_station_id, line_id)
);

-- 4. Station Facilities
CREATE TABLE IF NOT EXISTS station_facilities (
    id SERIAL PRIMARY KEY,
    station_id VARCHAR(64) REFERENCES stations(id) ON DELETE CASCADE,
    facility_name VARCHAR(100) NOT NULL,
    facility_type VARCHAR(50) NOT NULL, -- LIFT, ESCALATOR, PARKING, WASHROOM, TACTILE, FEEDER_BUS, ATM
    availability_status VARCHAR(50) DEFAULT 'Operational',
    verification_status VARCHAR(50) DEFAULT 'Verified', -- Verified, Demo
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Announcements & Advisories
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255),
    description TEXT NOT NULL,
    announcement_type VARCHAR(50) DEFAULT 'Advisory', -- Advisory, Delay, Maintenance, General
    line_id VARCHAR(32) REFERENCES metro_lines(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Active',
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_identifier VARCHAR(100) UNIQUE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    accessibility_preferences JSONB DEFAULT '{"reduced_motion": false, "high_contrast": false, "wheelchair_friendly": false}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stations_name ON stations(station_name);
CREATE INDEX IF NOT EXISTS idx_stations_primary_line ON stations(primary_line_id);
CREATE INDEX IF NOT EXISTS idx_connections_source ON connections(source_station_id);
CREATE INDEX IF NOT EXISTS idx_connections_dest ON connections(destination_station_id);
CREATE INDEX IF NOT EXISTS idx_facilities_station ON station_facilities(station_id);

