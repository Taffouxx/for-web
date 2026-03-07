import { BiSolidShield } from "solid-icons/bi";
import { Show } from "solid-js";

import { Trans, useLingui } from "@lingui-solid/solid/macro";
import { User, UserBadges } from "stoat.js";
import { styled } from "styled-system/jsx";

import badgeJoke1 from "@assets/badges/amog.svg";
import badgeJoke2 from "@assets/badges/amorbus.svg";
import badgeBattlePass from "@assets/badges/battlepass.svg";
import badgeDeveloper from "@assets/badges/developer.svg";
import badgeDesigner from "@assets/badges/designer.svg";
import badgeEarlyAdopter from "@assets/badges/early_adopter.svg";
import badgeFounder from "@assets/badges/founder.svg";
import badgeModeration from "@assets/badges/moderation.svg";
import badgePartner1 from "@assets/badges/partner1.svg";
import badgePartner2 from "@assets/badges/partner2.svg";
import badgePartner3 from "@assets/badges/partner3.svg";
import badgePaw from "@assets/badges/paw.svg";
import badgeRaccoon from "@assets/badges/raccoon.svg";
import badgeSupporter from "@assets/badges/supporter.svg";
import badgeTranslator from "@assets/badges/translator.svg";
import { Text } from "../../design";

import { ProfileCard } from "./ProfileCard";

export function ProfileBadges(props: { user: User }) {
  const { t } = useLingui();

  return (
    <Show when={props.user.badges}>
      <ProfileCard>
        <Text class="title" size="large">
          <Trans>Badges</Trans>
        </Text>

        <BadgeRow>
          <Show when={props.user.badges & UserBadges.Founder}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Zeelo Founder`,
                },
              }}
              src={badgeFounder}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.Developer}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Zeelo Developer`,
                },
              }}
              src={badgeDeveloper}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.Supporter}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Donated to Zeelo`,
                },
              }}
              src={badgeSupporter}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.Translator}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Helped translate Zeelo`,
                },
              }}
              src={badgeTranslator}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.EarlyAdopter}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`One of the first 1000 users!`,
                },
              }}
              src={badgeEarlyAdopter}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.PlatformModeration}>
            <span
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Platform Moderator`,
                },
              }}
            >
              <img src={badgeModeration} />
            </span>
          </Show>
          <Show when={props.user.badges & UserBadges.ResponsibleDisclosure}>
            <span
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Responsibly disclosed security issues`,
                },
              }}
            >
              <BiSolidShield />
            </span>
          </Show>
          <Show
            when={props.user.badges & UserBadges.ReservedRelevantJokeBadge1}
          >
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`irrelevant joke badge 1`,
                },
              }}
              src={badgeJoke1}
            />
          </Show>
          <Show
            when={props.user.badges & UserBadges.ReservedRelevantJokeBadge1}
          >
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`irrelevant joke badge 2`,
                },
              }}
              src={badgeJoke2}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.Paw}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: "🦊",
                },
              }}
              src={badgePaw}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.BattlePass}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Battle Pass`,
                },
              }}
              src={badgeBattlePass}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.Designer}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Designer`,
                },
              }}
              src={badgeDesigner}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.Partner1}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Partner`,
                },
              }}
              src={badgePartner1}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.Partner2}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Partner`,
                },
              }}
              src={badgePartner2}
            />
          </Show>
          <Show when={props.user.badges & UserBadges.Partner3}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: t`Partner`,
                },
              }}
              src={badgePartner3}
            />
          </Show>
          <Show when={props.user.id === "01EX2NCWQ0CHS3QJF0FEQS1GR4"}>
            <img
              use:floating={{
                tooltip: {
                  placement: "top",
                  content: "🦝",
                },
              }}
              src={badgeRaccoon}
            />
          </Show>
        </BadgeRow>
      </ProfileCard>
    </Show>
  );
}

const BadgeRow = styled("div", {
  base: {
    gap: "var(--gap-md)",
    display: "flex",
    flexWrap: "wrap",

    "& img, & svg": {
      width: "24px",
      height: "24px",
      aspectRatio: "1/1",
    },
  },
});
