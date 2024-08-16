// src/firebaseStorage.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from './firebase';  // Импортируйте и инициализируйте Firebase app

const storage = getStorage(app);

export const uploadFile = async (file, folder) => {
  const storageRef = ref(storage, `${folder}/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
