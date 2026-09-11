import { SocialMouseTrail } from "@/components/social/SocialMouseTrail";
import { NYC_SOCIAL_PROFILES } from "@/lib/social/nycProfiles";
import { jetbrainsMono, newsreader } from "../../../../fonts";
import { SocialCard } from "../../social/SocialCard";
import { ZimaLogo } from "../ZimaLogo";

export default function ZimaSocialPage() {
  return (
    <div className="relative min-h-dvh bg-white px-6 pb-24 pt-[max(80px,env(safe-area-inset-top))]">
      <SocialMouseTrail />
      <ZimaLogo
        priority
        className="fixed left-[max(20px,env(safe-area-inset-left))] top-[max(20px,env(safe-area-inset-top))] z-10"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="mb-10 max-w-2xl">
          <h1
            className={`${newsreader.className} text-4xl font-normal tracking-[-0.02em] text-[#00a6f3] md:text-5xl`}
          >
            NYC Social
          </h1>
          <p
            className={`${jetbrainsMono.className} mt-3 text-sm leading-relaxed text-neutral-600`}
          >
            Eight fictional New Yorkers — pixel punks, archivists, DJs, and
            trainers — each with their own corner of the city.
          </p>
        </header>

        <section aria-labelledby="zima-social-grid-heading">
          <h2 id="zima-social-grid-heading" className="sr-only">
            Social profiles
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>article]:min-w-0">
            {NYC_SOCIAL_PROFILES.map((profile) => (
              <SocialCard key={profile.id} profile={profile} theme="zima" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
