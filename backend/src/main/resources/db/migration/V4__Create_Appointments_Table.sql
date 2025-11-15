CREATE TABLE appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    reason TEXT,
    consultation_type VARCHAR(20) NOT NULL,
    cancellation_reason TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id),
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
);

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, end_time, status, reason, consultation_type, created_at)
VALUES 
    (1, 1, NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 1 hour', 'SCHEDULED', 'Weekly therapy session', 'VIDEO', NOW()),
    (1, 1, NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days 1 hour', 'SCHEDULED', 'Follow-up appointment', 'VIDEO', NOW()),
    (1, 2, NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days 1 hour', 'SCHEDULED', 'Initial consultation', 'VIDEO', NOW());
