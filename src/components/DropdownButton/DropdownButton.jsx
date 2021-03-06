import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/Button';
import { Portal } from '@/components/util';

import useDropdown from './useDropdown';

const DropdownButton = ({
    active,
    setActive, // just like dialog to translate visible prop to this for programmatical use
    value,
    width,
    dropdownWidth = 260,
    dropdownHeight = 400,
    renderButton,
    beforeClick,
    trigger = 'click',
    renderDropdown = _ => "",
    disabled = false,
    position
}) => {
    const [buttonRef, top, left, transform] = useDropdown(active, setActive, trigger, position);

    let btn;
    if (renderButton !== undefined) {
        btn = renderButton(buttonRef);
    } else {
        btn = (
            <Button
                // WARNING: a silly coincidence is while button active(class="__dropdown") 
                // the button will not be listened by native events of the sideEffects in useDropdown()
                // button events will be handled by React, but outside click will be caughted by native event listener
                className={active ? '__dropdown dropdown-button' : "dropdown-button"}
                ref={buttonRef}

                disabled={disabled}

                onMouseDown={event => {
                    if (trigger === 'mousedown') {
                        event.preventDefault(); // slate.js

                        if (!disabled) {
                            beforeClick && beforeClick();// use beforeClick to save selection for editor
                            setActive(!active);
                        }
                    }
                }}

                onClick={
                    event => {
                        if (trigger === 'click') {
                            if (!disabled) {
                                beforeClick && beforeClick();// no usage, just copy
                                setActive(!active);
                            }
                        }
                    }
                }

                style={{ width }}
            >
                {value}
            </Button>
        );
    }

    return (
        <>
            {btn}
            <Portal>
                <div
                    className="__dropdown dropdown-dialog"
                    style={{
                        top,
                        left,
                        transform,
                        display: active ? null : "none",
                        maxWidth: Math.min(dropdownWidth ? dropdownWidth : Number.MAX_VALUE, window.innerWidth - left - 12),
                        maxHeight: Math.min(dropdownHeight ? dropdownHeight : Number.MAX_VALUE, window.innerHeight - top - 12)
                    }}>
                    {
                        renderDropdown(setActive)
                    }
                </div>
            </Portal>
        </>
    )
}

export default DropdownButton;