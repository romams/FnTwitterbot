import { CronJob } from "cron";
import { getImageShop, readMediaDirectory } from "./createImage.js";
import { removeImagenes } from "../utils/removeImages.js";
import { getTweetDescription } from "../config/tweetDescription.js";
import { rwClient } from "../config/twitterAPIConfig.js";

const tweet = async () => {
    try {
        const { shopJPEGPath, totalItems } = await getImageShop();

        if (shopJPEGPath) {
            setTimeout(async () => {
                const mediaId = await rwClient.v1.uploadMedia(shopJPEGPath);
                const tweetResp = await rwClient.v2.tweet(getTweetDescription(totalItems), { media: { media_ids: [mediaId] } });

                if (tweetResp?.data?.id) {
                    const imagesToRemove = await readMediaDirectory();

                    if (imagesToRemove.length > 0) {
                        await removeImagenes(imagesToRemove);
                        await removeImagenes([shopJPEGPath]);
                    }
                }
            }, 1000);
        }

    } catch (e) {
        console.log(e);
        throw new Error(`Ha ocurrido un eror: ${e}`)
    }
}

const tweetJob = new CronJob('40 01 23 * * *', () => {
    console.log('Iniciando tarea...');
    tweet()
}, null, false, 'America/Mexico_city');

export default tweetJob;