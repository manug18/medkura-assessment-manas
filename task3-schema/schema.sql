-- ==================================================================================
-- PostgreSQL Schema for Patient Journey - MedKura Case Management System
-- ==================================================================================
-- This schema models the complete patient journey from onboarding through surgery
-- completion, supporting 50,000+ active cases with proper audit trails and indexing.
-- ==================================================================================

-- Case stage enum type (provided by requirement)
CREATE TYPE case_stage AS ENUM (
  'onboarded',
  'lab_tests_ordered',
  'second_opinion_scheduled',
  'second_opinion_completed',
  'hospital_selected',
  'surgery_scheduled',
  'surgery_completed',
  'closed'
);

-- Actor type enum for audit trail
CREATE TYPE actor_type AS ENUM (
  'representative',
  'doctor',
  'system',
  'admin'
);

-- ==================================================================================
-- CORE ENTITIES
-- ==================================================================================

-- Patients table: one patient can have multiple cases over time
-- (e.g., knee surgery now, hip surgery later)
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_age CHECK (date_of_birth < CURRENT_DATE)
);

-- Care representatives who manage patient cases
CREATE TABLE representatives (
    rep_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    max_cases INT DEFAULT 50 CHECK (max_cases > 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================================================
-- CASE MANAGEMENT
-- ==================================================================================

-- Cases: core entity tracking one patient's treatment journey/episode
-- Each case represents one surgery/treatment cycle (patient can have multiple cases)
CREATE TABLE cases (
    case_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    assigned_rep INT REFERENCES representatives(rep_id) ON DELETE SET NULL,
    current_stage case_stage NOT NULL DEFAULT 'onboarded',
    current_stage_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    case_description TEXT NOT NULL,
    treatment_type VARCHAR(100), -- e.g., "Knee Replacement", "Cardiac Surgery"
    estimated_cost DECIMAL(12, 2) CHECK (estimated_cost >= 0),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    closed_at TIMESTAMP WITH TIME ZONE,
    closed_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_closed_logic CHECK (
        (is_closed = FALSE AND closed_at IS NULL) OR
        (is_closed = TRUE AND closed_at IS NOT NULL)
    ),
    CONSTRAINT check_stage_started CHECK (current_stage_started_at >= created_at)
);

-- Audit trail table for stage transitions
-- Tracks every stage change with actor information for compliance and debugging
CREATE TABLE case_stage_history (
    history_id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    previous_stage case_stage,
    new_stage case_stage NOT NULL,
    changed_by INT NOT NULL, -- ID of the actor (rep, doctor, admin)
    changed_by_type actor_type NOT NULL, -- Type of actor who made the change
    changed_by_name VARCHAR(200), -- Denormalized name for reporting
    change_notes TEXT, -- Optional reason/context for the change
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_stage_change CHECK (
        previous_stage IS NULL OR previous_stage != new_stage
    )
);

-- ==================================================================================
-- MEDICAL PROVIDERS
-- ==================================================================================

-- Doctors who provide consultations for cases
CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    specialty VARCHAR(100) NOT NULL, -- e.g., "Orthopedics", "Cardiology"
    hospital_affiliation VARCHAR(200),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    consultation_fee DECIMAL(10, 2) CHECK (consultation_fee >= 0),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    years_of_experience INT CHECK (years_of_experience >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Doctor consultations, tied to a case and a doctor
CREATE TABLE consultations (
    consultation_id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    doctor_id INT NOT NULL REFERENCES doctors(doctor_id) ON DELETE RESTRICT,
    consultation_type VARCHAR(50) DEFAULT 'in-person' CHECK (consultation_type IN ('in-person', 'telemedicine', 'phone', 'follow-up')),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    diagnosis TEXT,
    treatment_plan TEXT,
    prescription TEXT,
    notes TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_consultation_times CHECK (
        completed_at IS NULL OR completed_at >= scheduled_at
    ),
    CONSTRAINT check_follow_up CHECK (
        (follow_up_required = FALSE AND follow_up_date IS NULL) OR
        (follow_up_required = TRUE)
    )
);

-- Lab test orders for a case
CREATE TABLE lab_tests (
    lab_test_id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    test_name VARCHAR(200) NOT NULL,
    test_type VARCHAR(100) NOT NULL, -- e.g., "Blood Test", "MRI", "X-Ray"
    ordered_by INT REFERENCES doctors(doctor_id) ON DELETE SET NULL,
    ordered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    result TEXT,
    result_received_at TIMESTAMP WITH TIME ZONE,
    result_file_url TEXT,
    status VARCHAR(50) DEFAULT 'ordered' CHECK (status IN ('ordered', 'scheduled', 'in-progress', 'completed', 'cancelled')),
    notes TEXT,
    
    CONSTRAINT check_test_times CHECK (
        (scheduled_at IS NULL OR scheduled_at >= ordered_at) AND
        (completed_at IS NULL OR (scheduled_at IS NULL OR completed_at >= scheduled_at))
    )
);

-- ==================================================================================
-- HOSPITALS AND REFERRALS
-- ==================================================================================

-- Hospitals where treatments are performed
CREATE TABLE hospitals (
    hospital_id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255) CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    specialties TEXT[], -- Array of specialties the hospital offers
    bed_count INT CHECK (bed_count > 0),
    is_network_partner BOOLEAN DEFAULT TRUE,
    accreditation VARCHAR(100), -- e.g., "NABH", "JCI"
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hospital referrals for a case
CREATE TABLE hospital_referrals (
    referral_id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    hospital_id INT NOT NULL REFERENCES hospitals(hospital_id) ON DELETE RESTRICT,
    referred_by INT REFERENCES representatives(rep_id) ON DELETE SET NULL,
    referred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    treatment_type VARCHAR(200),
    estimated_cost DECIMAL(12, 2) CHECK (estimated_cost >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
    accepted BOOLEAN DEFAULT FALSE,
    admission_date DATE,
    discharge_date DATE,
    notes TEXT,
    
    CONSTRAINT check_admission_dates CHECK (
        (admission_date IS NULL) OR
        (discharge_date IS NULL OR discharge_date >= admission_date)
    )
);

-- ==================================================================================
-- DOCUMENTS
-- ==================================================================================

-- Documents uploaded for cases (reports, test results, insurance docs, etc.)
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- e.g., "Medical Report", "Insurance Card", "Test Result"
    document_name VARCHAR(300) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_kb INT CHECK (file_size_kb > 0),
    uploaded_by INT NOT NULL,
    uploaded_by_type actor_type NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- ==================================================================================
-- INDEXES (Optimized for 50K+ cases)
-- ==================================================================================

-- Critical performance indexes for high-volume queries:

-- 1. Composite index for representative workload queries
-- Justification: Reps frequently filter their assigned cases by current stage to prioritize work.
-- With 50K+ cases, filtering by rep alone would scan thousands of rows. This composite index
-- allows efficient filtering on both columns in a single index lookup.
CREATE INDEX idx_cases_rep_stage ON cases(assigned_rep, current_stage) WHERE assigned_rep IS NOT NULL;

-- 2. Index for finding stalled cases by stage duration
-- Justification: Management queries frequently ask "which cases have been in stage X for >N days?"
-- This composite index on (current_stage, current_stage_started_at) enables efficient range scans
-- for finding stalled cases without full table scan.
CREATE INDEX idx_cases_stage_duration ON cases(current_stage, current_stage_started_at);

-- 3. Index for closed case analytics
-- Justification: Reporting queries filter by is_closed flag and analyze by closure time.
-- Partial index reduces size by only indexing closed cases.
CREATE INDEX idx_cases_closed ON cases(is_closed, closed_at) WHERE is_closed = TRUE;

-- 4. Index for patient lookup by name
-- Justification: Support staff search patients by last name + first name frequently.
-- Text pattern indexes support LIKE queries with 'Name%' patterns.
CREATE INDEX idx_patients_name ON patients(last_name, first_name);

-- 5. Index for audit trail queries by case
-- Justification: Viewing a case's full history requires scanning case_stage_history by case_id.
-- Ordered by changed_at DESC for chronological display (most recent first).
CREATE INDEX idx_history_case_time ON case_stage_history(case_id, changed_at DESC);

-- 6. Index for audit queries by actor
-- Justification: Compliance reports need "show all changes made by representative X".
-- Composite index on (changed_by_type, changed_by, changed_at) enables efficient filtering.
CREATE INDEX idx_history_actor ON case_stage_history(changed_by_type, changed_by, changed_at DESC);

-- 7. Index for consultation scheduling queries
-- Justification: Doctors' dashboards show upcoming consultations (scheduled_at in future).
-- Composite index allows efficient "doctor's schedule for date range" queries.
CREATE INDEX idx_consultations_doctor_schedule ON consultations(doctor_id, scheduled_at) WHERE completed_at IS NULL;

-- 8. Index for case consultation history
-- Justification: Case detail page shows all consultations for a case chronologically.
CREATE INDEX idx_consultations_case ON consultations(case_id, scheduled_at DESC);

-- 9. Index for lab test tracking
-- Justification: Lab coordinators filter tests by status to see pending/scheduled tests.
-- Partial index only covers non-completed tests to reduce size.
CREATE INDEX idx_lab_tests_status ON lab_tests(status, scheduled_at) WHERE status != 'completed';

-- 10. Index for case lab test history
-- Justification: Case detail view lists all lab tests ordered for a case.
CREATE INDEX idx_lab_tests_case ON lab_tests(case_id, ordered_at DESC);

-- 11. Index for hospital network partner searches
-- Justification: Users search for hospitals by city and partner status frequently.
CREATE INDEX idx_hospitals_city_partner ON hospitals(city, is_network_partner);

-- 12. Index for hospital referral tracking
-- Justification: Hospital coordinators track referrals by status to manage admissions.
CREATE INDEX idx_referrals_status ON hospital_referrals(hospital_id, status, referred_at DESC);

-- 13. Index for case referral lookup
-- Justification: Case detail page shows all hospital referrals for a case.
CREATE INDEX idx_referrals_case ON hospital_referrals(case_id, referred_at DESC);

-- 14. Index for document retrieval by case
-- Justification: Case detail page loads all documents for a case sorted by upload time.
CREATE INDEX idx_documents_case ON documents(case_id, uploaded_at DESC);

-- 15. Index for doctor availability search
-- Justification: Booking system searches for available doctors by specialty and city.
CREATE INDEX idx_doctors_specialty_city ON doctors(specialty, city, is_available) WHERE is_available = TRUE;

-- ==================================================================================
-- SAMPLE QUERIES
-- ==================================================================================

-- ==================================================================================
-- SAMPLE QUERIES
-- ==================================================================================

/*
 * Query (a): Get all active cases assigned to a specific representative where the 
 * case has been in the same stage for more than 5 days.
 *
 * Performance Strategy:
 * - Uses idx_cases_rep_stage for efficient filtering by rep and stage
 * - Uses idx_cases_stage_duration to filter by stage duration in a single index scan
 * - Avoids NOT EXISTS subquery by using window functions for better performance
 * - For 50K+ cases, this query will scan only the relevant rep's cases (~500-1000)
 *   and use index on current_stage_started_at for the time filter.
 */

-- Option 1: Simple and efficient using current_stage_started_at (denormalized approach)
SELECT 
    c.case_id,
    c.patient_id,
    p.first_name,
    p.last_name,
    c.current_stage,
    c.current_stage_started_at,
    EXTRACT(DAY FROM (CURRENT_TIMESTAMP - c.current_stage_started_at)) AS days_in_stage,
    c.priority,
    c.case_description
FROM cases c
JOIN patients p ON p.patient_id = c.patient_id
WHERE c.assigned_rep = $1  -- Parameter: representative ID
  AND c.is_closed = FALSE
  AND c.current_stage_started_at < CURRENT_TIMESTAMP - INTERVAL '5 days'
ORDER BY c.current_stage_started_at ASC, c.priority DESC;

-- Option 2: Using audit trail (if current_stage_started_at wasn't tracked)
-- More complex but demonstrates audit trail usage
WITH latest_stage_changes AS (
    SELECT 
        csh.case_id,
        csh.new_stage,
        csh.changed_at,
        ROW_NUMBER() OVER (PARTITION BY csh.case_id ORDER BY csh.changed_at DESC) AS rn
    FROM case_stage_history csh
)
SELECT 
    c.case_id,
    c.patient_id,
    p.first_name,
    p.last_name,
    c.current_stage,
    lsc.changed_at AS stage_started_at,
    EXTRACT(DAY FROM (CURRENT_TIMESTAMP - lsc.changed_at)) AS days_in_stage,
    c.priority,
    c.case_description
FROM cases c
JOIN patients p ON p.patient_id = c.patient_id
JOIN latest_stage_changes lsc ON lsc.case_id = c.case_id AND lsc.rn = 1
WHERE c.assigned_rep = $1
  AND c.is_closed = FALSE
  AND lsc.new_stage = c.current_stage
  AND lsc.changed_at < CURRENT_TIMESTAMP - INTERVAL '5 days'
ORDER BY lsc.changed_at ASC, c.priority DESC;

/*
 * Query (b): Get the average number of days from case creation to "Hospital Selected" stage,
 * grouped by the hospital's city.
 *
 * Performance Strategy:
 * - Uses idx_history_case_time to find hospital_selected transitions efficiently
 * - Uses idx_referrals_case to join hospital referrals
 * - For 50K+ cases with ~30% reaching hospital selection (~15K rows),
 *   the query scans case_stage_history with index and performs aggregation.
 * - Result set is small (one row per city), so GROUP BY is performant.
 *
 * Assumptions:
 * - Each case has at most one hospital referral that's accepted/completed
 * - We track the hospital_selected stage in case_stage_history
 * - If multiple hospitals per case, we use the first accepted referral
 */

WITH hospital_selection_times AS (
    SELECT DISTINCT ON (csh.case_id)
        csh.case_id,
        csh.changed_at AS hospital_selected_at,
        c.created_at AS case_created_at
    FROM case_stage_history csh
    JOIN cases c ON c.case_id = csh.case_id
    WHERE csh.new_stage = 'hospital_selected'
    ORDER BY csh.case_id, csh.changed_at ASC  -- First time reaching this stage
),
case_hospitals AS (
    SELECT DISTINCT ON (hr.case_id)
        hr.case_id,
        h.city AS hospital_city
    FROM hospital_referrals hr
    JOIN hospitals h ON h.hospital_id = hr.hospital_id
    WHERE hr.status IN ('accepted', 'completed')
    ORDER BY hr.case_id, hr.referred_at ASC  -- First accepted referral
)
SELECT 
    ch.hospital_city,
    COUNT(*) AS total_cases,
    ROUND(AVG(EXTRACT(EPOCH FROM (hst.hospital_selected_at - hst.case_created_at)) / 86400), 2) AS avg_days_to_hospital_selection,
    ROUND(MIN(EXTRACT(EPOCH FROM (hst.hospital_selected_at - hst.case_created_at)) / 86400), 2) AS min_days,
    ROUND(MAX(EXTRACT(EPOCH FROM (hst.hospital_selected_at - hst.case_created_at)) / 86400), 2) AS max_days,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (hst.hospital_selected_at - hst.case_created_at)) / 86400), 2) AS median_days
FROM hospital_selection_times hst
JOIN case_hospitals ch ON ch.case_id = hst.case_id
GROUP BY ch.hospital_city
HAVING COUNT(*) >= 5  -- Only show cities with at least 5 cases for statistical relevance
ORDER BY avg_days_to_hospital_selection ASC;

/*
 * Additional Performance Notes:
 * 
 * 1. For Query (a), if representatives typically have 500-1000 active cases, the composite
 *    index idx_cases_rep_stage will reduce the scan to only those rows, then the 
 *    WHERE clause on current_stage_started_at filters further using idx_cases_stage_duration.
 *
 * 2. For Query (b), the CTE approach with DISTINCT ON is more efficient than subqueries
 *    with window functions for finding the "first" occurrence. The indexes on changed_at
 *    and referred_at DESC support this pattern.
 *
 * 3. Both queries avoid SELECT * and only retrieve necessary columns for better I/O performance.
 *
 * 4. Using EXTRACT(EPOCH) / 86400 for day calculations is more accurate than casting to
 *    DATE and subtracting, as it preserves sub-day precision.
 */

-- ==================================================================================
-- TRIGGERS FOR AUTOMATED TIMESTAMP UPDATES
-- ==================================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at columns
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_representatives_updated_at BEFORE UPDATE ON representatives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================================================================================
-- END OF SCHEMA
-- ==================================================================================
