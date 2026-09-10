import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Coffee,
  Compass,
  Copy,
  GripVertical,
  Landmark,
  MapPin,
  Menu,
  Navigation,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";

type PlaceKind = "coffee" | "attraction";

type Place = {
  id: string;
  name: string;
  kind: PlaceKind;
  neighborhood: string;
  description: string;
  image: string;
  time: string;
  duration: number;
  x: number;
  y: number;
  tags: string[];
};

const places: Place[] = [
  {
    id: "victrola",
    name: "Victrola Coffee",
    kind: "coffee",
    neighborhood: "Capitol Hill",
    description: "A warm first pour for a day that starts slowly and gets better as it goes.",
    image: "assets/victrola.jpg",
    time: "08:30",
    duration: 45,
    x: 40,
    y: 57,
    tags: ["morning", "roasted here"],
  },
  {
    id: "pike-place",
    name: "Pike Place Market",
    kind: "attraction",
    neighborhood: "Waterfront",
    description: "Stalls, signs, and a little delicious chaos—an easy anchor for the middle of the day.",
    image: "assets/pike-place-market.jpg",
    time: "10:00",
    duration: 75,
    x: 30,
    y: 61,
    tags: ["market", "waterfront"],
  },
  {
    id: "space-needle",
    name: "Space Needle",
    kind: "attraction",
    neighborhood: "Seattle Center",
    description: "A skyline pause with a clean view north, south, and everywhere in between.",
    image: "assets/space-needle.jpg",
    time: "12:00",
    duration: 90,
    x: 40,
    y: 34,
    tags: ["skyline", "Seattle Center"],
  },
  {
    id: "kerry-park",
    name: "Kerry Park",
    kind: "attraction",
    neighborhood: "Queen Anne",
    description: "The postcard moment: bring the plan here when the light starts to turn kind.",
    image: "assets/kerry-park.jpg",
    time: "14:15",
    duration: 45,
    x: 33,
    y: 24,
    tags: ["viewpoint", "golden hour"],
  },
  {
    id: "starbucks-reserve",
    name: "Starbucks Reserve Roastery",
    kind: "coffee",
    neighborhood: "Capitol Hill",
    description: "A grander coffee stop for when the cup itself becomes part of the outing.",
    image: "assets/starbucks-reserve.jpg",
    time: "15:30",
    duration: 60,
    x: 49,
    y: 64,
    tags: ["slow afternoon", "roastery"],
  },
  {
    id: "caffe-vita",
    name: "Caffe Vita",
    kind: "coffee",
    neighborhood: "Fremont",
    description: "A neighborhood reset with enough character to make the detour feel intentional.",
    image: "assets/caffe-vita.jpg",
    time: "09:00",
    duration: 45,
    x: 33,
    y: 12,
    tags: ["neighborhood", "morning"],
  },
  {
    id: "caffe-ladro",
    name: "Caffe Ladro",
    kind: "coffee",
    neighborhood: "Downtown",
    description: "A dependable downtown breather when the route needs a soft landing.",
    image: "assets/caffe-ladro.jpg",
    time: "11:00",
    duration: 40,
    x: 27,
    y: 52,
    tags: ["quick stop", "downtown"],
  },
  {
    id: "espresso-vivace",
    name: "Espresso Vivace",
    kind: "coffee",
    neighborhood: "Capitol Hill",
    description: "A focused espresso stop for the people who plan their day around the cup.",
    image: "assets/espresso-vivace.jpg",
    time: "10:30",
    duration: 40,
    x: 46,
    y: 53,
    tags: ["espresso", "Capitol Hill"],
  },
  {
    id: "monorail-espresso",
    name: "Monorail Espresso",
    kind: "coffee",
    neighborhood: "Downtown",
    description: "Small, bright, and perfectly placed for a fast shot before the next landmark.",
    image: "assets/monorail-espresso.jpg",
    time: "09:45",
    duration: 30,
    x: 29,
    y: 48,
    tags: ["quick stop", "downtown"],
  },
  {
    id: "chihuly",
    name: "Chihuly Garden and Glass",
    kind: "attraction",
    neighborhood: "Seattle Center",
    description: "Color and glass that reward taking the long way through the room.",
    image: "assets/chihuly-garden-and-glass.jpg",
    time: "13:30",
    duration: 75,
    x: 45,
    y: 35,
    tags: ["art", "Seattle Center"],
  },
  {
    id: "great-wheel",
    name: "Seattle Great Wheel",
    kind: "attraction",
    neighborhood: "Waterfront",
    description: "A slow turn above the water for a different scale on the city.",
    image: "assets/seattle-great-wheel.jpg",
    time: "16:00",
    duration: 45,
    x: 25,
    y: 70,
    tags: ["waterfront", "sunset"],
  },
  {
    id: "fremont-troll",
    name: "Fremont Troll",
    kind: "attraction",
    neighborhood: "Fremont",
    description: "A wonderfully odd northbound detour when the itinerary needs a story.",
    image: "assets/fremont-troll.jpg",
    time: "17:00",
    duration: 30,
    x: 34,
    y: 8,
    tags: ["detour", "Fremont"],
  },
];

const initialItinerary = ["victrola", "pike-place", "space-needle", "kerry-park"];

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (!hours) return `${remainder}m`;
  if (!remainder) return `${hours}h`;
  return `${hours}h ${remainder}m`;
}

function App() {
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [activeFilter, setActiveFilter] = useState<"all" | PlaceKind>("all");
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  const itineraryPlaces = useMemo(
    () =>
      itinerary
        .map((id) => places.find((place) => place.id === id))
        .filter((place): place is Place => Boolean(place)),
    [itinerary],
  );

  const visiblePlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return places.filter((place) => {
      const matchesFilter = activeFilter === "all" || place.kind === activeFilter;
      const matchesQuery =
        !normalizedQuery ||
        [place.name, place.neighborhood, place.description, ...place.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  const totalPlannedTime = itineraryPlaces.reduce((sum, place) => sum + place.duration, 0);

  function toggleStop(placeId: string) {
    setItinerary((current) =>
      current.includes(placeId)
        ? current.filter((id) => id !== placeId)
        : [...current, placeId],
    );
  }

  function moveStop(index: number, direction: -1 | 1) {
    setItinerary((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function resetPlan() {
    setItinerary(initialItinerary);
    setToast("Your original route is back.");
    window.setTimeout(() => setToast(""), 2600);
  }

  async function copyPlan() {
    const plan = itineraryPlaces
      .map((place, index) => `${index + 1}. ${place.name} · ${place.neighborhood}`)
      .join("\n");
    const message = `My Seattle day:\n${plan}`;
    try {
      await navigator.clipboard.writeText(message);
      setToast("Route copied to your clipboard.");
    } catch {
      setToast("Your browser blocked clipboard access.");
    }
    window.setTimeout(() => setToast(""), 2600);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Seattle Day Planner home">
          <span className="brand-mark" aria-hidden="true">
            <Compass size={19} strokeWidth={1.8} />
          </span>
          <span>
            <strong>Seattle</strong>
            <span>day planner</span>
          </span>
        </a>
        <nav className={mobileMenuOpen ? "main-nav main-nav-open" : "main-nav"} aria-label="Main navigation">
          <a href="#discover" onClick={() => setMobileMenuOpen(false)}>Discover</a>
          <a href="#route" onClick={() => setMobileMenuOpen(false)}>Your route</a>
          <a href="#notes" onClick={() => setMobileMenuOpen(false)}>Field notes</a>
        </nav>
        <div className="header-actions">
          <button className="button button-quiet header-reset" type="button" onClick={resetPlan}>
            <RotateCcw size={15} />
            Reset
          </button>
          <button
            className="menu-button"
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-title-row">
              <span className="hero-rule" aria-hidden="true" />
              <span className="hero-context">A one-day field guide</span>
            </div>
            <h1 id="hero-title">
              Build a day
              <span>worth wandering.</span>
            </h1>
            <p className="hero-description">
              Coffee, skyline, markets, and small detours—arranged around the way you want to see Seattle.
            </p>
            <a className="text-link" href="#discover">
              Start with a place <ArrowDown size={15} />
            </a>
          </div>
          <div className="hero-image-wrap">
            <img src="assets/space-needle.jpg" alt="The Space Needle rising above Seattle" className="hero-image" />
            <div className="hero-image-note">
              <span>Today’s north star</span>
              <strong>Keep one view<br />in the plan.</strong>
            </div>
            <div className="hero-index" aria-hidden="true">SEA / 01</div>
          </div>
        </section>

        <section className="planner-layout" id="route" aria-label="Day planner">
          <div className="route-panel panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Your route</span>
                <h2>Make it yours.</h2>
              </div>
              <span className="route-count">{itineraryPlaces.length} stops</span>
            </div>
            <p className="panel-intro">
              Start with a loose shape, then swap in the places that feel most like your day.
            </p>
            <div className="route-meta">
              <span><ClockIcon /> {formatDuration(totalPlannedTime)} planned</span>
              <span><MapPin size={15} /> Seattle, WA</span>
            </div>

            <div className="timeline" aria-live="polite">
              {itineraryPlaces.length ? (
                itineraryPlaces.map((place, index) => (
                  <div className="timeline-item" key={place.id}>
                    <div className="timeline-rail" aria-hidden="true">
                      <span className="timeline-dot" />
                      {index < itineraryPlaces.length - 1 && <span className="timeline-line" />}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-topline">
                        <span className="timeline-time">{place.time}</span>
                        <span className="timeline-kind">
                          {place.kind === "coffee" ? <Coffee size={13} /> : <Landmark size={13} />}
                          {place.kind}
                        </span>
                      </div>
                      <div className="timeline-title-row">
                        <div>
                          <h3>{place.name}</h3>
                          <p>{place.neighborhood} <span aria-hidden="true">·</span> {formatDuration(place.duration)}</p>
                        </div>
                        <button
                          className="icon-button remove-button"
                          type="button"
                          onClick={() => toggleStop(place.id)}
                          aria-label={`Remove ${place.name} from your route`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="timeline-controls">
                        <button
                          className="text-button"
                          type="button"
                          onClick={() => moveStop(index, -1)}
                          disabled={index === 0}
                        >
                          <ArrowUp size={14} /> Earlier
                        </button>
                        <button
                          className="text-button"
                          type="button"
                          onClick={() => moveStop(index, 1)}
                          disabled={index === itineraryPlaces.length - 1}
                        >
                          Later <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-route">
                  <Sparkles size={20} />
                  <strong>Your day is wide open.</strong>
                  <p>Add a coffee or attraction below to give it a first shape.</p>
                </div>
              )}
            </div>

            <div className="route-footer">
              <button className="button button-primary" type="button" onClick={copyPlan} disabled={!itineraryPlaces.length}>
                <Copy size={16} /> Copy this route
              </button>
              <span className="route-footnote"><GripVertical size={14} /> Reorder with the arrows</span>
            </div>
          </div>

          <div className="map-panel panel" aria-label="Schematic Seattle route map">
            <div className="map-header">
              <div>
                <span className="eyebrow">The shape of the day</span>
                <h2>Follow the feeling.</h2>
              </div>
              <span className="map-legend"><span className="legend-dot" /> Your stops</span>
            </div>
            <div className="map-canvas">
              <div className="map-water" aria-hidden="true" />
              <div className="map-title">SEATTLE<br /><span>city notes</span></div>
              <div className="map-label label-fremont">FREMONT</div>
              <div className="map-label label-queen">QUEEN ANNE</div>
              <div className="map-label label-center">SEATTLE CENTER</div>
              <div className="map-label label-downtown">DOWNTOWN</div>
              <div className="map-label label-hill">CAPITOL HILL</div>
              <div className="map-label label-waterfront">WATERFRONT</div>
              <svg className="map-svg" viewBox="0 0 100 80" role="img" aria-label="Schematic route connecting your selected Seattle stops">
                <path className="map-road map-road-main" d="M6 28 C22 29, 18 44, 29 53 S40 61, 61 75" />
                <path className="map-road" d="M15 11 C25 22, 19 31, 38 40 S49 48, 51 72" />
                <path className="map-road" d="M49 2 C51 18, 50 26, 54 39 S69 52, 74 74" />
                <path className="map-road" d="M20 66 C36 57, 45 56, 65 56 S79 45, 93 39" />
                <path
                  className="route-line"
                  d={itineraryPlaces.length > 1
                    ? itineraryPlaces.map((place) => `${place.x},${place.y}`).join(" ")
                    : "0,0"}
                />
                {itineraryPlaces.map((place, index) => (
                  <g key={place.id} className="map-stop">
                    <circle cx={place.x} cy={place.y} r="3.2" />
                    <circle className="map-stop-core" cx={place.x} cy={place.y} r="1.35" />
                    <text x={place.x + 4.2} y={place.y - 4.2}>{index + 1}</text>
                  </g>
                ))}
              </svg>
              <div className="map-scale"><span /> 1 day / 1 city</div>
              <div className="map-compass" aria-hidden="true"><Navigation size={15} /><span>N</span></div>
            </div>
            <div className="map-caption">
              <div>
                <strong>{itineraryPlaces.length ? "Your day, drawn in a line." : "Give the map something to follow."}</strong>
                <span>Schematic only—not turn-by-turn directions.</span>
              </div>
              <button className="button button-secondary" type="button" onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}>
                Add a stop <Plus size={15} />
              </button>
            </div>
          </div>
        </section>

        <section className="discover-section" id="discover" aria-labelledby="discover-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">The field guide</span>
              <h2 id="discover-title">Pick your landmarks.</h2>
            </div>
            <p>Curated places for a day that feels full, not overbooked.</p>
          </div>
          <div className="discover-tools">
            <div className="filter-tabs" role="group" aria-label="Filter places">
              {(["all", "coffee", "attraction"] as const).map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={activeFilter === filter ? "filter-tab filter-tab-active" : "filter-tab"}
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                >
                  {filter === "all" ? "All places" : filter === "coffee" ? "Coffee" : "Attractions"}
                </button>
              ))}
            </div>
            <label className="search-box">
              <Search size={17} />
              <span className="visually-hidden">Search places</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by place or neighborhood"
              />
              {query && (
                <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">
                  <X size={15} />
                </button>
              )}
            </label>
          </div>

          <div className="place-grid">
            {visiblePlaces.map((place) => {
              const selected = itinerary.includes(place.id);
              return (
                <article className={selected ? "place-card place-card-selected" : "place-card"} key={place.id}>
                  <div className="place-image-wrap">
                    <img src={place.image} alt={`${place.name} in Seattle`} className="place-image" loading="lazy" />
                    <span className="place-kind">{place.kind === "coffee" ? <Coffee size={13} /> : <Landmark size={13} />}{place.kind}</span>
                    {selected && <span className="selected-badge"><Check size={13} /> In your day</span>}
                  </div>
                  <div className="place-card-body">
                    <div className="place-card-title">
                      <div>
                        <h3>{place.name}</h3>
                        <p>{place.neighborhood}</p>
                      </div>
                      <span className="place-time">{place.time}</span>
                    </div>
                    <p className="place-description">{place.description}</p>
                    <div className="place-card-footer">
                      <span className="place-duration"><ClockIcon /> {formatDuration(place.duration)}</span>
                      <button
                        type="button"
                        className={selected ? "button button-selected" : "button button-secondary"}
                        onClick={() => toggleStop(place.id)}
                      >
                        {selected ? <><Check size={15} /> Added</> : <><Plus size={15} /> Add stop</>}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {!visiblePlaces.length && (
            <div className="no-results">
              <Search size={21} />
              <strong>No places match that search.</strong>
              <button type="button" className="text-link" onClick={() => { setQuery(""); setActiveFilter("all"); }}>
                Show every place <RotateCcw size={14} />
              </button>
            </div>
          )}
        </section>

        <section className="notes-section" id="notes" aria-labelledby="notes-title">
          <div className="notes-photo">
            <img src="assets/fremont-troll.jpg" alt="The Fremont Troll beneath a bridge" loading="lazy" />
          </div>
          <div className="notes-copy">
            <span className="eyebrow">Field notes / 01</span>
            <h2>Leave room for the unexpected.</h2>
            <p>
              The best Seattle days have a little flex in them. Keep one stop that surprises you, one view that slows you down, and enough space to follow a good smell.
            </p>
            <div className="notes-signoff"><Utensils size={17} /> Built for good company.</div>
          </div>
        </section>
      </main>

      {toast && <div className="toast" role="status"><Check size={16} /> {toast}</div>}
      <footer className="site-footer">
        <span>Seattle day planner</span>
        <span>Made for wandering well.</span>
      </footer>
    </div>
  );
}

function ClockIcon() {
  return <Circle size={14} className="clock-icon" />;
}

export default App;
