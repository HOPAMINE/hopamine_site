import { SocialMouseTrail } from "@/components/social/SocialMouseTrail";
import { PORTAL_MAIN_PAD } from "@/lib/layoutConstants";
import { NYC_SOCIAL_PROFILES } from "@/lib/social/nycProfiles";
import { robotoMono, sortsMillGoudy } from "../../../fonts";
import { SocialCard } from "./SocialCard";

export default function SocialPage() {
  return (
    <main className={`relative min-h-dvh w-full ${PORTAL_MAIN_PAD} pb-16 md:pb-24`}>
      <SocialMouseTrail />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="mb-10 max-w-2xl">
          <h1
            className={`${sortsMillGoudy.className} text-4xl tracking-[-0.04em] text-neutral-900 md:text-5xl`}
          >
            NYC Social
          </h1>
          <p className={`${robotoMono.className} mt-3 text-sm leading-relaxed text-neutral-600`}>
            Eight fictional New Yorkers — pixel punks, archivists, DJs, and
            trainers — each with their own corner of the city.
          </p>
        </header>

        <section aria-labelledby="social-grid-heading">
          <h2 id="social-grid-heading" className="sr-only">
            Social profiles
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>article]:min-w-0">
            {NYC_SOCIAL_PROFILES.map((profile) => (
              <SocialCard key={profile.id} profile={profile} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
