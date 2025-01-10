// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.verification_token */
export type Verification_tokenIdentifier = string;

/** Identifier type for public.verification_token */
export type Verification_tokenToken = string;

/** Represents the table public.verification_token */
export default interface VerificationToken {
  identifier: Verification_tokenIdentifier;

  token: Verification_tokenToken;

  expires: Date;
}

/** Represents the initializer for the table public.verification_token */
export interface VerificationTokenInitializer {
  identifier: Verification_tokenIdentifier;

  token: Verification_tokenToken;

  expires: Date;
}

/** Represents the mutator for the table public.verification_token */
export interface VerificationTokenMutator {
  identifier?: Verification_tokenIdentifier;

  token?: Verification_tokenToken;

  expires?: Date;
}
