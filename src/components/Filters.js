import React, { useState } from 'react';
import Select from 'react-select';
import './Filters.css';

const Filters = ({ onFilterChange, complexes }) => {
  const [filters, setFilters] = useState({
    complex: '',
    rooms: [],
    priceFrom: '',
    priceTo: '',
    area: '',
    type: 'Квартира' // Default property type
  });

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : '';

    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [name]: value };

      onFilterChange({
        complex: newFilters.complex,
        rooms: Array.isArray(newFilters.rooms) ? newFilters.rooms : [],
        priceFrom: newFilters.priceFrom ? Number(newFilters.priceFrom) : '',
        priceTo: newFilters.priceTo ? Number(newFilters.priceTo) : '',
        area: newFilters.area ? Number(newFilters.area) : '',
        type: newFilters.type
      });

      return newFilters;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [name]: value };

      onFilterChange({
        complex: newFilters.complex,
        rooms: Array.isArray(newFilters.rooms) ? newFilters.rooms : [],
        priceFrom: newFilters.priceFrom ? Number(newFilters.priceFrom) : '',
        priceTo: newFilters.priceTo ? Number(newFilters.priceTo) : '',
        area: newFilters.area ? Number(newFilters.area) : '',
        type: newFilters.type
      });

      return newFilters;
    });
  };

  const handleRoomChange = (room) => {
    setFilters(prevFilters => {
      const newRooms = prevFilters.rooms.includes(room)
        ? prevFilters.rooms.filter(r => r !== room)
        : [...prevFilters.rooms, room];

      const newFilters = { ...prevFilters, rooms: newRooms };

      onFilterChange(newFilters);

      return newFilters;
    });
  };

  const handleReset = () => {
    setFilters({
      complex: '',
      rooms: [],
      priceFrom: '',
      priceTo: '',
      area: '',
      type: 'Квартира' // Reset to default type
    });

    onFilterChange({
      complex: '',
      rooms: [],
      priceFrom: '',
      priceTo: '',
      area: '',
      type: 'Квартира' // Reset to default type
    });
  };

  const roomOptions = [1, 2, 3, 4];
  const propertyTypes = [
    { value: 'Квартира', label: 'Квартира' },
    { value: 'Пентхаус', label: 'Пентхаус' },
    { value: 'Коммерческое помещение', label: 'Коммерческое помещение' },
    { value: 'Коттедж', label: 'Коттедж' },
    { value: 'Парковка', label: 'Парковка' }
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      padding: '0.09rem',
      marginTop: '0.35rem',
      borderRadius: '4px',
      backgroundColor: '#f5f5f5',
      color: '#000',
      borderColor: 'rgba(0, 0, 0, 0.09)',
      fontSize: '0.875rem',
      '&:hover': { borderColor: 'rgba(0, 0, 0, 0.09)' }
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '0.875rem',
      backgroundColor: state.isFocused ? 'none' : 'white',
      color: '#000',
      '&:hover': { backgroundColor: 'none' }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#000',
      fontSize: '0.875rem'
    }),
  };

  return (
    <form className="filters-form">
      <div className='form-group1'>
        <div className="form-group">
          <Select
            name="complex"
            id="complex"
            options={complexes.map(complex => ({ value: complex.id, label: complex.name }))}
            onChange={handleSelectChange}
            styles={customStyles}
            placeholder="Выберите жилой комплекс"
          />
        </div>
        <div className="form-group">
          <div className="room-options">
            {roomOptions.map(room => (
              <label key={room} className={`room-option ${filters.rooms.includes(room) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  name="rooms"
                  value={room}
                  checked={filters.rooms.includes(room)}
                  onChange={() => handleRoomChange(room)}
                />
                {room}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group form-control-price">
          <input name="priceFrom" type="number" id="priceFrom" className="form-control" placeholder="Цена от" value={filters.priceFrom} onChange={handleInputChange} />
        </div>
        <div className="form-group form-control-price">
          <input name="priceTo" type="number" id="priceTo" className="form-control" placeholder="Цена до" value={filters.priceTo} onChange={handleInputChange} />
        </div>
      </div>
      <div className='form-group2'>
        <div className="form-group">
          <input name="area" type="number" id="area" className="form-control" placeholder="Площадь" value={filters.area} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <Select
            name="type"
            id="type"
            options={propertyTypes}
            onChange={handleSelectChange}
            styles={customStyles}
            value={propertyTypes.find(option => option.value === filters.type)}
          />
        </div>
        <div className='form-group-btn'>
          <button type="button" onClick={handleReset} className="reset-button">Сбросить</button>
        </div>
      </div>
    </form>
  );
};

export default Filters;
