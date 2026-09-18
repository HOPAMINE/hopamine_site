const BANNER_SRC = "/Frame 51.png";
const BANNER_WIDTH = 3184;
const BANNER_HEIGHT = 740;

export function ZimaMakeathonBanner() {
  return (
    <figure className="m-0 w-full shrink-0 p-0">
      <img
        src={BANNER_SRC}
        alt="The NYC Climate Week Hackathon — September 20th at NYU. For futurists, founders, and creatives building tech for humanity."
        width={BANNER_WIDTH}
        height={BANNER_HEIGHT}
        decoding="async"
        className="block h-auto w-full align-bottom"
      />
    </figure>
  );
}
