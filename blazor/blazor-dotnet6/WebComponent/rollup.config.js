import resolve from "@rollup/plugin-node-resolve";
import image from "@rollup/plugin-image";
import copy from 'rollup-plugin-copy';
import postcss from "rollup-plugin-postcss";
import autoprefixer from 'autoprefixer';
import importcss from 'postcss-import';
import importurl from 'postcss-url';
import path from "path";
import os from "os";
import fs from "fs";

export default {
  input: "./src/index.js",
  output: [
    {
      file: "./public/blazor-web-component.js",
      format: "es",
      globals: { react: "React" },
    },
  ],
  plugins: [
    resolve({
      modulePaths: [
        path.join(os.homedir(), ".nuget/packages/abbott.designsystem/1.0.32/staticwebassets/js"),
        path.join(os.homedir(), ".nuget/packages/abbott.designsystem/1.0.32/staticwebassets/css"),
        process.env.NODE_ENV == "production" ? path.resolve("../obj/Release/net6.0/scopedcss/bundle") : path.resolve("../obj/Debug/net6.0/scopedcss/bundle"),
      ],
    }),
    image(),
    postcss({
      extensions: [".css"],
      minimize: true,
      extract: true,
      plugins: [
        autoprefixer(),
        importcss(),
        importurl({
          url: (asset) => {
            // ignore inline
            if (!asset.pathname) return;
            
            const basename = path.basename(asset.url);
            const destbase = path.resolve("public/fonts");
            if (!fs.existsSync(destbase)) fs.mkdirSync(destbase, {recursive: true});
            
            // resolve
            const srcbase = [
              path.join(os.homedir(), ".nuget/packages/abbott.designsystem/1.0.32/staticwebassets"),
              path.resolve("../wwwroot/css/open-iconic/font/fonts"),
            ].find((p) => {
              return fs.existsSync(path.join(p, basename));
            });
            if (!srcbase) return;

            // copy
            const srcpath = path.join(srcbase, basename);
            const destpath = path.join(destbase, basename);
            if (!fs.existsSync(destpath)) fs.copyFileSync(srcpath, destpath);

            return path.join("fonts", basename);
          }
        }),
      ],
    }),
    copy({
      targets: [
        {src: ['./src/index.html'], dest: './public'},
        {src: ['../wwwroot/css/fonts'], dest: './public'},
        {src: ['./src/script.js'], dest: './public/js'},
      ],
    }),
  ],
  context: "window",
};
