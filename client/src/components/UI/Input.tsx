import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
};

const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
    return (
        <input
            {...props} // 모든 기본 속성을 적용
            className={`border p-2 rounded-md focus:ring-2 focus:ring-blue-500 ${className}`}
        />
    );
};

export default Input;
