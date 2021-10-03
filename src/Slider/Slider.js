import './Slider.css';
import { useRef, useState } from 'react';
import  { getFingerNewValue, ownerDocument, trackFinger, valueToPercent } from './SliderUtils';


const handleMouseDown = (event, values, updateValue, sliderRef, step, min, max, currentActiveIndex) => {
    // Only handle left clicks
    if (event.button !== 0) {
      return;
    }

    // Avoid text selection
    event.preventDefault();
    const finger = trackFinger(event);
    const { newValue } = getFingerNewValue({ 
        finger,
        values,
        sliderRef,
        step,
        min,
        max,
        currentActiveIndex
    });
    // focusThumb({ sliderRef, activeIndex, setActive });

    updateValue(newValue);


const stopListening = () => {
    const doc = ownerDocument(sliderRef.current);
    doc.removeEventListener('mousemove', handleTouchMove);
    doc.removeEventListener('mouseup', handleTouchEnd);
  };

const handleTouchMove = (nativeEvent) => {
    const finger = trackFinger(nativeEvent);

    if (!finger) {
      return;
    }
    const { newValue } = getFingerNewValue({ finger, values, sliderRef, step, min, max, currentActiveIndex, move: true});

    // focusThumb({ sliderRef, activeIndex, setActive });
    updateValue(newValue);
  };

const handleTouchEnd = (nativeEvent) => {
    const finger = trackFinger(nativeEvent);

    if (!finger) {
      return;
    }

    stopListening(sliderRef);
  };

    const doc = ownerDocument(sliderRef.current);
    doc.addEventListener('mousemove', handleTouchMove);
    doc.addEventListener('mouseup', handleTouchEnd);
  };

const axisProps = {
    horizontal: {
      offset: (percent) => ({ left: `${percent}%` }),
      leap: (percent) => ({ width: `${percent}%` }),
    }
  };

const Slider = () => {
    const [values, setValues] = useState([10, 15]);
    const sliderRef = useRef();
    const currentActiveIndex = useRef();

    return (
        <div className="root" onMouseDown={(event) => {
            handleMouseDown(
                event,
                values,
                setValues,
                sliderRef,
                0.5,
                10,
                22,
                currentActiveIndex,
            )
        }} ref={sliderRef}>
            <span className="slider">
                <span className="slider__track"></span>
                {
                    values.map(
                        (val, index) => {

                        const percent = valueToPercent(val, 10, 22);
                        const style = axisProps['horizontal'].offset(percent);
                        
                        return (
                            <span className={"slider__thumb"} style={style}>
                                <input className="slider__thumb__input" type="range" min={0} max={100} value={val} />
                            </span>
                        );
                    }
                )
                }
            </span>
        </div>
    )
}

export default Slider;