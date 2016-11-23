
const applyBindingValueSlide = (slide, bindings, value) => {
  let newSlide = Object.assign({}, slide);

  if (bindings.length == 0) {
    return newSlide;

  } else {
    const newBindings = bindings;
    const key         = newBindings.shift();
    const isArray     = key.match(/\[/);
    if (isArray) {
      const indexKey  = parseInt(key.match(/\d+/)[0], 10);
      const actualKey = key.replace(/\[\d+\]/, "");
      if (!newSlide[actualKey]) {
        newSlide[actualKey] = [];
      }
      const val = (bindings.length === 0) ? value : applyBindingValueSlide(newSlide[actualKey][indexKey], newBindings, value);
      newSlide[actualKey][indexKey] = val;
    } else {
      newSlide[key]  = (bindings.length === 0) ? value : applyBindingValueSlide(newSlide[key], newBindings, value);
    }
    return newSlide;

  }
}


const applyBindingValue = (slides, binding, value) => {
  let   parts     = binding.split(/\./);
  const slidePart = parts.shift();
  const index     = parseInt(slidePart.match(/\d+/)[0], 10);

  const slide     = slides[index];
  
  let   newSlides = slides;
  parts.shift()

  if (slide && slide.data && newSlides[index] && newSlides[index].data) {
    newSlides[index].data = applyBindingValueSlide(slide.data, parts, value);
  }

  return newSlides;
}


export const generate = (slides, fields) => {
  let newSlides = Object.assign({}, JSON.parse(slides));
  for (const field of fields) {
    const { binding, value } = field;
    newSlides = applyBindingValue(newSlides, binding, value);
  }
  return newSlides;
}
