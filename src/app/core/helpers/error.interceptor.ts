import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/layout/shared/service/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    
    constructor(
        private authenticationService: AuthenticationService,
        private notificationService: NotificationService,
        private toastServ: ToastrService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            switch (err.status) {
                case 401: {
                    // auto logout if 401 response returned from api
                    this.notificationService.addNotification({ autohide: true, text: "Unauthorized", level: "error"})
                    this.authenticationService.logout();
                    location.reload();
                    break;
                }
                case 500: {
                    this.notificationService.addNotification({ autohide: true, text: "Error with the backend", level: "error"})
                    break;
                }
                case 403: {
                    this.notificationService.addNotification({ autohide: true, text: "Forbidden access", level: "error"})
                    break;
                }
                case 405: {
                    this.notificationService.addNotification({ autohide: true, text: "Method not allowed", level: "error"})
                    break;
                }
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
