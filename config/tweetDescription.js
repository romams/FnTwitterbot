import emoji from "node-emoji"
import { getCurrentDate } from "../utils/fortmatDate.js"

const getTweetDescription = (totalItems) => {
    const tweetMessage = `
    ${emoji.get('shopping_trolley')} Tienda de objetos del día ${emoji.get('date')} ${getCurrentDate()}\n${totalItems} Articulos en la tienda ${emoji.get('shopping_trolley')}\n#Fortnite | #FortniteMEGA
    `
    return tweetMessage;
}

export { getTweetDescription }