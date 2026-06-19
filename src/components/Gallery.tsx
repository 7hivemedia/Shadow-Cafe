import React, { useState } from "react";
import { INSTAGRAM_EMBED_PHOTOS } from "../data";
import { Instagram, Eye, ArrowLeft, ArrowRight, Grid3X3, Image as ImageIcon } from "lucide-react";

export default function Gallery() {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhoto !== null) {
      setActivePhoto((activePhoto + 1) % INSTAGRAM_EMBED_PHOTOS.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhoto !== null) {
      setActivePhoto((activePhoto - 1 + INSTAGRAM_EMBED_PHOTOS.length) % INSTAGRAM_EMBED_PHOTOS.length);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="font-semibold text-lg text-zinc-100 flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-indigo-400" /> Ambiance & Glass Gallery
          </h3>
          <p className="text-zinc-400 text-xs mt-0.5">
            Atmospheric compositions representing the exact physical environments of the lounge floor.
          </p>
        </div>
        <a
          href="https://www.instagram.com/shadowcafe_un/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-805 hover:bg-zinc-800 rounded-xl text-xs text-zinc-300 font-medium transition"
        >
          <Instagram className="h-4 w-4 text-rose-500" /> @shadowcafe_un
        </a>
      </div>

      {/* Grid gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {INSTAGRAM_EMBED_PHOTOS.map((photo, i) => (
          <div
            key={i}
            onClick={() => setActivePhoto(i)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-905 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-md"
          >
            {/* Visual overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300 z-10"></div>

            {/* Glowing inspect hover icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <span className="p-3 rounded-full bg-black/60 border border-zinc-800/80 text-zinc-200">
                <Eye className="h-5 w-5" />
              </span>
            </div>

            <img
              src={photo.url}
              alt={photo.caption}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 scale-100 group-hover:scale-105"
            />

            {/* In-view caption */}
            <div className="absolute bottom-4 left-4 right-4 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-[10px] text-zinc-400 font-serif leading-tight line-clamp-2 italic">
                &ldquo;{photo.caption}&rdquo;
              </p>
              <span className="text-[9px] uppercase tracking-widest font-mono text-indigo-400 font-bold block mt-1">
                Expand Ambiance
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Slider Overlay modal */}
      {activePhoto !== null && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          {/* Close trigger button */}
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <span className="text-sm font-mono uppercase tracking-wider font-bold">Close ✕</span>
          </button>

          {/* Core frame */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full flex flex-col items-center gap-4 cursor-default"
          >
            <div className="relative w-full aspect-video md:aspect-[16/10] bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
              <img
                src={INSTAGRAM_EMBED_PHOTOS[activePhoto].url}
                alt={INSTAGRAM_EMBED_PHOTOS[activePhoto].caption}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] max-w-full object-contain"
              />

              {/* Slider left trigger */}
              <button
                onClick={handlePrev}
                className="absolute left-4 p-4 rounded-full bg-black/60 border border-zinc-850 text-zinc-300 hover:text-white hover:bg-black/90 transition cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              {/* Slider right trigger */}
              <button
                onClick={handleNext}
                className="absolute right-4 p-4 rounded-full bg-black/60 border border-zinc-850 text-zinc-300 hover:text-white hover:bg-black/90 transition cursor-pointer"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Slider bottom descriptions */}
            <div className="max-w-xl text-center space-y-1 mt-2">
              <p className="text-sm text-zinc-300 font-serif leading-relaxed px-4">
                &ldquo;{INSTAGRAM_EMBED_PHOTOS[activePhoto].caption}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-zinc-550 pt-2">
                <span>SLIDE {activePhoto + 1} OF {INSTAGRAM_EMBED_PHOTOS.length}</span>
                <span>•</span>
                <a
                  href="https://www.instagram.com/shadowcafe_un/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 flex items-center gap-1 transition"
                >
                  <Instagram className="h-3 w-3" /> View On Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { Gallery };
