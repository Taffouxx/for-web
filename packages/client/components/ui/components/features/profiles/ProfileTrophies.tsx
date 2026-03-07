import { Show, For } from "solid-js";
import { useLingui } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";
import { useModals } from "@revolt/modal";
import { Text } from "../../design";
import { ProfileCard } from "./ProfileCard";

interface Props {
  onClose?: () => void;
  trophies?: Array<{
    id: string;
    title: string;
    description?: string;
    icon?: string;
    date?: string;
  }>;
}

function isUrl(icon: string): boolean {
  return icon.startsWith("http") || icon.startsWith("/");
}

export function ProfileTrophies(props: Props) {
  const { t } = useLingui();
  const { openModal } = useModals();

  return (
    <Show when={props.trophies && props.trophies.length > 0}>
      <ProfileCard
        width={2}
        constraint={"half"}
        onClick={() => { const t = props.trophies!; props.onClose?.(); openModal({ type: "trophies_list", trophies: t }); }}
        style={{ cursor: "pointer" }}
      >
        <Header>
          <Text class="label" size="large">
            {t`Trophies`}
          </Text>
          <TrophyCount>{props.trophies!.length}</TrophyCount>
        </Header>

        <TrophiesGrid>
          <For each={props.trophies!.slice(0, 4)}>
            {(trophy) => (
              <TrophyCard>
                <TrophyIconWrapper>
                  <Show
                    when={trophy.icon && isUrl(trophy.icon)}
                    fallback={<TrophyEmoji>{trophy.icon ?? "🏆"}</TrophyEmoji>}
                  >
                    <TrophyIconImg src={trophy.icon} />
                  </Show>
                </TrophyIconWrapper>
                <TrophyTitle>{trophy.title}</TrophyTitle>
                <Show when={trophy.description}>
                  <TrophyDescription>{trophy.description}</TrophyDescription>
                </Show>
              </TrophyCard>
            )}
          </For>
          <Show when={props.trophies!.length > 4}>
            <MoreCard>+{props.trophies!.length - 4}</MoreCard>
          </Show>
        </TrophiesGrid>
      </ProfileCard>
    </Show>
  );
}

const Header = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
});

const TrophyCount = styled("span", {
  base: {
    fontSize: "0.75rem",
    color: "var(--md-sys-color-outline)",
    backgroundColor: "var(--md-sys-color-surface-container-high)",
    borderRadius: "999px",
    padding: "2px 8px",
  },
});

const TrophiesGrid = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "8px",
  },
});

const TrophyCard = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    padding: "10px 8px",
    borderRadius: "8px",
    backgroundColor: "var(--md-sys-color-surface-container)",
    border: "1px solid var(--md-sys-color-outline-variant)",
    textAlign: "center",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "var(--md-sys-color-surface-container-high)",
      transform: "translateY(-2px)",
    },
  },
});

const MoreCard = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 8px",
    borderRadius: "8px",
    backgroundColor: "var(--md-sys-color-surface-container)",
    border: "1px solid var(--md-sys-color-outline-variant)",
    color: "var(--md-sys-color-outline)",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
});

const TrophyIconWrapper = styled("div", {
  base: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "var(--md-sys-color-surface-container-high)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const TrophyEmoji = styled("span", {
  base: {
    fontSize: "22px",
    lineHeight: 1,
  },
});

const TrophyIconImg = styled("img", {
  base: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    objectFit: "cover",
  },
});

const TrophyTitle = styled("div", {
  base: {
    fontWeight: "600",
    color: "var(--md-sys-color-on-surface)",
    fontSize: "0.8rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
    textAlign: "center",
  },
});

const TrophyDescription = styled("div", {
  base: {
    color: "var(--md-sys-color-on-surface-variant)",
    fontSize: "0.72rem",
    lineHeight: "1.3",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%",
    textAlign: "center",
  },
});



