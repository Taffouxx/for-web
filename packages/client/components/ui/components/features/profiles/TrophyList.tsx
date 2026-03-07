import { For, Show } from "solid-js";
import { styled } from "styled-system/jsx";
import { Dialog, DialogProps } from "@revolt/ui";
import { useLingui } from "@lingui-solid/solid/macro";
import { Modals } from "../types";

function isUrl(icon: string): boolean {
  return icon.startsWith("http") || icon.startsWith("/");
}

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function TrophiesListModal(
  props: DialogProps & Modals & { type: "trophies_list" }
) {
  const { t } = useLingui();

  return (
    <Dialog show={props.show} onClose={props.onClose} title={t`Trophies`}>
      <Grid>
        <For each={props.trophies}>
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
              <Show when={trophy.date}>
                <TrophyDate>✦ {t`Received`} {formatDate(trophy.date!)}</TrophyDate>
              </Show>
            </TrophyCard>
          )}
        </For>
      </Grid>
    </Dialog>
  );
}

const Grid = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "12px",
    padding: "8px",
  },
});

const TrophyCard = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "16px 12px",
    borderRadius: "10px",
    backgroundColor: "var(--colours-background-200)",
    border: "1px solid var(--colours-background-300)",
    textAlign: "center",
  },
});

const TrophyIconWrapper = styled("div", {
  base: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    backgroundColor: "var(--colours-background-300)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const TrophyEmoji = styled("span", {
  base: { fontSize: "28px", lineHeight: 1 },
});

const TrophyIconImg = styled("img", {
  base: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    objectFit: "cover",
  },
});

const TrophyTitle = styled("div", {
  base: {
    fontWeight: "600",
    color: "var(--colours-foreground)",
    fontSize: "0.875rem",
  },
});

const TrophyDescription = styled("div", {
  base: {
    color: "var(--colours-foreground-200)",
    fontSize: "0.78rem",
    lineHeight: "1.4",
  },
});

const TrophyDate = styled("div", {
  base: {
    color: "var(--colours-foreground-300)",
    fontSize: "0.72rem",
  },
});