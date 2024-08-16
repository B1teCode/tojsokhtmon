// src/components/ComplexTable.js
import React, { useState, useEffect } from 'react';
import { fetchComplexes, deleteComplex } from '../api';
import './ComplexTable.css';

const ComplexTable = () => {
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // ID комплекса, который удаляется
  const [showModal, setShowModal] = useState(false); // Состояние показа модального окна
  const [modalComplexId, setModalComplexId] = useState(null); // ID комплекса для удаления
  const [modalLoading, setModalLoading] = useState(false); // Состояние загрузки в модальном окне

  useEffect(() => {
    const loadComplexes = async () => {
      setLoading(true);
      try {
        const complexesData = await fetchComplexes();
        setComplexes(complexesData);
      } catch (error) {
        console.error('Ошибка загрузки комплексов:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComplexes();
  }, []);

  const handleDelete = async () => {
    if (modalComplexId) {
      setModalLoading(true); // Показываем индикатор загрузки
      try {
        await deleteComplex(modalComplexId);
        setComplexes(complexes.filter(complex => complex.id !== modalComplexId));
      } catch (error) {
        console.error('Ошибка при удалении комплекса:', error);
      } finally {
        setModalLoading(false); // Скрываем индикатор загрузки
        setDeletingId(null);
        setModalComplexId(null);
        setShowModal(false);
      }
    }
  };

  const openModal = (complexId) => {
    setModalComplexId(complexId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalComplexId(null);
  };

  return (
    <div className="complex-table-container">
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <table className="complex-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Расположение</th>
                <th>Отделка</th>
                <th>Благоустройство</th>
                <th>Архитектура</th>
                <th>Инфраструктура</th>
                <th>Экология</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {complexes.map(complex => (
                <tr key={complex.id}>
                  <td>{complex.name}</td>
                  <td>{complex.location}</td>
                  <td>{complex.finishing}</td>
                  <td>{complex.landscaping}</td>
                  <td>{complex.architecture}</td>
                  <td>{complex.infrastructure}</td>
                  <td>{complex.ecology}</td>
                  <td>
                    <button
                      className={`delete-button ${deletingId === complex.id ? 'loading' : ''}`}
                      onClick={() => openModal(complex.id)}
                      disabled={deletingId === complex.id} // Отключаем кнопку при удалении
                    >
                      {deletingId === complex.id ? 'Удаление...' : 'Удалить'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Подтверждение удаления</h2>
                <p>Вы уверены, что хотите удалить этот комплекс и связанные с ним квартиры?</p>
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

export default ComplexTable;
