import { BiRegularChevronLeft, BiRegularChevronRight } from "solid-icons/bi";
import { JSX, Match, Switch } from "solid-js";

import { useLingui } from "@lingui-solid/solid/macro";
import { css } from "styled-system/css";

import { useNavigate } from "@revolt/routing";
import { useState } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";

/**
 * Wrapper for header icons.
 * - Desktop: chevron to toggle sidebar
 * - Mobile: back arrow (←) to navigate back to channel/server list
 */
export function HeaderIcon(props: { children: JSX.Element }) {
  const state = useState();
  const navigate = useNavigate();
  const { t } = useLingui();

  /**
   * On desktop: toggle the primary sidebar
   * On mobile: navigate back (exits the channel view back to sidebar)
   */
  function handleClick() {
    if (window.innerWidth <= 768) {
      navigate(-1 as unknown as string);
    } else {
      state.layout.toggleSectionState(LAYOUT_SECTIONS.PRIMARY_SIDEBAR, true);
    }
  }

  return (
    <div
      class={container}
      onClick={handleClick}
      use:floating={{
        tooltip: {
          placement: "bottom",
          content: t`Toggle main sidebar`,
        },
      }}
    >
      {/* Desktop: chevron arrows */}
      <span class={desktopOnly}>
        <Switch fallback={<BiRegularChevronRight size={20} />}>
          <Match
            when={state.layout.getSectionState(
              LAYOUT_SECTIONS.PRIMARY_SIDEBAR,
              true,
            )}
          >
            <BiRegularChevronLeft size={20} />
          </Match>
        </Switch>
      </span>
      {/* Mobile: back arrow */}
      <span class={mobileOnly}>←</span>
      {props.children}
    </div>
  );
}

const container = css({
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  gap: "4px",

  "@media (max-width: 768px)": {
    minWidth: "44px",
    minHeight: "44px",
    justifyContent: "flex-start",
    paddingInline: "4px",
  },
});

const desktopOnly = css({
  display: "inline-flex",
  alignItems: "center",

  "@media (max-width: 768px)": {
    display: "none",
  },
});

const mobileOnly = css({
  display: "none",
  alignItems: "center",
  fontSize: "22px",
  lineHeight: 1,

  "@media (max-width: 768px)": {
    display: "inline-flex",
  },
});
