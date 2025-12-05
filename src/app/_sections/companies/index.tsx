import { BaseHubImage } from "basehub/next-image";

import { Section } from "@/common/layout";
import { fragmentOn } from "basehub";
import { CompaniesMarquee } from "./marquee";

export const companiesFragment = fragmentOn("CompaniesComponent", {
  subtitle: true,
  companies: {
    _title: true,
    url: true,
    image: {
      url: true,
    },
  },
});

type Companies = fragmentOn.infer<typeof companiesFragment>;

export function Companies(props: Companies) {
  return (
    <Section container="full">
      <h2 className="text-center tracking-tight text-dark-text-tertiary opacity-50">
        {props.subtitle}
      </h2>
      <CompaniesMarquee companies={props.companies} />
    </Section>
  );
}
