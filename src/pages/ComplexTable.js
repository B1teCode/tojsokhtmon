import React, { useState, useEffect } from 'react';
import { fetchComplexes, deleteComplex, updateComplex } from '../api'; // Не забудьте добавить updateComplex
import './ComplexTable.css';

const ComplexTable = () => {
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Состояние для модального окна редактирования
  const [modalComplexId, setModalComplexId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [editComplexData, setEditComplexData] = useState({}); // Данные для редактирования комплекса

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
      setModalLoading(true);
      try {
        await deleteComplex(modalComplexId);
        setComplexes(complexes.filter(complex => complex.id !== modalComplexId));
      } catch (error) {
        console.error('Ошибка при удалении комплекса:', error);
      } finally {
        setModalLoading(false);
        setModalComplexId(null);
        setShowDeleteModal(false);
      }
    }
  };

  const openDeleteModal = (complexId) => {
    setModalComplexId(complexId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setModalComplexId(null);
  };

  const openEditModal = (complex) => {
    setEditComplexData(complex);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditComplexData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditComplexData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEditSave = async () => {
    setModalLoading(true);
    try {
      await updateComplex(editComplexData.id, editComplexData);
      setComplexes(complexes.map(complex =>
        complex.id === editComplexData.id ? editComplexData : complex
      ));
    } catch (error) {
      console.error('Ошибка при редактировании комплекса:', error);
    } finally {
      setModalLoading(false);
      closeEditModal();
    }
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
                  <td className='teble-dey'>
                    <button
                      className={`delete-button ${deletingId === complex.id ? 'loading' : ''}`}
                      onClick={() => openDeleteModal(complex.id)}
                      disabled={deletingId === complex.id}
                    >
                      {deletingId === complex.id ? 'Удаление...' : 'Удалить'}
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => openEditModal(complex)}
                    >
                      Изменить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Модальное окно для подтверждения удаления */}
          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Подтверждение удаления</h2>
                <p>Вы уверены, что хотите удалить этот комплекс и связанные с ним квартиры?</p>
                {modalLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <button className="modal-button" onClick={handleDelete}>Да</button>
                    <button className="modal-button" onClick={closeDeleteModal}>Отмена</button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Модальное окно для редактирования комплекса */}
          {showEditModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Редактирование комплекса</h2>
                <form className='modal-overlay-form'>
                  <label>Название
                  <input
                    type="text"
                    name="name"
                    value={editComplexData.name || ''}
                    onChange={handleEditChange}
                  />
                  </label>
                  <label>Расположение
                  <input
                    type="text"
                    name="location"
                    value={editComplexData.location || ''}
                    onChange={handleEditChange}
                  />
                  </label>
                  <label>Отделка
                  <input
                    type="text"
                    name="finishing"
                    value={editComplexData.finishing || ''}
                    onChange={handleEditChange}
                  />
                  </label>
                  <label>Благоустройство
                  <input
                    type="text"
                    name="landscaping"
                    value={editComplexData.landscaping || ''}
                    onChange={handleEditChange}
                  />
                  </label>
                  <label>Архитектура
                  <input
                    type="text"
                    name="architecture"
                    value={editComplexData.architecture || ''}
                    onChange={handleEditChange}
                  />
                  </label>
                  <label>Инфраструктура
                  <input
                    type="text"
                    name="infrastructure"
                    value={editComplexData.infrastructure || ''}
                    onChange={handleEditChange}
                  />
                  </label>
                  <label>Экология
                  <input
                    type="text"
                    name="ecology"
                    value={editComplexData.ecology || ''}
                    onChange={handleEditChange}
                  />
                  </label>
                  {/* Добавьте остальные поля аналогичным образом */}
                  <div className="modal-buttons">
                    {modalLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <>
                      <div className='modal-overlay-form-button'>
                        <button type="button" className="modal-button" onClick={handleEditSave}>Сохранить</button>
                        <button type="button" className="modal-button" onClick={closeEditModal}>Отмена</button>
                      </div>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ComplexTable;
