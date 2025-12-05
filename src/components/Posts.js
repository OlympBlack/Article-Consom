import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/posts')
      .then(res => {
        console.log("Réponse API :", res.data);
        setPosts(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur API :", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h1>Liste des Articles</h1>
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="text-gray">
              {posts.length > 0 ? `${posts.length} article${posts.length > 1 ? 's' : ''} trouvé${posts.length > 1 ? 's' : ''}` : 'Aucun article trouvé'}
            </p>
            <Link className="btn btn-primary btn-lg" to="/create">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Ajouter un article
            </Link>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner"></div>
              <p className="mt-3 text-gray">Chargement des articles...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h2 className="empty-state-title">Aucun article disponible</h2>
              <p className="empty-state-text">
                Commencez par créer votre premier article pour voir apparaître du contenu ici.
              </p>
              <Link className="btn btn-primary" to="/create">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Créer le premier article
              </Link>
            </div>
          ) : (
            <table className="posts-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr key={post.id} style={{ animationDelay: `${index * 0.05}s` }}>
                    <td>
                      <strong>{post.titre}</strong>
                    </td>
                    <td>
                      {post.description.length > 80
                        ? `${post.description.substring(0, 80)}...`
                        : post.description || "Aucune description"
                      }
                    </td>
                    <td>
                      <span className="post-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {new Date().toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td>
                      <div className="post-actions-table">
                        <Link className="btn btn-success btn-sm" to={`/edit/${post.id}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                        <Link className="btn btn-danger btn-sm" to={`/delete/${post.id}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2"/>
                            <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Posts;
