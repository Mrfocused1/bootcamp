import { ScribbleTransition } from "@/components/marketing/ScribbleTransition";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Same page transition as the marketing site: the scribble draws ON to
          cover before navigating to a marketing route, and un-draws to REVEAL on
          arrival. Navigating to the app/onboarding stays an instant navigation. */}
      <ScribbleTransition />
      {children}
    </>
  );
}
