import useSupervisorLocationSender from "../../../hooks/useSupervisorLocationSender";

export default function SupervisorLocationPusher() {
  useSupervisorLocationSender({
    sendIntervalMs: 30000,     // كل 30 ثانية
    minDistanceMeters: 0       // أو 15 لتقليل الطلبات
  });
  return null;
}
