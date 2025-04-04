

// define the review schema that will be stored in sanity
const reviews = {
  name: 'review',
  title: 'Reviews',
  type: 'document',
  fields: [
    {
      name: 'movie',
      title: 'Movie',
      type: 'reference',
      to: [{ type: 'movie' }], // Reference to the movie schema so that reviews can be linked to a certian movie
      validation: (Rule: { required: () => any; }) => Rule.required(),
    },
    {
      name: 'userName',
      title: 'UserName',
      type: 'string',
      validation: (Rule: { required: () => any; }) => Rule.required(),
    },
    {
      name: 'reviewText',
      title: 'Review Text',
      type: 'text',
      validation: (Rule: { required: () => any; }) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule: { required: () => { (): any; new(): any; min: { (arg0: number): { (): any; new(): any; max: { (arg0: number): any; new(): any; }; }; new(): any; }; }; }) => Rule.required().min(0).max(5),
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
      },
      readOnly: true,
    },
  ],
  initialValue: {
    createdAt: new Date().toISOString(),
  },
};

export default reviews;
