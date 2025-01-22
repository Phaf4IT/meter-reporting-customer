// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.entity */
export type EntityId = string;

/** Represents the table public.entity */
export default interface Entity {
  id: EntityId;

  entityType: string;

  fieldValues: unknown;

  company: string;
}

/** Represents the initializer for the table public.entity */
export interface EntityInitializer {
  /** Default value: uuidv7_sub_ms() */
  id?: EntityId;

  entityType: string;

  fieldValues: unknown;

  company: string;
}

/** Represents the mutator for the table public.entity */
export interface EntityMutator {
  id?: EntityId;

  entityType?: string;

  fieldValues?: unknown;

  company?: string;
}
