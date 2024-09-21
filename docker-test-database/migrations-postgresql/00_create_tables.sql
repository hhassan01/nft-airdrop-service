CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(255) NOT NULL,
    points INT DEFAULT 0,
    is_og BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_wallet_address ON "user" (wallet_address);