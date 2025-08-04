import type { ChangeEvent, FC, ReactNode } from "react";

interface FloatingLabelSelectProps {
  label: string;
  selectClassName?: string;
  newSelectClassName?: string;
  labelClassName?: string;
  newLabelClassName?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  errors?: string[];
  children: ReactNode;
}

const FloatingLabelSelect: FC<FloatingLabelSelectProps> = ({
  label,
  name,
  selectClassName,
  newSelectClassName,
  labelClassName,
  newLabelClassName,
  value,
  onChange,
  required,
  autoFocus,
  disabled,
  errors,
  children,
}) => {
  return (
    <>
      <div className="relative">
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={`${
            newSelectClassName
              ? newSelectClassName
              : `block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${
                  errors && errors.length > 0
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                } appearance-none focus:outline-none focus:ring-0 peer ${selectClassName}`
          }`}
          autoFocus={autoFocus}
          disabled={disabled}
        >
          {children}
        </select>
        <label
          htmlFor={name}
          className={`${
            newLabelClassName
              ? newLabelClassName
              : `absolute text-sm ${
                  errors && errors.length > 0 ? "text-red-500" : "text-gray-500"
                } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 ${
                  errors && errors.length > 0
                    ? "peer-focus:text-red-500"
                    : "peer-focus:text-blue-600"
                } peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 ${labelClassName}`
          }`}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
        {errors && errors.length > 0 && (
          <div className="mt-1">
            {errors.map((error, index) => (
              <p key={index} className="text-xs text-red-600">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingLabelSelect;
