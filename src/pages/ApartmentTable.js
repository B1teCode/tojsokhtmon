import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchComplexes, fetchApartments, deleteApartment, updateApartment } from '../api';
import './ApartmentTable.css';
import Filters from '../components/Filters';

const ApartmentTable = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [complexOptions, setComplexOptions] = useState([]);
  const [complexOptionss, setComplexOptionss] = useState([]);
  const [typeOptions] = useState([
    { value: 'Квартира', label: 'Квартира' },
    { value: 'Пентхаус', label: 'Пентхаус' },
    { value: 'Коммерческое помещение', label: 'Коммерческое помещение' },
    { value: 'Коттедж', label: 'Коттедж' },
    { value: 'Парковка', label: 'Парковка' },
  ]);
  const [deletingId, setDeletingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalApartmentId, setModalApartmentId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [editMode, setEditMode] = useState(false); // Режим редактирования
  const [apartmentData, setApartmentData] = useState({}); // Данные квартиры для редактирования
  const [filters, setFilters] = useState({
    complex: '',
    type: 'Квартира',
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const loadApartmentsAndComplexes = async () => {
      setLoading(true);
      try {
        const apartmentsData = await fetchApartments(filters);
        setApartments(apartmentsData);
  
        // Загрузка данных о комплексах
        const complexesData = await fetchComplexes();
        setComplexOptionss(complexesData.map(complex => ({
          value: complex.id,
          label: complex.name
        })));
        setComplexOptions(complexesData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadApartmentsAndComplexes();
  }, [filters]);

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

  const handleEdit = (apartment) => {
    setEditMode(true);
    setApartmentData(apartment);
    setModalApartmentId(apartment.id);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    setModalLoading(true);
    try {
      await updateApartment(modalApartmentId, apartmentData);
      const updatedApartments = apartments.map(apartment =>
        apartment.id === modalApartmentId ? { ...apartment, ...apartmentData } : apartment
      );
      setApartments(updatedApartments);
    } catch (error) {
      console.error('Ошибка при обновлении квартиры:', error);
    } finally {
      setModalLoading(false);
      setEditMode(false);
      setShowModal(false);
      setModalApartmentId(null);
      setApartmentData({});
    }
  };

  const handleInputChange = (name, value) => {
    setApartmentData(prevState => ({
      ...prevState,
      [name]: ['rooms', 'floor', 'area', 'price'].includes(name) ? Number(value) : value
    }));
  };

  const openModal = (actionType, apartment) => {
    if (actionType === 'delete') {
      setModalApartmentId(apartment.id);
      setEditMode(false);
    } else if (actionType === 'edit') {
      setApartmentData(apartment);
      setModalApartmentId(apartment.id);
      setEditMode(true);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setModalApartmentId(null);
    setApartmentData({});
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
                    <td>{complexOptionss.find(complex => complex.value === apartment.complexId)?.label || apartment.complexId}</td>
                    <td>{apartment.rooms}</td>
                    <td>{apartment.area}</td>
                    <td>{apartment.district}</td>
                    <td>{apartment.price}</td>
                    <td>{apartment.finishing}</td>
                    <td>{apartment.floor}</td>
                    <td>{apartment.building}</td>
                    <td>{apartment.entrance}</td>
                    <td className='teble-dey'>
                      <button
                        className={`delete-button ${deletingId === apartment.id ? 'loading' : ''}`}
                        onClick={() => openModal('delete', apartment)}
                        disabled={deletingId === apartment.id}
                      >
                        {deletingId === apartment.id ? 'Удаление...' : 'Удалить'}
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => openModal('edit', apartment)}
                      >
                        Изменить
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
                <h2>{editMode ? 'Редактирование недвижимости' : 'Подтверждение удаления'}</h2>
                {editMode ? (
                  <form className='modal-overlay-form'>
                    <label>
                      Тип:
                      <Select
                        options={typeOptions}
                        className='modal-overlay-select'
                        value={typeOptions.find(option => option.value === apartmentData.type)}
                        onChange={(selectedOption) => handleInputChange('type', selectedOption.value)}
                      />
                    </label>
                    <label>
                      Комплекс:
                      <Select
                        options={complexOptionss}
                        className='modal-overlay-select'
                        value={complexOptionss.find(option => option.value === apartmentData.complexId)}
                        onChange={(selectedOption) => handleInputChange('complexId', selectedOption.value)}
                      />
                    </label>
                    {/* Добавьте остальные поля аналогично */}
                    <div className='modal-glav-razdel'>
                    <div className='modal-razdel'>
                    <label className='modal-overlay-form-label'>
                      Комнаты:
                      <input
                        type="number"
                        name="rooms"
                        value={apartmentData.rooms || ''}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </label>
                    <label className='modal-overlay-form-label'>
                      Площадь:
                      <input
                        type="number"
                        name="area"
                        value={apartmentData.area || ''}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </label>
                    <label className='modal-overlay-form-label'>
                      Цена:
                      <input
                        type="number"
                        name="price"
                        value={apartmentData.price || ''}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </label>
                    <label className='modal-overlay-form-label'>
                      Район:
                      <input
                        type="text"
                        name="district"
                        value={apartmentData.district || ''}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </label>
                    </div>
                    <div className='modal-razdel'>
                    <label className='modal-overlay-form-label'>
                      Этаж:
                      <input
                        type="number"
                        name="floor"
                        value={apartmentData.floor || ''}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </label>
                    <label className='modal-overlay-form-label'>
                      Корпус:
                      <input
                        type="text"
                        name="building"
                        value={apartmentData.building || ''}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </label>
                    <label className='modal-overlay-form-label'>
                      Подъезд:
                      <input
                        type="text"
                        name="entrance"
                        value={apartmentData.entrance || ''}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </label>
                    <label className='modal-overlay-form-label'>
                      Отделка:
                      <input
                        type="text"
                        name="finishing"
                        value={apartmentData.finishing || ''}
                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                      />
                    </label>
                    </div>
                    </div>
                    {/* Остальные поля */}
                    {modalLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <>
                    <div className='modal-overlay-form-button'>
                    <button type="button" className="modal-button" onClick={handleUpdate} disabled={modalLoading}>
                      {modalLoading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button type="button" className="modal-button cancel-button" onClick={closeModal}>
                      Отмена
                    </button>
                    </div>
                    </>
                    )}
                  </form>
                ) : (
                  <>
                    <p>Вы уверены, что хотите удалить эту квартиру?</p>
                    {modalLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <>
                        <button className="modal-button" onClick={handleDelete}>Да</button>
                        <button className="modal-button cancel-button" onClick={closeModal}>Отмена</button>
                      </>
                    )}
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
