CREATE TABLE doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialty VARCHAR(100) NOT NULL,
    license VARCHAR(50) NOT NULL,
    years_of_experience INTEGER,
    bio TEXT,
    consultation_fee DOUBLE PRECISION,
    average_rating DOUBLE PRECISION,
    rating_count INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE doctor_specializations (
    doctor_id BIGINT NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    PRIMARY KEY (doctor_id, specialization),
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
);

CREATE TABLE doctor_education (
    doctor_id BIGINT NOT NULL,
    degree VARCHAR(100) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    year INTEGER,
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
);

CREATE TABLE doctor_certifications (
    doctor_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(200) NOT NULL,
    year INTEGER,
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
);

-- Insert sample doctors
INSERT INTO users (email, password, first_name, last_name, phone, active, created_at)
VALUES ('doctor1@thephysc.com', '$2a$10$DfPZI8Q9FU/jKjupl5AVtu/fJmO.pAMZDrLJnhCWY0k4.ODbtFhLa', 'Sarah', 'Wilson', '1234567891', true, NOW());

INSERT INTO user_roles (user_id, role)
VALUES (2, 'ROLE_DOCTOR');

INSERT INTO doctors (user_id, specialty, license, years_of_experience, bio, consultation_fee, average_rating, rating_count, created_at)
VALUES (2, 'Psychiatry', 'PSY123456', 10, 'Dr. Sarah Wilson is a board-certified psychiatrist with over 10 years of experience in treating various mental health conditions including depression, anxiety, and PTSD.', 150.00, 4.9, 120, NOW());

INSERT INTO doctor_specializations (doctor_id, specialization)
VALUES (1, 'Depression'), (1, 'Anxiety'), (1, 'PTSD');

INSERT INTO doctor_education (doctor_id, degree, institution, year)
VALUES (1, 'MD', 'Harvard Medical School', 2010), (1, 'Residency in Psychiatry', 'Johns Hopkins Hospital', 2014);

INSERT INTO doctor_certifications (doctor_id, name, issuing_authority, year)
VALUES (1, 'Board Certification in Psychiatry', 'American Board of Psychiatry and Neurology', 2014);

-- Insert second doctor
INSERT INTO users (email, password, first_name, last_name, phone, active, created_at)
VALUES ('doctor2@thephysc.com', '$2a$10$DfPZI8Q9FU/jKjupl5AVtu/fJmO.pAMZDrLJnhCWY0k4.ODbtFhLa', 'Michael', 'Thompson', '1234567892', true, NOW());

INSERT INTO user_roles (user_id, role)
VALUES (3, 'ROLE_DOCTOR');

INSERT INTO doctors (user_id, specialty, license, years_of_experience, bio, consultation_fee, average_rating, rating_count, created_at)
VALUES (3, 'Psychology', 'PSY654321', 8, 'Dr. Michael Thompson is a clinical psychologist specializing in cognitive behavioral therapy for mood disorders, relationship issues, and stress management.', 120.00, 4.8, 95, NOW());

INSERT INTO doctor_specializations (doctor_id, specialization)
VALUES (2, 'Cognitive Behavioral Therapy'), (2, 'Relationship Counseling'), (2, 'Stress Management');

INSERT INTO doctor_education (doctor_id, degree, institution, year)
VALUES (2, 'PhD in Clinical Psychology', 'Stanford University', 2012), (2, 'MA in Psychology', 'University of California', 2008);

INSERT INTO doctor_certifications (doctor_id, name, issuing_authority, year)
VALUES (2, 'Licensed Clinical Psychologist', 'State Board of Psychology', 2013);
