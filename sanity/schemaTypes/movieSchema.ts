import { defineField, defineType } from 'sanity';


// define the movie schema that will be stored in sanity
export const movies = defineType({
  name: 'movie',
  title: 'Movies',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title', // Uses the 'name' field as the source for generating the slug
      },
    },
    {
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
    },
    {
      name: 'genre',
      title: 'Genre',
      type: 'string',
    },
    {
      name: 'synopsis',
      title: 'Synopsis',
      type: 'text',
    },
    {
      name: 'cover',
      title: 'Cover',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'trailer',
      title: 'Trailer',
      type: 'string',
    },
  ],
});

export default movies;
