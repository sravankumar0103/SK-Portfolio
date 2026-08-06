import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tech',
      title: 'Tech tags',
      description: 'e.g. React, TypeScript, Supabase',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'github',
      title: 'GitHub / Code URL',
      type: 'url',
    }),
    defineField({
      name: 'live',
      title: 'Live demo URL',
      description: 'Leave empty if there is no live link.',
      type: 'url',
    }),
    defineField({
      name: 'image',
      title: 'Image (optional)',
      description: 'Optional project thumbnail. Leave empty to keep the text-only card.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers show first.',
      type: 'number',
    }),
    defineField({
      name: 'visible',
      title: 'Show on site',
      type: 'boolean',
      initialValue: true,
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
    select: { title: 'title', subtitle: 'order', media: 'image' },
  },
});
