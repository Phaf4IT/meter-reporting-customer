// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.entity_type */
export type Entity_typeName = string;

/** Represents the table public.entity_type */
export default interface EntityType {
  name: Entity_typeName;

  fields: unknown;

  company: string;
}

/** Represents the initializer for the table public.entity_type */
export interface EntityTypeInitializer {
  name: Entity_typeName;

  fields: unknown;

  company: string;
}

/** Represents the mutator for the table public.entity_type */
export interface EntityTypeMutator {
  name?: Entity_typeName;

  fields?: unknown;

  company?: string;
}
