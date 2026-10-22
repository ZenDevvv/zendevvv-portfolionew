export const getImageUrl = (path) => {
  return new URL(`/src/assets/${path}`, import.meta.url).href;
};

// A project's own page.
export const projectPath = (project) => `/projects/${project.slug}/`;
