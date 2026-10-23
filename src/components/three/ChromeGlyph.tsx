import { lazy, Suspense, useEffect, useState } from "react";
import type { GlyphKind } from "./ChromeScene";

const ChromeScene = lazy(() => import("./ChromeScene"));

export function ChromeGlyph({ kind, className, interactive }: { kind: GlyphKind; className?: string; interactive?: boolean | undefined }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className={className} aria-hidden="true">
      {mounted && (
        <Suspense fallback={null}>
          <ChromeScene kind={kind} interactive={interactive} />
        </Suspense>
      )}
    </div>
  );
}
