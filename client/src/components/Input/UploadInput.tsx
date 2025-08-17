import { useCallback, useEffect, useState, type FC } from "react";
import { useDropzone } from "react-dropzone";
import RemoveButton from "../Button/RemoveButton";

interface UploadInputProps {
  label: string;
  name: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  onRemoveExistingImageUrl?: () => void;
  existingImageUrl?: string | null;
  errors?: string[];
}

const UploadInput: FC<UploadInputProps> = ({
  label,
  name,
  value,
  onChange,
  onRemoveExistingImageUrl,
  existingImageUrl,
  errors,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
        if (onChange) onChange(file);
      }
    },
    [onChange]
  );

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
    },
    multiple: false,
  });

  useEffect(() => {
    if (value) {
      setPreview(URL.createObjectURL(value));
    } else if (existingImageUrl) {
      setPreview(existingImageUrl);
    } else {
      setPreview(null);
    }
  }, [value, existingImageUrl]);

  return (
    <>
      {/* Label */}
      <div className="mb-1">
        <label htmlFor={name} className="text-blue-600 font-medium">
          {label}
        </label>
      </div>

      {/* Dropzone container */}
      <div
        className={`translation border border-gray-300 rounded-lg border-dashed cursor-pointer hover:border-blue-900 ${
          errors ? "mb-0" : "mb-4"
        }`}
      >
        <div
          {...getRootProps()}
          className={`rounded-lg border-gray-300 border-dashed p-7 lg:p-10 ${
            isDragActive
              ? "border-blue-600 bg-blue-100"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <input {...getInputProps()} name={name} id={name} />

          {/* Preview or placeholder */}
          <div className="flex flex-col items-center m-0">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="object-cover rounded-full w-[185px] h-[185px]"
                />
              </div>
            ) : (
              <>
                <div className="mb-[22px] flex justify-center">
                  <div className="flex w-[60px] h-[60px] items-center justify-center rounded-full bg-gray-200 text-gray-600">
                    <svg
                      className="fill-current"
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.5419 3.91699C14.2852 3.91699 14.8099 4.00091 13.953 4.15589L8.57363 9.53186L8.28065 9.82466L8.28065 10.2999L8.5733 10.5925C8.86561 10.8855 9.34097 10.8857 9.63398 10.5929L13.7519 6.47571C14.0588 6.16877 14.5419 6.16877 14.8489 6.47571L18.9661 10.5929C19.2591 10.8859 19.7343 10.8857 20.0273 10.5925C20.3203 10.2995 20.3203 9.82429 20.0273 9.53129L14.648 4.15531C14.3626 3.8699 14.1906 3.91699 14.5419 3.91699ZM14.5419 14.584V17.9173C14.5419 18.3656 14.9175 18.7412 15.3659 18.7412C15.8142 18.7412 16.1899 18.3656 16.1899 17.9173V14.584C16.1899 14.1356 15.8142 13.76 15.3659 13.76C14.9175 13.76 14.5419 14.1356 14.5419 14.584ZM8.7666 24.0837C7.91237 24.0837 7.1946 23.366 7.1946 22.5117V13.7487C7.1946 12.8945 7.91237 12.1767 8.7666 12.1767H20.3173C21.1715 12.1767 21.8893 12.8945 21.8893 13.7487V22.5117C21.8893 23.366 21.1715 24.0837 20.3173 24.0837H8.7666Z"
                      />
                    </svg>
                  </div>
                </div>

                <h4 className="mb-3 font-semibold text-gray-800 text-xl">
                  {isDragActive ? "Drop File Here" : "Drag & Drop File Here"}
                </h4>
                <span className="text-center mb-4 block w-full max-w-[290px] text-sm text-gray-700">
                  Drag and drop your PNG, JPG, or JPEG
                </span>
                <span className="font-medium underline text-blue-600 text-sm">
                  Browse File
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error messages */}
      {errors && errors.length > 0 && (
        <div className="mb-2">
          <span className="text-red-600 text-xs">{errors[0]}</span>
        </div>
      )}
      {preview && (
        <RemoveButton
          label="Remove Profile Picture"
          className="w-full"
          onRemove={() => {
            if (onChange) onChange(null);
            if (onRemoveExistingImageUrl) onRemoveExistingImageUrl();
            setPreview(null);
          }}
        />
      )}
    </>
  );
};

export default UploadInput;
