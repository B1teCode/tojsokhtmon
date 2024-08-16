import React, { useState, useEffect } from 'react';
import { fetchComplexes, fetchApartments, deleteApartment } from '../api';
import './ApartmentTable.css';
import Filters from '../components/Filters';

const ApartmentTable = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complexOptions, setComplexOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalApartmentId, setModalApartmentId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [filters, setFilters] = useState({
    complex: '',
    type: 'Квартира', // Установите тип недвижимости по умолчанию
  });

  // Обработчик изменения фильтров
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const loadApartmentsAndComplexes = async () => {
      setLoading(true);
      try {
        // Загрузка данных о квартирах
        const apartmentsData = await fetchApartments(filters);
        setApartments(apartmentsData);
  
        // Загрузка данных о комплексах
        const complexesData = await fetchComplexes();
        setComplexOptions(complexesData);
  
        // Выборка уникальных значений для dropdown
        const types = [...new Set(apartmentsData.map(a => a.type))];
        setTypeOptions(types);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadApartmentsAndComplexes();
  }, [filters]); // Перезагружаем данные при изменении фильтров
  

  const handleDelete = async () => {
    if (modalApartmentId) {
      setModalLoading(true);
      try {
        await deleteApartment(modalApartmentId);
        setApartments(apartments.filter(apartment => apartment.id !== modalApartmentId));
      } catch (error) {
        console.error('Ошибка при удалении квартиры:', error);
      } finally {
        setModalLoading(false);
        setDeletingId(null);
        setModalApartmentId(null);
        setShowModal(false);
      }
    }
  };

  const openModal = (apartmentId) => {
    setModalApartmentId(apartmentId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalApartmentId(null);
  };

  return (
    <div className="apartment-table-container">
      <Filters onFilterChange={handleFilterChange} complexes={complexOptions} />

      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <table className="apartment-table">
            <thead>
              <tr>
                <th>Тип</th>
                <th>Комплекс</th>
                <th>Комнаты</th>
                <th>Площадь</th>
                <th>Район</th>
                <th>Цена</th>
                <th>Отделка</th>
                <th>Этаж</th>
                <th>Здание</th>
                <th>Подъезд</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {apartments.length > 0 ? (
                apartments.map(apartment => (
                  <tr key={apartment.id}>
                    <td>{apartment.type}</td>
                    <td>{complexOptions.find(complex => complex.id === apartment.complexId)?.name || apartment.complexId}</td>
                    <td>{apartment.rooms}</td>
                    <td>{apartment.area}</td>
                    <td>{apartment.district}</td>
                    <td>{apartment.price}</td>
                    <td>{apartment.finishing}</td>
                    <td>{apartment.floor}</td>
                    <td>{apartment.building}</td>
                    <td>{apartment.entrance}</td>
                    <td>
                      <button
                        className={`delete-button ${deletingId === apartment.id ? 'loading' : ''}`}
                        onClick={() => openModal(apartment.id)}
                        disabled={deletingId === apartment.id}
                      >
                        {deletingId === apartment.id ? 'Удаление...' : 'Удалить'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11">Нет данных</td>
                </tr>
              )}
            </tbody>
          </table>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Подтверждение удаления</h2>
                <p>Вы уверены, что хотите удалить эту квартиру?</p>
                {modalLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <button className="modal-button" onClick={handleDelete}>Да</button>
                    <button className="modal-button" onClick={closeModal}>Отмена</button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApartmentTable;
