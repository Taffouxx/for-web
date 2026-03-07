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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29kZWdlbi5wbHVnaW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxzdGFwZVxcXFx6ZWVsb1xcXFxwYWNrYWdlc1xcXFxjbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHN0YXBlXFxcXHplZWxvXFxcXHBhY2thZ2VzXFxcXGNsaWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovc3RhcGUvemVlbG8vcGFja2FnZXMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgbGluZ3VpIGFzIGxpbmd1aVNvbGlkUGx1Z2luIH0gZnJvbSBcIkBsaW5ndWktc29saWQvdml0ZS1wbHVnaW5cIjtcclxuaW1wb3J0IGRldnRvb2xzIGZyb20gXCJAc29saWQtZGV2dG9vbHMvdHJhbnNmb3JtXCI7XHJcbmltcG9ydCB7IHJlYWRkaXJTeW5jIH0gZnJvbSBcIm5vZGU6ZnNcIjtcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IGJhYmVsTWFjcm9zUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1iYWJlbC1tYWNyb3NcIjtcclxuaW1wb3J0IEluc3BlY3QgZnJvbSBcInZpdGUtcGx1Z2luLWluc3BlY3RcIjtcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuaW1wb3J0IHNvbGlkUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1zb2xpZFwiO1xyXG5pbXBvcnQgc29saWRTdmcgZnJvbSBcInZpdGUtcGx1Z2luLXNvbGlkLXN2Z1wiO1xyXG5cclxuaW1wb3J0IGNvZGVnZW5QbHVnaW4gZnJvbSBcIi4vY29kZWdlbi5wbHVnaW5cIjtcclxuXHJcbmNvbnN0IGJhc2UgPSBwcm9jZXNzLmVudi5CQVNFX1BBVEggPz8gXCIvXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2UsXHJcbiAgcGx1Z2luczogW1xyXG4gICAgSW5zcGVjdCgpLFxyXG4gICAgZGV2dG9vbHMoKSxcclxuICAgIGNvZGVnZW5QbHVnaW4oKSxcclxuICAgIGJhYmVsTWFjcm9zUGx1Z2luKCksXHJcbiAgICBsaW5ndWlTb2xpZFBsdWdpbigpLFxyXG4gICAgc29saWRQbHVnaW4oKSxcclxuICAgIHNvbGlkU3ZnKHtcclxuICAgICAgZGVmYXVsdEFzQ29tcG9uZW50OiBmYWxzZSxcclxuICAgIH0pLFxyXG4gICAgVml0ZVBXQSh7XHJcbiAgICAgIHNyY0RpcjogXCJzcmNcIixcclxuICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIixcclxuICAgICAgZmlsZW5hbWU6IFwic2VydmljZVdvcmtlci50c1wiLFxyXG4gICAgICBzdHJhdGVnaWVzOiBcImluamVjdE1hbmlmZXN0XCIsXHJcbiAgICAgIGluamVjdE1hbmlmZXN0OiB7XHJcbiAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDQwMDAwMDAsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgbmFtZTogXCJTdG9hdFwiLFxyXG4gICAgICAgIHNob3J0X25hbWU6IFwiU3RvYXRcIixcclxuICAgICAgICBkZXNjcmlwdGlvbjogXCJVc2VyLWZpcnN0IG9wZW4gc291cmNlIGNoYXQgcGxhdGZvcm0uXCIsXHJcbiAgICAgICAgY2F0ZWdvcmllczogW1wiY29tbXVuaWNhdGlvblwiLCBcImNoYXRcIiwgXCJtZXNzYWdpbmdcIl0sXHJcbiAgICAgICAgc3RhcnRfdXJsOiBiYXNlLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiBcInBvcnRyYWl0XCIsXHJcbiAgICAgICAgZGlzcGxheV9vdmVycmlkZTogW1wid2luZG93LWNvbnRyb2xzLW92ZXJsYXlcIl0sXHJcbiAgICAgICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIsXHJcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogXCIjMTAxODIzXCIsXHJcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiIzEwMTgyM1wiLFxyXG4gICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogYCR7YmFzZX1hc3NldHMvd2ViL2FuZHJvaWQtY2hyb21lLTE5MngxOTIucG5nYCxcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiBgJHtiYXNlfWFzc2V0cy93ZWIvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmdgLFxyXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IGAke2Jhc2V9YXNzZXRzL3dlYi9tb25vY2hyb21lLnN2Z2AsXHJcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2Uvc3ZnK3htbFwiLFxyXG4gICAgICAgICAgICBzaXplczogXCI0OHg0OCA3Mng3MiA5Nng5NiAxMjh4MTI4IDI1NngyNTZcIixcclxuICAgICAgICAgICAgcHVycG9zZTogXCJtb25vY2hyb21lXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6IGAke2Jhc2V9YXNzZXRzL3dlYi9tYXNraW5nLTUxMng1MTIucG5nYCxcclxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgICBwdXJwb3NlOiBcIm1hc2thYmxlXCIsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgLy8gVE9ETzogdGFrZSBhZHZhbnRhZ2Ugb2Ygc2hvcnRjdXRzXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICB0YXJnZXQ6IFwiZXNuZXh0XCIsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbXCJoYXN0XCJdLFxyXG4gICAgfSxcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgZXhjbHVkZTogW1wiaGFzdFwiXSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwic3R5bGVkLXN5c3RlbVwiOiByZXNvbHZlKF9fZGlybmFtZSwgXCJzdHlsZWQtc3lzdGVtXCIpLFxyXG4gICAgICAuLi5yZWFkZGlyU3luYyhyZXNvbHZlKF9fZGlybmFtZSwgXCJjb21wb25lbnRzXCIpKS5yZWR1Y2UoXHJcbiAgICAgICAgKHAsIGYpID0+ICh7XHJcbiAgICAgICAgICAuLi5wLFxyXG4gICAgICAgICAgW2BAcmV2b2x0LyR7Zn1gXTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiY29tcG9uZW50c1wiLCBmKSxcclxuICAgICAgICB9KSxcclxuICAgICAgICB7fSxcclxuICAgICAgKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcc3RhcGVcXFxcemVlbG9cXFxccGFja2FnZXNcXFxcY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxzdGFwZVxcXFx6ZWVsb1xcXFxwYWNrYWdlc1xcXFxjbGllbnRcXFxcY29kZWdlbi5wbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3N0YXBlL3plZWxvL3BhY2thZ2VzL2NsaWVudC9jb2RlZ2VuLnBsdWdpbi50c1wiO2ltcG9ydCB7IHJlYWRkaXJTeW5jIH0gZnJvbSBcIm5vZGU6ZnNcIjtcclxuXHJcbmNvbnN0IGZpbGVSZWdleCA9IC9cXC50c3gkLztcclxuY29uc3QgY29kZWdlblJlZ2V4ID0gL1xcL1xcLyBAY29kZWdlbiAoLiopL2c7XHJcblxyXG5jb25zdCBESVJFQ1RJVkVTID0gcmVhZGRpclN5bmMoXCIuL2NvbXBvbmVudHMvdWkvZGlyZWN0aXZlc1wiKVxyXG4gIC5maWx0ZXIoKHgpID0+IHggIT09IFwiaW5kZXgudHNcIilcclxuICAubWFwKCh4KSA9PiB4LnN1YnN0cmluZygwLCB4Lmxlbmd0aCAtIDMpKTtcclxuXHJcbmNvbnN0IGRpcmVjdGl2ZVJlZ2V4ID0gbmV3IFJlZ0V4cChcInVzZTooXCIgKyBESVJFQ1RJVkVTLmpvaW4oXCJ8XCIpICsgXCIpXCIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29kZWdlblBsdWdpbigpIHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogXCJjb2RlZ2VuXCIsXHJcbiAgICBlbmZvcmNlOiBcInByZVwiIGFzIGNvbnN0LFxyXG4gICAgdHJhbnNmb3JtKHNyYzogc3RyaW5nLCBpZDogc3RyaW5nKSB7XHJcbiAgICAgIGlmIChmaWxlUmVnZXgudGVzdChpZCkpIHtcclxuICAgICAgICBzcmMgPSBzcmMucmVwbGFjZShjb2RlZ2VuUmVnZXgsIChzdWJzdHJpbmcsIGdyb3VwMSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcmF3QXJnczogc3RyaW5nW10gPSBncm91cDEuc3BsaXQoXCIgXCIpO1xyXG4gICAgICAgICAgY29uc3QgdHlwZSA9IHJhd0FyZ3Muc2hpZnQoKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBhcmdzID0gcmF3QXJncy5yZWR1Y2UoXHJcbiAgICAgICAgICAgIChkLCBhcmcpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCBba2V5LCB2YWx1ZV0gPSBhcmcuc3BsaXQoXCI9XCIpO1xyXG4gICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5kLFxyXG4gICAgICAgICAgICAgICAgW2tleV06IHZhbHVlLFxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHsgdHlwZSB9LFxyXG4gICAgICAgICAgKSBhcyB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiZGlyZWN0aXZlc1wiO1xyXG4gICAgICAgICAgICBwcm9wcz86IHN0cmluZztcclxuICAgICAgICAgICAgaW5jbHVkZT86IHN0cmluZztcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgc3dpdGNoIChhcmdzLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcImRpcmVjdGl2ZXNcIjoge1xyXG4gICAgICAgICAgICAgIC8vIEdlbmVyYXRlIGRpcmVjdGl2ZXMgZm9yd2FyZGluZ1xyXG4gICAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IGFyZ3MucHJvcHMgPz8gXCJwcm9wc1wiO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHBlcm1pdHRlZDogc3RyaW5nW10gPVxyXG4gICAgICAgICAgICAgICAgYXJncy5pbmNsdWRlPy5zcGxpdChcIixcIikgPz8gRElSRUNUSVZFUztcclxuICAgICAgICAgICAgICByZXR1cm4gRElSRUNUSVZFUy5maWx0ZXIoKGQpID0+IHBlcm1pdHRlZC5pbmNsdWRlcyhkKSlcclxuICAgICAgICAgICAgICAgIC5tYXAoKGQpID0+IGB1c2U6JHtkfT17JHtzb3VyY2V9W1widXNlOiR7ZH1cIl19YClcclxuICAgICAgICAgICAgICAgIC5qb2luKFwiXFxuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHN1YnN0cmluZztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGRpcmVjdGl2ZVJlZ2V4LnRlc3Qoc3JjKSkge1xyXG4gICAgICAgICAgaWYgKCFpZC5lbmRzV2l0aChcImNsaWVudC9jb21wb25lbnRzL3VpL2luZGV4LnRzeFwiKSlcclxuICAgICAgICAgICAgc3JjID1cclxuICAgICAgICAgICAgICBgaW1wb3J0IHsgJHtESVJFQ1RJVkVTLmpvaW4oXHJcbiAgICAgICAgICAgICAgICBcIiwgXCIsXHJcbiAgICAgICAgICAgICAgKX0gfSBmcm9tIFwiQHJldm9sdC91aS9kaXJlY3RpdmVzXCI7XFxuYCArIHNyYztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzcmM7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNSLFNBQVMsVUFBVSx5QkFBeUI7QUFDbFUsT0FBTyxjQUFjO0FBQ3JCLFNBQVMsZUFBQUEsb0JBQW1CO0FBQzVCLFNBQVMsZUFBZTtBQUN4QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLHVCQUF1QjtBQUM5QixPQUFPLGFBQWE7QUFDcEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sY0FBYzs7O0FDVHVRLFNBQVMsbUJBQW1CO0FBRXhULElBQU0sWUFBWTtBQUNsQixJQUFNLGVBQWU7QUFFckIsSUFBTSxhQUFhLFlBQVksNEJBQTRCLEVBQ3hELE9BQU8sQ0FBQyxNQUFNLE1BQU0sVUFBVSxFQUM5QixJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRTFDLElBQU0saUJBQWlCLElBQUksT0FBTyxVQUFVLFdBQVcsS0FBSyxHQUFHLElBQUksR0FBRztBQUV2RCxTQUFSLGdCQUFpQztBQUN0QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFD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RUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsTUFBTTtBQUFBLElBQ25CO0FBQUEsSUFDQSxXQUFXO0FBQUEsRUFDYjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLE1BQU07QUFBQSxFQUNsQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsaUJBQWlCLFFBQVEsa0NBQVcsZUFBZTtBQUFBLE1BQ25ELEdBQUdDLGFBQVksUUFBUSxrQ0FBVyxZQUFZLENBQUMsRUFBRTtBQUFBLFFBQy9DLENBQUMsR0FBRyxPQUFPO0FBQUEsVUFDVCxHQUFHO0FBQUEsVUFDSCxDQUFDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsUUFBUSxrQ0FBVyxjQUFjLENBQUM7QUFBQSxRQUN0RDtBQUFBLFFBQ0EsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInJlYWRkaXJTeW5jIiwgInJlYWRkaXJTeW5jIl0KfQo=
