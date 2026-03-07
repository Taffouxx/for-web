import { useLingui } from "@lingui-solid/solid/macro";
import { styled } from "styled-system/jsx";

import { createSignal, Show } from "solid-js";
import { Column, Row, Text, Dialog } from "@revolt/ui";

interface Props {
  trophy: {
    id: string;
    title: string;
    description?: string;
    icon?: string;
    date?: string;
  };
}

/**
 * Trophy details modal
 */
export default function Trophy(props: Props) {
  const { t } = useLingui();
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [imageError, setImageError] = createSignal(false);

  return (
    <div style={{ "min-width": "400px", "max-width": "600px" }}>
      <Column gap="lg">
        <Header>
          <Show when={props.trophy.icon}>
            <TrophyIconContainer>
              <Show
                when={!imageError()}
                fallback={<TrophyPlaceholder />}
              >
                <TrophyIcon
                  src={props.trophy.icon}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  style={{ display: imageLoaded() ? "block" : "none" }}
                />
              </Show>
            </TrophyIconContainer>
          </Show>
          <Title>{props.trophy.title}</Title>
        </Header>

        <Content>
          <Show when={props.trophy.description}>
            <Description>{props.trophy.description}</Description>
          </Show>
          
          <Show when={props.trophy.date}>
            <Date>{props.trophy.date}</Date>
          </Show>
        </Content>
      </Column>
    </div>
  );
}

const Header = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    borderBottom: "1px solid var(--colours-background-variant)",
  },
});

const TrophyIconContainer = styled("div", {
  base: {
    width: "64px",
    height: "64px",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "var(--colours-background-variant)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const TrophyIcon = styled("img", {
  base: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

const TrophyPlaceholder = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    backgroundColor: "var(--colours-background-modifier)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "var(--colours-foreground-secondary)",
  },
});

const Title = styled(Text, {
  base: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "var(--colours-foreground)",
  },
});

const Content = styled("div", {
  base: {
    padding: "0 20px 20px",
  },
});

const Description = styled("div", {
  base: {
    fontSize: "1rem",
    lineHeight: "1.5",
    color: "var(--colours-foreground-secondary)",
    marginBottom: "16px",
  },
});

const Date = styled("div", {
  base: {
    fontSize: "0.875rem",
    color: "var(--colours-foreground-tertiary)",
  },
});
