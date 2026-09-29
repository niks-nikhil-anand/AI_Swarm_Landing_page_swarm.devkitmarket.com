import Image from "next/image";
import { collaborators, team, type Collaborator } from "../data/content";
import { icons } from "../data/icons";
import { Accent } from "../ui/Accent";
import { Card } from "../ui/Card";
import { Chip } from "../ui/Chip";
import { Icon } from "../ui/Icon";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { SocialIcon, socialLabels } from "../ui/SocialIcon";

/** The two people behind AI Swarm: one card each under a shared heading. */
export function Collaborators() {
  return (
    <Section id="team">
      <SectionHeader
        eyebrow="THE TEAM"
        title={
          <>
            Built by two developers, <Accent>not a faceless AI company.</Accent>
          </>
        }
        description="AI Swarm is designed and built by two engineers at Rubenius Interior Wellbeing in Bengaluru. We use it on our own ideas first."
      />

      <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-2">
        {collaborators.map((person) => (
          <CollaboratorCard key={person.name} person={person} />
        ))}
      </div>

    </Section>
  );
}

function CollaboratorCard({ person }: { person: Collaborator }) {
  return (
    <Card className="gap-5 p-5 sm:p-7">
      <div className="flex items-center gap-4">
        <Image
          src={person.photo}
          alt=""
          width={72}
          height={72}
          sizes="72px"
          className="size-16 shrink-0 rounded-full object-cover ring-2 ring-brand/30 ring-offset-2 ring-offset-panel sm:size-[72px]"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-medium text-fg">{person.name}</h3>
          <p className="mt-0.5 text-sm text-brand-soft">{person.role}</p>
          <p className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-snug text-muted">
            <Icon d={icons.building} size={14} className="mt-px shrink-0 text-dim" />
            <span>{team.company}</span>
          </p>
        </div>
      </div>

      <p className="text-sm leading-[1.65] text-muted">{person.bio}</p>

      <div className="flex flex-wrap gap-2">
        {person.focus.map((item) => (
          <Chip key={item} tone="muted" className="px-2.5 py-1 text-xs">
            {item}
          </Chip>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-1 border-t border-line pt-5 min-[375px]:gap-2">
        {person.socials.map((social) => (
          <a
            key={social.kind}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.kind === "portfolio" ? `${person.name}’s portfolio` : `${person.name} on ${socialLabels[social.kind]}`}
            className="group relative flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand max-xl:size-11"
          >
            <SocialIcon kind={social.kind} />
            {/* Instant styled tooltip on hover and keyboard focus (the native title tooltip is slow and mouse-only). */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 translate-y-1 rounded-md bg-fg px-2 py-1 font-code text-xs whitespace-nowrap text-ink opacity-0 shadow-lg transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
            >
              {socialLabels[social.kind]}
              <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-fg" />
            </span>
          </a>
        ))}
      </div>
    </Card>
  );
}
