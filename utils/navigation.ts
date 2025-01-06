export const navigation = [
    {
        label: 'Organizatorzy',
        to: '/organizers',
        roles: ['user', 'organizer', 'admin', 'niezalogowany', null], // Dostępne dla wszystkich
    },
    {
        label: 'Moje wydarzenia',
        to: '/events/myEvents',
        roles: ['user', 'organizer', 'admin'], // Dostępne dla wszystkich
    },
    {
      label: 'Nowe wydarzenie',
      to: '/events/addEvent',
      roles: ['organizer'], // Tylko dla organizatorów
    },
    {
      label: 'Panel administratora',
      to: '/admin',
      roles: ['admin'], // Tylko dla administratorów
    },
  ];
  