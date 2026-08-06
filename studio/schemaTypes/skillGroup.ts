import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'skillGroup',
  title: 'Skill Group',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      description: 'e.g. "Languages", "Frameworks & Libraries"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
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
    select: { title: 'category' },
  },
});
