import { db } from './firebase';
import { collection, getDocs, addDoc, query, where, orderBy, doc, deleteDoc } from "firebase/firestore";

const complexesCollection = collection(db, 'complexes');
const apartmentsCollection = collection(db, 'apartments');

export const deleteApartment = async (apartmentId) => {
  await deleteDoc(doc(db, 'apartments', apartmentId));
};

export const fetchComplexes = async () => {
  const snapshot = await getDocs(complexesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Функция для удаления жилого комплекса и связанных квартир
export const deleteComplex = async (complexId) => {
  const apartmentsQuery = query(apartmentsCollection, where('complexId', '==', complexId));
  const apartmentsSnapshot = await getDocs(apartmentsQuery);

  const deleteApartmentPromises = apartmentsSnapshot.docs.map(apartmentDoc => 
    deleteDoc(doc(db, 'apartments', apartmentDoc.id))
  );

  await Promise.all(deleteApartmentPromises);
  await deleteDoc(doc(db, 'complexes', complexId));
};

export const fetchApartments = async (filters) => {
  let q = apartmentsCollection; // Начнем с коллекции

  // Если тип недвижимости не установлен, фильтруем по умолчанию на квартиры
  if (!filters.type) {
    filters.type = 'Квартира';
  }

  if (filters.complex) {
    q = query(q, where('complexId', '==', filters.complex));
  }

  if (Array.isArray(filters.rooms) && filters.rooms.length > 0) {
    q = query(q, where('rooms', 'in', filters.rooms));
  }

  if (filters.priceFrom && filters.priceTo) {
    q = query(q, where('price', '>=', filters.priceFrom), where('price', '<=', filters.priceTo));
  } else if (filters.priceFrom) {
    q = query(q, where('price', '>=', filters.priceFrom));
  } else if (filters.priceTo) {
    q = query(q, where('price', '<=', filters.priceTo));
  }

  if (filters.area) {
    q = query(q, where('area', '==', filters.area));
  }

  if (filters.type) {
    q = query(q, where('type', '==', filters.type));
  }

  // Сортировка должна быть последним шагом
  q = query(q, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const addApartment = async (data) => {
  // Добавление времени создания
  const apartmentData = {
    ...data,
    createdAt: new Date().toISOString()
  };
  await addDoc(apartmentsCollection, apartmentData);
};

export const addComplex = async (data) => {
  await addDoc(complexesCollection, data);
};

