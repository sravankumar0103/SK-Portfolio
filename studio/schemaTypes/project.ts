import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'card', title: 'Card (list view)', default: true },
    { name: 'detail', title: 'Detail page (blog)' },
  ],
  fields: [
    // ---------- Card fields (shown in the Selected Works list) ----------
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'card',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'card',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tech',
      title: 'Tech tags',
      description: 'e.g. React, TypeScript, Supabase',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'card',
    }),
    defineField({
      name: 'github',
      title: 'GitHub / Code URL',
      type: 'url',
      group: 'card',
    }),
    defineField({
      name: 'live',
      title: 'Live demo URL',
      description: 'Leave empty if there is no live link.',
      type: 'url',
      group: 'card',
    }),
    defineField({
      name: 'image',
      title: 'Image (optional)',
      description: 'Optional project thumbnail. Leave empty to keep the text-only card.',
      type: 'image',
      options: { hotspot: true },
      group: 'card',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      description: 'Lower numbers show first.',
      type: 'number',
      group: 'card',
    }),
    defineField({
      name: 'visible',
      title: 'Show on site',
      type: 'boolean',
      initialValue: true,
      group: 'card',
    }),

    // ---------- Detail page (blog) fields ----------
    defineField({
      name: 'hasDetailPage',
      title: 'Enable detail page',
      description:
        'When on, the project row’s arrow opens a full "/projects/<slug>" blog page. Leave off for text-only projects.',
      type: 'boolean',
      initialValue: false,
      group: 'detail',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      description: 'The page URL, e.g. "crm-nuzividu" → /projects/crm-nuzividu. Click "Generate".',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      group: 'detail',
      hidden: ({ parent }) => !parent?.hasDetailPage,
      validation: (Rule) =>
        Rule.custom((slug, context) => {
          const parent = context.parent as { hasDetailPage?: boolean } | undefined;
          if (parent?.hasDetailPage && !slug?.current) {
            return 'A slug is required when the detail page is enabled.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      description: 'Large banner shown at the top of the detail page.',
      type: 'image',
      options: { hotspot: true },
      group: 'detail',
      hidden: ({ parent }) => !parent?.hasDetailPage,
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      description: 'A short intro paragraph shown under the title.',
      type: 'text',
      rows: 3,
      group: 'detail',
      hidden: ({ parent }) => !parent?.hasDetailPage,
    }),
    defineField({
      name: 'client',
      title: 'Client / Context',
      description: 'e.g. "Nuzividu Mangoes (Freelance)". Optional.',
      type: 'string',
      group: 'detail',
      hidden: ({ parent }) => !parent?.hasDetailPage,
    }),
    defineField({
      name: 'clientLabel',
      title: 'Client heading',
      description:
        'Overrides the "Client" heading above the value on the left — e.g. "Project", "Institution". Leave empty to show "Client".',
      type: 'string',
      group: 'detail',
      hidden: ({ parent }) => !parent?.hasDetailPage,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      description: 'e.g. "Full-Stack Developer". Optional.',
      type: 'string',
      group: 'detail',
      hidden: ({ parent }) => !parent?.hasDetailPage,
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      description: 'e.g. "Jan 2025 – Apr 2025". Optional.',
      type: 'string',
      group: 'detail',
      hidden: ({ parent }) => !parent?.hasDetailPage,
    }),
    defineField({
      name: 'body',
      title: 'Body (write-up / workflow)',
      description: 'The main blog content — headings, paragraphs, lists, links, and inline images.',
      type: 'array',
      group: 'detail',
      hidden: ({ parent }) => !parent?.hasDetailPage,
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h2' },
            { title: 'Sub-heading', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'caption', type: 'string', title: 'Caption' }],
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description: 'Screenshots shown in a grid near the bottom of the detail page.',
      type: 'array',
      group: 'detail',
      hidden: ({ parent }) => !parent?.hasDetailPage,
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'caption', type: 'string', title: 'Caption' }],
        },
      ],
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes / Highlights',
      description: 'Short bullet points — results, impact, key features.',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'detail',
      hidden: ({ parent }) => !parent?.hasDetailPage,
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
