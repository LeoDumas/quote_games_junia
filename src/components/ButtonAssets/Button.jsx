import {useState} from "react"
import "./Button.css"

function Button({
    h,
    w,
    txt,
    children,
    className = "",
    type = "button",
    onClick,
    ariaLabel,
    style,
    variant = "blue",
    neonOnHover = true,
    ...rest
}) {
    const mergedStyle = {
        ...(h ? { height: h } : {}),
        ...(w ? { width: w } : {}),
        ...(h ? { fontSize: h * 0.4 } : {}),
        ...style,
    };

    const variantClass = `btn--${variant}`;
    const neonClass = neonOnHover ? "btn--neon-hover" : "";

    return (
        <button
            type={type}
            className={`btn ${variantClass} ${neonClass} ${className}`.trim()}
            onClick={onClick}
            aria-label={ariaLabel}
            style={mergedStyle}
            {...rest}
        >
            {children ?? txt}
        </button>
    );

}

export default Button;

