import type { ChangeEvent, FC } from "react";

interface FloatingLabelInputProps {
  label: string;
  type: "text" | "date" | "password";
  inputClassName?: string;
  newInputClassName?: string;
  labelClassName?: string;
  newLabelClassName?: string;
  name: string;
  value?: any;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  errors?: string[];
}

const FloatingLabelInput: FC<FloatingLabelInputProps> = ({
  label,
  type,
  inputClassName,
  newInputClassName,
  labelClassName,
  newLabelClassName,
  name,
  value,
  onChange,
  required,
  autoFocus,
  disabled,
  readOnly,
  errors,
}) => {
  return (
    <>
      <div className="relative">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={`${
            newInputClassName
              ? newInputClassName
              : `block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 ${
                  errors && errors.length > 0
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                } appearance-none focus:outline-none focus:ring-0 peer ${inputClassName}`
          } `}
          placeholder=" "
          autoFocus={autoFocus}
          disabled={disabled}
          readOnly={readOnly}
        />
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
      </div>
      {errors && errors.length > 0 && (
        <div className="mt-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}
    </>
  );
};

export default FloatingLabelInput;
