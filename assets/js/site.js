document.querySelectorAll('.carousel-wrap').forEach((wrap) => {
  const scroller = wrap.querySelector('.carousel');
  const prev = wrap.querySelector('.carousel-ui .prev');
  const next = wrap.querySelector('.carousel-ui .next');
  const dots = [...wrap.querySelectorAll('.carousel-ui .dots button')];
  if (!scroller || !prev || !next || !dots.length) return;

  const current = () => Math.round(scroller.scrollLeft / Math.max(1, scroller.clientWidth));
  const update = () => {
    const index = current();
    dots.forEach((dot, i) => dot.toggleAttribute('aria-current', i === index));
    prev.disabled = index === 0;
    next.disabled = index === dots.length - 1;
  };
  const go = (index) => {
    scroller.scrollTo({ left: Math.max(0, Math.min(dots.length - 1, index)) * scroller.clientWidth, behavior: 'smooth' });
  };
  prev.addEventListener('click', () => go(current() - 1));
  next.addEventListener('click', () => go(current() + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  scroller.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  update();
});
