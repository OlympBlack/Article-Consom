import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';

const EditPost = () => {
  const { id } = useParams();
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [originalPost, setOriginalPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get('/posts');
        const post = res.data.data.find(p => p.id === Number(id));
        
        if (post) {
          setTitre(post.titre);
          setDescription(post.description);
          setOriginalPost(post);
        } else {
          setErrors({ fetch: 'Article non trouvé' });
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setErrors({ fetch: 'Une erreur est survenue lors du chargement de l\'article' });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (originalPost) {
      const changed = originalPost.titre !== titre || originalPost.description !== description;
      setHasChanges(changed);
    }
  }, [titre, description, originalPost]);

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

    if (!hasChanges) {
      navigate('/');
      return;
    }

    setSaving(true);

    try {
      await api.put(`/posts/edit/${id}`, { titre, description });
      navigate('/');
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setErrors({ submit: 'Une erreur est survenue lors de la modification de l\'article' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleReset = () => {
    if (originalPost) {
      setTitre(originalPost.titre);
      setDescription(originalPost.description);
      setErrors({});
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="card">
            <div className="text-center">
              <div className="spinner"></div>
              <p className="mt-3 text-gray">Chargement de l'article...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (errors.fetch) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">😕</div>
              <h2 className="empty-state-title">Article non trouvé</h2>
              <p className="empty-state-text">{errors.fetch}</p>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1>Modifier l'Article</h1>
            <p className="text-gray">Mettez à jour votre contenu</p>
            {hasChanges && (
              <div className="changes-indicator">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Modifications non enregistrées
              </div>
            )}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Annuler
              </button>
              
              {hasChanges && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleReset}
                  disabled={saving}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="23,4 23,10 17,10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M20.49 15C19.79 15.64 19 16.19 18.14 16.63C16.48 17.48 14.62 18 12.66 18C7.85 18 3.92 14.28 3.01 9.5C2.45 6.73 3.05 4.09 4.36 2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3.51 9C4.21 8.36 5 7.81 5.86 7.37C7.52 6.52 9.38 6 11.34 6C16.15 6 20.08 9.72 20.99 14.5C21.55 17.27 20.95 19.91 19.64 22" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Réinitialiser
                </button>
              )}
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || !hasChanges}
              >
                {saving ? (
                  <>
                    <div className="spinner-sm"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Enregistrer les modifications
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

export default EditPost;
