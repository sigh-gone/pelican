import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import {HTMLDocument} from "./records.ts";

export async function archive_webpage(link:string):Promise<HTMLDocument> {
    return new Promise(async (resolve) =>{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link);
        await page.waitFor(100)

        //Uint8 array
        let screenshot = await page.screenshot();
        //string
        // @ts-ignore
        const text = await page.evaluate(() => document.querySelector('*').outerHTML);

        let record = new HTMLDocument(link,screenshot,text);
        await browser.close();
        resolve(record)
    })
}
