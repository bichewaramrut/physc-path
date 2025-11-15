CREATE TABLE consultations (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    doctor_notes TEXT,
    recording_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments (id)
);

CREATE TABLE video_sessions (
    id BIGSERIAL PRIMARY KEY,
    consultation_id BIGINT,
    room_id VARCHAR(100) NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    patient_joined BOOLEAN DEFAULT FALSE,
    doctor_joined BOOLEAN DEFAULT FALSE,
    recording_enabled BOOLEAN DEFAULT FALSE,
    recording_url VARCHAR(255),
    session_token VARCHAR(255),
    session_config TEXT,
    provider VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (consultation_id) REFERENCES consultations (id)
);

-- Insert sample consultations and video sessions
INSERT INTO consultations (appointment_id, status, created_at)
VALUES 
    (1, 'SCHEDULED', NOW()),
    (2, 'SCHEDULED', NOW()),
    (3, 'SCHEDULED', NOW());

INSERT INTO video_sessions (consultation_id, room_id, recording_enabled, provider, created_at)
VALUES 
    (1, 'room-123456', FALSE, 'WEBRTC', NOW()),
    (2, 'room-234567', FALSE, 'WEBRTC', NOW()),
    (3, 'room-345678', FALSE, 'WEBRTC', NOW());
