"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { usePrefersReduced } from "@/hooks/use-prefers-reduced";
import { cn } from "@/lib/utils";

const POSTER = "/images/max_bruno_poster.jpg";
const VIDEO = "/videos/max_bruno.mp4";
const LABEL =
  "Max, el toro, y Bruno, el oso, analizan juntos el medidor de sentimiento del mercado";

/**
 * Video de Max y Bruno (SPEC 6.1). El póster es SIEMPRE la capa de base (es el elemento del LCP y lo
 * único que ve quien pide movimiento reducido); el video se superpone y aparece con un fundido
 * cuando empieza a reproducirse.
 *
 * - Movimiento reducido: el `<video>` ni se monta, así que no se descarga.
 * - Con movimiento: se monta después de la carga de la página, para no competir con el LCP.
 * - Se pausa fuera de pantalla y se reanuda al volver, salvo que la persona lo haya pausado.
 * - Botón Pausar/Reproducir: WCAG 2.2.2 (contenido en movimiento de más de 5 s).
 */
export function HeroVideo({ className }: { className?: string }) {
  const reduced = usePrefersReduced();
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);

  const showVideo = ready && !reduced;

  // Montar el video tras la carga de la página.
  useEffect(() => {
    if (reduced) return;
    const mount = () => setReady(true);
    if (document.readyState === "complete") {
      const timer = setTimeout(mount, 300);
      return () => clearTimeout(timer);
    }
    window.addEventListener("load", mount, { once: true });
    return () => window.removeEventListener("load", mount);
  }, [reduced]);

  // Pausar fuera de pantalla para ahorrar batería; reanudar al volver.
  useEffect(() => {
    const el = frame.current;
    const media = video.current;
    if (!showVideo || !el || !media) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (!entry.isIntersecting) media.pause();
      else if (!userPaused.current) media.play().catch(() => {});
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [showVideo]);

  function toggle() {
    const media = video.current;
    if (!media) return;
    if (media.paused) {
      userPaused.current = false;
      media.play().catch(() => {});
    } else {
      userPaused.current = true;
      media.pause();
    }
  }

  return (
    <div className={cn("hero-media relative", className)}>
      <div
        ref={frame}
        role="img"
        aria-label={LABEL}
        className="relative aspect-video w-full overflow-hidden rounded-3xl bg-navy-deep shadow-2xl shadow-black/30"
      >
        <Image
          src={POSTER}
          alt=""
          width={2576}
          height={1438}
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="absolute inset-0 size-full object-cover"
        />
        {showVideo && (
          <video
            ref={video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-500",
              playing ? "opacity-100" : "opacity-0",
            )}
          >
            <source src={VIDEO} type="video/mp4" />
          </video>
        )}
      </div>

      {showVideo && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar animación" : "Reproducir animación"}
          className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-black/60 focus-visible:outline-white active:scale-[0.97]"
        >
          {playing ? (
            <Pause className="size-4" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Play className="size-4" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
