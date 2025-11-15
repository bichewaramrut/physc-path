CREATE TABLE payments (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(100),
    description TEXT,
    invoice_number VARCHAR(100),
    expiry_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE prescriptions (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    prescription_number VARCHAR(100) UNIQUE,
    issue_date TIMESTAMP NOT NULL,
    expiry_date TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    payment_id UUID,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (payment_id) REFERENCES payments(id)
);

CREATE TABLE medications (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100),
    instructions VARCHAR(500),
    quantity INTEGER,
    refills INTEGER,
    duration VARCHAR(100),
    prescription_id UUID,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
);

CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_medications_prescription_id ON medications(prescription_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
