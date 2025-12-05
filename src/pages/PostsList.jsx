import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/posts")
      .then((response) => {
        // IMPORTANT : lire la clé "data"
        setPosts(response.data.data);
      })
      .catch((error) => {
        console.error("Erreur API :", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-lg">Chargement…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 p-3 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold text-center mb-3" style={{ color: 'var(--primary-color)' }}>
        Liste des Articles
      </h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">Aucun article disponible…</p>
      ) : (
        <table className="posts-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <strong>{post.titre}</strong>
                </td>
                <td>
                  {post.description && post.description.length > 100
                    ? `${post.description.substring(0, 100)}...`
                    : post.description ?? "Aucune description"
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
