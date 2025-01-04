export const navigation = [
    {
      label: 'Home',
      path: '/',
      roles: ['user', 'organizer', 'admin'], // Dostępne dla wszystkich
    },
    {
        label: 'Organizatorzy',
        path: '/organizers',
        roles: ['user', 'organizer', 'admin'], // Dostępne dla wszystkich
    },
    {
        label: 'Moje wydarzenia',
        path: '/events/myEvents',
        roles: ['user', 'organizer', 'admin'], // Dostępne dla wszystkich
    },
    {
      label: 'Nowe wydarzenie',
      path: '/events/addEvent',
      roles: ['organizer'], // Tylko dla organizatorów
    },
    {
      label: 'Panel administratora',
      path: '/admin',
      roles: ['admin'], // Tylko dla administratorów
    },
  ];
  