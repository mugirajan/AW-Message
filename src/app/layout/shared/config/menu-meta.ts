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
                key: 'Add-Template',
                label: 'Add Custom Template',
                link: '/apps/admin/Add-Template',
                icon: 'message-square'
            },
            {
                key: 'app-manage-shedule',
                label: 'Send Custom Template',
                link: '/apps/admin/sendcustomMessage',
                icon: 'calendar'  
            },
            {
                key: 'app-manage-custom',
                label: 'Instant Contact Message',
                link: '/apps/admin/custom',
                icon: 'package'

            },
            {
                key: 'app-message',
                label: 'Instant List Message',
                link: '/apps/admin/custom-single-message-template',
                icon: 'message-square'
            },
<<<<<<< HEAD
            {
                key: 'expired-contacts',
                label: 'Expiring Contacts',
                link: '/apps/admin/expired-contacts',
                icon: 'check-circle'
            },
            // {
            //     key: 'logstats',
            //     label: 'Log Stats',
            //     link: '/apps/admin/logstats',
            //     icon: 'percent'
            // },
=======
>>>>>>> 53e92a5f9d366895b6797bd68fe143f0f7284e83
            {
                key: 'Automatic',
                label: 'Scheduled Messages ',
                link: '/apps/admin/automatic',
                icon: 'clock'
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