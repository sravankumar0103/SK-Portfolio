import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: '3otp111t',
    dataset: 'production',
  },
  // The hosted Studio will live at https://sk-portfolio.sanity.studio
  // If that hostname is already taken, change this and re-run `npm run deploy`.
  studioHost: 'sk-portfolio',
});
