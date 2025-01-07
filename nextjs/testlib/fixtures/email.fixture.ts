import {randomUUID} from "node:crypto";

export function getRandomEmail() {
    return `customer-${randomUUID()}@example.com`;
}