/**
 * "We ship everywhere" — drawn rather than photographed.
 *
 * The silhouette is India stippled with dots: the dot field is one <rect> of
 * a repeating pattern clipped to the outline, so coverage reads as coverage
 * without the map pretending to be a survey. Cities sit on top as pins, four
 * of them named. Everything is inline SVG in the page's own tokens, so it
 * costs no request and follows the palette if the palette moves.
 *
 * The outline and every pin are plotted from real degrees through one linear
 * projection — x = (lon − 67.9) × 12.4, y = (36.4 − lat) × 12.4 — which is
 * why the pins land where they should relative to the coast rather than
 * being nudged into place by eye.
 */

/** India, ~90 vertices, in the projection above. Field is 370 × 362. */
const INDIA =
  'M81.8 22.3 L99.2 9.9 L122.8 11.2 L136.4 24.8 L143.8 42.2 L138.9 60.8 L151.3 74.4 ' +
  'L156.2 96.7 L168.6 100.4 L193.4 111.6 L218.2 121.5 L239.3 124.0 L249.2 119.0 L250.5 ' +
  '105.4 L260.4 114.1 L269.1 120.3 L293.9 119.0 L300.1 117.8 L306.3 105.4 L331.1 100.4 ' +
  'L348.4 86.8 L362.1 100.4 L354.6 112.8 L364.6 116.6 L350.9 121.5 L338.5 120.3 L331.1 ' +
  '136.4 L327.4 152.5 L316.2 164.9 L312.5 176.1 L302.6 178.6 L301.3 157.5 L291.4 152.5 ' +
  'L288.9 138.9 L274.0 138.9 L271.6 129.0 L260.4 125.2 L257.9 137.6 L250.5 146.3 L257.9 ' +
  '151.3 L260.4 163.7 L251.7 178.6 L236.8 184.8 L230.6 200.9 L212.0 209.6 L187.2 224.4 ' +
  'L164.9 249.2 L153.8 254.2 L152.5 284.0 L148.8 303.8 L142.6 323.6 L136.4 337.3 L127.7 ' +
  '341.0 L120.3 350.9 L112.8 347.2 L106.6 333.6 L98.0 311.2 L85.6 290.2 L74.4 261.6 ' +
  'L63.2 234.4 L60.8 214.5 L59.5 198.4 L62.0 186.0 L55.8 187.2 L32.2 193.4 L12.4 176.1 ' +
  'L31.0 166.2 L45.9 158.7 L19.8 155.0 L6.2 156.2 L3.7 148.8 L26.0 150.0 L37.2 130.2 ' +
  'L27.3 106.6 L49.6 104.2 L62.0 91.8 L81.8 80.6 L83.1 65.7 L93.0 50.8 L83.1 38.4 ' +
  'L75.6 28.5Z';

/** Named hubs. `side: 'end'` hangs the label off the pin's left. */
const HUBS: Array<{ x: number; y: number; name: string; side?: 'end' }> = [
  { x: 115.3, y: 96.7, name: 'Delhi' },
  { x: 253.0, y: 171.1, name: 'Kolkata' },
  { x: 62.0, y: 214.5, name: 'Mumbai', side: 'end' },
  { x: 152.5, y: 288.9, name: 'Chennai' },
];

/** The rest of the network — unlabelled, they are there to fill the country. */
const CITIES = [
  [85.6, 28.5], // Srinagar
  [86.8, 59.5], // Amritsar
  [98.0, 117.8], // Jaipur
  [63.2, 125.2], // Jodhpur
  [161.2, 119.0], // Lucknow
  [213.3, 133.9], // Patna
  [295.1, 126.5], // Guwahati
  [58.3, 166.2], // Ahmedabad
  [99.2, 169.9], // Indore
  [117.8, 162.4], // Bhopal
  [215.8, 161.2], // Ranchi
  [138.9, 189.7], // Nagpur
  [169.9, 187.2], // Raipur
  [222.0, 199.6], // Bhubaneswar
  [74.4, 222.0], // Pune
  [131.4, 235.6], // Hyderabad
  [191.0, 231.9], // Visakhapatnam
  [120.3, 290.2], // Bengaluru
  [112.8, 315.0], // Coimbatore
  [104.2, 327.4], // Kochi
];

export default function DeliveryMap() {
  return (
    <section className="dmap" aria-labelledby="dmap-h">
      <div className="dmap__copy">
        <h2 id="dmap-h">Delivered All Over India</h2>
        <p>
          Srinagar to Kanyakumari — purifiers, filters and spares ship to every serviceable pin
          code in the country.
        </p>
      </div>

      <figure className="dmap__fig">
        <svg
          className="dmap__svg"
          viewBox="0 0 370 362"
          role="img"
          aria-label="Map of India with RTX delivery hubs marked at Delhi, Kolkata, Mumbai and Chennai"
        >
          <defs>
            <pattern id="dmap-dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle className="dmap__stipple" cx="5" cy="5" r="1.9" />
            </pattern>
            <clipPath id="dmap-clip">
              <path d={INDIA} />
            </clipPath>
          </defs>

          <g clipPath="url(#dmap-clip)">
            <rect className="dmap__wash" width="370" height="362" />
            <rect className="dmap__field" width="370" height="362" />
          </g>
          <path className="dmap__edge" d={INDIA} />

          {CITIES.map(([x, y]) => (
            <circle key={`${x}-${y}`} className="dmap__dot" cx={x} cy={y} r="3.2" />
          ))}

          {HUBS.map((h) => (
            <g key={h.name}>
              <circle className="dmap__halo" cx={h.x} cy={h.y} r="11" />
              <circle className="dmap__hub" cx={h.x} cy={h.y} r="4.6" />
              <text
                className="dmap__label"
                x={h.side === 'end' ? h.x - 10 : h.x + 10}
                y={h.y + 4}
                textAnchor={h.side ?? 'start'}
              >
                {h.name}
              </text>
            </g>
          ))}
        </svg>
      </figure>

      <div className="dmap__stats">
        <div>
          <b>28 States</b>
          <span>& 8 union territories</span>
        </div>
        <div>
          <b>80K+</b>
          <span>Homes served</span>
        </div>
        <div>
          <b>Free</b>
          <span>Above ₹5,000</span>
        </div>
      </div>
    </section>
  );
}
