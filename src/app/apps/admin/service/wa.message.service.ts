import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import * as env from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WAMesssagingService {
  private apicontactUrl ='http://localhost/list'

  // private apicontactUrl = "http://13.126.175.153/list";

  url = env.WAEnds.url + env.WAEnds.version + "/" + env.WAEnds.PhnID + "/messages";

  constructor(private http: HttpClient) {}

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.apicontactUrl);
  }

  /* Birthday wishes */
  sendWACustomTemplateMessage(to: string, headerTxt: string, msg: string) {
    // console.log("Parameter got:", to, headerTxt, msg);
    const headers = {
      "Content-Type": "application/json",
      Authorization: env.WAEnds.token,
    };
    let data = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: "birthday_fusion_original",
        language: {
          code: "en",
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "text",
                text: headerTxt,
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: msg,
              },
            ],
          },
        ],
      },
    };

    return this.http.post(this.url, data, { headers });
  }

  /* Anniversary */
  sendWAanniversaryTemplate(to: string, headerTxt: string, msg: string) {
    // console.log("Parameter got:", to, headerTxt, msg);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `${env.WAEnds.token}`,
    };
    let data = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: "anniversary_fusion",
        language: {
          code: "en",
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "text",
                text: headerTxt,
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: msg,
              },
            ],
          },
        ],
      },
    };

    return this.http.post(this.url, data, { headers });
  }

  /* subscription_fusion*/
  subscriptionFusionTemplate(to: string, headerTxt: string, msg: string) {
    // console.log("Parameter got:", to, headerTxt, msg);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `${env.WAEnds.token}`,
    };
    let data = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: "subscription_fusion",
        language: {
          code: "en",
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "text",
                text: headerTxt,
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: msg,
              },
            ],
          },
        ],
      },
    };

    return this.http.post(this.url, data, { headers });
  }

  customTemplate(to: string, headerTxt: string, msg: string) {
    // console.log("Parameter recieved:", to, headerTxt);
    const headers = {
      "Accept" : "application/json",
      "Content-Type": "application/json",
      Authorization: env.WAEnds.token,
    };

    let custom_Temp = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: "customtemp",
        language: {
          code: "en",
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "text",
                text: headerTxt,
              },
            ],
          },
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: msg,
              },
            ],
          },
        ],
      },
    };
    return this.http.post(this.url, custom_Temp, { headers });
  }

  helloworldTemplate(to: string) {
    console.log("Parameter recieved on helloworldTemplate:", to);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `${env.WAEnds.token}`,
    };
    let content = {
      messaging_product: "whatsapp",
      to: "918056221146",
      type: "template",
      template: {
        name: "hello_world",
        language: {
          code: "en_US",
        },
      },
    };
    return this.http.post(this.url, content, { headers });
  }
}
