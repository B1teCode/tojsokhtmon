import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com'; // Импортируем EmailJS
import './ModalForm.css';

const ModalForm = ({ apartment, complexName, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    // Загрузка данных из localStorage при монтировании компонента
    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('userFormData'));
        if (savedData) {
            setFormData(savedData);
        }
    }, []);

    // Обновление localStorage при изменении данных формы
    useEffect(() => {
        localStorage.setItem('userFormData', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const emailData = {
            from_name: formData.name,
            phone_number: formData.phone,
            type: apartment.type,
            rooms: apartment.rooms,
            area: apartment.area,
            price: apartment.price,
            complex: complexName,
            district: apartment.district,
            floor: apartment.floor,
            building: apartment.building,
            entrance: apartment.entrance,
            photo: apartment.photo
        };

        emailjs.send('service_i8mziih', 'template_l5hf2vn', emailData, '2ydOAJrC2o4RGpeOf')
            .then(() => {
                setIsSent(true);
            })
            .catch((error) => {
                console.error("Ошибка при отправке:", error);
                alert("Не удалось отправить письмо. Проверьте консоль для подробностей.");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                {!isSent ? (
                    <>
                        <h2>Заказать звонок</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="ФИО"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className='form-control'
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Номер телефона"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className='form-control'
                            />
                            {isLoading ? (
                                <div className="loading-spinner"></div>
                            ) : (
                                <>
                                    <button type="submit" className="modal-button modalfrom-btn">
                                        Отправить
                                    </button>
                                    <button className="modal-button modalfrom-btn" onClick={onClose}>
                                        Закрыть
                                    </button>
                                </>
                            )}
                        </form>
                    </>
                ) : (
                    <>
                    <p>Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.</p>
                    <button className="modal-button modalfrom-btn" onClick={onClose}>
                        Закрыть
                    </button>
                    </>
                )}

            </div>
        </div>
    );
};

export default ModalForm;
