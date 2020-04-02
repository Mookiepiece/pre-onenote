import React from 'react';

const MkButton = React.forwardRef(({
    className = "",
    type = "default",
    active,
    unfocusable,
    full,
    children,
    size = "small",
    round,
    disabled = false,
    onClick,
    ...others
}, ref) => {
    className = className + ' ' + "mk-button";

    if (active) {
        className += ' ' + "active";
    }
    if (unfocusable) {
        className += ' ' + "unfocusable";
    }
    if (full) {
        className += ' ' + "mk-button-fullwidth";
    }
    if (round) {
        className += ' ' + "mk-button-round";
    }


    className += ' ' + (_ => {
        switch (type) {
            case 'plain':
                return 'mk-button-plain';
            case 'primary':
                return 'mk-button-primary';
            case 'floating':
                return 'mk-button-floating';
            default:
                return "mk-button-default";
        }
    })();

    className += ' ' + (_ => {
        switch (size) {
            case 'l':
                return 'mk-button-large';
            default:
                return "";
        }
    })();

    className += ' ' + (disabled ? 'disabled' : '');



    return (
        <button ref={ref} className={className} tabIndex={unfocusable ? '-1' : null} onClick={
            e => {
                if (disabled) {
                    e.preventDefault();
                }
                else {
                    onClick&&onClick(e);
                }
            }
        } {...others}>
            {children}
        </button>
    )
})

export default MkButton;