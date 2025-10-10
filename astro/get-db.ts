import path from 'node:path'
import fs from 'node:fs'

export function getLocalD1DB() {
    try {
        const basePath = path.resolve(".wrangler");
        const dbFile = fs
            .readdirSync(basePath, { encoding: "utf-8", recursive: true })
            .find((f) => f.endsWith(".sqlite"));

        if (!dbFile) {
            throw new Error(`.sqlite file not found in ${basePath}`);
        }

        const filePath = path.resolve(basePath, dbFile);
        const url = `file:///${filePath.replace(/\\/g, "/")}`;
        return url;
    } catch (err) {
        console.log(`Error  ${err}`);
    }
}