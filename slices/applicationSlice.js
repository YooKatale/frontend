import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config"; 
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "config/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const app = initializeApp(firebaseConfig);
const storage = getStorage();  


const uploadCVToFirebaseStorage = async (cvFile) => {
  try {
   
    const storageRef = ref(storage, `cvs/${cvFile.name}`);
    await uploadBytes(storageRef, cvFile);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    throw new Error("Error uploading CV to Firebase Storage: " + error.message);
  }
};


export const applicationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitApplication: builder.mutation({
      query: async (formData) => {
        try {
          const cvDownloadURL = await uploadCVToFirebaseStorage(formData.cv);
          
          const response = await fetch(DB_URL + "/applications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              coverLetter: formData.coverLetter,
              cvDownloadURL: cvDownloadURL,
            }),
          });
          
          return { success: true };
        } catch (error) {
          throw new Error("Error submitting application: " + error.message);
        }
      },
    }),
  }),
});


export const { useSubmitApplicationMutation } = applicationApiSlice;
