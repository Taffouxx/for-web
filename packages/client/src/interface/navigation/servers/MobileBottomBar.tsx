import { Show } from "solid-js";

import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { useUser } from "@revolt/client";
import { useModals } from "@revolt/modal";
import { Avatar, Row, UserStatus } from "@revolt/ui";

import MdSettings from "@material-design-icons/svg/filled/settings.svg?component-solid";

/**
 * Mobile-only bottom bar: shows user avatar, display name, status,
 * and a settings shortcut — like Discord's bottom bar on mobile.
 */
export function MobileBottomBar() {
  const user = useUser();
  const { openModal } = useModals();

  return (
    <Bar>
      <Show when={user()}>
        <Row align gap="md" style={{ "flex-grow": 1, "min-width": 0 }}>
          <Avatar
            size={32}
            src={user()!.animatedAvatarURL}
            holepunch="bottom-right"
            overlay={<UserStatus.Graphic status={user()!.presence} />}
          />
          <NameStack>
            <UserName>{user()!.displayName}</UserName>
            <UserTag>
              {user()!.username}
              {user()!.discriminator !== "0" ? `#${user()!.discriminator}` : ""}
            </UserTag>
          </NameStack>
        </Row>
        <BarAction
          onClick={() => openModal({ type: "settings", config: "user" })}
          aria-label="Settings"
        >
          <MdSettings class={iconClass} />
        </BarAction>
      </Show>
    </Bar>
  );
}

/**
 * The bar itself — fixed at the bottom, mobile-only
 */
const Bar = styled("div", {
  base: {
    /* Hidden on desktop */
    display: "none",

    "@media (max-width: 768px)": {
      display: "flex",
      flexShrink: 0,
      alignItems: "center",
      gap: "8px",
      height: "56px",
      paddingInline: "12px",
      paddingBottom: "env(safe-area-inset-bottom)",
      background: "var(--md-sys-color-surface-container-highest)",
      borderTop: "1px solid var(--md-sys-color-outline-variant)",
      color: "var(--md-sys-color-on-surface)",
      fill: "var(--md-sys-color-on-surface)",
    },
  },
});

/**
 * Stack for name + tag
 */
const NameStack = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    overflow: "hidden",
  },
});

const UserName = styled("span", {
  base: {
    fontWeight: 600,
    fontSize: "13px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

const UserTag = styled("span", {
  base: {
    fontSize: "11px",
    opacity: 0.6,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

/**
 * Action button in the bar
 */
const BarAction = styled("button", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "var(--borderRadius-sm)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
    fill: "var(--md-sys-color-on-surface)",
    opacity: 0.75,

    "&:hover": {
      opacity: 1,
      background: "var(--md-sys-color-surface-container-high)",
    },
  },
});

const iconClass = css({
  width: "20px",
  height: "20px",
});
