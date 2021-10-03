export function trackFinger(event) {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

export const getFingerNewValue = ({ finger, values: currentValues, sliderRef, step, min, max, currentActiveIndex, move = false }) => {
    const slider = sliderRef.current;

    const { width, left } = slider.getBoundingClientRect();


    const percent = (finger.x - left) / width;

    let newValue;
    newValue = percentToValue(percent, min, max);
    if (step) {
      newValue = roundValueToStep(newValue, step, min);
    }
    newValue = clamp(newValue, min, max);
    let activeIndex = 0;

    if (!move) {
      activeIndex = findClosest(currentValues, newValue);
      currentActiveIndex.current = activeIndex;
    } else {
      activeIndex = currentActiveIndex.current;
    }

    newValue = setValueIndex({
      values: currentValues,
      newValue,
      index: activeIndex,
    }).sort(asc);

    return { newValue, activeIndex };
  };

function asc(a, b) {
    return a - b;
  }
  
function clamp(value, min, max) {
    if (value == null) {
      return min;
    }
    return Math.min(Math.max(min, value), max);
  }
  
function findClosest(values, currentValue) {
    const { index: closestIndex } = values.reduce((acc, value, index) => {
      const distance = Math.abs(currentValue - value);
  
      if (acc === null || distance < acc.distance || distance === acc.distance) {
        return {
          distance,
          index,
        };
      }
  
      return acc;
    }, null);
    return closestIndex;
  }

export function valueToPercent(value, min, max) {
    return ((value - min) * 100) / (max - min);
  }

function percentToValue(percent, min, max) {
    return (max - min) * percent + min;
  }

function roundValueToStep(value, step, min) {
    const nearest = Math.round((value - min) / step) * step + min;
    return Number(nearest.toFixed(getDecimalPrecision(step)));
  }
  
function getDecimalPrecision(num) {
    // This handles the case when num is very small (0.00000001), js will turn this into 1e-8.
    // When num is bigger than 1 or less than -1 it won't get converted to this notation so it's fine.
    if (Math.abs(num) < 1) {
      const parts = num.toExponential().split('e-');
      const matissaDecimalPart = parts[0].split('.')[1];
      return (matissaDecimalPart ? matissaDecimalPart.length : 0) + parseInt(parts[1], 10);
    }
  
    const decimalPart = num.toString().split('.')[1];
    return decimalPart ? decimalPart.length : 0;
  }


function setValueIndex({ values, newValue, index }) {
    // Performance shortcut
    if (values[index] === newValue) {
      return values;
    }
  
    const output = values.slice();
    output[index] = newValue;
    return output;
  }

export  function ownerDocument(node) {
    return (node && node.ownerDocument) || document;
  }
  