import { MenuItem } from '../models/menu.model';

const MENU_ITEMS: MenuItem[] = [
  

    { key: 'adminPanel', 'label': '', isTitle: true },
   
            {
                key: 'app-manage-contact',
                label: 'Contacts',
                link: '/apps/admin/contact',
                icon: 'users'
            },
            {
                key: 'app-manage-list',
                label: 'List',
                link: '/apps/admin/list',
                icon: 'list'

            },
            {
                key: 'app-manage-shedule',
                label: 'Schedule',
                link: '/apps/admin/schedule',
                icon: 'calendar'

                
               
            },
            {
                key: 'Add-Template',
                label: 'Add Template',
                link: '/apps/admin/Add-Template',
                icon: 'message-square'
            },
            {
                key: 'app-manage-custom',
                label: 'Default Message',
                link: '/apps/admin/custom',
                icon: 'package'

            },
            {
                key: 'app-message',
                label: 'Custom Message',
                link: '/apps/admin/custom-single-message-template',
                icon: 'message-square'
            },
            {
                key: 'Punch-out-in',
                label: 'Punch In-Punch Out',
                link: '/apps/admin/punch',
                icon: 'check-circle'
            },
            {
                key: 'logstats',
                label: 'Log Stats',
                link: '/apps/admin/logstats',
                icon: 'percent'
            },
            {
                key: 'app-manage-logout',
                label: 'logout',
                link: 'auth/logout',
                icon: 'log-out'
            },
   
        ]
    
    const TWO_COl_MENU_ITEMS: MenuItem[] = []


const HORIZONTAL_MENU_ITEMS: MenuItem[] = []
 

export { MENU_ITEMS, TWO_COl_MENU_ITEMS, HORIZONTAL_MENU_ITEMS };