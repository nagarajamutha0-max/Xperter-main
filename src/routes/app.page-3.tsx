import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/app/page-3")({
  head: () => ({
    meta: [
      { title: "Vector — Coming soon · Lumen" },
      { name: "description", content: "The Vector space in Lumen is coming soon." },
      { property: "og:title", content: "Vector — Coming soon · Lumen" },
      { property: "og:description", content: "The Vector space in Lumen is coming soon." },
    ],
  }),
  component: Page,
});

function Page() {
  return <ComingSoon kind="cross" name="Vector" index="03" />;
}
