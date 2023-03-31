//@ts-ignore
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export class HTMLDocument {
    public url;
    public body;
    private hmtl


    constructor(_url:string, _body:any) {
        this.url = _url;
        this.body = _body;
        this.hmtl = new DOMParser().parseFromString(this.body, 'text/html');
    }

    public links():Array<string>{
        let link_array:Array<any> = this.hmtl.querySelectorAll('a');
        //@ts-ignore
        let links:Array<string> = [];
        for(let i =0; i <link_array.length;i++){
            if(link_array[i].attributes.href.length >0){
                try{
                    let url = new URL(link_array[i].attributes.href);
                    links.push(url.href)
                }catch{
                    links.push(this.parse_link(link_array[i].attributes.href))
                }
            }
        }
        return links;
    }

    public domain_links():Array<string>{
        let link_array:Array<any> = this.hmtl.querySelectorAll('a');
        //@ts-ignore
        let links:Array<string> = [];
        for(let i =0; i <link_array.length;i++){
            if(link_array[i].attributes.href.length >0){
                try{
                    let url = new URL(link_array[i].attributes.href);
                    if(this.host_match(url.href)){
                        links.push(url.href)
                    }
                }catch{
                    links.push(this.parse_link(link_array[i].attributes.href))
                }
            }
        }
        return links;
    }
    public non_host_links():Array<string>{
        let link_array:Array<any> = this.hmtl.querySelectorAll('a');
        //@ts-ignore
        let links:Array<string> = [];
        for(let i =0; i <link_array.length;i++){
            if(link_array[i].attributes.href.length >0){
                try{
                    let url = new URL(link_array[i].attributes.href);
                    if(!this.host_match(url.href)){
                        links.push(url.href)
                    }
                }catch{
                    links.push(this.parse_link(link_array[i].attributes.href))
                }
            }
        }
        return links;
    }

    public curated_links(regex_string:any):Array<string>{
        let regex = new RegExp(regex_string)
        let link_array:Array<any> = this.hmtl.querySelectorAll('a');
        //@ts-ignore
        let links:Array<string> = [];
        for(let i =0; i <link_array.length;i++){
            if(link_array[i].attributes.href.length >0){
                try{
                    let url = new URL(link_array[i].attributes.href);
                    if(regex.test(url.href)){
                        links.push(url.href)
                    }
                }catch{
                    let link = this.parse_link(link_array[i].attributes.href)
                    if(regex.test(link)){
                        links.push(link)
                    }
                }
            }
        }
        return links;
    }

    private parse_link(link:string):string{
           let base = new URL(this.url);
            if(link.substring(0,1).match("/")){
                return base.origin+link
            }else{
                return base.origin+"/"+link
            }
    }

    private host_match(link:string):boolean{
        let origin = new URL(this.url).host;
        let to_check = new URL(link).host;

        return origin===to_check;
    }
}