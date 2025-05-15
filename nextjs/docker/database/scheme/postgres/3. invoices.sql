DROP TABLE IF EXISTS tariff;
DROP TABLE IF EXISTS discount;
DROP TABLE IF EXISTS invoice_line_item;
DROP TABLE IF EXISTS invoice;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS invoice_year_state;


CREATE TABLE IF NOT EXISTS tariff
(
    id                 uuid           NOT NULL DEFAULT gen_random_uuid(),
    campaign_name      TEXT           NOT NULL,
    company            VARCHAR(255)   NOT NULL,
    customer_ids       uuid[]         NOT NULL,
    description        VARCHAR(255)   NOT NULL,
    measure_value_name TEXT           NULL,     -- NULL betekent dat het tarief voor de hele campagne geldt
    rate               NUMERIC(10, 2) NOT NULL, -- Het tarief (per eenheid of per periode)
    currency           VARCHAR(50)    NOT NULL,
    unit               VARCHAR(50)    NOT NULL, -- Bijvoorbeeld: 'usage_based', 'annual', 'daily', 'monthly'
    range_from         NUMERIC(10, 2) NULL,     -- Ondergrens van het gebruik (NULL = geen minimum)
    range_to           NUMERIC(10, 2) NULL,     -- Bovengrens van het gebruik (NULL = geen maximum)
    valid_from         TIMESTAMPTZ    NOT NULL, -- Startdatum van het tarief
    valid_to           TIMESTAMPTZ    NULL,     -- Einddatum van het tarief
    is_deposit         BOOLEAN        NOT NULL,
    PRIMARY KEY (id)
);

CREATE INDEX tariff_campaign_customer_idx ON tariff USING btree (campaign_name, company, description,
                                                                 measure_value_name, range_from, valid_from);

CREATE TABLE IF NOT EXISTS discount
(
    id                 uuid           NOT NULL DEFAULT gen_random_uuid(),
    discount_name      TEXT           NOT NULL, -- Unieke naam voor de korting
    campaign_name      TEXT           NOT NULL, -- De campagne waarop de korting van toepassing is
    company            VARCHAR(255)   NOT NULL, -- Het bedrijf waarvoor de korting geldt
    customer_ids       uuid[]         NOT NULL,
    discount_type      VARCHAR(50)    NOT NULL, -- Type korting: 'general', 'tariff', 'tiered'
    measure_value_name TEXT           NULL,     -- Voor korting op specifieke meetwaarden (NULL = algemene korting)
    range_from         NUMERIC(10, 2) NULL,     -- Ondergrens voor staffelkorting (NULL = geen drempel)
    range_to           NUMERIC(10, 2) NULL,     -- Bovengrens voor staffelkorting (NULL = geen maximum)
    discount_value     NUMERIC(10, 2) NOT NULL, -- Waarde van de korting (percentage of vast bedrag)
    discount_unit      VARCHAR(50)    NOT NULL, -- 'percentage' of 'fixed' (voor vast bedrag)
    currency           VARCHAR(50)    NULL,
    valid_from         TIMESTAMPTZ    NOT NULL, -- Startdatum van de korting
    valid_to           TIMESTAMPTZ    NULL,     -- Einddatum van de korting
    PRIMARY KEY (id)
);

CREATE INDEX discount_campaign_customer_idx ON discount USING btree (discount_name, campaign_name, company,
                                                                     discount_type, measure_value_name, range_from,
                                                                     valid_from);

CREATE TABLE IF NOT EXISTS invoice_year_state
(
    company_name VARCHAR(255),
    year         INT,
    PRIMARY KEY (company_name, year)
);

CREATE TABLE IF NOT EXISTS invoice
(
    id                  uuid           NOT NULL DEFAULT gen_random_uuid(),
    sequence_number     VARCHAR(50)    NOT NULL,
    year                INT            NOT NULL,
    customer_id         TEXT           NOT NULL,
    company             VARCHAR(255)   NOT NULL,
    campaign_name       TEXT           NOT NULL,
    invoice_date        TIMESTAMPTZ    NOT NULL DEFAULT now(),
    total_amount        NUMERIC(10, 2) NOT NULL,
    currency            VARCHAR(10)    NOT NULL,
    status              VARCHAR(20)    NOT NULL CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
    type                VARCHAR(10)    NOT NULL CHECK (type IN ('REGULAR', 'CREDITNOTA')),
    original_invoice_id uuid REFERENCES invoice (id), -- only creditnota's
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX if not exists invoice_sequence_number ON invoice USING btree (sequence_number, year, company);

CREATE INDEX if not exists invoice_idx ON invoice USING btree (customer_id, company, campaign_name);
CREATE INDEX if not exists invoice_date_idx ON invoice USING btree (invoice_date);
CREATE INDEX if not exists invoice_sequence_idx ON invoice USING btree (sequence_number, year);

CREATE TABLE IF NOT EXISTS invoice_line_item
(
    id            uuid           NOT NULL DEFAULT gen_random_uuid(),
    invoice_id    uuid REFERENCES invoice (id),
    customer_id   TEXT           NOT NULL,
    company       VARCHAR(255)   NOT NULL,
    invoice_date  TIMESTAMPTZ    NOT NULL,
    campaign_name TEXT           NOT NULL,
    tariff_type   VARCHAR(255)   NOT NULL,
    description   TEXT           NOT NULL,
    quantity      NUMERIC(10, 2) NOT NULL, -- Bijv. eenheden gebruikt
    unit_price    NUMERIC(10, 2) NOT NULL,
    line_total    NUMERIC(10, 2) NOT NULL, -- quantity * unit_price
    currency      VARCHAR(50)    NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS payment
(
    customer_email TEXT           NOT NULL,
    company        VARCHAR(255)   NOT NULL,
    invoice_date   TIMESTAMPTZ    NOT NULL,
    payment_date   TIMESTAMPTZ    NOT NULL DEFAULT now(),
    amount         NUMERIC(10, 2) NOT NULL,
    currency       VARCHAR(10)    NOT NULL,
    payment_method VARCHAR(50)    NOT NULL, -- Bijvoorbeeld: 'credit_card', 'bank_transfer'
    transaction_id TEXT           NOT NULL, -- Unieke referentie voor betalingen
    PRIMARY KEY (customer_email, company, invoice_date, payment_date, transaction_id)
);
