// vite.config.ts
import { lingui as linguiSolidPlugin } from "file:///C:/stape/zeelo/node_modules/.pnpm/@lingui-solid+vite-plugin@5_c3b5352d17066ecfed796ca575e8c739/node_modules/@lingui-solid/vite-plugin/dist/index.cjs";
import devtools from "file:///C:/stape/zeelo/node_modules/.pnpm/@solid-devtools+transform@0_404b69bcc014e95676df9bf7435e6cd5/node_modules/@solid-devtools/transform/dist/index.js";
import { readdirSync as readdirSync2 } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "file:///C:/stape/zeelo/node_modules/.pnpm/vite@5.4.19_@types+node@24._48cc1562d6045913b7959ff2f3eeb1b3/node_modules/vite/dist/node/index.js";
import babelMacrosPlugin from "file:///C:/stape/zeelo/node_modules/.pnpm/vite-plugin-babel-macros@1._e928a801fa318185648c5195bb7e9122/node_modules/vite-plugin-babel-macros/dist/plugin.js";
import Inspect from "file:///C:/stape/zeelo/node_modules/.pnpm/vite-plugin-inspect@0.8.9_r_706a326de31a8eaa34ad0855880e4ff6/node_modules/vite-plugin-inspect/dist/index.mjs";
import { VitePWA } from "file:///C:/stape/zeelo/node_modules/.pnpm/vite-plugin-pwa@0.20.5_vite_498b15facdbc5e1d005881f2e56de656/node_modules/vite-plugin-pwa/dist/index.js";
import solidPlugin from "file:///C:/stape/zeelo/node_modules/.pnpm/vite-plugin-solid@2.11.6_@t_a3a73efe94031814a0cb38700222e798/node_modules/vite-plugin-solid/dist/esm/index.mjs";
import solidSvg from "file:///C:/stape/zeelo/node_modules/.pnpm/vite-plugin-solid-svg@0.8.1_b9613412b5d2f4c19ed42f4d547b3a1a/node_modules/vite-plugin-solid-svg/dist/index.js";

// codegen.plugin.ts
import { readdirSync } from "node:fs";
var fileRegex = /\.tsx$/;
var codegenRegex = /\/\/ @codegen (.*)/g;
var DIRECTIVES = readdirSync("./components/ui/directives").filter((x) => x !== "index.ts").map((x) => x.substring(0, x.length - 3));
var directiveRegex = new RegExp("use:(" + DIRECTIVES.join("|") + ")");
function codegenPlugin() {
  return {
    name: "codegen",
    enforce: "pre",
    transform(src, id) {
      if (fileRegex.test(id)) {
        src = src.replace(codegenRegex, (substring, group1) => {
          const rawArgs = group1.split(" ");
          const type = rawArgs.shift();
          const args = rawArgs.reduce(
            (d, arg) => {
              const [key, value] = arg.split("=");
              return {
                ...d,
                [key]: value
              };
            },
            { type }
          );
          switch (args.type) {
            case "directives": {
              const source = args.props ?? "props";
              const permitted = args.include?.split(",") ?? DIRECTIVES;
              return DIRECTIVES.filter((d) => permitted.includes(d)).map((d) => `use:${d}={${source}["use:${d}"]}`).join("\n");
            }
            default:
              return substring;
          }
        });
        if (directiveRegex.test(src)) {
          if (!id.endsWith("client/components/ui/index.tsx"))
            src = `import { ${DIRECTIVES.join(
              ", "
            )} } from "@revolt/ui/directives";
` + src;
        }
        return src;
      }
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "C:\\stape\\zeelo\\packages\\client";
var base = process.env.BASE_PATH ?? "/";
var vite_config_default = defineConfig({
  base,
  plugins: [
    Inspect(),
    devtools(),
    codegenPlugin(),
    babelMacrosPlugin(),
    linguiSolidPlugin(),
    solidPlugin(),
    solidSvg({
      defaultAsComponent: false
    }),
    VitePWA({
      srcDir: "src",
      registerType: "autoUpdate",
      filename: "serviceWorker.ts",
      strategies: "injectManifest",
      injectManifest: {
        maximumFileSizeToCacheInBytes: 4e6
      },
      manifest: {
        name: "Stoat",
        short_name: "Stoat",
        description: "User-first open source chat platform.",
        categories: ["communication", "chat", "messaging"],
        start_url: base,
        orientation: "portrait",
        display_override: ["window-controls-overlay"],
        display: "standalone",
        background_color: "#101823",
        theme_color: "#101823",
        icons: [
          {
            src: `${base}assets/web/android-chrome-192x192.png`,
            type: "image/png",
            sizes: "192x192"
          },
          {
            src: `${base}assets/web/android-chrome-512x512.png`,
            type: "image/png",
            sizes: "512x512"
          },
          {
            src: `${base}assets/web/monochrome.svg`,
            type: "image/svg+xml",
            sizes: "48x48 72x72 96x96 128x128 256x256",
            purpose: "monochrome"
          },
          {
            src: `${base}assets/web/masking-512x512.png`,
            type: "image/png",
            sizes: "512x512",
            purpose: "maskable"
          }
        ]
        // TODO: take advantage of shortcuts
      }
    })
  ],
  build: {
    target: "esnext",
    rollupOptions: {
      external: ["hast"]
    },
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ["hast"]
  },
  resolve: {
    alias: {
      "styled-system": resolve(__vite_injected_original_dirname, "styled-system"),
      "@assets": resolve(__vite_injected_original_dirname, "src/assets"),
      ...readdirSync2(resolve(__vite_injected_original_dirname, "components")).reduce(
        (p, f) => ({
          ...p,
          [`@revolt/${f}`]: resolve(__vite_injected_original_dirname, "components", f)
        }),
        {}
      )
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29kZWdlbi5wbHVnaW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxzdGFwZVxcXFx6ZWVsb1xcXFxwYWNrYWdlc1xcXFxjbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHN0YXBlXFxcXHplZWxvXFxcXHBhY2thZ2VzXFxcXGNsaWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovc3RhcGUvemVlbG8vcGFja2FnZXMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgbGluZ3VpIGFzIGxpbmd1aVNvbGlkUGx1Z2luIH0gZnJvbSBcIkBsaW5ndWktc29saWQvdml0ZS1wbHVnaW5cIjtcclxuaW1wb3J0IGRldnRvb2xzIGZyb20gXCJAc29saWQtZGV2dG9vbHMvdHJhbnNmb3JtXCI7XHJcbmltcG9ydCB7IHJlYWRkaXJTeW5jIH0gZnJvbSBcIm5vZGU6ZnNcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGJhYmVsTWFjcm9zUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1iYWJlbC1tYWNyb3NcIjtcclxuaW1wb3J0IEluc3BlY3QgZnJvbSBcInZpdGUtcGx1Z2luLWluc3BlY3RcIjtcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuaW1wb3J0IHNvbGlkUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1zb2xpZFwiO1xyXG5pbXBvcnQgc29saWRTdmcgZnJvbSBcInZpdGUtcGx1Z2luLXNvbGlkLXN2Z1wiO1xyXG5cclxuaW1wb3J0IGNvZGVnZW5QbHVnaW4gZnJvbSBcIi4vY29kZWdlbi5wbHVnaW5cIjtcclxuXHJcbmNvbnN0IGJhc2UgPSBwcm9jZXNzLmVudi5CQVNFX1BBVEggPz8gXCIvXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2UsXHJcbiAgcGx1Z2luczogW1xyXG4gICAgSW5zcGVjdCgpLFxyXG4gICAgZGV2dG9vbHMoKSxcclxuICAgIGNvZGVnZW5QbHVnaW4oKSxcclxuICAgIGJhYmVsTWFjcm9zUGx1Z2luKCksXHJcbiAgICBsaW5ndWlTb2xpZFBsdWdpbigpLFxyXG4gICAgc29saWRQbHVnaW4oKSxcclxuICAgIHNvbGlkU3ZnKHtcclxuICAgICAgZGVmYXVsdEFzQ29tcG9uZW50OiBmYWxzZSxcclxuICAgIH0pLFxyXG4gICAgVml0ZVBXQSh7XHJcbiAgICAgIHNyY0RpcjogXCJzcmNcIixcclxuICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIixcclxuICAgICAgZmlsZW5hbWU6IFwic2VydmljZVdvcmtlci50c1wiLFxyXG4gICAgICBzdHJhdGVnaWVzOiBcImluamVjdE1hbmlmZXN0XCIsXHJcbiAgICAgIGluamVjdE1hbmlmZXN0OiB7XHJcbiAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDQwMDAwMDAsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgbmFtZTogXCJTdG9hdFwiLFxyXG4gICAgICAgIHNob3J0X25hbWU6IFwiU3RvYXRcIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJVc2VyLWZpcnN0IG9wZW4gc291cmNlIGNoYXQgcGxhdGZvcm0uXCIsXHJcbiAgICAgICAgY2F0ZWdvcmllczogW1wiY29tbXVuaWNhdGlvblwiLCBcImNoYXRcIiwgXCJtZXNzYWdpbmdcIl0sXHJcbiAgICAgICAgc3RhcnRfdXJsOiBiYXNlLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiBcInBvcnRyYWl0XCIsXHJcbiAgICAgICAgZGlzcGxheV9vdmVycmlkZTogW1wid2luZG93LWNvbnRyb2xzLW92ZXJsYXlcIl0sXHJcbiAgICAgICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIsXHJcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogXCIjMTAxODIzXCIsXHJcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiIzEwMTgyM1wiLFxyXG4gICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogYCR7YmFzZX1hc3NldHMvd2ViL2FuZHJvaWQtY2hyb21lLTE5MngxOTIucG5nYCxcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiBgJHtiYXNlfWFzc2V0cy93ZWIvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmdgLFxyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IGAke2Jhc2V9YXNzZXRzL3dlYi9tb25vY2hyb21lLnN2Z2AsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2Uvc3ZnK3htbFwiLFxyXG4gICAgICAgICAgICBzaXplczogXCI0OHg0OCA3Mng3MiA5Nng5NiAxMjh4MTI4IDI1NngyNTZcIixcclxuICAgICAgICAgICAgcHVycG9zZTogXCJtb25vY2hyb21lXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IGAke2Jhc2V9YXNzZXRzL3dlYi9tYXNraW5nLTUxMng1MTIucG5nYCxcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgICBwdXJwb3NlOiBcIm1hc2thYmxlXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgLy8gVE9ETzogdGFrZSBhZHZhbnRhZ2Ugb2Ygc2hvcnRjdXRzXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICB0YXJnZXQ6IFwiZXNuZXh0XCIsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbXCJoYXN0XCJdLFxyXG4gICAgfSxcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgZXhjbHVkZTogW1wiaGFzdFwiXSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwic3R5bGVkLXN5c3RlbVwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzdHlsZWQtc3lzdGVtXCIpLFxyXG4gICAgICBcIkBhc3NldHNcIjogcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2Fzc2V0c1wiKSxcclxuICAgICAgLi4ucmVhZGRpclN5bmMocmVzb2x2ZShfX2Rpcm5hbWUsIFwiY29tcG9uZW50c1wiKSkucmVkdWNlKFxyXG4gICAgICAgIChwLCBmKSA9PiAoe1xyXG4gICAgICAgICAgLi4ucCxcclxuICAgICAgICAgIFtgQHJldm9sdC8ke2Z9YF06IHJlc29sdmUoX19kaXJuYW1lLCBcImNvbXBvbmVudHNcIiwgZiksXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAge30sXHJcbiAgICAgICksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXHN0YXBlXFxcXHplZWxvXFxcXHBhY2thZ2VzXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcc3RhcGVcXFxcemVlbG9cXFxccGFja2FnZXNcXFxcY2xpZW50XFxcXGNvZGVnZW4ucGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9zdGFwZS96ZWVsby9wYWNrYWdlcy9jbGllbnQvY29kZWdlbi5wbHVnaW4udHNcIjtpbXBvcnQgeyByZWFkZGlyU3luYyB9IGZyb20gXCJub2RlOmZzXCI7XHJcblxyXG5jb25zdCBmaWxlUmVnZXggPSAvXFwudHN4JC87XHJcbmNvbnN0IGNvZGVnZW5SZWdleCA9IC9cXC9cXC8gQGNvZGVnZW4gKC4qKS9nO1xyXG5cclxuY29uc3QgRElSRUNUSVZFUyA9IHJlYWRkaXJTeW5jKFwiLi9jb21wb25lbnRzL3VpL2RpcmVjdGl2ZXNcIilcclxuICAuZmlsdGVyKCh4KSA9PiB4ICE9PSBcImluZGV4LnRzXCIpXHJcbiAgLm1hcCgoeCkgPT4geC5zdWJzdHJpbmcoMCwgeC5sZW5ndGggLSAzKSk7XHJcblxyXG5jb25zdCBkaXJlY3RpdmVSZWdleCA9IG5ldyBSZWdFeHAoXCJ1c2U6KFwiICsgRElSRUNUSVZFUy5qb2luKFwifFwiKSArIFwiKVwiKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvZGVnZW5QbHVnaW4oKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6IFwiY29kZWdlblwiLFxyXG4gICAgZW5mb3JjZTogXCJwcmVcIiBhcyBjb25zdCxcclxuICAgIHRyYW5zZm9ybShzcmM6IHN0cmluZywgaWQ6IHN0cmluZykge1xyXG4gICAgICBpZiAoZmlsZVJlZ2V4LnRlc3QoaWQpKSB7XHJcbiAgICAgICAgc3JjID0gc3JjLnJlcGxhY2UoY29kZWdlblJlZ2V4LCAoc3Vic3RyaW5nLCBncm91cDEpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHJhd0FyZ3M6IHN0cmluZ1tdID0gZ3JvdXAxLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICAgIGNvbnN0IHR5cGUgPSByYXdBcmdzLnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgY29uc3QgYXJncyA9IHJhd0FyZ3MucmVkdWNlKFxyXG4gICAgICAgICAgICAoZCwgYXJnKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgW2tleSwgdmFsdWVdID0gYXJnLnNwbGl0KFwiPVwiKTtcclxuICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLi4uZCxcclxuICAgICAgICAgICAgICAgIFtrZXldOiB2YWx1ZSxcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7IHR5cGUgfSxcclxuICAgICAgICAgICkgYXMge1xyXG4gICAgICAgICAgICB0eXBlOiBcImRpcmVjdGl2ZXNcIjtcclxuICAgICAgICAgICAgcHJvcHM/OiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGluY2x1ZGU/OiBzdHJpbmc7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHN3aXRjaCAoYXJncy50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkaXJlY3RpdmVzXCI6IHtcclxuICAgICAgICAgICAgICAvLyBHZW5lcmF0ZSBkaXJlY3RpdmVzIGZvcndhcmRpbmdcclxuICAgICAgICAgICAgICBjb25zdCBzb3VyY2UgPSBhcmdzLnByb3BzID8/IFwicHJvcHNcIjtcclxuICAgICAgICAgICAgICBjb25zdCBwZXJtaXR0ZWQ6IHN0cmluZ1tdID1cclxuICAgICAgICAgICAgICAgIGFyZ3MuaW5jbHVkZT8uc3BsaXQoXCIsXCIpID8/IERJUkVDVElWRVM7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIERJUkVDVElWRVMuZmlsdGVyKChkKSA9PiBwZXJtaXR0ZWQuaW5jbHVkZXMoZCkpXHJcbiAgICAgICAgICAgICAgICAubWFwKChkKSA9PiBgdXNlOiR7ZH09eyR7c291cmNlfVtcInVzZToke2R9XCJdfWApXHJcbiAgICAgICAgICAgICAgICAuam9pbihcIlxcblwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgIHJldHVybiBzdWJzdHJpbmc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChkaXJlY3RpdmVSZWdleC50ZXN0KHNyYykpIHtcclxuICAgICAgICAgIGlmICghaWQuZW5kc1dpdGgoXCJjbGllbnQvY29tcG9uZW50cy91aS9pbmRleC50c3hcIikpXHJcbiAgICAgICAgICAgIHNyYyA9XHJcbiAgICAgICAgICAgICAgYGltcG9ydCB7ICR7RElSRUNUSVZFUy5qb2luKFxyXG4gICAgICAgICAgICAgICAgXCIsIFwiLFxyXG4gICAgICAgICAgICAgICl9IH0gZnJvbSBcIkByZXZvbHQvdWkvZGlyZWN0aXZlc1wiO1xcbmAgKyBzcmM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3JjO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUixTQUFTLFVBQVUseUJBQXlCO0FBQ2xVLE9BQU8sY0FBYztBQUNyQixTQUFTLGVBQUFBLG9CQUFtQjtBQUM1QixTQUFTLGVBQWU7QUFDeEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyx1QkFBdUI7QUFDOUIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsZUFBZTtBQUN4QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGNBQWM7OztBQ1R1USxTQUFTLG1CQUFtQjtBQUV4VCxJQUFNLFlBQVk7QUFDbEIsSUFBTSxlQUFlO0FBRXJCLElBQU0sYUFBYSxZQUFZLDRCQUE0QixFQUN4RCxPQUFPLENBQUMsTUFBTSxNQUFNLFVBQVUsRUFDOUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUUxQyxJQUFNLGlCQUFpQixJQUFJLE9BQU8sVUFBVSxXQUFXLEtBQUssR0FBRyxJQUFJ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
