import { fileURLToPath } from "url";
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);

const rootPath = resolve(dirname(__filename), '../');

export {rootPath}