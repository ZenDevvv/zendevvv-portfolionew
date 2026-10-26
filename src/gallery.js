// The gallery screenshots that exist (src/assets/projects/<slug>/*.webp), by their path in
// projects.js. A shot whose image file has been deleted is left out everywhere: the project
// page's grid and viewer, and the cover on the slides and in the all-projects list. So
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

// How long each cover shot shows before cutting to the next, in seconds, when a project
// flags more than one.
export const COVER_SECONDS_PER_SHOT = 0.8;

// The shots flagged `cover: true`: the picture on the home page's slide and in the
// all-projects list. One is a still; several play in turn. None: the logo (imageSrc).
export function coverOf(project) {
  return galleryOf(project).filter((shot) => shot.cover);
}
