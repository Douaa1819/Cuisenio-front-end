import { useState } from "react";
import client from "../api/client";

export interface Comment {
  id: number;
  content: string;
  creationDate: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments for a specific recipe
  const fetchComments = async (recipeId: number) => {
    setLoading(true);
    try {
      const response = await client.get<Comment[]>(`/api/recipes/${recipeId}/comments`);
      setComments(response.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des commentaires");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a comment to a recipe
  const handleAddComment = async (recipeId: number) => {
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const response = await client.post<Comment>(`/api/recipes/${recipeId}/comments`, { 
        content: newComment 
      });
      
      setComments((prev) => [...prev, response.data]);
      setNewComment(""); // Clear comment field after successful submission
      setError(null);
    } catch (err) {
      setError("Erreur lors de l'ajout du commentaire");
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    comments, 
    newComment, 
    setNewComment, 
    handleAddComment, 
    fetchComments, 
    loading, 
    error 
  };
};