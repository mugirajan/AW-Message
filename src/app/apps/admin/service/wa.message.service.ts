import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import * as env from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WAMesssagingService {

  private apicontactUrl ='http://localhost:3000/contacts'

  url = env.WAEnds.url + env.WAEnds.version + "/" + env.WAEnds.PhnID + "/messages";

  constructor(private http: HttpClient) { }

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.apicontactUrl);
    
  }

  sendWACustomTemplateMessage(to: string, headerTxt: string, msg: string) {

    console.log("Parameter got:", to, headerTxt, msg)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${env.WAEnds.token}`
    }
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

    return this.http.post(this.url, data, { headers });
  }

  customTemplate(to: string, headerTxt: string, ){
    console.log("Parameter recieved:", to, headerTxt,)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${env.WAEnds.token}`
    }

    let custom_Temp={
      "messaging_product": "whatsapp",
      "to": to,
      "type": "template",
        "template": {
            "name": "customized_gym_template",
            "language": {
                "code": "en"
            },
            "components": [
                {
                    "type": "header",
                    "parameters": [
                        {
                            "type": "image",
                            "image": {
                                "link": "https://i.imgur.com/UlFinxp.jpeg"
                            },
                            "text": ""
                        }
                    ]
                },
                {
                    "type": "body",
                    "parameters": [
                        {
                            "type": "text",
                            "text": headerTxt
                        }
                    ]
                }
            ]
        }
    }
    return this.http.post(this.url, custom_Temp,{headers});

    }
    
  }
