import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Issuer',
      description: 'e.g. "Google / Coursera"',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Year',
      description: 'e.g. "2024"',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Credential URL (optional)',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers show first.',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'issuer' },
  },
});
