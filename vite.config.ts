import { UserConfig } from "vite";
import { createVuedcoPlugin } from "./examples/src/plugins/doc/index";
import path from "path";

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

const config: UserConfig = {
  alias: {
    "/@/": pathResolve("./examples/src"),
  },
  outDir: pathResolve("./examples/dist"),
  plugins: [
    createVuedcoPlugin({
      docsPath(root: string) {
        return path.join(root, "./examples/src/views");
      },
    }),
  ],
};

module.exports = config;
