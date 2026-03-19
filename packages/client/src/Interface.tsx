import { JSX, Match, Show, Switch, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";

import { Server } from "stoat.js";
import { styled } from "styled-system/jsx";

import { ChannelContextMenu, ServerContextMenu } from "@revolt/app";
import { MessageCache } from "@revolt/app/interface/channels/text/MessageCache";
import { Titlebar } from "@revolt/app/interface/desktop/Titlebar";
import { useClient, useClientLifecycle } from "@revolt/client";
import { State } from "@revolt/client/Controller";
import { NotificationsWorker } from "@revolt/client/NotificationsWorker";
import { useModals } from "@revolt/modal";
import { Navigate, useBeforeLeave, useLocation } from "@revolt/routing";
import { useState } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";
import { CircularProgress } from "@revolt/ui";

import { Sidebar } from "./interface/Sidebar";

/**
 * Application layout
 */
const Interface = (props: { children: JSX.Element }) => {
  const state = useState();
  const client = useClient();
  const { openModal } = useModals();
  const { isLoggedIn, lifecycle } = useClientLifecycle();
  const { pathname } = useLocation();

  /** Reactive mobile viewport detection */
  const [isMobile, setIsMobile] = createSignal(
    typeof window !== "undefined" && window.innerWidth <= 768,
  );

  onMount(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    onCleanup(() => mq.removeEventListener("change", handler));
  });

  useBeforeLeave((e) => {
    if (!e.defaultPrevented) {
      if (e.to === "/settings") {
        e.preventDefault();
        openModal({ type: "settings", config: "user" });
      } else if (typeof e.to === "string") {
        state.layout.setLastActivePath(e.to);
      }
    }
  });

  createEffect(() => {
    if (!isLoggedIn()) {
      state.layout.setNextPath(pathname);
      console.debug("WAITING... currently", lifecycle.state());
    }
  });

  function isDisconnected() {
    return [
      State.Connecting,
      State.Disconnected,
      State.Reconnecting,
      State.Offline,
    ].includes(lifecycle.state());
  }

  /** Detect if we're currently viewing a channel */
  const hasChannel = () => pathname.includes("/channel/");

  /** Mobile layout: Auto-scroll when navigating */
  createEffect(() => {
    if (!isMobile()) return;
    // When channel state changes, scroll to the correct pane smoothly
    if (hasChannel()) {
      const contentPane = document.getElementById("mobile-content-pane");
      if (contentPane) {
        contentPane.scrollIntoView({ behavior: "smooth", inline: "start" });
      }
    } else {
      const sidebarPane = document.getElementById("mobile-sidebar-pane");
      if (sidebarPane) {
        sidebarPane.scrollIntoView({ behavior: "smooth", inline: "start" });
      }
    }
  });

  return (
    <MessageCache client={client()}>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          height: "100%",
          "min-height": 0,
        }}
      >
        <Titlebar />
        <Switch fallback={<CircularProgress />}>
          <Match when={!isLoggedIn()}>
            <Navigate href="/login" />
          </Match>
          <Match when={lifecycle.loadedOnce()}>
            <LayoutWrapper>
              <SwipeContainer
                id="mobile-swipe-layout"
                disconnected={isDisconnected()}
                style={{ "flex-grow": 1, "min-height": 0 }}
                onDragOver={(e) => {
                  if (e.dataTransfer) e.dataTransfer.dropEffect = "none";
                }}
                onDrop={(e) => e.preventDefault()}
              >
                {/* 1. Left Pane: Server List & Channels Sidebar */}
                <Pane id="mobile-sidebar-pane" style={{ "flex-grow": 0, "flex-shrink": 0 }}>
                  <Sidebar
                    menuGenerator={(target) => ({
                      contextMenu: () => (
                        <>
                          {target instanceof Server ? (
                            <ServerContextMenu server={target} />
                          ) : (
                            <ChannelContextMenu channel={target} />
                          )}
                        </>
                      ),
                    })}
                  />
                </Pane>

                {/* 2. Center Pane: Message Area */}
                <Pane id="mobile-content-pane" style={{ "flex-grow": 1, "flex-shrink": 0 }}>
                  <Content
                    sidebar={state.layout.getSectionState(
                      LAYOUT_SECTIONS.PRIMARY_SIDEBAR,
                      true,
                    )}
                  >
                    {props.children}
                  </Content>
                </Pane>

                {/* 3. Right Pane: Member Sidebar Portal Target (Mobile Only) */}
                <Show when={isMobile()}>
                  <Pane id="mobile-members-pane" style={{ "flex-grow": 0, "flex-shrink": 0 }}>
                    <div id="mobile-members-portal" style={{ width: "100%", height: "100%" }} />
                  </Pane>
                </Show>

              </SwipeContainer>
            </LayoutWrapper>
          </Match>
        </Switch>

        <NotificationsWorker />
      </div>
    </MessageCache>
  );
};

const LayoutWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: 0,
  },
});

/**
 * Mobile: Native Horizontal Snap-Scrolling Container
 * Desktop: Standard Flex Row Container
 */
const SwipeContainer = styled("div", {
  base: {
    display: "flex",
    flexGrow: 1,
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",

    "@media (max-width: 768px)": {
      width: "100%",
      overflowX: "auto",
      overflowY: "hidden", // strictly block parent vertical scroll
      scrollSnapType: "x mandatory",
      scrollBehavior: "smooth",
      // Hide scrollbars
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  },
  variants: {
    disconnected: {
      true: {
        color: "var(--md-sys-color-on-primary-container)",
        background: "var(--md-sys-color-primary-container)",
      },
      false: {
        color: "var(--md-sys-color-outline)",
        background: "var(--md-sys-color-surface-container-high)",
      },
    },
  },
});

/**
 * Swipeable Pane
 * Mobile: Takes 100vw width, snaps left/right.
 * Desktop: Acts like a normal flex container.
 */
const Pane = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minWidth: 0,
    minHeight: 0,

    "@media (max-width: 768px)": {
      width: "100%",
      scrollSnapAlign: "start",
      scrollSnapStop: "always",
    },
  },
});

/**
 * Main content container
 */
const Content = styled("div", {
  base: {
    background: "var(--md-sys-color-surface-container-low)",
    display: "flex",
    width: "100%",
    height: "100%",
    flexGrow: 1,
    minWidth: 0,
    minHeight: 0,

    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },
  variants: {
    sidebar: {
      false: {
        borderTopLeftRadius: "var(--borderRadius-lg)",
        borderBottomLeftRadius: "var(--borderRadius-lg)",
        overflow: "hidden",

        "@media (max-width: 768px)": {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      },
    },
  },
});

export default Interface;
