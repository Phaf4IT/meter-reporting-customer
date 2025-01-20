DROP TABLE IF EXISTS company;
DROP TABLE IF EXISTS campaign;
DROP TABLE IF EXISTS campaign_reminder_sent;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS non_active_customer;
DROP TABLE IF EXISTS measure_value;
DROP TABLE IF EXISTS customer_measurement;
DROP TABLE IF EXISTS overruled_customer_measurement;

CREATE OR REPLACE FUNCTION uuidv7_sub_ms() RETURNS uuid
AS
$$
select encode(
               substring(int8send(floor(t_ms)::int8) from 3) ||
               int2send((7 << 12)::int2 | ((t_ms - floor(t_ms)) * 4096)::int2) ||
               substring(uuid_send(gen_random_uuid()) from 9 for 8)
           , 'hex')::uuid
from (select extract(epoch from clock_timestamp()) * 1000 as t_ms) s
$$ LANGUAGE sql volatile;

CREATE TABLE IF NOT EXISTS company
(
    name  varchar(255) NOT NULL,
    email TEXT         NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS campaign
(
    name           text          NOT NULL,
    start_date     date          NOT NULL,
    end_date       date          NOT NULL,
    reminder_dates timestamptz[] NOT NULL,
    customer_ids   uuid[]        NOT NULL,
    measure_values json[]        NOT NULL,
    company        varchar(255)  NOT NULL,
    PRIMARY KEY (name, company)
);

CREATE INDEX if not exists search_campaign_idx ON campaign USING btree (start_date, end_date, reminder_dates, company);

CREATE TABLE IF NOT EXISTS reminder
(
    campaign_name   text         NOT NULL,
    customer_emails text[]       NOT NULL,
    reminder_date   timestamptz  NOT NULL,
    company         varchar(255) NOT NULL,
    PRIMARY KEY (campaign_name, reminder_date, company)
);

CREATE TABLE IF NOT EXISTS campaign_reminder_sent
(
    campaign_name  text         NOT NULL,
    reminder_date  timestamptz  NOT NULL,
    customer_email text         NOT NULL,
    token          text         NOT NULL,
    company        varchar(255) NOT NULL,
    PRIMARY KEY (campaign_name, reminder_date, customer_email, company)
);

CREATE INDEX if not exists campaign_reminder_sent_idx ON campaign_reminder_sent USING btree (customer_email, token);

CREATE TABLE IF NOT EXISTS customer
(
    id                uuid         NOT NULL DEFAULT uuidv7_sub_ms(),
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
    id                uuid         NOT NULL,
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

CREATE INDEX if not exists non_active_customer_company_email_idx ON non_active_customer USING btree (id, email, company);

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
    measurements  json[]       NOT NULL,
    campaign_name TEXT         NOT NULL,
    customer_mail TEXT         NOT NULL,
    date_time     TIMESTAMP    NOT NULL,
    company       varchar(255) NOT NULL,
    PRIMARY KEY (campaign_name, customer_mail, company)
);

CREATE TABLE IF NOT EXISTS overruled_customer_measurement
(
    measurements       json[]       NOT NULL,
    campaign_name      TEXT         NOT NULL,
    customer_mail      TEXT         NOT NULL,
    original_date_time TIMESTAMP    NOT NULL,
    overrule_date_time TIMESTAMP    NOT NULL,
    company            varchar(255) NOT NULL,
    PRIMARY KEY (campaign_name, customer_mail, company, overrule_date_time)
);
