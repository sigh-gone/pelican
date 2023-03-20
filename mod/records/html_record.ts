import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export class HTMLDocument {
    public url;
    public screenshot;
    public body;


    constructor(_url:string,_screenshot:any, _body:any) {
        this.url = _url;
        this.screenshot = _screenshot;
        this.body = _body;
    }

    public get_document():any{
       return new DOMParser().parseFromString(this.body, 'text/html');
    }

    public links():Array<string>{
        const document: any = this.get_document();
        let link_array:Array<any> = document.querySelectorAll('a');
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
        const document: any = this.get_document();
        let link_array:Array<any> = document.querySelectorAll('a');
        //@ts-ignore
        let links:Array<string> = [];
        for(let i =0; i <link_array.length;i++){
            if(link_array[i].attributes.href.length >0){
                try{
                    let url = new URL(link_array[i].attributes.href);
                    if(this.is_domain(url.href)){
                        links.push(url.href)
                    }
                }catch{
                    links.push(this.parse_link(link_array[i].attributes.href))
                }
            }
        }
        return links;
    }
    public non_domain_links():Array<string>{
        const document: any = this.get_document();
        let link_array:Array<any> = document.querySelectorAll('a');
        //@ts-ignore
        let links:Array<string> = [];
        for(let i =0; i <link_array.length;i++){
            if(link_array[i].attributes.href.length >0){
                try{
                    let url = new URL(link_array[i].attributes.href);
                    if(!this.is_domain(url.href)){
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
        const document: any = this.get_document();
        let link_array:Array<any> = document.querySelectorAll('a');
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
            if(link.substr(0,1).match("/")){
                return base.origin+link
            }else{
                return base.origin+"/"+link
            }
    }
    /*
    australian sites will have issue
     */
    private is_domain(link:string):boolean{
        let origin = new URL(this.url).origin.split(".");
        let to_check = new URL(link).origin.split(".");
        let origin_parsed = origin[origin.length-2]+origin[origin.length-1];
        let to_check_parsed = to_check[to_check.length-2]+to_check[to_check.length-1];

        return origin_parsed===to_check_parsed;
    }
}