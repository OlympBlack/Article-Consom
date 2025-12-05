import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';

const DeletePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get('/posts');
        const foundPost = res.data.data.find(p => p.id === Number(id));
        
        if (foundPost) {
          setPost(foundPost);
          setTimeout(() => setShowConfirmation(true), 500);
        } else {
          setError('Article non trouvé');
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Une erreur est survenue lors du chargement de l\'article');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    
    try {
      await api.delete(`/post/${id}`);
      // Animation de succès avant la redirection
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Une erreur est survenue lors de la suppression de l\'article');
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
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

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">😕</div>
              <h2 className="empty-state-title">Article non trouvé</h2>
              <p className="empty-state-text">{error || 'L\'article que vous essayez de supprimer n\'existe pas.'}</p>
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
          <div className={`delete-confirmation ${showConfirmation ? 'show' : ''}`}>
            <div className="delete-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1>Supprimer l'Article</h1>
            <p className="text-gray">Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.</p>
            
            <div className="post-preview">
              <h3>{post.titre}</h3>
              <p>
                {post.description.length > 150 
                  ? `${post.description.substring(0, 150)}...` 
                  : post.description
                }
              </p>
            </div>
            
            {deleting ? (
              <div className="deleting-animation">
                <div className="spinner"></div>
                <p className="mt-3">Suppression en cours...</p>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            ) : (
              <div className="confirmation-actions">
                <button
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={deleting}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Annuler
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2"/>
                    <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2"/>
                    <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2"/>
                    <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Oui, supprimer définitivement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletePost;
