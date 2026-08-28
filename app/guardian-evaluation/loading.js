import Loader from "@/components/UIComponent/Loader/Loader";

// Next.js route-level loading UI - rendered on the server as part of the
// Suspense boundary for this segment, so it appears immediately on
// navigation without waiting for client JS to download or hydrate.
export default function Loading() {
  return <Loader loading />;
}
