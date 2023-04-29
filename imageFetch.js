import dotenv from 'dotenv';
import { createCanvas, loadImage } from "canvas";
import fetch from "node-fetch";
import sharp from "sharp";
import fs from 'fs';
import { extname, join } from "path";
import { compareImagePaths } from "./utils/sortImages.js";
import { rootPath, API_ENDPOINT } from "./config/config.js";

dotenv.config();
const { readdir } = fs.promises;

const generateArrayOfLinks = async () => {
    const arrayOfLinks = [];

    try {
        const response = await fetch(API_ENDPOINT, {
            headers: { 'Authorization': process.env.FORTNITE_ACCESS_TOKEN }
        });

        const data = await response.json();
        const { shop } = data;

        if (shop.length > 0) {
            {
                shop?.map(({ displayAssets }) => {
                    displayAssets?.map(({ full_background }) => {
                        arrayOfLinks.push(full_background);
                    })
                })
            }
        }
    } catch (error) {
        console.log({ error });
        return [];
    }

    return arrayOfLinks;
}

const fetchImagesSequentially = async (index, arrayOfLinks) => {
    if (index >= arrayOfLinks.length) {
        return true;
    }

    try {
        const response = await fetch(arrayOfLinks[index]);
        const imgBuffer = await response.arrayBuffer();
        saveImage(imgBuffer, index);
    } catch (error) {
        throw new Error(`Failed to fetch image at index ${index} : ${error.message}`);
    }

    return fetchImagesSequentially(index + 1, arrayOfLinks)
}


const saveImage = (imgBuffer, idx) => {
    console.log('Guardando imagen: ', idx);
    sharp(imgBuffer)
        .resize(256, 256)
        .toFile(`${join(rootPath, '/media/')}${idx}.jpeg`)
}

const readMediaDirectory = async () => {
    const directoryPath = join(rootPath, 'media');

    try {
        const files = await readdir(directoryPath);

        const imageFiles = files.filter(file => {
            const imgExt = extname(file);
            return imgExt === '.jpeg' || imgExt === '.png'
        });

        const imagesPath = imageFiles.sort(compareImagePaths).map(file => {
            const imgPath = join(directoryPath, file);
            return imgPath.replace(/\\/g, '/');
        })
        return imagesPath;
    } catch (error) {
        console.log(error);
        return [];
    }
}

const createMainImage = async (imagesPath) => {
    const headerImgWidth = 1024;
    const headerImgHeight = 200;
    const imgWH = 256;
    const elementsPerRow = 8;
    const totalRows = Math.ceil(imagesPath.length / elementsPerRow);
    const canvasHeight = totalRows * imgWH;
    const canvasWidth = (elementsPerRow * imgWH)

    let initialXPosition = 0;
    let initialYPosition = headerImgHeight;
    let currentRow = 1;
    let currentImgDrawing = 0;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0,0, canvasWidth, canvasHeight);

    const imagesArray = await Promise.all(imagesPath.map(url => loadImage(url)));

    imagesArray.forEach((img, idx) => {
        if (idx === 0) {
            context.drawImage(img, initialXPosition, initialYPosition);
            currentImgDrawing++;
        } else if ((imgWH * currentImgDrawing) >= canvasWidth) {
            initialYPosition = (imgWH * currentRow) + (headerImgHeight);
            currentImgDrawing = 0
            currentRow++;
        }else{
            context.drawImage(img, (currentImgDrawing * imgWH), initialYPosition);
            currentImgDrawing++;
        }

    });

    const headerImageLoaded = await loadImage(join(rootPath, '/headerImg.png'));

    context.drawImage(headerImageLoaded, (canvasWidth / 2) - (headerImgWidth / 2), 0);

    const out = fs.createWriteStream('output.jpeg');
    const stream = canvas.createJPEGStream();
    stream.pipe(out);

    return join(rootPath, out.path);
}


const getImageShop = async () => {
    const arrayOfLinks = await generateArrayOfLinks();
    const isFetchDone = await fetchImagesSequentially(0, arrayOfLinks);

    if (isFetchDone) {
        const imagesPath = await readMediaDirectory();

        const shopJPEGPath = await createMainImage(imagesPath);

        return {
            'shopJPEGPath': shopJPEGPath.replace(/\\/g, '/'),
            'totalItems': arrayOfLinks.length,
        };
    }
}

export { getImageShop, readMediaDirectory };