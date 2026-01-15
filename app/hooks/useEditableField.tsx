// import { useState } from 'react';

// export const useEditableField = (
//   initialValue: string,
//   onSubmit: (v: string) => Promise<void>
// ) => {
//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [value, setValue] = useState(initialValue);

//   const submit = async () => {
//     if (loading) return;
//     if (value === initialValue) {
//       setEditing(false);
//       return;
//     }

//     setLoading(true);
//     await onSubmit(value);
//     setLoading(false);
//     setEditing(false);
//   };

//   return {
//     editing,
//     loading,
//     value,
//     setValue,
//     start: () => setEditing(true),
//     cancel: () => {
//       setEditing(false);
//       setValue(initialValue);
//     },
//     submit,
//   };
// };
