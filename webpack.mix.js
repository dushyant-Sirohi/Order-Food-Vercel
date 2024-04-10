// webpack.mix.js

let mix = require("laravel-mix");

mix
  .js("resources/js/app.js", "public/js/app.js")
  .js("resources/js/admin.js", "public/js/admin.js")
  .sass("resources/scss/app.scss", "public/css/app.css");
