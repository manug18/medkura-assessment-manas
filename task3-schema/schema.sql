-- PostgreSQL schema for patient journey (Task 3)

-- case_stage enum type provided by requirement
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

-- Patients table: a patient may have multiple cases
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Care representatives who manage cases
CREATE TABLE representatives (
    rep_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cases: one surgery journey linked to a patient and assigned rep
CREATE TABLE cases (
    case_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    assigned_rep INT REFERENCES representatives(rep_id),
    current_stage case_stage NOT NULL DEFAULT 'onboarded',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit trail table for stage transitions
CREATE TABLE case_stage_history (
    history_id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    previous_stage case_stage,
    new_stage case_stage NOT NULL,
    changed_by INT, -- could reference representatives, doctors, etc. we'll keep generic for now
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Doctors table
CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT,
    phone TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Doctor consultations, tied to a case and a doctor
CREATE TABLE consultations (
    consultation_id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    doctor_id INT NOT NULL REFERENCES doctors(doctor_id),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lab test orders for a case
CREATE TABLE lab_tests (
    lab_test_id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    ordered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    result TEXT,
    result_received_at TIMESTAMP WITH TIME ZONE
);

-- Hospital referrals for a case
CREATE TABLE hospitals (
    hospital_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT
);

CREATE TABLE hospital_referrals (
    referral_id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    hospital_id INT NOT NULL REFERENCES hospitals(hospital_id),
    referred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    accepted BOOLEAN DEFAULT FALSE,
    notes TEXT
);

-- Document uploads associated with cases or patients
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(case_id) ON DELETE CASCADE,
    patient_id INT REFERENCES patients(patient_id) ON DELETE CASCADE,
    uploaded_by INT, -- could be rep, doctor, etc.
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes: choose based on queries we expect
-- 1. cases(current_stage) for finding cases by stage
CREATE INDEX idx_cases_current_stage ON cases(current_stage);
-- 2. cases(assigned_rep) for looking up cases by representative
CREATE INDEX idx_cases_assigned_rep ON cases(assigned_rep);
-- 3. case_stage_history(case_id) for auditing history quickly
CREATE INDEX idx_history_case ON case_stage_history(case_id);
-- 4. hospital_referrals(hospital_id) to find referrals to certain hospital
CREATE INDEX idx_referrals_hospital ON hospital_referrals(hospital_id);
-- 5. consultations(case_id, doctor_id) composite for joining
CREATE INDEX idx_consultations_case_doctor ON consultations(case_id, doctor_id);

-- Additional meaningful indexes:
-- patients(last_name, first_name) for search
CREATE INDEX idx_patients_name ON patients(last_name, first_name);
-- lab_tests(case_id) for quick fetch of tests
CREATE INDEX idx_lab_tests_case ON lab_tests(case_id);

-- Sample queries as comments

-- (a) Get all active cases assigned to a specific representative where the case has been in the same stage for more than 5 days
--
-- SELECT c.*
-- FROM cases c
-- JOIN case_stage_history h ON h.case_id = c.case_id
-- WHERE c.assigned_rep = $1
--   AND c.current_stage NOT IN ('closed')
--   AND h.new_stage = c.current_stage
--   AND h.changed_at < now() - interval '5 days'
--   AND NOT EXISTS (
--         SELECT 1 FROM case_stage_history h2
--         WHERE h2.case_id = c.case_id
--           AND h2.changed_at > h.changed_at
--           AND h2.new_stage = c.current_stage
--       )
--;

-- (b) Get the average number of days from case creation to Hospital Selected stage, grouped by the referring city.
-- This assumes hospital_referrals records the city of the hospital and that stage history tracks the transition to hospital_selected.
--
-- SELECT h.city,
--        AVG( (sh.changed_at - c.created_at) )::interval AS avg_duration
-- FROM cases c
-- JOIN case_stage_history sh
--      ON sh.case_id = c.case_id AND sh.new_stage = 'hospital_selected'
-- JOIN hospital_referrals h
--      ON h.case_id = c.case_id
-- GROUP BY h.city;

-- End of schema
