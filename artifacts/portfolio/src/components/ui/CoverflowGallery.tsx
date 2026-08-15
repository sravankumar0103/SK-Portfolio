import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { imageUrl } from '../../lib/sanity';
import type { SanityImage } from '../../lib/sanityQueries';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// 3D "coverflow" gallery — a horizontal slider where the centered card faces
// forward and neighbours rotate back around a cylinder. No extra dependency:
// built on the embla-carousel already in the project.
export function CoverflowGallery({ items, title }: { items: SanityImage[]; title: string }) {
  const loop = items.length > 2;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    align: 'center',
    containScroll: false,
    dragFree: false,
  });
  const [selected, setSelected] = useState(0);
  const cardNodes = useRef<HTMLElement[]>([]);

  const setCardNodes = useCallback((api: EmblaCarouselType) => {
    cardNodes.current = api
      .slideNodes()
      .map((slide) => slide.querySelector('[data-card]') as HTMLElement);
  }, []);

  // Apply per-slide 3D transforms based on distance from the centre.
  const applyCoverflow = useCallback((api: EmblaCarouselType, eventName?: string) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScroll = eventName === 'scroll';
    const snapCount = api.scrollSnapList().length;

    api.scrollSnapList().forEach((snap, snapIndex) => {
      let diff = snap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScroll && !slidesInView.includes(slideIndex)) return;

        // Handle the seam when looping so wrapped slides tween smoothly.
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diff = snap - (1 + scrollProgress);
              if (sign === 1) diff = snap + (1 - scrollProgress);
            }
          });
        }

        const slidesAway = diff * snapCount; // ~how many slides from centre
        const absAway = Math.min(Math.abs(slidesAway), 2.6);
        const rotateY = clamp(-slidesAway * 26, -60, 60);
        const translateZ = -absAway * 115;
        const scale = 1 - absAway * 0.13;
        const opacity = clamp(1 - absAway * 0.42, 0.18, 1);
        const grayscale = clamp(absAway * 55, 0, 85);

        const card = cardNodes.current[slideIndex];
        if (!card) return;
        card.style.transform = `translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.filter = `grayscale(${grayscale}%) brightness(${clamp(1 - absAway * 0.18, 0.55, 1)})`;
        card.style.zIndex = `${Math.round((3 - absAway) * 10)}`;
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setCardNodes(emblaApi);
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    applyCoverflow(emblaApi);

    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', applyCoverflow);
    emblaApi.on('reInit', (api) => {
      setCardNodes(api);
      applyCoverflow(api);
    });
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', applyCoverflow);
    };
  }, [emblaApi, applyCoverflow, setCardNodes]);

  if (!items.length) return null;

  const caption = items[selected]?.caption;

  return (
    <div className="relative">
      {/* Stage */}
      <div className="overflow-hidden py-6" ref={emblaRef} style={{ perspective: '1600px' }}>
        <div className="flex items-center" style={{ transformStyle: 'preserve-3d' }}>
          {items.map((img, i) => {
            const src = imageUrl(img.url, 1400);
            return (
              <div
                key={i}
                className="flex-[0_0_82%] sm:flex-[0_0_62%] md:flex-[0_0_50%] lg:flex-[0_0_44%] min-w-0 px-3"
              >
                <figure
                  data-card
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] aspect-[16/10] will-change-transform"
                  style={{ transition: 'box-shadow 0.4s ease', transformOrigin: 'center center' }}
                >
                  {src && (
                    <img
                      src={src}
                      alt={img.caption || `${title} screenshot ${i + 1}`}
                      loading="lazy"
                      draggable={false}
                      className="absolute inset-0 w-full h-full object-contain select-none"
                    />
                  )}
                  {/* Centre highlight ring */}
                  {i === selected && (
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/40 pointer-events-none" />
                  )}
                </figure>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous image"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-primary text-background flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform glow-hover"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next image"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-primary text-background flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform glow-hover"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Caption */}
      {caption && (
        <p className="text-center text-sm text-muted-foreground italic mt-4 px-6">{caption}</p>
      )}

      {/* Dots */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selected ? 'w-6 bg-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
