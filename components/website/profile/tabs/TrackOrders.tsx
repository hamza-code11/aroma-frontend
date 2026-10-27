"use client";

import { useState } from "react";
import {
  Truck,
  Search,
  Loader2,
  AlertCircle,
  AlertTriangle,
  FileText,
  PackageCheck,
  Plane,
  Home,
  Check,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/components/ui/Toast";
import styles from "./TrackOrders.module.css";

/* ================= HELPERS ================= */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ISO string se seedha date/time lete hain taake FedEx ka local time dikhe (browser timezone se na badle)
const parseIso = (iso?: string | null) => {
  if (!iso) return null;
  const [datePart, timePart = ""] = iso.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return null;
  const [hh = "00", mm = "00"] = timePart.split(":");
  return { y, m, d, hh: parseInt(hh, 10), mm: mm.slice(0, 2) };
};

const formatDate = (iso?: string | null) => {
  const p = parseIso(iso);
  if (!p) return "";
  return `${MONTHS[p.m - 1]} ${p.d}, ${p.y}`;
};

const formatTime = (iso?: string | null) => {
  const p = parseIso(iso);
  if (!p || !iso?.includes("T")) return "";
  const ampm = p.hh >= 12 ? "PM" : "AM";
  const hour = p.hh % 12 || 12;
  return `${hour}:${p.mm} ${ampm}`;
};

const toTitleCase = (s: string) =>
  s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

/* ================= STATUS MAPPING ================= */

const STEPS = [
  { label: "Label Created", icon: FileText },
  { label: "Picked Up", icon: PackageCheck },
  { label: "In Transit", icon: Plane },
  { label: "Out for Delivery", icon: Truck },
  { label: "Delivered", icon: Home },
];

// FedEx status code -> progress step (0 se 4)
const CODE_TO_STEP: Record<string, number> = {
  OC: 0, // Order/label created
  PU: 1, // Picked up
  IT: 2, // In transit
  DP: 2, // Departed
  AR: 2, // Arrived
  AF: 2, // At FedEx facility
  CC: 2, // Cleared customs
  FD: 2, // At destination
  OD: 3, // Out for delivery
  HL: 3, // Hold at location (ready for pickup)
  DL: 4, // Delivered
};

const EXCEPTION_CODES = ["DE", "SE", "CA", "RS"]; // delivery/shipment exception, cancelled, returned

const getStepIndex = (code?: string) => (code && CODE_TO_STEP[code] !== undefined ? CODE_TO_STEP[code] : 2);

const getHeadline = (code: string | undefined, status: string, location?: string) => {
  const at = location ? ` (${location})` : "";
  switch (code) {
    case "DL":
      return { title: "Your package has been delivered", sub: `Delivered successfully${at}.` };
    case "HL":
      return { title: "Your package is ready for pickup", sub: `You can collect it from the FedEx location${at}. Carry a valid ID.` };
    case "OD":
      return { title: "Your package is out for delivery", sub: "It is on the FedEx vehicle and will reach you today." };
    case "PU":
      return { title: "Your package has been picked up", sub: "FedEx has collected your package and it will move soon." };
    case "OC":
      return { title: "Your shipping label is created", sub: "Your package is waiting to be picked up by FedEx." };
    case "DE":
    case "SE":
      return { title: "There is a delay with your package", sub: "FedEx has reported an issue. Please check the latest update below." };
    case "CA":
      return { title: "This shipment was cancelled", sub: "Please contact support if you need help." };
    default:
      return { title: "Your package is on the way", sub: `${status}${at}.` };
  }
};

/* ================= COMPONENT ================= */

const INITIAL_EVENTS = 4;

export default function TrackOrders() {
  const { showToast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setShowAll(false);

    if (!trackingNumber.trim()) {
      return showToast("Please enter a tracking number.", "error");
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/fedex/track", {
        tracking_number: trackingNumber.trim(),
      });

      if (res.data.success) {
        setResult(res.data.data);
      } else {
        setError(res.data.message || "Tracking information not found.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to track shipment.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- derived data ---------- */
  const events: any[] = result?.events || [];
  const latestEvent = events[0];
  const latestLocation = latestEvent?.location || "";
  const code: string | undefined = result?.status_code;
  const stepIndex = getStepIndex(code);
  const isException = !!code && EXCEPTION_CODES.includes(code);
  const isDelivered = code === "DL";
  const headline = result ? getHeadline(code, result.status, latestLocation) : null;

  const visibleEvents = showAll ? events : events.slice(0, INITIAL_EVENTS);

  // date ke hisaab se group
  const grouped: { date: string; items: any[] }[] = [];
  visibleEvents.forEach((ev) => {
    const d = formatDate(ev.date) || "Unknown date";
    const last = grouped[grouped.length - 1];
    if (last && last.date === d) last.items.push(ev);
    else grouped.push({ date: d, items: [ev] });
  });

  return (
    <div>
      <h2 className={styles.sectionTitle}>Track Orders</h2>

      {/* SEARCH INPUT */}
      <form onSubmit={handleTrack} className={styles.searchForm}>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter FedEx Tracking Number (e.g. 794898070526)"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className={styles.searchBtn} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {loading ? "Tracking..." : "Track"}
        </button>
      </form>

      {/* ERROR STATE */}
      {error && (
        <div className={styles.errorBox}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* RESULT */}
      {result && headline ? (
        <div className={styles.resultCard}>
          {/* Headline */}
          <div className={`${styles.headline} ${isException ? styles.headlineWarn : ""} ${isDelivered ? styles.headlineDone : ""}`}>
            <div className={styles.headlineIcon}>
              {isException ? <AlertTriangle size={22} /> : isDelivered ? <Check size={22} /> : <Truck size={22} />}
            </div>
            <div>
              <h3 className={styles.headlineTitle}>{headline.title}</h3>
              <p className={styles.headlineSub}>{headline.sub}</p>
            </div>
          </div>

          {/* Info row */}
          <div className={styles.infoRow}>
            <div className={styles.infoItem}>
              <p className={styles.trackingLabel}>Tracking Number</p>
              <p className={styles.trackingNumber}>{result.tracking_number}</p>
            </div>
            {result.service && (
              <div className={styles.infoItem}>
                <p className={styles.trackingLabel}>Service</p>
                <p className={styles.infoValue}>{result.service}</p>
              </div>
            )}
            {result.estimated_delivery && !isDelivered && (
              <div className={styles.infoItem}>
                <p className={styles.trackingLabel}>Estimated Delivery</p>
                <p className={styles.infoValue}>{formatDate(result.estimated_delivery)}</p>
              </div>
            )}
          </div>

          {/* Progress stepper */}
          {!isException && (
            <div className={styles.stepper}>
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const state = i < stepIndex ? "done" : i === stepIndex ? "current" : "pending";
                return (
                  <div
                    key={step.label}
                    className={`${styles.step} ${state === "done" ? styles.stepDone : ""} ${state === "current" ? styles.stepCurrent : ""}`}
                  >
                    <div className={styles.stepCircle}>
                      {state === "done" ? <Check size={16} /> : <Icon size={16} />}
                    </div>
                    <span className={styles.stepLabel}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* History */}
          {events.length > 0 && (
            <div className={styles.history}>
              <h3 className={styles.historyTitle}>Shipment Updates</h3>

              {grouped.map((group, gi) => (
                <div key={group.date} className={styles.dateGroup}>
                  <p className={styles.dateHeading}>{group.date}</p>
                  <div className={styles.timeline}>
                    {group.items.map((event, i) => {
                      const isLatest = gi === 0 && i === 0;
                      return (
                        <div key={i} className={styles.timelineItem}>
                          <div className={`${styles.timelineDot} ${isLatest ? styles.timelineDotLatest : ""}`} />
                          <div className={styles.timelineContent}>
                            <p className={styles.eventDesc}>{event.description}</p>
                            {event.location && (
                              <p className={styles.eventLocation}>
                                <MapPin size={12} /> {toTitleCase(event.location)}
                              </p>
                            )}
                            {formatTime(event.date) && <p className={styles.eventTime}>{formatTime(event.date)}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {events.length > INITIAL_EVENTS && (
                <button type="button" className={styles.toggleBtn} onClick={() => setShowAll((v) => !v)}>
                  {showAll ? (
                    <>
                      Show less <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Show full history ({events.length - INITIAL_EVENTS} more) <ChevronDown size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        !loading &&
        !error && (
          <div className={styles.emptyState}>
            <Truck size={48} className={styles.emptyIcon} strokeWidth={1} />
            <h3>Track your shipment</h3>
            <p>Enter your FedEx tracking number above to see the latest status.</p>
          </div>
        )
      )}
    </div>
  );
}
