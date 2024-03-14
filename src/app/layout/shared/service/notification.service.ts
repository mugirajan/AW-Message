import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications$ = new BehaviorSubject<Notification>({ text: "Welcome back", title: "Festa Solar", autohide: true });

  public getNotifications(): Observable<Notification> {
    return this.notifications$;
  }

  public addNotification(notification: Notification) {
    this.next(notification);
  }

  // public removeNotification(id: number) {
  //   this.next(this.notifications$.getValue().filter( _ => _.id != id));
  // }

  private next(notifications: Notification) {
    this.notifications$.next(notifications);
  }


}
