import React, { useState } from 'react';
import { addComplex } from '../api';
import { uploadFile } from '../firebaseStorage';
import defaultPhoto from './default-img.png';
import './AddComplex.css';
import NotificationList from './NotificationList'; // Импортируем компонент NotificationList

const AddComplex = () => {
  const [complex, setComplex] = useState({
    name: '',
    location: '',
    finishing: '',
    landscaping: '',
    architecture: '',
    infrastructure: '',
    ecology: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(defaultPhoto);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]); // Состояние для уведомлений

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplex(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!complex.name) {
      setNotifications(prev => [...prev, { id: Date.now(), message: 'Название жилого комплекса обязательно для заполнения', type: 'error' }]);
      return; // Прекращаем выполнение, если поле не заполнено
    }
    
    setIsLoading(true);
    let photoUrl = null;
    try {
      if (file) {
        photoUrl = await uploadFile(file);
      }
      
      await addComplex({ ...complex, photo: photoUrl });

      // Добавляем уведомление о успешном добавлении
      setNotifications(prev => [...prev, { id: Date.now(), message: 'Жилой комплекс добавлен!', type: 'success' }]);

      // Очищаем форму
      setComplex({
        name: '',
        location: '',
        finishing: '',
        landscaping: '',
        architecture: '',
        infrastructure: '',
        ecology: ''
      });
      setFile(null);
      setPreview(defaultPhoto);
    } catch (error) {
      // Добавляем уведомление о неудаче
      setNotifications(prev => [...prev, { id: Date.now(), message: 'Ошибка при добавлении комплекса', type: 'error' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NotificationList notifications={notifications} setNotifications={setNotifications} />
      <form onSubmit={handleSubmit} className='addcmx-form'>
        <div className='addcmx-img'>
          <img src={preview} alt="Preview" />
        </div>
        <div className='addcmx-form-group'>
          <div className='grid textarea'>
            <input 
              name="name" 
              type="text" 
              placeholder="Название жилого комплекса" 
              value={complex.name} 
              onChange={handleChange} 
              required // Обязательно для заполнения
            />
            <div className="file-input-container">
              <input id="file" name="photo" type="file" onChange={handleFileChange} />
              <label htmlFor="file" className="custom-file-upload">
                Выбрать фото
              </label>
            </div>
          </div>
          <div className='textarea'>
            <textarea name="location" placeholder="Расположение" value={complex.location} onChange={handleChange} />
            <textarea name="finishing" placeholder="Отделка" value={complex.finishing} onChange={handleChange} />
            <textarea name="landscaping" placeholder="Благоустройство" value={complex.landscaping} onChange={handleChange} />
            <textarea name="architecture" placeholder="Архитектура" value={complex.architecture} onChange={handleChange} />
            <textarea name="infrastructure" placeholder="Инфраструктура" value={complex.infrastructure} onChange={handleChange} />
            <textarea name="ecology" placeholder="Экология" value={complex.ecology} onChange={handleChange} />
          </div>
          <button type="submit" className='add-btn' disabled={isLoading}>
            {isLoading ? <span className="loader"></span> : 'Добавить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComplex;
