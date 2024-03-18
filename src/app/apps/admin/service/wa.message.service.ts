import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import * as env from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WAMesssagingService {

  url = env.WAEnds.url + env.WAEnds.version + "/" + env.WAEnds.PhnID + "/messages";

  constructor(private http: HttpClient) { }

  sendWACustomTemplateMessage(to: string, headerTxt: string, msg: string) {

    let data = {
      "messaging_product": "whatsapp",
      "to": to,
      "type": "template",
      "template": {
        "name": "custom_msg",
        "language": {
          "code": "en"
        },
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "text",
                "text": headerTxt
              }
            ]
          },
          {
            "type": "body",
            "parameters": [
              {
                "type": "text",
                "text": msg
              }
            ]
          }
        ]
      }
    }

    this.http.post(this.url, data);
  }
}