import { UserConfig } from "vite";
import path from "path";

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

const config: UserConfig = {
  alias: {
    "/@/": pathResolve("./examples/src"),
  },
  outDir: pathResolve("./examples/dist"),
};

module.exports = config;
