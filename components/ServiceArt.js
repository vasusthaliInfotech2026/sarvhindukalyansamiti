

const SCENES = {
  food: (
  <image
    href="/images/Bhojan.jpg"
    x="0"
    y="0"
    width="600"
    height="400"
    preserveAspectRatio="xMidYMid slice"
  />
),
needy: (
  <image
    href="/images/needy.jpg"
    x="0"
    y="0"
    width="600"
    height="400"
    preserveAspectRatio="xMidYMid slice"
  />
),
  orphan: (
  <image
    href="/images/orphan.jpg"
    x="0"
    y="0"
    width="600"
    height="400"
    preserveAspectRatio="xMidYMid slice"
  />
),
 health: (
  <image
    href="/images/health.jpg"
    x="0"
    y="0"
    width="600"
    height="400"
    preserveAspectRatio="xMidYMid slice"
  />
),
  disaster: (
  <image
    href="/images/disaster.jpg"
    x="0"
    y="0"
    width="600"
    height="400"
    preserveAspectRatio="xMidYMid slice"
  />
),
};

export const ART_IDS = Object.keys(SCENES);

export default function ServiceArt({ id }) {
  return (
   

    <svg
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFE3A3" stopOpacity=".95" />
          <stop offset="1" stopColor="#FF9933" stopOpacity="0" />
        </radialGradient>
      </defs>

      {SCENES[id]}

    </svg>
  );
}

  