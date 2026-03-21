"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  OverlayView,
  DirectionsRenderer,
} from "@react-google-maps/api";

/* ── Stable libs array (must not change between renders) ── */
const LIBS = ["places", "geometry"];

/* ── Silver map style ───────────────────────────────────── */
const SILVER_STYLE = [
  { elementType: "geometry",              stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon",           stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill",      stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke",    stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi",           elementType: "geometry",         stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi",           elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park",      elementType: "geometry",         stylers: [{ color: "#e5e5e5" }] },
  { featureType: "poi.park",      elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "road",          elementType: "geometry",         stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road.highway",  elementType: "geometry",         stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway",  elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road.local",    elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "transit.line",     elementType: "geometry",      stylers: [{ color: "#e5e5e5" }] },
  { featureType: "transit.station",  elementType: "geometry",      stylers: [{ color: "#eeeeee" }] },
  { featureType: "water", elementType: "geometry",         stylers: [{ color: "#c9c9c9" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
];

/* ── Map options (stable reference) ─────────────────────── */
const MAP_OPTIONS = {
  styles: SILVER_STYLE,
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

/* ── Lerp helper ─────────────────────────────────────────── */
function lerp(a, b, t) { return a + (b - a) * t; }

/* ── Driver marker — motorcycle SVG in green circle ─────── */
function DriverMarker({ position, heading = 0 }) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h / 2 })}
    >
      <div style={{
        width: 38, height: 38,
        transform: `rotate(${heading}deg)`,
        transition: "transform 0.4s ease",
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.45))",
        pointerEvents: "none",
      }}>
        <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
          <circle cx="19" cy="19" r="19" fill="#185f2d" />
          <g stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="25" r="3" />
            <circle cx="27" cy="25" r="3" />
            <path d="M14 25h9M23 25V17l-4-6H16L13 17h6l3 4" />
            <path d="M28 17h-5M11 23l2-6h3" />
          </g>
        </svg>
      </div>
    </OverlayView>
  );
}

/* ── Customer destination pin ────────────────────────────── */
function CustomerMarker({ position }) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h })}
    >
      <div style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))", pointerEvents: "none" }}>
        <svg viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 37 }}>
          <path d="M16 1C7.716 1 1 7.716 1 16c0 12.5 15 25 15 25S31 28.5 31 16C31 7.716 24.284 1 16 1z" fill="#ef4444" stroke="white" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="5.5" fill="white" />
        </svg>
      </div>
    </OverlayView>
  );
}

/* ── Vendor / pickup store pin ───────────────────────────── */
function VendorMarker({ position }) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h })}
    >
      <div style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.35))", pointerEvents: "none" }}>
        <svg viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 37 }}>
          <path d="M16 1C7.716 1 1 7.716 1 16c0 12.5 15 25 15 25S31 28.5 31 16C31 7.716 24.284 1 16 1z" fill="#F5A623" stroke="white" strokeWidth="1.5" />
          <g stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18v5h14v-5" />
            <path d="M7 13l2.5-5h13l2.5 5H7z" />
            <path d="M7 13h18" />
            <path d="M13 23v-5h6v5" />
          </g>
        </svg>
      </div>
    </OverlayView>
  );
}

/**
 * DeliveryMap — shared live tracking map component.
 *
 * Props:
 *   driverLocation  { lat, lng, heading }   live driver position
 *   customerLocation { lat, lng }           delivery destination
 *   vendorLocation  { lat, lng }            optional pickup point
 *   height          string                  CSS height (default "100%")
 *   showCenterFab   boolean                 show "Center on driver" FAB
 *   onDirectionsReady (result) => void      called when route is ready
 */
export default function DeliveryMap({
  driverLocation,
  customerLocation,
  vendorLocation,
  height = "100%",
  showCenterFab = true,
  onDirectionsReady,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBS,
    id: "yookatale-map-script",
  });

  const mapRef = useRef(null);
  const animRef = useRef(null);
  const prevPosRef = useRef(null);
  const [displayedDriver, setDisplayedDriver] = useState(driverLocation || null);
  const [directions, setDirections] = useState(null);
  const dirFetchedRef = useRef(null); // tracks last origin tile to debounce refetch

  /* ── Lerp animation: smoothly move marker between GPS updates ── */
  useEffect(() => {
    if (!driverLocation) return;
    if (!prevPosRef.current) {
      prevPosRef.current = driverLocation;
      setDisplayedDriver(driverLocation);
      return;
    }
    const from = { ...prevPosRef.current };
    prevPosRef.current = driverLocation;

    const startTime = performance.now();
    const DURATION = 3600; // slightly shorter than 4s socket interval

    if (animRef.current) cancelAnimationFrame(animRef.current);
    const tick = (now) => {
      const t = Math.min((now - startTime) / DURATION, 1);
      setDisplayedDriver({
        lat: lerp(from.lat, driverLocation.lat, t),
        lng: lerp(from.lng, driverLocation.lng, t),
        heading: driverLocation.heading ?? 0,
      });
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [driverLocation]);

  /* ── Auto-fit bounds when any marker changes ─────────────────── */
  useEffect(() => {
    if (!mapRef.current || !isLoaded || typeof window === "undefined" || !window.google) return;
    const bounds = new window.google.maps.LatLngBounds();
    let count = 0;
    if (displayedDriver)    { bounds.extend(displayedDriver);    count++; }
    if (customerLocation)   { bounds.extend(customerLocation);   count++; }
    if (vendorLocation)     { bounds.extend(vendorLocation);     count++; }
    if (count > 1) {
      mapRef.current.fitBounds(bounds, { top: 80, bottom: 100, left: 40, right: 40 });
    } else if (count === 1) {
      mapRef.current.setZoom(16);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoaded,
    displayedDriver?.lat && Math.round(displayedDriver.lat * 500),
    displayedDriver?.lng && Math.round(displayedDriver.lng * 500),
    customerLocation?.lat,
    customerLocation?.lng,
    vendorLocation?.lat,
    vendorLocation?.lng,
  ]);

  /* ── Directions fetch: refetch when driver moves >~55m ──────── */
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined" || !window.google) return;
    if (!displayedDriver || !customerLocation) return;

    // Tile-based debounce: ~0.0005 deg ≈ 55m
    const tile = `${Math.round(displayedDriver.lat * 2000)},${Math.round(displayedDriver.lng * 2000)}`;
    if (dirFetchedRef.current === tile) return;
    dirFetchedRef.current = tile;

    const svc = new window.google.maps.DirectionsService();
    const waypoints = vendorLocation
      ? [{ location: new window.google.maps.LatLng(vendorLocation.lat, vendorLocation.lng), stopover: true }]
      : [];

    svc.route(
      {
        origin: new window.google.maps.LatLng(displayedDriver.lat, displayedDriver.lng),
        destination: new window.google.maps.LatLng(customerLocation.lat, customerLocation.lng),
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          if (onDirectionsReady) onDirectionsReady(result);
        }
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoaded,
    displayedDriver ? Math.round(displayedDriver.lat * 2000) : null,
    displayedDriver ? Math.round(displayedDriver.lng * 2000) : null,
    customerLocation?.lat,
    customerLocation?.lng,
    vendorLocation?.lat,
    vendorLocation?.lng,
  ]);

  const onMapLoad = useCallback((map) => { mapRef.current = map; }, []);

  const centerOnDriver = useCallback(() => {
    if (mapRef.current && displayedDriver) {
      mapRef.current.panTo({ lat: displayedDriver.lat, lng: displayedDriver.lng });
      mapRef.current.setZoom(17);
    }
  }, [displayedDriver]);

  /* ── Error / loading states ─────────────────────────────────── */
  if (loadError) {
    return (
      <div style={{ width: "100%", height, display: "flex", alignItems: "center", justifyContent: "center", background: "#1c1c1c", color: "#6b7280", fontSize: 13, fontFamily: "'Sora',sans-serif" }}>
        Map unavailable
      </div>
    );
  }
  if (!isLoaded) {
    return (
      <div style={{ width: "100%", height, display: "flex", alignItems: "center", justifyContent: "center", background: "#e8e8e8" }}>
        <div style={{ width: 30, height: 30, border: "3px solid #185f2d", borderTopColor: "transparent", borderRadius: "50%", animation: "dmSpin 0.8s linear infinite" }} />
        <style>{`@keyframes dmSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const center = displayedDriver || customerLocation || { lat: 0.3476, lng: 32.5825 };

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={15}
        onLoad={onMapLoad}
        options={MAP_OPTIONS}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#185f2d",
                strokeWeight: 5,
                strokeOpacity: 0.85,
              },
            }}
          />
        )}

        {displayedDriver && (
          <DriverMarker
            position={{ lat: displayedDriver.lat, lng: displayedDriver.lng }}
            heading={displayedDriver.heading ?? 0}
          />
        )}
        {customerLocation && <CustomerMarker position={customerLocation} />}
        {vendorLocation && <VendorMarker position={vendorLocation} />}
      </GoogleMap>

      {/* Center on Driver FAB */}
      {showCenterFab && displayedDriver && (
        <button
          onClick={centerOnDriver}
          title="Center on driver"
          style={{
            position: "absolute", bottom: 16, right: 16,
            width: 44, height: 44, borderRadius: "50%",
            background: "white", border: "none",
            boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#185f2d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </button>
      )}
    </div>
  );
}
