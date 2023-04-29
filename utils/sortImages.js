
function compareImagePaths(a, b) {
    const aNum = parseInt(a.match(/\d+/));
    const bNum = parseInt(b.match(/\d+/));
    if (aNum < bNum) {
        return -1;
    } else if (aNum > bNum) {
        return 1;
    } else {
        return 0;
    }
}

export { compareImagePaths }