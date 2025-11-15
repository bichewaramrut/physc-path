CREATE TABLE push_subscriptions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    endpoint VARCHAR(1000) NOT NULL,
    p256dh VARCHAR(500) NOT NULL,
    auth VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_used_at TIMESTAMP,
    user_agent VARCHAR(500),
    device_info VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_push_sub_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_sub_endpoint ON push_subscriptions(endpoint);
CREATE INDEX idx_push_sub_is_active ON push_subscriptions(is_active);
