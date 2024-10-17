BEGIN;

CREATE TABLE IF NOT EXISTS companies (
    id         SERIAL PRIMARY KEY,
    unit       TEXT NOT NULL,
    email      TEXT UNIQUE NOT NULL,
    password   TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
    id        SERIAL PRIMARY KEY,
    cpf       TEXT UNIQUE NOT NULL,
    password  TEXT NOT NULL,
    name      TEXT NOT NULL,
    role      TEXT NOT NULL,
    companyId INTEGER NOT NULL,
    FOREIGN KEY (companyId) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS leads (
    id         SERIAL PRIMARY KEY,
    location   TEXT NOT NULL,
    name       TEXT NOT NULL,
    phone      TEXT NOT NULL,
    email      TEXT,
    cpf        TEXT,
    birth      TEXT,
    zip        TEXT,
    street     TEXT,
    complement TEXT,
    city       TEXT,
    level      TEXT,
    interest   BOOLEAN DEFAULT FALSE,
    enroll     BOOLEAN DEFAULT FALSE,
    price      DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    employeeId INTEGER NOT NULL,
    FOREIGN KEY (employeeId) REFERENCES employees(id)
);

COMMIT;