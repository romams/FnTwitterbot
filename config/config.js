import { fileURLToPath } from "url";
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);

const rootPath = resolve(dirname(__filename), '../');

const API_ENDPOINT = 'https://fortniteapi.io/v2/shop?lang=es'

export {rootPath, API_ENDPOINT}