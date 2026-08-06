import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'About' },
    { name: 'resume', title: 'Resume' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    // ---------- HERO ----------
    defineField({
      name: 'heroFirstName',
      title: 'Name — line 1',
      description: 'e.g. "Sravan Kumar"',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroLastName',
      title: 'Name — line 2',
      description: 'e.g. "Diddi"',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroRole',
      title: 'Role / headline',
      description: 'e.g. "AI & Full - Stack Developer"',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroLocation',
      title: 'Location / status line',
      description: 'e.g. "Hyderabad, India · Open to opportunities"',
      type: 'string',
      group: 'hero',
    }),

    // ---------- ABOUT ----------
    defineField({
      name: 'aboutPara1',
      title: 'About — paragraph 1',
      type: 'text',
      rows: 4,
      group: 'about',
    }),
    defineField({
      name: 'aboutHighlight',
      title: 'About — highlighted sentence',
      description: 'The short animated sentence at the end of paragraph 1.',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutPara2',
      title: 'About — paragraph 2',
      type: 'text',
      rows: 4,
      group: 'about',
    }),
    defineField({
      name: 'statCgpa',
      title: 'Stat — CGPA',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'statProjects',
      title: 'Stat — Projects',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'statCertifications',
      title: 'Stat — Certifications',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'statExperience',
      title: 'Stat — Experience',
      type: 'string',
      group: 'about',
    }),

    // ---------- RESUME ----------
    defineField({
      name: 'resumeFile',
      title: 'Resume PDF (upload)',
      description: 'Upload your latest resume PDF here. This is used first if present.',
      type: 'file',
      options: { accept: '.pdf' },
      group: 'resume',
    }),
    defineField({
      name: 'resumeUrl',
      title: 'Resume link (fallback)',
      description: 'Optional external link (e.g. Google Drive) used if no PDF is uploaded.',
      type: 'url',
      group: 'resume',
    }),

    // ---------- CONTACT ----------
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'GitHub', value: 'github' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Email', value: 'email' },
                  { title: 'X / Twitter', value: 'twitter' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Other', value: 'other' },
                ],
              },
            }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
});
