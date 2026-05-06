export function applyScrollEventlistener(hourlyForecastEl) {
  const sliderEl = hourlyForecastEl;
  console.log(sliderEl);

  let isDown = false;
  let startX;
  let scrollLeft;

  sliderEl.addEventListener("mouseover", (e) => {
    isDown = false;
    sliderEl.style.cursor = "grab";
  });

  sliderEl.addEventListener("mousedown", (e) => {
    isDown = true;
    //slider.classList.add("active");
    startX = e.pageX - sliderEl.offsetLeft;
    scrollLeft = sliderEl.scrollLeft;
    sliderEl.style.cursor = "grabbing";
  });

  sliderEl.addEventListener("mouseleave", () => {
    isDown = false;
    //slider.classList.remove("active");
  });

  sliderEl.addEventListener("mouseup", () => {
    isDown = false;
    sliderEl.style.cursor = "grab";
    //slider.classList.remove("active");
  });

  sliderEl.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderEl.offsetLeft;
    const walk = x - startX;
    sliderEl.scrollLeft = scrollLeft - walk;
  });
}
