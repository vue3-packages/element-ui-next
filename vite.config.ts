import { UserConfig } from "vite";
import { createVuedcoPlugin } from "./examples/src/plugins/doc/index";
import path from "path";

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

const config: UserConfig = {
  alias: {
    "/@/": pathResolve("./examples/src"),
    vue: "vue/dist/vue.esm-bundler.js",
  },
  outDir: pathResolve("./examples/dist"),
  plugins: [
    createVuedcoPlugin({
      docsPath(root: string) {
        return path.join(root, "./packages/");
      },
    }),
  ],
};

module.exports = config;
