import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "rollup-plugin-postcss";
import sass from "node-sass";
import path from "path";

const resolve = function (...args) {
  return path.resolve(__dirname, ...args);
};

const processSass = function (context, payload) {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file: context,
      },
      function (err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      },
    );
  });
};

module.exports = {
  input: resolve("../packages/styles/index.scss"),
  output: {
    file: resolve("../dist/style/element-ui-next.min.css"),
  },
  plugins: [
    postcss({
      extensions: [".css", ".sass", ".scss"],
      process: processSass,
      plugins: [
        autoprefixer(),
        cssnano({
          preset: "default",
        }),
      ],
      extract: true,
    }),
  ],
};
