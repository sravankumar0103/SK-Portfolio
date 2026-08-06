import type { StructureResolver } from 'sanity/structure';

// Custom dashboard layout.
// "Site Settings" is a singleton (one document you edit in place — Hero, About,
// Resume, Contact). The rest are lists you add/edit/reorder items in.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
        ),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('experience').title('Experience'),
      S.documentTypeListItem('skillGroup').title('Skill Groups'),
      S.documentTypeListItem('certification').title('Certifications'),
    ]);
