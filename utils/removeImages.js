import fs from 'fs';
import { promisify } from 'util';

const unlinkASync = promisify(fs.unlink);

async function removeImagenes(imagesToRemove) {
    try {
        await Promise.all(imagesToRemove.map(async (imagePath) => {
            await unlinkASync(imagePath);
        }));
    } catch (error) {
        console.log(`Error al eliminar imagen: ${error.message}`)
    }
}

export {
    removeImagenes
}