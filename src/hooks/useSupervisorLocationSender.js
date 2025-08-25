// hooks/useSupervisorLocationSender.js
/* eslint-disable */
import { useEffect, useRef } from "react";
import { storeSupervisorLocation } from "./../api/Supervisor/Locations/storeSupervisorLocation";

const getPosOnce = (opts) =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, opts)
  );

export default function useSupervisorLocationSender({
  sendIntervalMs = 30000,
  minDistanceMeters = 0,
} = {}) {
  const lastPosRef = useRef(null);
  const lastSentRef = useRef({ t: 0, pos: null });
  const watchIdRef = useRef(null);
  const sendTimerRef = useRef(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.warn("GPS غير مدعوم في هذا المتصفح");
      return;
    }

    const watchOpts = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    };

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          lastPosRef.current = pos;
        },
        (err) => {
          console.error("GPS watch error:", err);
          if (err?.code === 2 || err?.code === 3) {
            if (watchIdRef.current != null) {
              navigator.geolocation.clearWatch(watchIdRef.current);
              watchIdRef.current = null;
            }
          }
        },
        watchOpts
      );
    } catch (e) {
      console.error("فشل تفعيل watchPosition:", e);
    }

    const fetchFallbackPosition = async () => {
      try {
        const low = await getPosOnce({
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000,
        });
        return low;
      } catch (e1) {
        const hi = await getPosOnce({
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        });
        return hi;
      }
    };

    const metersBetween = (a, b) => {
      const [lat1, lon1] = a;
      const [lat2, lon2] = b;
      const R = 6371e3,
        toRad = (d) => (d * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(s));
    };

    const sendTick = async () => {
      try {
        let pos = lastPosRef.current;
        if (!pos) {
          pos = await fetchFallbackPosition();
        }
        const { latitude, longitude } = pos.coords;

        if (minDistanceMeters > 0 && lastSentRef.current.pos) {
          const prev = lastSentRef.current.pos;
          const dist = metersBetween(prev, [latitude, longitude]);
          if (dist < minDistanceMeters) {
            return;
          }
        }

        await storeSupervisorLocation(latitude, longitude);
        lastSentRef.current = { t: Date.now(), pos: [latitude, longitude] };
      } catch (err) {
        if (err?.code === 1) {
          console.warn("PERMISSION_DENIED: فعّل إذن الموقع للمتصفح/الموقع.");
        } else if (err?.code === 2) {
          console.warn(
            "POSITION_UNAVAILABLE: مزوّد الموقع غير متاح (جرّب Wi‑Fi/خدمة الموقع)."
          );
        } else if (err?.code === 3) {
          console.warn("TIMEOUT: انتهت مهلة تحديد الموقع، سنحاول مجددًا.");
        } else {
          console.warn("فشل إرسال الموقع:", err?.message || err);
        }
      }
    };

    // إرسال فوري ثم كل 30 ثانية
    sendTick();
    sendTimerRef.current = setInterval(sendTick, sendIntervalMs);

    // تنظيف
    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      clearInterval(sendTimerRef.current);
    };
  }, [sendIntervalMs, minDistanceMeters]);
}
