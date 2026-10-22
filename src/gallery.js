// The gallery screenshots that exist (src/assets/projects/<slug>/*.webp), by their path in
// projects.js. A shot whose image file has been deleted is left out everywhere: the project
// page's grid and viewer, and the preview on the slides and in the all-projects list. So
// deleting the file is all it takes to drop a shot.
const files = import.meta.glob("/src/assets/projects/*/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

// A project's gallery shots whose images exist, each with its `url`.
export function galleryOf(project) {
  return (project.gallery ?? [])
    .map((shot) => ({ ...shot, url: files[`/src/assets/${shot.src}`] }))
    .filter((shot) => shot.url);
}
