const BANNER_SRC = "/Frame 51.png";
const BANNER_WIDTH = 3184;
const BANNER_HEIGHT = 740;
const LUMA_EVENT_URL = "https://luma.com/2tvin681";

export function ZimaMakeathonBanner() {
  return (
    <figure className="m-0 w-full shrink-0 p-0">
      <a
        href={LUMA_EVENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a6f3]"
      >
        <img
          src={BANNER_SRC}
          alt="Building the Future: A Life-Centric Climate & Civic Tech Makeathon at NYU CUSP — view on Luma"
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          decoding="async"
          className="block h-auto w-full align-bottom"
        />
      </a>
    </figure>
  );
}
