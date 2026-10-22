// Enquiries from the callback form. Created by the website; you only change the status.
export default {
  name: 'lead',
  title: 'Lead',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'phone', title: 'Phone / WhatsApp', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'tripType', title: 'Trip type', type: 'string' },
    { name: 'destination', title: 'Destination', type: 'string' },
    { name: 'consent', title: 'OK to send offers', type: 'boolean' },
    { name: 'fromCity', title: 'Travelling from', type: 'string' },
    { name: 'travelMonth', title: 'Month', type: 'string' },
    { name: 'people', title: 'People', type: 'string' },
    { name: 'trip', title: 'Trip', type: 'string' },
    { name: 'page', title: 'Page they came from', type: 'string' },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: [{ title: 'New', value: 'new' }, { title: 'Contacted', value: 'contacted' }, { title: 'Booked', value: 'booked' }, { title: 'Not interested', value: 'lost' }], layout: 'radio' },
      initialValue: 'new',
    },
    { name: 'createdAt', title: 'Received', type: 'datetime' },
  ],
  orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'createdAt', direction: 'desc' }] }],
  preview: { select: { title: 'name', subtitle: 'phone' }, prepare: ({ title, subtitle }) => ({ title: title || 'Lead', subtitle }) },
};
