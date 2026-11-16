export function HomeHeroArtwork() {
  return (
    <div className="sb-bridge-scene" aria-hidden="true">
      <span className="sb-scene-word">next.</span>
      <svg className="sb-bridge" viewBox="0 0 520 390" fill="none">
        <defs>
          <linearGradient
            id="bridge-face"
            x1="130"
            y1="130"
            x2="380"
            y2="340"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#a49ae4" />
            <stop offset="1" stopColor="#6453b4" />
          </linearGradient>
          <linearGradient
            id="bridge-side"
            x1="290"
            y1="140"
            x2="430"
            y2="330"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7966c7" />
            <stop offset="1" stopColor="#514190" />
          </linearGradient>
          <linearGradient
            id="bridge-top"
            x1="110"
            y1="160"
            x2="390"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e4dffc" />
            <stop offset="1" stopColor="#bbb0ed" />
          </linearGradient>
        </defs>
        <ellipse
          cx="266"
          cy="338"
          rx="191"
          ry="31"
          fill="#575062"
          opacity=".08"
        />
        <path d="M52 293L246 181L468 309L274 421Z" fill="#e7e2dc" />
        <path d="M52 281L246 169L468 297L274 409Z" fill="#f3f0eb" />
        <path
          d="M99 286V196C99 110 169 63 243 106L304 141C343 164 365 203 365 248V339L310 371V274C310 240 292 210 263 193L226 172C183 147 154 170 154 219V318Z"
          fill="url(#bridge-face)"
        />
        <path
          d="M365 339L418 308V218C418 173 396 134 357 111L296 76C259 54 222 55 193 72L140 103C169 86 206 85 243 106L304 141C343 164 365 203 365 248Z"
          fill="url(#bridge-side)"
        />
        <path
          d="M140 103L193 72C222 55 259 54 296 76L357 111L304 141L243 106C206 85 169 86 140 103Z"
          fill="url(#bridge-top)"
        />
        <path
          d="M154 318L207 287V188C207 180 208 172 210 166C177 153 154 177 154 219Z"
          fill="#564694"
        />
        <path
          d="M207 287L257 316L310 285V274L257 305L207 276Z"
          fill="#d1c7b8"
        />
        <path d="M207 276L257 305L310 274L260 245Z" fill="#f7f4ee" />
        <path d="M257 316L288 334L341 303L310 285Z" fill="#e4ded5" />
        <path d="M288 334L318 352L371 321L341 303Z" fill="#ede7df" />
        <path d="M318 352L348 370L401 339L371 321Z" fill="#f7f4ee" />
        <path d="M348 370V382L401 351V339Z" fill="#d1c7b8" />
        <path
          d="M243 106L296 76M304 141L357 111"
          stroke="white"
          strokeOpacity=".3"
        />
        <path
          className="sb-route-path"
          d="M66 334L108 358C121 366 136 366 149 358L207 324"
          stroke="#7764bd"
          strokeWidth="2"
          strokeDasharray="5 6"
        />
        <circle
          className="sb-path-dot"
          cx="207"
          cy="324"
          r="5"
          fill="#7764bd"
        />
      </svg>
      <span className="sb-scene-caption">
        <span className="sb-scene-caption-line" /> Mỗi bước nhỏ, một tầm nhìn
        mới.
      </span>
    </div>
  );
}
