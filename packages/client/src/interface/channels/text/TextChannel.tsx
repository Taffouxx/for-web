import {
  JSX,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import { Portal } from "solid-js/web";

import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { decodeTime, ulid } from "ulid";

import { DraftMessages, Messages } from "@revolt/app";
import { useClient } from "@revolt/client";
import { Keybind, KeybindAction, createKeybind } from "@revolt/keybinds";
import { useNavigate, useSmartParams } from "@revolt/routing";
import { useState } from "@revolt/state";
import { LAYOUT_SECTIONS } from "@revolt/state/stores/Layout";
import {
  BelowFloatingHeader,
  Header,
  NewMessages,
  Text,
  TypingIndicator,
  main,
} from "@revolt/ui";
import { VoiceChannelCallCardMount } from "@revolt/ui/components/features/voice/callCard/VoiceCallCard";

import { ChannelHeader } from "../ChannelHeader";
import { ChannelPageProps } from "../ChannelPage";

import { MessageComposition } from "./Composition";
import { MemberSidebar } from "./MemberSidebar";
import { TextSearchSidebar } from "./TextSearchSidebar";

/**
 * State of the channel sidebar
 */
export type SidebarState =
  | {
      state: "search";
      query: string;
    }
  | {
      state: "pins";
    }
  | {
      state: "default";
    };

/**
 * Channel component
 */
export function TextChannel(props: ChannelPageProps) {
  const state = useState();
  const client = useClient();

  // Last unread message id
  const [lastId, setLastId] = createSignal<string>();

  // Read highlighted message id from parameters
  const params = useSmartParams();
  const navigate = useNavigate();

  /**
   * Message id to be highlighted
   * @returns Message Id
   */
  const highlightMessageId = () => params().messageId;

  const canConnect = () =>
    props.channel.isVoice && props.channel.havePermission("Connect");

  // Get a reference to the message box's load latest function
  let jumpToBottomRef: ((nearby?: string) => void) | undefined;

  // Get a reference to the message list's "end status"
  let atEndRef: (() => boolean) | undefined;

  // Store last unread message id
  createEffect(
    on(
      () => props.channel.id,
      (id) =>
        setLastId(
          props.channel.unread
            ? (client().channelUnreads.get(id)?.lastMessageId as string)
            : undefined,
        ),
    ),
  );

  // Mark channel as read whenever it is marked as unread
  createEffect(
    on(
      // must be at the end of the conversation
      () => props.channel.unread && (atEndRef ? atEndRef() : true),
      (unread) => {
        if (unread) {
          if (document.hasFocus()) {
            // acknowledge the message
            props.channel.ack();
          } else {
            // otherwise mark this location as the last read location
            if (!lastId()) {
              // (taking away one second from the seed)
              setLastId(ulid(decodeTime(props.channel.lastMessageId!) - 1));
            }
          }
        }
      },
    ),
  );

  // Mark as read on re-focus
  function onFocus() {
    if (props.channel.unread && (atEndRef ? atEndRef() : true)) {
      props.channel.ack();
    }
  }

  document.addEventListener("focus", onFocus);
  onCleanup(() => document.removeEventListener("focus", onFocus));

  // Register ack/jump latest
  createKeybind(KeybindAction.CHAT_JUMP_END, () => {
    // Mark channel as read if not already
    if (props.channel.unread) {
      props.channel.ack();
    }

    // Clear the last unread id
    if (lastId()) {
      setLastId(undefined);
    }

    // Scroll to the bottom
    jumpToBottomRef?.();
  });

  // Sidebar scroll target
  let sidebarScrollTargetElement!: HTMLDivElement;

  // Sidebar state
  const [sidebarState, setSidebarState] = createSignal<SidebarState>({
    state: "default",
  });

  // todo: in the future maybe persist per ID?
  createEffect(
    on(
      () => props.channel.id,
      () => setSidebarState({ state: "default" }),
    ),
  );

  return (
    <>
      <Header placement="primary">
        <ChannelHeader
          channel={props.channel}
          sidebarState={sidebarState}
          setSidebarState={setSidebarState}
        />
      </Header>
      <Content>
        <main class={main()}>
          <Show
            when={canConnect()}
            fallback={
              <BelowFloatingHeader>
                <div>
                  <NewMessages
                    lastId={lastId}
                    jumpBack={() => navigate(lastId()!)}
                    dismiss={() => setLastId()}
                  />
                </div>
              </BelowFloatingHeader>
            }
          >
            <VoiceChannelCallCardMount channel={props.channel} />
          </Show>

          <Messages
            channel={props.channel}
            lastReadId={lastId}
            pendingMessages={(pendingProps) => (
              <DraftMessages
                channel={props.channel}
                tail={pendingProps.tail}
                sentIds={pendingProps.ids}
              />
            )}
            typingIndicator={
              <TypingIndicator
                users={props.channel.typing}
                ownId={client().user!.id}
              />
            }
            highlightedMessageId={highlightMessageId}
            clearHighlightedMessage={() => navigate(".")}
            atEndRef={(ref) => (atEndRef = ref)}
            jumpToBottomRef={(ref) => (jumpToBottomRef = ref)}
          />

          <MessageComposition
            channel={props.channel}
            onMessageSend={() => jumpToBottomRef?.()}
          />
        </main>
        <Show
          when={
            (state.layout.getSectionState(
              LAYOUT_SECTIONS.MEMBER_SIDEBAR,
              true,
            ) &&
              props.channel.type !== "SavedMessages") ||
            sidebarState().state !== "default"
          }
        >
          <MemberSidebarMobileWrapper>
            <div
              ref={sidebarScrollTargetElement}
              use:scrollable={{
                direction: "y",
                showOnHover: true,
                class: sidebar(),
              }}
              style={{
                width: sidebarState().state !== "default" ? "360px" : "",
              }}
            >
              <Switch
                fallback={
                  <MemberSidebar
                    channel={props.channel}
                    scrollTargetElement={sidebarScrollTargetElement}
                  />
                }
              >
                <Match when={sidebarState().state === "search"}>
                  <WideSidebarContainer>
                    <SidebarTitle>
                      <Text class="label" size="large">
                        Search Results
                      </Text>
                    </SidebarTitle>
                    <TextSearchSidebar
                      channel={props.channel}
                      query={{
                        query: (sidebarState() as { query: string }).query,
                      }}
                    />
                  </WideSidebarContainer>
                </Match>
                <Match when={sidebarState().state === "pins"}>
                  <WideSidebarContainer>
                    <SidebarTitle>
                      <Text class="label" size="large">
                        Pinned Messages
                      </Text>
                    </SidebarTitle>
                    <TextSearchSidebar
                      channel={props.channel}
                      query={{ pinned: true, sort: "Latest" }}
                    />
                  </WideSidebarContainer>
                </Match>
              </Switch>
  
              <Show when={sidebarState().state !== "default"}>
                <Keybind
                  keybind={KeybindAction.CLOSE_SIDEBAR}
                  onPressed={() => setSidebarState({ state: "default" })}
                />
              </Show>
            </div>
          </MemberSidebarMobileWrapper>
        </Show>
      </Content>
    </>
  );
}

/**
 * Mobile wrapper for the member sidebar (uses a portal if on mobile).
 */
function MemberSidebarMobileWrapper(props: { children: JSX.Element }) {
  const [isMobile, setIsMobile] = createSignal(
    typeof window !== "undefined" && window.innerWidth <= 768,
  );

  const [portalTarget, setPortalTarget] = createSignal<HTMLElement | null>(null);

  onMount(() => {
    if (typeof window === "undefined") return;
    setPortalTarget(document.getElementById("mobile-members-portal"));

    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    onCleanup(() => mq.removeEventListener("change", handler));
  });

  return (
    <Show
      when={isMobile() && portalTarget()}
      fallback={<>{props.children}</>}
    >
      <Portal mount={portalTarget()!}>{props.children}</Portal>
    </Show>
  );
}

/**
 * Main content row layout
 */
const Content = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    minWidth: 0,
    minHeight: 0,

    "@media (max-width: 768px)": {
      position: "relative",
    },
  },
});

/**
 * Base styles
 */
const sidebar = cva({
  base: {
    flexShrink: 0,
    width: "var(--layout-width-channel-sidebar)",
    borderRadius: "var(--borderRadius-lg)",

    "@media (max-width: 768px)": {
      position: "relative",
      height: "100%",
      width: "100vw",
      borderRadius: 0,
      background: "var(--md-sys-color-surface-container-low)",
    },
  },
});

/**
 * Container styles
 */
const WideSidebarContainer = styled("div", {
  base: {
    paddingRight: "var(--gap-md)",
    width: "360px",

    "@media (max-width: 768px)": {
      width: "100%",
      paddingRight: 0,
      paddingInline: "var(--gap-md)",
    },
  },
});

/**
 * Sidebar title
 */
const SidebarTitle = styled("div", {
  base: {
    padding: "var(--gap-md)",
    color: "var(--md-sys-color-on-surface)",
  },
});
