import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const CreatePost = () => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    } else if (titre.length < 3) {
      newErrors.titre = 'Le titre doit contenir au moins 3 caractères';
    }
    
    if (!description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await api.post('/posts/create', { titre, description });
      navigate('/');
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setErrors({ submit: 'Une erreur est survenue lors de la création de l\'article' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1>Créer un Nouvel Article</h1>
            <p className="text-gray">Partagez vos idées avec le monde</p>
          </div>

          <form onSubmit={handleSubmit} className="post-form">
            {errors.submit && (
              <div className="alert alert-danger">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {errors.submit}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="titre" className="form-label">
                Titre de l'article
                <span className="required">*</span>
              </label>
              <input
                id="titre"
                type="text"
                className={`form-control ${errors.titre ? 'is-invalid' : ''}`}
                placeholder="Entrez un titre accrocheur..."
                value={titre}
                onChange={(e) => {
                  setTitre(e.target.value);
                  if (errors.titre) {
                    setErrors({ ...errors, titre: '' });
                  }
                }}
                disabled={loading}
              />
              {errors.titre && (
                <div className="invalid-feedback">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {errors.titre}
                </div>
              )}
              <small className="form-text text-muted">
                {titre.length}/100 caractères
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
                <span className="required">*</span>
              </label>
              <textarea
                id="description"
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                placeholder="Décrivez votre article en détail..."
                rows="8"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors({ ...errors, description: '' });
                  }
                }}
                disabled={loading}
              />
              {errors.description && (
                <div className="invalid-feedback">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  {errors.description}
                </div>
              )}
              <small className="form-text text-muted">
                {description.length}/1000 caractères
              </small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-sm"></div>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Créer l'article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
