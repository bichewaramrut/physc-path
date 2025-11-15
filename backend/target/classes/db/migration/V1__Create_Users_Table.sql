CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    profile_image VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Insert admin user
INSERT INTO users (email, password, first_name, last_name, phone, active, created_at)
VALUES ('admin@thephysc.com', '$2a$10$DfPZI8Q9FU/jKjupl5AVtu/fJmO.pAMZDrLJnhCWY0k4.ODbtFhLa', 'Admin', 'User', '1234567890', true, NOW());

INSERT INTO user_roles (user_id, role)
VALUES (1, 'ROLE_ADMIN');
