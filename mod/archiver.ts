//@ts-ignore
//@ts-ignore
import { HTMLDocument } from "./records.ts";

export async function archive_webpage(link:string):Promise<HTMLDocument> {
    return new Promise(async (resolve) =>{
        const page = await (await fetch(link)).body;
        let record = new HTMLDocument(link,page);
        resolve(record)
    })
}
