"use client"

import React from "react"
import type { RecipeCommentResponse } from "../../types/recipe.types"
import type { Recipe } from "../../types/recipe.types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Avatar } from "../ui/avatar"
import { Send } from "lucide-react"

interface CommentDialogProps {
  recipe: Recipe
  comments: RecipeCommentResponse[]
  newComment: string
  onNewCommentChange: (value: string) => void
  onAddComment: () => void
  isOpen: boolean
  onClose: () => void
  formatDate: (dateString: string) => string
}

const CommentDialog = ({
  recipe,
  comments,
  newComment,
  onNewCommentChange,
  onAddComment,
  isOpen,
  onClose,
  formatDate,
}: CommentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Commentaires</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">{recipe.title}</p>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <span className="font-medium">
                {/* Display first letter of logged-in user's name */}
                {recipe.user?.name?.charAt(0) || "U"}
              </span>
            </Avatar>
            
            <div className="flex-1 flex items-center space-x-2">
              <Input
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => onNewCommentChange(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={onAddComment}
                disabled={!newComment.trim()}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Publier</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun commentaire pour le moment
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <span className="font-medium">
                      {comment.user.username.charAt(0)}
                    </span>
                  </Avatar>
                  <div>
                    <span className="font-medium">{comment.user.username}</span>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                
                <p className="pl-10 text-gray-700">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
