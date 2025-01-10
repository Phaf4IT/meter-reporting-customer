// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.overruled_customer_measurement */
export type Overruled_customer_measurementCampaign_name = string;

/** Identifier type for public.overruled_customer_measurement */
export type Overruled_customer_measurementCustomer_mail = string;

/** Identifier type for public.overruled_customer_measurement */
export type Overruled_customer_measurementOverrule_date_time = Date;

/** Identifier type for public.overruled_customer_measurement */
export type Overruled_customer_measurementCompany = string;

/** Represents the table public.overruled_customer_measurement */
export default interface OverruledCustomerMeasurement {
  campaignName: Overruled_customer_measurementCampaign_name;

  customerMail: Overruled_customer_measurementCustomer_mail;

  overruleDateTime: Overruled_customer_measurementOverrule_date_time;

  company: Overruled_customer_measurementCompany;

  measurements: unknown[];

  originalDateTime: Date;
}

/** Represents the initializer for the table public.overruled_customer_measurement */
export interface OverruledCustomerMeasurementInitializer {
  campaignName: Overruled_customer_measurementCampaign_name;

  customerMail: Overruled_customer_measurementCustomer_mail;

  overruleDateTime: Overruled_customer_measurementOverrule_date_time;

  company: Overruled_customer_measurementCompany;

  measurements: unknown[];

  originalDateTime: Date;
}

/** Represents the mutator for the table public.overruled_customer_measurement */
export interface OverruledCustomerMeasurementMutator {
  campaignName?: Overruled_customer_measurementCampaign_name;

  customerMail?: Overruled_customer_measurementCustomer_mail;

  overruleDateTime?: Overruled_customer_measurementOverrule_date_time;

  company?: Overruled_customer_measurementCompany;

  measurements?: unknown[];

  originalDateTime?: Date;
}
