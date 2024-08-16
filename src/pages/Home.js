import React, { useState, useEffect } from 'react';
import { fetchApartments, fetchComplexes } from '../api';
import Filters from '../components/Filters';
import ApartmentCard from '../components/ApartmentCard';
import './Home.css';

const Home = () => {
  const [apartments, setApartments] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [complexMap, setComplexMap] = useState({});
  const [loading, setLoading] = useState(true); // состояние загрузки

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // показываем загрузку перед началом запроса данных

      try {
        const allComplexes = await fetchComplexes();
        setComplexes(allComplexes);

        const complexMap = allComplexes.reduce((map, complex) => {
          map[complex.id] = complex.name;
          return map;
        }, {});
        setComplexMap(complexMap);

        const allApartments = await fetchApartments({});
        setApartments(allApartments);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false); // отключаем загрузку после завершения запроса
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = async (filters) => {
    setLoading(true); // показываем загрузку при изменении фильтров

    try {
      const filteredApartments = await fetchApartments(filters);
      setApartments(filteredApartments);
    } catch (error) {
      console.error("Ошибка применения фильтров:", error);
    } finally {
      setLoading(false); // отключаем загрузку после применения фильтров
    }
  };

  return (
    <div className="home-container container">
      <h3 className='head-title'>Выбор квартиры</h3>
      <Filters onFilterChange={handleFilterChange} complexes={complexes} />

      {loading ? (
        <div className="apartment-container-spinner">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="apartment-cards-container">
          {apartments.length > 0 ? (
            apartments.map(apartment => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                complexName={complexMap[apartment.complexId] || 'Неизвестно'}
              />
            ))
          ) : (
            <p>Нет доступных квартир</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
