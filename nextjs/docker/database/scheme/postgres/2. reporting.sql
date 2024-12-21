DROP TABLE IF EXISTS company;
DROP TABLE IF EXISTS campaign;
DROP TABLE IF EXISTS campaign_reminder_sent;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS non_active_customer;
DROP TABLE IF EXISTS measure_value;
DROP TABLE IF EXISTS customer_measurement;

CREATE TABLE IF NOT EXISTS company
(
    name  varchar(255) NOT NULL,
    email TEXT         NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS campaign
(
    start_date      date          NOT NULL,
    end_date        date          NOT NULL,
    reminder_dates  timestamptz[] NOT NULL,
    customer_emails text[],
    measure_values  json[]        NOT NULL,
    company         varchar(255)  NOT NULL,
    PRIMARY KEY (start_date, end_date, measure_values, reminder_dates, customer_emails, company)
);

CREATE TABLE IF NOT EXISTS campaign_reminder_sent
(
    date            timestamptz   NOT NULL,
    start_date      date          NOT NULL,
    end_date        date          NOT NULL,
    measure_values  json[]        NOT NULL,
    reminder_dates  timestamptz[] NOT NULL,
    customer_emails text[],
    company         varchar(255)  NOT NULL,
    PRIMARY KEY (start_date, end_date, measure_values, date, reminder_dates, customer_emails, company)
);

CREATE TABLE IF NOT EXISTS customer
(
    email             text         NOT NULL,
    title             varchar(255) NULL,
    first_name        varchar(255) NOT NULL,
    middle_name       varchar(255) NULL,
    last_name         varchar(255) NOT NULL,
    street_lines      text[]       NOT NULL,
    postal_code       varchar(255) NOT NULL,
    city              varchar(255) NOT NULL,
    country           varchar(255) NOT NULL,
    state_or_province varchar(255) NOT NULL,
    phone_number      varchar(255) NOT NULL,
    company           varchar(255) NOT NULL,
    PRIMARY KEY (email, company)
);

CREATE TABLE IF NOT EXISTS non_active_customer
(
    email             text         NOT NULL,
    title             varchar(255) NULL,
    first_name        varchar(255) NOT NULL,
    middle_name       varchar(255) NULL,
    last_name         varchar(255) NOT NULL,
    street_lines      text[]       NOT NULL,
    postal_code       varchar(255) NOT NULL,
    city              varchar(255) NOT NULL,
    country           varchar(255) NOT NULL,
    state_or_province varchar(255) NOT NULL,
    phone_number      varchar(255) NOT NULL,
    company           varchar(255) NOT NULL,
    archive_date      timestamptz  NOT NULL default now()
);

CREATE INDEX if not exists non_active_customer_company_email ON non_active_customer USING btree (email, company);

CREATE TABLE IF NOT EXISTS measure_value
(
    name          TEXT         NOT NULL,
    translations  json         NOT NULL,
    measure_unit  TEXT         NULL,
    type          VARCHAR(255) NOT NULL,
    is_editable   BOOLEAN      NOT NULL,
    default_value TEXT         NULL,
    company       varchar(255),
    PRIMARY KEY (name, company)
);

CREATE TABLE IF NOT EXISTS customer_measurement
(
    name          TEXT         NOT NULL,
    value         TEXT         NOT NULL,
    customer_mail TEXT         NOT NULL,
    date_time     TIMESTAMP    NOT NULL,
    company       varchar(255) NOT NULL,
    PRIMARY KEY (name, customer_mail, date_time, company)
);
