#!/usr/bin/env ts-node

const path = require("path");
const fs = require("fs");

// Grab the table name from the command line
const nameArg = process.argv[2];
if (!nameArg) {
  console.log("Usage: npm run make:table <tableName>");
  process.exit(0);
}

const fileName = `${nameArg}.ts`;
const schemaDir = path.join(__dirname, "..", "src", "database", "schema");
const filePath = path.join(schemaDir, fileName);

// Don’t overwrite an existing schema
if (fs.existsSync(filePath)) {
  console.log(`ℹ️ File already exists at src/database/schema/${fileName}`);
  process.exit(0);
}

// Generate file contents
const schemaContent = `import * as t from "drizzle-orm/sqlite-core";

export const ${nameArg} = t.sqliteTable("${nameArg}", {
  id: t.int().primaryKey({ autoIncrement: true }),
});
`;

// Write the new schema file
fs.mkdirSync(schemaDir, { recursive: true });
fs.writeFileSync(filePath, schemaContent);
console.log(`✅ Created schema at src/database/schema/${fileName}`);

// Update the central export file
const schemaIndexPath = path.join(schemaDir, "..", "schema.ts");
const exportLine = `export * from "@/database/schema/${nameArg}";\n`;

if (!fs.existsSync(schemaIndexPath)) {
  fs.writeFileSync(schemaIndexPath, exportLine);
  console.log("✅ Created schema.ts and added export.");
} else {
  const current = fs.readFileSync(schemaIndexPath, "utf8");
  if (!current.includes(exportLine.trim())) {
    fs.appendFileSync(schemaIndexPath, exportLine);
    console.log("✅ Added export to schema.ts.");
  } else {
    console.log("ℹ️ Export already exists in schema.ts.");
  }
}
