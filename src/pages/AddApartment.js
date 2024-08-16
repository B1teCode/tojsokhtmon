import React, { useState, useEffect } from 'react';
import { fetchComplexes, addApartment } from '../api';
import { uploadFile } from '../firebaseStorage';
import defaultPhoto from './default-img.png';
import './AddApartment.css';
import './AddComplex.css';
import NotificationList from './NotificationList';
import Select from 'react-select';

const AddApartment = () => {
  const [complexes, setComplexes] = useState([]);
  const [apartment, setApartment] = useState({
    type: 'Квартира', // Значение по умолчанию
    complexId: '',
    rooms: '',
    area: '',
    district: '',
    price: '',
    finishing: '',
    floor: '',
    building: '',
    entrance: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(defaultPhoto);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchComplexes().then(setComplexes);
  }, []);

  const handleChange = (e) => {
    setApartment({ ...apartment, type: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(defaultPhoto);
    }
  };

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!apartment.rooms && apartment.type === 'Квартира') {
      addNotification('Количество комнат обязательно для заполнения', 'error');
      return;
    }

    setIsLoading(true);

    let photoUrl = preview;
    try {
      if (file) {
        photoUrl = await uploadFile(file, 'apartments');
      }

      const apartmentData = {
        ...apartment,
        rooms: apartment.rooms ? Number(apartment.rooms) : '',
        area: apartment.area ? Number(apartment.area) : '',
        price: apartment.price ? Number(apartment.price) : '',
        floor: apartment.floor ? Number(apartment.floor) : '',
        createdAt: new Date().toISOString(),
      };

      if (file) {
        apartmentData.photo = photoUrl;
      }

      await addApartment(apartmentData);
      addNotification('Недвижимость добавлена!', 'success');
    } catch (error) {
      addNotification('Ошибка при добавлении недвижимости', 'error');
    } finally {
      setIsLoading(false);
      setApartment({
        type: 'Квартира',
        complexId: '',
        rooms: '',
        area: '',
        district: '',
        price: '',
        finishing: '',
        floor: '',
        building: '',
        entrance: ''
      });
      setFile(null);
      setPreview(defaultPhoto);
    }
  };

  const renderFormFields = () => {
    switch (apartment.type) {
      case 'Квартира':
        return (
          <>
            <input name="rooms" type="number" placeholder="Количество комнат" value={apartment.rooms} onChange={(e) => setApartment({ ...apartment, rooms: e.target.value })} />
            <input name="area" type="number" placeholder="Площадь" value={apartment.area} onChange={(e) => setApartment({ ...apartment, area: e.target.value })} />
            <input name="district" type="text" placeholder="Район" value={apartment.district} onChange={(e) => setApartment({ ...apartment, district: e.target.value })} />
            <input name="price" type="number" placeholder="Цена" value={apartment.price} onChange={(e) => setApartment({ ...apartment, price: e.target.value })} />
            <input name="floor" type="number" placeholder="Этаж" value={apartment.floor} onChange={(e) => setApartment({ ...apartment, floor: e.target.value })} />
            <input name="building" type="text" placeholder="Корпус" value={apartment.building} onChange={(e) => setApartment({ ...apartment, building: e.target.value })} />
            <input name="entrance" type="text" placeholder="Подъезд" value={apartment.entrance} onChange={(e) => setApartment({ ...apartment, entrance: e.target.value })} />
            <textarea name="finishing" placeholder="Отделка" value={apartment.finishing} onChange={(e) => setApartment({ ...apartment, finishing: e.target.value })} />
          </>
        );
      case 'Коммерческое помещение':
        return (
          <>
            <input name="price" type="number" placeholder="Цена" value={apartment.price} onChange={(e) => setApartment({ ...apartment, price: e.target.value })} />
            <input name="district" type="text" placeholder="Район" value={apartment.district} onChange={(e) => setApartment({ ...apartment, district: e.target.value })} />
            <input name="floor" type="number" placeholder="Этаж" value={apartment.floor} onChange={(e) => setApartment({ ...apartment, floor: e.target.value })} />
            <input name="area" type="number" placeholder="Площадь" value={apartment.area} onChange={(e) => setApartment({ ...apartment, area: e.target.value })} />
          </>
        );
      case 'Пентхаус':
        return (
          <>
            <input name="price" type="number" placeholder="Цена" value={apartment.price} onChange={(e) => setApartment({ ...apartment, price: e.target.value })} />
            <input name="district" type="text" placeholder="Район" value={apartment.district} onChange={(e) => setApartment({ ...apartment, district: e.target.value })} />
            <textarea name="finishing" placeholder="Отделка" value={apartment.finishing} onChange={(e) => setApartment({ ...apartment, finishing: e.target.value })} />
            <input name="floor" type="number" placeholder="Этаж" value={apartment.floor} onChange={(e) => setApartment({ ...apartment, floor: e.target.value })} />
            <input name="building" type="text" placeholder="Корпус" value={apartment.building} onChange={(e) => setApartment({ ...apartment, building: e.target.value })} />
            <input name="entrance" type="text" placeholder="Подъезд" value={apartment.entrance} onChange={(e) => setApartment({ ...apartment, entrance: e.target.value })} />
            <input name="area" type="number" placeholder="Площадь" value={apartment.area} onChange={(e) => setApartment({ ...apartment, area: e.target.value })} />
          </>
        );
      case 'Коттедж':
        return (
          <>
            <input name="price" type="number" placeholder="Цена" value={apartment.price} onChange={(e) => setApartment({ ...apartment, price: e.target.value })} />
            <input name="area" type="number" placeholder="Площадь (соток)" value={apartment.area} onChange={(e) => setApartment({ ...apartment, area: e.target.value })} />
            <input name="district" type="text" placeholder="Район" value={apartment.district} onChange={(e) => setApartment({ ...apartment, district: e.target.value })} />
            <textarea name="finishing" placeholder="Отделка" value={apartment.finishing} onChange={(e) => setApartment({ ...apartment, finishing: e.target.value })} />
            <input name="floor" type="number" placeholder="Этаж" value={apartment.floor} onChange={(e) => setApartment({ ...apartment, floor: e.target.value })} />
          </>
        );
      case 'Парковка':
        return (
          <>
            <input name="price" type="number" placeholder="Цена" value={apartment.price} onChange={(e) => setApartment({ ...apartment, price: e.target.value })} />
            <input name="district" type="text" placeholder="Район" value={apartment.district} onChange={(e) => setApartment({ ...apartment, district: e.target.value })} />
            <input name="floor" type="number" placeholder="Этаж" value={apartment.floor} onChange={(e) => setApartment({ ...apartment, floor: e.target.value })} />
            <input name="area" type="number" placeholder="Площадь" value={apartment.area} onChange={(e) => setApartment({ ...apartment, area: e.target.value })} />
          </>
        );
      default:
        return null;
    }
  };

  const complexOptions = complexes.map(complex => ({
    value: complex.id,
    label: complex.name,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      padding: '0.09rem',
      borderRadius: '4px',
      backgroundColor: '#f5f5f5',
      color: '#000',
      borderColor: 'rgba(0, 0, 0, 0.09)',
      fontSize: '0.875rem', // Уменьшаем размер шрифта
      '&:hover': { borderColor: 'rgba(0, 0, 0, 0.09)' } // Удаляем эффект при наведении
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '0.875rem', // Уменьшаем размер шрифта для опций
      backgroundColor: state.isFocused ? 'none' : 'white', // Убираем фон при наведении
      color: '#000', // Цвет текста
      '&:hover': { backgroundColor: 'none' } // Убираем эффект при наведении
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#000',
      fontSize: '0.875rem' // Уменьшаем размер шрифта для плейсхолдера
    }),
  };

  return (
    <div>
      <NotificationList notifications={notifications} setNotifications={setNotifications} />

      <form onSubmit={handleSubmit} className='addcmx-form'>
        <div className='addcmx-img'>
          <img src={preview} alt="Preview" />
        </div>

        <div className='addcmx-form-group'>
          <div className='addcmx-header'>
            <h3 className='addcmx-h3'>Добавить недвижимость</h3>
            <div className='addcmx-type'>
              <label className={apartment.type === 'Квартира' ? 'selected' : ''}>
                <input type="checkbox" name="type" value="Квартира" checked={apartment.type === 'Квартира'} onChange={handleChange} />
                <span>Квартира</span>
              </label>
              <label className={apartment.type === 'Коммерческое помещение' ? 'selected' : ''}>
                <input type="checkbox" name="type" value="Коммерческое помещение" checked={apartment.type === 'Коммерческое помещение'} onChange={handleChange} />
                <span>Коммерческое помещение</span>
              </label>
              <label className={apartment.type === 'Пентхаус' ? 'selected' : ''}>
                <input type="checkbox" name="type" value="Пентхаус" checked={apartment.type === 'Пентхаус'} onChange={handleChange} />
                <span>Пентхаус</span>
              </label>
              <label className={apartment.type === 'Коттедж' ? 'selected' : ''}>
                <input type="checkbox" name="type" value="Коттедж" checked={apartment.type === 'Коттедж'} onChange={handleChange} />
                <span>Коттедж</span>
              </label>
              <label className={apartment.type === 'Парковка' ? 'selected' : ''}>
                <input type="checkbox" name="type" value="Парковка" checked={apartment.type === 'Парковка'} onChange={handleChange} />
                <span>Парковка</span>
              </label>
            </div>
          </div>
          <div className='grid g2'>
            <Select
              options={complexOptions}
              styles={customStyles}
              className='Select'
              // placeholder="Выберите жилой комплекс"
              value={complexOptions.find(option => option.value === apartment.complexId)}
              onChange={(selectedOption) => setApartment({ ...apartment, complexId: selectedOption ? selectedOption.value : '' })}
            />
            <div className="file-input-container fic2">
              <input id="file" name="photo" type="file" onChange={handleFileChange} />
              <label htmlFor="file" className="custom-file-upload cfu2">
                Выбрать фото
              </label>
            </div>
          </div>
          <div className='textarea'>
            {renderFormFields()}
          </div>
          <button type="submit" className='add-btn' disabled={isLoading}>
            {isLoading ? (
              <span className="loader"></span>
            ) : "Добавить"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddApartment;
