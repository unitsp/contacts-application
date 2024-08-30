import React from "react";

const FormField: React.FC<{
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}> = ({ id, label, type = 'text', value, onChange, error }) => (
    <div className="mb-4">
        <label className="block text-left mb-2" htmlFor={id}>
            {label}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded ${error ? 'border-red-500' : ''}`}
            aria-describedby={`${id}-error`}
        />
        {error && <p id={`${id}-error`} className="text-red-500 text-left" role="alert">{error}</p>}
    </div>
);

export default FormField;