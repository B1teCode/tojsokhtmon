import React, { useState } from 'react';
import './ApartmentCard.css';
import 'boxicons';
import ModalForm from './ModalForm'; // Импортируем компонент ModalForm

const ApartmentCard = ({ apartment, complexName }) => {
  const [showMore, setShowMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна

  const handleToggle = () => {
    setShowMore(!showMore);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ru-RU') + ' сом.';
  };

  const renderAdditionalInfo = () => {
    const fields = {
      'Комплекс': complexName,
      'Район': apartment.district,
      'Отделка': apartment.finishing,
      'Этаж': apartment.floor,
      'Корпус': apartment.building,
      'Подъезд': apartment.entrance,
    };

    return (
      <table>
        <tbody>
          {Object.entries(fields).map(([key, value]) => 
            value ? (
              <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    );
  };

  const getTitle = () => {
    if (apartment.type === 'Квартира') {
      return `${apartment.rooms}-комнатная`;
    }
    return apartment.type;
  };
  const getArea = () => {
    if (apartment.type === 'Коттедж') {
      return `${apartment.area}-соток`;
    }
    else{
      return `${apartment.area}м²`;
    }
  };

  return (
    <div className="apartment-card">
      <div className='header-card'>
        <k>
          <h3>{getTitle()}</h3>
          <p>{getArea()} </p>
        </k>
        <p className='zhk'>{complexName}</p>
      </div>
      <div className='apr-img'>
        <img src={apartment.photo} alt={`Квартира ${apartment.rooms} комнат`} />
      </div>
      <p className='card-price'>Цена: {formatPrice(apartment.price)}</p>
      
      <div className={`additional-info ${showMore ? 'show' : ''}`}>
        {renderAdditionalInfo()}
      </div>
      <div className='card-btn'>
        <button className='btn-sibmin' onClick={openModal}>
          <span><box-icon name='phone-call' color='#10554B'></box-icon></span>
          Заказать звонок
        </button>
        <button onClick={handleToggle} className="show-more-button">
          {showMore ? <box-icon name='chevron-up' color='#DEE8E1'></box-icon> : <box-icon name='chevron-down' color='#DEE8E1'></box-icon>}
        </button>
      </div>

      {isModalOpen && (
        <ModalForm apartment={apartment} complexName={complexName} onClose={closeModal} />
      )}
    </div>
  );
};

export default ApartmentCard;
