import { BehaviorSubject } from "rxjs";

export interface NotificationItem {
    id?: number;
    text?: string;
    icon?: string;
    isActive?: boolean;
    avatar?: string;
    subText?: string;
    bgColor?: string;
    redirectTo?: string;
}

export interface Notification {
    
    id?: number;
    title?: string;
    text: string;
    params?: string[];
    options?: { timeout?: number };
    level?: 'success' | 'default' | 'error';
    autohide: boolean;
}

export interface ToastItem {
    id?: number;
    msg: string;
    type: string;  
    hide?: boolean 
}
