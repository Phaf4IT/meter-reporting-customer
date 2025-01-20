const {resolveType, escapeIdentifier} = require("kanel");
const {kyselyCamelCaseHook} = require("kanel-kysely");

/** @type {import('kanel').Config} */
module.exports = {
    connection: {
        host: "localhost",
        user: "postgres",
        password: "postgres",
        database: "main",
    },

    preDeleteOutputFolder: true,
    outputPath: "./components/database/schemas",

    customTypeMap: {
        "pg_catalog.tsvector": "string",
        "pg_catalog.bpchar": "string",
    },
    generateIdentifierType: (
        column,
        details,
        config,
    ) => {
        const name = escapeIdentifier(
            toPascalCase(details.name) + toPascalCase(column.name),
        );
        const innerType = resolveType(column, details, {
            ...config,
            generateIdentifierType: undefined,
        });
        const imports = [];

        let type = innerType;
        if (typeof innerType === "object") {
            type = innerType.name;
            imports.push(...innerType.typeImports);
        }

        return {
            declarationType: "typeDeclaration",
            name,
            exportAs: "named",
            typeDefinition: [`${type}`],
            typeImports: imports,
            comment: [`Identifier type for ${details.schemaName}.${details.name}`],
        };
    },
    preRenderHooks: [kyselyCamelCaseHook],
};

function toPascalCase(input) {
    return input
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
            index === 0 ? match.toUpperCase() : match.toLowerCase()
        )
        .replace(/\s+/g, '');
}