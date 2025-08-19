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
  const [isImage, setIsImage] = useState<boolean>(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const imageType = file.type.startsWith("image/");
        setIsImage(imageType);
        setPreview(imageType ? URL.createObjectURL(file) : file.name);
        onChange?.(file);
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
      "image/gif": [],
      "image/svg": [],
      "application/pdf": [],
    },
    multiple: false,
  });

  useEffect(() => {
    if (value) {
      const imageType = value.type.startsWith("image/");
      setIsImage(imageType);
      setPreview(imageType ? URL.createObjectURL(value) : value.name);
    } else if (existingImageUrl) {
      setIsImage(true);
      setPreview(existingImageUrl);
    } else {
      setPreview(null);
      setIsImage(false);
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
          className={`rounded-lg border-dashed p-7 lg:p-10 ${
            isDragActive
              ? "border-blue-600 bg-blue-100"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <input {...getInputProps()} name={name} id={name} />

          {/* Preview or placeholder */}
          <div className="flex flex-col items-center m-0">
            {preview ? (
              isImage ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-cover rounded-full w-[185px] h-[185px]"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-700">
                  <div className="mb-2 w-[60px] h-[60px] flex items-center justify-center rounded-full bg-gray-200">
                    <svg
                      className="fill-current text-gray-600"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM13 3.5V9h5.5L13 3.5zM6 20V4h6v6h6v10H6z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">{preview}</span>
                </div>
              )
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
                        d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <h4 className="mb-3 font-semibold text-gray-800 text-xl">
                  {isDragActive
                    ? "Drop File Here"
                    : "Drag & Drop File or Photo Here"}
                </h4>
                <span className="text-center mb-4 block w-full max-w-[290px] text-sm text-gray-700">
                  Upload PNG, JPG, JPEG, PDF, DOCX, XLSX, TXT and more
                </span>
                <span className="font-medium underline text-blue-600 text-sm">
                  Browse File
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Remove button */}
      {preview && (
        <RemoveButton
          label="Remove File"
          className="w-full"
          onRemove={() => {
            onChange?.(null);
            onRemoveExistingImageUrl?.();
            setPreview(null);
            setIsImage(false);
          }}
        />
      )}
    </>
  );
};

export default UploadInput;

// import { useCallback, useEffect, useState, type FC } from "react";
// import { useDropzone } from "react-dropzone";
// import RemoveButton from "../Button/RemoveButton";

// interface UploadInputProps {
//   label: string;
//   name: string;
//   value?: File | null;
//   onChange?: (file: File | null) => void;
//   onRemoveExistingImageUrl?: () => void;
//   existingImageUrl?: string | null;
//   errors?: string[];
// }

// const UploadInput: FC<UploadInputProps> = ({
//   label,
//   name,
//   value,
//   onChange,
//   onRemoveExistingImageUrl,
//   existingImageUrl,
//   errors,
// }) => {
//   const [preview, setPreview] = useState<string | null>(null);

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       if (acceptedFiles && acceptedFiles.length > 0) {
//         const file = acceptedFiles[0];
//         setPreview(URL.createObjectURL(file));
//         if (onChange) onChange(file);
//       }
//     },
//     [onChange]
//   );

//   const { getInputProps, getRootProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       "image/png": [],
//       "image/jpeg": [],
//       "image/jpg": [],
//     },
//     multiple: false,
//   });

//   useEffect(() => {
//     if (value) {
//       setPreview(URL.createObjectURL(value));
//     } else if (existingImageUrl) {
//       setPreview(existingImageUrl);
//     } else {
//       setPreview(null);
//     }
//   }, [value, existingImageUrl]);

//   return (
//     <>
//       {/* Label */}
//       <div className="mb-1">
//         <label htmlFor={name} className="text-blue-600 font-medium">
//           {label}
//         </label>
//       </div>

//       {/* Dropzone container */}
//       <div
//         className={`translation border border-gray-300 rounded-lg border-dashed cursor-pointer hover:border-blue-900 ${
//           errors ? "mb-0" : "mb-4"
//         }`}
//       >
//         <div
//           {...getRootProps()}
//           className={`rounded-lg border-gray-300 border-dashed p-7 lg:p-10 ${
//             isDragActive
//               ? "border-blue-600 bg-blue-100"
//               : "border-gray-300 bg-gray-50"
//           }`}
//         >
//           <input {...getInputProps()} name={name} id={name} />

//           {/* Preview or placeholder */}
//           <div className="flex flex-col items-center m-0">
//             {preview ? (
//               <div className="relative">
//                 <img
//                   src={preview}
//                   alt="Preview"
//                   className="object-cover rounded-full w-[185px] h-[185px]"
//                 />
//               </div>
//             ) : (
//               <>
//                 <div className="mb-[22px] flex justify-center">
//                   <div className="flex w-[60px] h-[60px] items-center justify-center rounded-full bg-gray-200 text-gray-600">
//                     <svg
//                       className="fill-current"
//                       width="29"
//                       height="28"
//                       viewBox="0 0 29 28"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         clipRule="evenodd"
//                         d="M14.5419 3.91699C14.2852 3.91699 14.8099 4.00091 13.953 4.15589L8.57363 9.53186L8.28065 9.82466L8.28065 10.2999L8.5733 10.5925C8.86561 10.8855 9.34097 10.8857 9.63398 10.5929L13.7519 6.47571C14.0588 6.16877 14.5419 6.16877 14.8489 6.47571L18.9661 10.5929C19.2591 10.8859 19.7343 10.8857 20.0273 10.5925C20.3203 10.2995 20.3203 9.82429 20.0273 9.53129L14.648 4.15531C14.3626 3.8699 14.1906 3.91699 14.5419 3.91699ZM14.5419 14.584V17.9173C14.5419 18.3656 14.9175 18.7412 15.3659 18.7412C15.8142 18.7412 16.1899 18.3656 16.1899 17.9173V14.584C16.1899 14.1356 15.8142 13.76 15.3659 13.76C14.9175 13.76 14.5419 14.1356 14.5419 14.584ZM8.7666 24.0837C7.91237 24.0837 7.1946 23.366 7.1946 22.5117V13.7487C7.1946 12.8945 7.91237 12.1767 8.7666 12.1767H20.3173C21.1715 12.1767 21.8893 12.8945 21.8893 13.7487V22.5117C21.8893 23.366 21.1715 24.0837 20.3173 24.0837H8.7666Z"
//                       />
//                     </svg>
//                   </div>
//                 </div>

//                 <h4 className="mb-3 font-semibold text-gray-800 text-xl">
//                   {isDragActive ? "Drop File Here" : "Drag & Drop File Here"}
//                 </h4>
//                 <span className="text-center mb-4 block w-full max-w-[290px] text-sm text-gray-700">
//                   Drag and drop your PNG, JPG, or JPEG
//                 </span>
//                 <span className="font-medium underline text-blue-600 text-sm">
//                   Browse File
//                 </span>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Error messages */}
//       {errors && errors.length > 0 && (
//         <div className="mb-2">
//           <span className="text-red-600 text-xs">{errors[0]}</span>
//         </div>
//       )}
//       {preview && (
//         <RemoveButton
//           label="Remove Profile Picture"
//           className="w-full"
//           onRemove={() => {
//             if (onChange) onChange(null);
//             if (onRemoveExistingImageUrl) onRemoveExistingImageUrl();
//             setPreview(null);
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default UploadInput;
