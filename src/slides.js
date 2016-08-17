
const applyBindingValueSlide = (slide, bindings, value) => {
  let newSlide = Object.assign({}, slide);

  //console.error("SLIDE", newSlide, "BINDING", binding, "VALUE", value);

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
      newSlide[actualKey][indexKey] = (bindings.length === 1) ? value : applyBindingValueSlide(newSlide[actualKey][indexKey], newBindings, value);
    } else {
      newSlide[key]  = (bindings.length === 1) ? value : applyBindingValueSlide(newSlide[key], newBindings, value);
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
  newSlides[index].data = applyBindingValueSlide(slide.data, parts, value);
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
