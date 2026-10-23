import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/app/page-2")({
  head: () => ({
    meta: [
      { title: "Orbit — Coming soon · Lumen" },
      { name: "description", content: "The Orbit space in Lumen is coming soon." },
      { property: "og:title", content: "Orbit — Coming soon · Lumen" },
      { property: "og:description", content: "The Orbit space in Lumen is coming soon." },
    ],
  }),
  component: Page,
});

function Page() {
  return <ComingSoon kind="rings" name="Orbit" index="02" />;
}
