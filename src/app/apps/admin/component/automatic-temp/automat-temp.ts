import { Component, OnInit } from '@angular/core';
import { WAMesssagingService } from "../../service/wa.message.service"
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'automat-temp',
  templateUrl: './automat-temp.html',
  styleUrls: ['./automat-temp.scss']
})
export class automatTempComponent implements OnInit {

  constructor(private http: HttpClient, private messagingService: WAMesssagingService) {}

  ngOnInit(): void {
    this.checkBirthdaysAndSendMessages();
  }

  checkBirthdaysAndSendMessages(): void {
    this.http.get<any[]>('../db.json').subscribe(
      (contacts) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; 

        const birthdayContacts = contacts.filter(contact => {
          const [contactMonth, contactDay] = contact.birthday.split('-').map(Number);
          return contactMonth === currentMonth && contactDay === currentDate.getDate();
        });

        birthdayContacts.forEach(contact => {
          const { name, phone } = contact;
          const birthdayMessage = `Happy Birthday ${name}! 🎉🎂`;

          this.messagingService.sendWACustomTemplateMessage(phone, 'Happy Birthday!', birthdayMessage)
            .subscribe(
              (response) => {
                console.log(`WhatsApp message sent to ${phone} for ${name}'s birthday.`);
              },
              (error) => {
                console.error(`Error sending WhatsApp message to ${phone} for ${name}'s birthday:`, error);
              }
            );
        });
      },
      (error) => {
        console.error('Error fetching contacts from db.json:', error);
      }
    );
  }
}