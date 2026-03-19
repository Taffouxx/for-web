import { styled } from "styled-system/jsx";

/**
 * Common styles for sidebar
 */
export const SidebarBase = styled("div", {
  base: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    overflow: "hidden",
    borderTopLeftRadius: "var(--borderRadius-lg)",
    borderBottomLeftRadius: "var(--borderRadius-lg)",
    width: "var(--layout-width-channel-sidebar)",

    fill: "var(--md-sys-color-on-surface)",
    color: "var(--md-sys-color-on-surface)",
    background: "var(--md-sys-color-surface-container-low)",

    "& a": {
      textDecoration: "none",
    },

    /**
     * On mobile: sidebar fills all space next to the ServerList (56px).
     * Since Content is hidden (display:none) on the sidebar panel,
     * this naturally takes the full remaining width.
     */
    "@media (max-width: 768px)": {
      width: "calc(100vw - 56px)",
      borderRadius: 0,
      flexShrink: 1,
    },
  },
});
