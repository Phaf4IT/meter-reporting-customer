DROP TABLE IF EXISTS tariff;
DROP TABLE IF EXISTS discount;
DROP TABLE IF EXISTS invoice;
DROP TABLE IF EXISTS invoice_line_item;
DROP TABLE IF EXISTS payment;

CREATE TABLE IF NOT EXISTS tariff
(
    campaign_name TEXT           NOT NULL,
    company       VARCHAR(255)   NOT NULL,
    tariff_type   VARCHAR(255)   NOT NULL, -- Bijvoorbeeld: 'usage_based', 'annual', 'daily', 'monthly'
    measure_value TEXT           NULL,     -- NULL betekent dat het tarief voor de hele campagne geldt
    rate          NUMERIC(10, 2) NOT NULL, -- Het tarief (per eenheid of per periode)
    unit          VARCHAR(50)    NOT NULL, -- Bijvoorbeeld: 'per_unit', 'per_year', 'per_month', 'per_day'
    range_from    NUMERIC(10, 2) NULL,     -- Ondergrens van het gebruik (NULL = geen minimum)
    range_to      NUMERIC(10, 2) NULL,     -- Bovengrens van het gebruik (NULL = geen maximum)
    valid_from    TIMESTAMPTZ    NOT NULL, -- Startdatum van het tarief
    valid_to      TIMESTAMPTZ    NOT NULL, -- Einddatum van het tarief
    PRIMARY KEY (campaign_name, company, tariff_type, measure_value, range_from, valid_from)
);

CREATE TABLE IF NOT EXISTS discount
(
    discount_name  TEXT           NOT NULL, -- Unieke naam voor de korting
    campaign_name  TEXT           NOT NULL, -- De campagne waarop de korting van toepassing is
    company        VARCHAR(255)   NOT NULL, -- Het bedrijf waarvoor de korting geldt
    discount_type  VARCHAR(50)    NOT NULL, -- Type korting: 'general', 'tariff', 'tiered'
    measure_value  TEXT           NULL,     -- Voor korting op specifieke meetwaarden (NULL = algemene korting)
    range_from     NUMERIC(10, 2) NULL,     -- Ondergrens voor staffelkorting (NULL = geen drempel)
    range_to       NUMERIC(10, 2) NULL,     -- Bovengrens voor staffelkorting (NULL = geen maximum)
    discount_value NUMERIC(10, 2) NOT NULL, -- Waarde van de korting (percentage of vast bedrag)
    discount_unit  VARCHAR(50)    NOT NULL, -- 'percentage' of 'fixed' (voor vast bedrag)
    valid_from     TIMESTAMPTZ    NOT NULL, -- Startdatum van de korting
    valid_to       TIMESTAMPTZ    NOT NULL, -- Einddatum van de korting
    PRIMARY KEY (discount_name, campaign_name, company, discount_type, measure_value, range_from, valid_from)
);



CREATE TABLE IF NOT EXISTS invoice
(
    customer_email TEXT           NOT NULL,
    company        VARCHAR(255)   NOT NULL,
    invoice_date   TIMESTAMPTZ    NOT NULL DEFAULT now(),
    total_amount   NUMERIC(10, 2) NOT NULL,
    currency       VARCHAR(10)    NOT NULL,
    status         VARCHAR(50)    NOT NULL DEFAULT 'pending', -- Bijvoorbeeld: 'pending', 'paid', 'cancelled'
    PRIMARY KEY (customer_email, company, invoice_date)
);

CREATE TABLE IF NOT EXISTS invoice_line_item
(
    customer_email TEXT           NOT NULL,
    company        VARCHAR(255)   NOT NULL,
    invoice_date   TIMESTAMPTZ    NOT NULL,
    campaign_name  TEXT           NOT NULL,
    tariff_type    VARCHAR(255)   NOT NULL,
    description    TEXT           NOT NULL,
    quantity       NUMERIC(10, 2) NOT NULL, -- Bijv. eenheden gebruikt
    unit_price     NUMERIC(10, 2) NOT NULL,
    line_total     NUMERIC(10, 2) NOT NULL, -- quantity * unit_price
    PRIMARY KEY (customer_email, company, invoice_date, campaign_name, tariff_type)
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
