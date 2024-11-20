import { Project } from '@interfaces';

export const initialData: Project = {
  company: 'Acme',
  projectName: 'Acme Project',
  description: 'Lorem Ipsum',
  priceByHour: 30.5,
  igvPercent: 10,
  features: [
    {
      id: window.crypto.randomUUID(),
      order: 0,
      canRemove: false,
      selected: false,
      editMode: false,
      hours: 16,
      description: 'Website Base',
      largeDescription:
        'Prepare the skeleton of the website such as the basic styles, the architecture to be used, what type of server the website will be deployed on, the web technology to be used, how the project folders will be organized, what external libraries such as CSS and JavaScript styles will be used, images and icons provided by the client',
      subFeatures: [],
    },
    {
      id: window.crypto.randomUUID(),
      order: 1,
      canRemove: false,
      selected: false,
      editMode: false,
      hours: 16,
      description: 'Website 5 to 8 pages.',
      largeDescription:
        'The website will need between 5 to 8 statics pages like landing page, contact us, about us.',
      subFeatures: [],
    },
    {
      id: window.crypto.randomUUID(),
      order: 2,
      canRemove: false,
      selected: false,
      editMode: false,
      hours: 30,
      description: 'Shopping cart.',
      largeDescription:
        'Allow to select products and buy them online. The payment gateway need to be provided by the customer',
      subFeatures: [],
    },
    {
      id: window.crypto.randomUUID(),
      order: 3,
      canRemove: false,
      selected: false,
      editMode: false,
      hours: 20,
      description: 'Access using email accounts',
      largeDescription:
        'Allow to registered with email/password with a confirmation email to verify if the email is valid',
      subFeatures: [],
    },
    {
      id: window.crypto.randomUUID(),
      order: 4,
      canRemove: false,
      selected: false,
      editMode: false,
      hours: 24,
      description: 'Access using social networks',
      largeDescription:
        'Using APIs of a social networks like facebook or gmail to registered into the website.',
      subFeatures: [],
    },
    {
      id: window.crypto.randomUUID(),
      order: 5,
      canRemove: false,
      selected: false,
      editMode: false,
      hours: 24,
      description: 'Chat integration',
      largeDescription:
        'Add chat functionality for help support to a client using a third platform previous selected by website owner where the owner has a license to use.',
      subFeatures: [],
    },
    {
      id: window.crypto.randomUUID(),
      order: 6,
      canRemove: false,
      selected: false,
      editMode: false,
      hours: 120,
      description:
        'Dashboard for managing clients, products and payments data.',
      largeDescription:
        'Dashboard with admin credentials functionality to manage the data of the clients registered, products selling by web site and the payments of the payment gateway used in the shopping cart. ',
      subFeatures: [],
    },
  ],
};
