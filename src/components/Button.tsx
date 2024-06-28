import React from 'react';
import '../style/Button.css';

interface Props{
    text: string,
    onClick: () => void,
    style?: any,
    className?: string,
    icon?: any,
    disabled?: boolean
}

const Button = ({text, onClick, style, className, icon, disabled}: Props) => {
    return (
        <button style={style} className={`btn ${disabled ? 'btn-disabled' : ''} ${className}`} onClick={onClick}>
            <div className="btn-items">
                {icon && <img src={icon} alt="icon"/>}
                <p className="btn-text">{text}</p>
            </div>

        </button>
    );
}

export default Button;