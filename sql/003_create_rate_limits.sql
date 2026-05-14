CREATE TABLE IF NOT EXISTS rate_limits (
  id SERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  fingerprint_hash TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_fingerprint_date ON rate_limits(fingerprint_hash, date);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_date ON rate_limits(ip, date);
