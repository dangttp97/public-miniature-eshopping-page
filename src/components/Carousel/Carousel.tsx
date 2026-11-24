import { Button } from "@/components/Button/Button";
import { Icon } from "@/components/Icon/Icon";
import { cx } from "@/lib/cx";
import { useRef, useState } from "@koniwa/core";

import css from "./Carousel.module.css";

const SWIPE_DISTANCE = 40;

type CarouselProps = {
  images: string[];
  alt: string;
  className?: string;
};

export const Carousel = ({ images, alt, className }: CarouselProps) => {
  const [index, setIndex] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const count = images.length;
  const hasMany = count > 1;

  const move = (step: number) => setIndex((current) => (current + step + count) % count);
  const showPrevious = () => move(-1);
  const showNext = () => move(1);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") showPrevious();
    if (e.key === "ArrowRight") showNext();
  };

  const handlePointerDown = (e: PointerEvent) => {
    swipeStartX.current = e.clientX;
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (swipeStartX.current === null) return;
    const distance = e.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(distance) < SWIPE_DISTANCE) return;
    if (distance < 0) showNext();
    else showPrevious();
  };

  return (
    <section className={cx(css.carousel, className)} aria-roledescription="carousel" aria-label={`Ảnh sản phẩm ${alt}`}>
      <div
        className={css.viewport}
        tabIndex={hasMany ? 0 : undefined}
        onKeyDown={hasMany ? handleKeyDown : undefined}
        onPointerDown={hasMany ? handlePointerDown : undefined}
        onPointerUp={hasMany ? handlePointerUp : undefined}
      >
        <img className={css.image} src={images[index]} alt={hasMany ? `${alt}, ảnh ${index + 1}/${count}` : alt} width="600" height="600" draggable={false} />

        {hasMany && (
          <>
            <Button variant="outline" iconOnly className={cx(css.arrow, css.previous)} aria-label="Ảnh trước" onClick={showPrevious}>
              <Icon name="chevronLeft" />
            </Button>
            <Button variant="outline" iconOnly className={cx(css.arrow, css.next)} aria-label="Ảnh sau" onClick={showNext}>
              <Icon name="chevronRight" />
            </Button>
            <span className={css.counter} aria-live="polite">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {hasMany && (
        <div className={css.thumbnails} role="group" aria-label="Chọn ảnh">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={css.thumbnail}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
            >
              <img src={src} alt="" width="72" height="72" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
