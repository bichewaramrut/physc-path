CREATE TABLE patients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    date_of_birth TIMESTAMP,
    gender VARCHAR(20) NOT NULL,
    blood_type VARCHAR(10),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    allergies TEXT,
    medical_history TEXT,
    current_medications TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Insert sample patient
INSERT INTO users (email, password, first_name, last_name, phone, active, created_at)
VALUES ('patient@thephysc.com', '$2a$10$DfPZI8Q9FU/jKjupl5AVtu/fJmO.pAMZDrLJnhCWY0k4.ODbtFhLa', 'John', 'Doe', '1234567893', true, NOW());

INSERT INTO user_roles (user_id, role)
VALUES (4, 'ROLE_PATIENT');

INSERT INTO patients (user_id, date_of_birth, gender, blood_type, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, allergies, created_at)
VALUES (4, '1985-06-15 00:00:00', 'Male', 'O+', 'Jane Doe', '9876543210', 'Spouse', 'Penicillin', NOW());
