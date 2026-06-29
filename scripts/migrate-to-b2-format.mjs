#!/usr/bin/env node
import { migrateAllToB2Format } from "./markdown-project.mjs";
import path from "path";
import { fileURLToPath } from "url";

migrateAllToB2Format(path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
