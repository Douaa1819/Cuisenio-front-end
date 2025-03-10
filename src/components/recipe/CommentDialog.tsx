// "use client"

// import type { Comment } from "../../types/recipe.types"
// import type { Recipe } from "../../types/recipe.types"
// import { Dialog } from "../ui/dialog"
// import { Input } from "../ui/input"
// import { Button } from "../ui/button"
// import { Avatar } from "../ui/avatar"

// interface CommentDialogProps {
//   recipe: Recipe
//   comments: Comment[]
//   newComment: string
//   onNewCommentChange: (value: string) => void
//   onAddComment: () => void
//   isOpen: boolean
//   onClose: () => void
//   formatDate: (dateString: string) => string
// }

// const CommentDialog = ({
//   recipe,
//   comments,
//   newComment,
//   onNewCommentChange,
//   onAddComment,
//   isOpen,
//   onClose,
//   formatDate,
// }: CommentDialogProps) => {
//   return (
//     <Dialog open={isOpen} onClose={onClose} className="max-w-[500px]">
//       <div className="mb-4">
//         <h2 className="text-xl font-bold">Commentaires</h2>
//         <p className="text-sm text-gray-500">{recipe.title}</p>
//       </div>

//       <div className="flex items-center gap-2 mb-4">
//         <Avatar className="h-8 w-8">
//           <div className="bg-gray-200 h-full w-full flex items-center justify-center text-sm font-medium">V</div>
//         </Avatar>
//         <div className="flex-1 flex gap-2">
//           <Input
//             placeholder="Ajouter un commentaire..."
//             value={newComment}
//             onChange={(e) => onNewCommentChange(e.target.value)}
//           />
//           <Button onClick={onAddComment} className="bg-rose-500 hover:bg-rose-600 text-white">
//             Publier
//           </Button>
//         </div>
//       </div>

//       <div className="space-y-4 max-h-[400px] overflow-y-auto">
//         {comments.length === 0 ? (
//           <p className="text-center text-gray-500 py-4">Aucun commentaire pour le moment</p>
//         ) : (
//           comments.map((comment) => (
//             <div key={comment.id} className="border-b pb-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <Avatar className="h-6 w-6">
//                   <div className="bg-gray-200 h-full w-full flex items-center justify-center text-xs font-medium">
//                     {comment.user.name.charAt(0)}
//                   </div>
//                 </Avatar>
//                 <span className="font-medium">{comment.user.name}</span>
//                 <span className="text-xs text-gray-500">{formatDate(comment.creationDate)}</span>
//               </div>
//               <p className="text-gray-700">{comment.content}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </Dialog>
//   )
// }

// export default CommentDialog

