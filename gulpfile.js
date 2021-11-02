const autoPrefixer = require("gulp-autoprefixer");

let project_folder = "dist";
let source_folder = "#src";
let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: source_folder + "/*.html",
    css: source_folder + "/sass/style.sass",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/**/*.{jpg,png,sbg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*.ttf",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/sass/**/*.sass",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,sbg,gif,ico,webp}",
  },
  clean: "./" + project_folder + "/",
};

let { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  del = require("del"),
  sass = require("gulp-sass")(require("sass")),
  autoprefixer = require("gulp-autoprefixer");
function bs(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    port: 3000,
    notify: false,
  });
}
function html(params) {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}
function css(params) {
  return src(path.src.css, "./sass/**/*.scss")
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(
      autoprefixer({ overrideBrowserList: "last 5 versions", cascade: true })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}
function js(params) {
  return src(path.src.js).pipe(dest(path.build.js)).pipe(browsersync.stream());
}
function clean(params) {
  return del(path.clean);
}
function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
}
let build = gulp.series(clean, gulp.parallel(html, css, js));
let watch = gulp.parallel(build, watchFiles, bs);

exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
