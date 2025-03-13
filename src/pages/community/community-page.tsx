// "use client"

// import { useState } from "react"
// import { Link } from "react-router-dom"
// import { BookOpen, ChefHat, Clock, Heart, MessageCircle, Menu, Search, Share2, Users, X, Filter, Send } from 'lucide-react'
// import { Button } from "../../components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
// import { Avatar } from "../../components/ui/avatar"
// import { Badge } from "../../components/ui/badge"
// import { Textarea } from "../../components/ui/textarea"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
// import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"

// interface ImageProps {
//   src: string;
//   alt: string;
//   width?: number;
//   height?: number;
//   className?: string;
//   fill?: boolean;
// }

// const Image = ({ src, alt, width, height, className, fill }: ImageProps) => {
//   const style = fill ? {
//     position: 'absolute' as const,
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     objectFit: 'cover' as const
//   } : {};

//   return (
//     <img
//       src={src || "/placeholder.svg"}
//       alt={alt}
//       width={width}
//       height={height}
//       className={className}
//       style={style}
//     />
//   );
// };

// export default function CommunityPage() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [commentText, setCommentText] = useState("")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [activeCommentId, setActiveCommentId] = useState<number | null>(null)
//   const [replyText, setReplyText] = useState("")
//   const [showFilters, setShowFilters] = useState(false)
  
//   // Filter states
//   const [selectedCategory, setSelectedCategory] = useState("")
//   const [sortOption, setSortOption] = useState("")

//   const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

//   const handleCommentSubmit = () => {
//     // Implement comment submission logic
//     console.log("Posted comment:", commentText)
//     setCommentText("")
//     // Here you would typically add the comment to your comments array
//   }

//   const handleReplySubmit = (commentId: number) => {
//     // Implement reply submission logic
//     console.log("Posted reply to comment", commentId, ":", replyText)
//     setReplyText("")
//     setActiveCommentId(null)
//     // Here you would typically add the reply to your comments array
//   }

//   const recipes = [
//     {
//       id: 1,
//       title: "Tarte aux Pommes Traditionnelle",
//       chef: "Marie Dubois",
//       time: "60 min",
//       level: "Intermédiaire",
//       likes: 124,
//       comments: 18,
//       image: "/placeholder.svg?height=400&width=600",
//       description: "Une délicieuse tarte aux pommes avec une touche de cannelle et une pâte croustillante."
//     },
//     {
//       id: 2,
//       title: "Risotto aux Champignons",
//       chef: "Thomas Martin",
//       time: "45 min",
//       level: "Intermédiaire",
//       likes: 98,
//       comments: 12,
//       image: "/placeholder.svg?height=400&width=600",
//       description: "Un risotto crémeux aux champignons sauvages et parmesan."
//     },
//     {
//       id: 3,
//       title: "Poulet Rôti aux Herbes",
//       chef: "Sophie Laurent",
//       time: "75 min",
//       level: "Facile",
//       likes: 156,
//       comments: 24,
//       image: "/placeholder.svg?height=400&width=600",
//       description: "Un poulet rôti juteux avec un mélange d'herbes fraîches et d'ail."
//     }
//   ]

//   const comments = [
//     {
//       id: 1,
//       user: "Claire Moreau",
//       avatar: "/placeholder.svg?height=50&width=50",
//       date: "Il y a 2 jours",
//       text: "J'ai essayé cette recette hier soir et c'était délicieux ! J'ai ajouté un peu plus de cannelle et le résultat était parfait. Merci pour le partage !",
//       likes: 8,
//       replies: []
//     },
//     {
//       id: 2,
//       user: "Lucas Bernard",
//       avatar: "/placeholder.svg?height=50&width=50",
//       date: "Il y a 5 jours",
//       text: "Super recette ! Simple à réaliser et très savoureuse. Toute ma famille a adoré.",
//       likes: 5,
//       replies: []
//     },
//     {
//       id: 3,
//       user: "Emma Petit",
//       avatar: "/placeholder.svg?height=50&width=50",
//       date: "Il y a 1 semaine",
//       text: "Est-ce qu'on peut remplacer le beurre par de l'huile d'olive ? J'aimerais essayer une version plus légère.",
//       likes: 2,
//       replies: [
//         {
//           id: 1,
//           user: "Marie Dubois",
//           avatar: "/placeholder.svg?height=50&width=50",
//           date: "Il y a 6 jours",
//           text: "Bonjour Emma ! Oui, vous pouvez remplacer le beurre par de l'huile d'olive pour une version plus légère. La texture sera un peu différente, mais toujours délicieuse !",
//           likes: 3
//         }
//       ]
//     }
//   ]

//   return (
//     <div className="min-h-screen bg-white text-gray-800">
//       {/* Navigation */}
//       <header className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-100">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <Link to="/" className="flex items-center space-x-2">
//             <ChefHat className="h-6 w-6 text-rose-500" />
//             <span className="font-medium text-xl">Cuisenio</span>
//           </Link>

//           <nav
//             className={`${mobileMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-6 md:p-0 space-y-4 md:space-y-0 md:space-x-8 items-center shadow-md md:shadow-none z-50`}
//           >
//             {["Recettes", "Ingrédients", "Communauté", "Planificateur"].map((item) => (
//               <Link
//                 key={item}
//                 to={item === "Communauté" ? "/community" : item === "Planificateur" ? "/meal-planner" : "#"}
//                 className={`text-sm font-medium transition-colors duration-200 ${
//                   item === "Communauté" ? "text-rose-500" : "text-gray-600 hover:text-rose-500"
//                 }`}
//               >
//                 {item}
//               </Link>
//             ))}
//             <Link to="/auth/login">
//               <Button variant="default" className="bg-rose-500 hover:bg-rose-600 text-white">
//                 Connexion
//               </Button>
//             </Link>
//           </nav>

//           <button onClick={toggleMobileMenu} className="md:hidden text-gray-800">
//             {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="pt-28 pb-16 px-4">
//         <div className="container mx-auto max-w-6xl">
//           {/* Community Header */}
//           <div className="mb-12 text-center">
//             <h1 className="text-3xl font-bold mb-4">Communauté Cuisenio</h1>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Partagez vos créations culinaires, découvrez de nouvelles recettes et échangez avec d'autres passionnés de cuisine
//             </p>
//           </div>

//           {/* Compact Search and Filter */}
//           <div className="mb-10 flex flex-wrap items-center">
//             <div className="relative flex-1 min-w-0 mr-2">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Rechercher..."
//                 className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 transition"
//               />
//             </div>
            
//             <Popover open={showFilters} onOpenChange={setShowFilters}>
//               <PopoverTrigger asChild>
//                 <Button 
//                   variant="outline" 
//                   className="bg-white border-gray-300 text-gray-700 flex items-center"
//                 >
//                   <Filter className="h-4 w-4 mr-2" />
//                   Filtres
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-80">
//                 <div className="space-y-4">
//                   <h4 className="font-medium mb-2">Affiner votre recherche</h4>
                  
//                   <div>
//                     <label className="text-sm text-gray-600 block mb-1">Catégorie</label>
//                     <select 
//                       className="w-full p-2 rounded-md border border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 transition"
//                       value={selectedCategory}
//                       onChange={(e) => setSelectedCategory(e.target.value)}
//                     >
//                       <option value="">Toutes les catégories</option>
//                       <option value="desserts">Desserts</option>
//                       <option value="plats">Plats principaux</option>
//                       <option value="entrees">Entrées</option>
//                       <option value="boissons">Boissons</option>
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm text-gray-600 block mb-1">Trier par</label>
//                     <select 
//                       className="w-full p-2 rounded-md border border-gray-300 focus:border-rose-500 focus:ring focus:ring-rose-200 transition"
//                       value={sortOption}
//                       onChange={(e) => setSortOption(e.target.value)}  
//                     >
//                       <option value="">Trier par</option>
//                       <option value="recent">Plus récent</option>
//                       <option value="popular">Plus populaire</option>
//                       <option value="comments">Plus commenté</option>
//                     </select>
//                   </div>
                  
//                   <div className="pt-2">
//                     <Button 
//                       className="w-full bg-rose-500 hover:bg-rose-600 text-white"
//                       onClick={() => setShowFilters(false)}
//                     >
//                       Appliquer les filtres
//                     </Button>
//                   </div>
//                 </div>
//               </PopoverContent>
//             </Popover>
//           </div>

//           {/* Community Tabs */}
//           <Tabs defaultValue="recettes" className="mb-10">
//             <TabsList className="grid w-full grid-cols-3 mb-8">
//               <TabsTrigger value="recettes" className="text-sm">Recettes Partagées</TabsTrigger>
//               <TabsTrigger value="discussions" className="text-sm">Discussions</TabsTrigger>
//               <TabsTrigger value="evenements" className="text-sm">Événements</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="recettes" className="space-y-8">
//               {/* Featured Recipe */}
//               <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
//                 <div className="md:flex">
//                   <div className="md:w-1/2 relative h-64 md:h-auto">
//                     <Image
//                       src="/placeholder.svg?height=500&width=800"
//                       alt="Tarte aux Pommes"
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="md:w-1/2 p-6 md:p-8">
//                     <div className="flex justify-between items-start mb-4">
//                       <div>
//                         <h2 className="text-2xl font-bold mb-2">Tarte aux Pommes Traditionnelle</h2>
//                         <div className="flex items-center text-sm text-gray-500 mb-2">
//                           <span className="flex items-center mr-4">
//                             <Clock className="h-3 w-3 mr-1" /> 60 min
//                           </span>
//                           <span>Niveau: Intermédiaire</span>
//                         </div>
//                         <div className="flex items-center mb-4">
//                           <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 mr-2">Dessert</Badge>
//                           <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200">Français</Badge>
//                         </div>
//                       </div>
//                       <div className="flex space-x-2">
//                         <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//                           <Heart className="h-5 w-5 text-gray-500" />
//                         </button>
//                         <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//                           <Share2 className="h-5 w-5 text-gray-500" />
//                         </button>
//                       </div>
//                     </div>
                    
//                     <p className="text-gray-600 mb-6">
//                       Une délicieuse tarte aux pommes avec une touche de cannelle et une pâte croustillante. 
//                       Parfaite pour les après-midis d'automne ou comme dessert lors d'un dîner en famille.
//                     </p>
                    
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <Avatar className="h-10 w-10 mr-3 border">
//                           <Image
//                             src="/placeholder.svg?height=50&width=50"
//                             alt="Marie Dubois"
//                             width={50}
//                             height={50}
//                           />
//                         </Avatar>
//                         <div>
//                           <p className="font-medium text-sm">Marie Dubois</p>
//                           <p className="text-xs text-gray-500">Partagé il y a 3 jours</p>
//                         </div>
//                       </div>
//                       <Button className="bg-rose-500 hover:bg-rose-600 text-white">Voir la recette</Button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Comments Section with Dialog for replies */}
//                 <div className="border-t border-gray-100 p-6 md:p-8">
//                   <div className="flex items-center justify-between mb-6">
//                     <h3 className="font-semibold text-lg flex items-center">
//                       <MessageCircle className="h-5 w-5 mr-2" /> Commentaires ({comments.length})
//                     </h3>
                    
//                     <Dialog>
//                       <DialogTrigger asChild>
//                         <Button variant="outline" className="text-sm">Voir tous les commentaires</Button>
//                       </DialogTrigger>
//                       <DialogContent className="max-w-2xl">
//                         <DialogHeader>
//                           <DialogTitle>Tous les commentaires</DialogTitle>
//                         </DialogHeader>
//                         <div className="max-h-[60vh] overflow-y-auto">
//                           {comments.map(comment => (
//                             <div key={comment.id} className="py-4 border-b border-gray-100 last:border-0">
//                               <div className="flex gap-4">
//                                 <Avatar className="h-10 w-10 flex-shrink-0 border">
//                                   <Image
//                                     src={comment.avatar || "/placeholder.svg"}
//                                     alt={comment.user}
//                                     width={50}
//                                     height={50}
//                                   />
//                                 </Avatar>
//                                 <div className="flex-1">
//                                   <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="flex justify-between items-center mb-2">
//                                       <p className="font-medium">{comment.user}</p>
//                                       <span className="text-xs text-gray-500">{comment.date}</span>
//                                     </div>
//                                     <p className="text-gray-700 text-sm">{comment.text}</p>
//                                   </div>
//                                   <div className="flex items-center mt-2 text-sm text-gray-500">
//                                     <button className="flex items-center hover:text-rose-500 transition-colors">
//                                       <Heart className="h-3 w-3 mr-1" /> {comment.likes}
//                                     </button>
//                                     <button 
//                                       className="ml-4 hover:text-rose-500 transition-colors"
//                                       onClick={() => setActiveCommentId(comment.id)}
//                                     >
//                                       Répondre
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
                              
//                               {/* Replies */}
//                               {comment.replies && comment.replies.length > 0 && (
//                                 <div className="ml-12 mt-3 space-y-3">
//                                   {comment.replies.map(reply => (
//                                     <div key={reply.id} className="flex gap-3">
//                                       <Avatar className="h-8 w-8 flex-shrink-0 border">
//                                         <Image
//                                           src={reply.avatar || "/placeholder.svg"}
//                                           alt={reply.user}
//                                           width={40}
//                                           height={40}
//                                         />
//                                       </Avatar>
//                                       <div className="flex-1">
//                                         <div className="bg-gray-50 p-3 rounded-lg">
//                                           <div className="flex justify-between items-center mb-1">
//                                             <p className="font-medium text-sm">{reply.user}</p>
//                                             <span className="text-xs text-gray-500">{reply.date}</span>
//                                           </div>
//                                           <p className="text-gray-700 text-xs">{reply.text}</p>
//                                         </div>
//                                         <div className="flex items-center mt-1 text-xs text-gray-500">
//                                           <button className="flex items-center hover:text-rose-500 transition-colors">
//                                             <Heart className="h-3 w-3 mr-1" /> {reply.likes}
//                                           </button>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}
                              
//                               {/* Reply input */}
//                               {activeCommentId === comment.id && (
//                                 <div className="ml-12 mt-3 flex gap-3">
//                                   <Avatar className="h-8 w-8 flex-shrink-0 border">
//                                     <Image
//                                       src="/placeholder.svg?height=40&width=40"
//                                       alt="Votre avatar"
//                                       width={40}
//                                       height={40}
//                                     />
//                                   </Avatar>
//                                   <div className="flex-1">
//                                     <Textarea
//                                       placeholder="Écrire une réponse..."
//                                       className="mb-2 resize-none text-sm"
//                                       value={replyText}
//                                       onChange={(e) => setReplyText(e.target.value)}
//                                     />
//                                     <div className="flex justify-end space-x-2">
//                                       <Button 
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => {
//                                           setActiveCommentId(null);
//                                           setReplyText("");
//                                         }}
//                                       >
//                                         Annuler
//                                       </Button>
//                                       <Button 
//                                         size="sm"
//                                         className="bg-rose-500 hover:bg-rose-600 text-white"
//                                         disabled={!replyText.trim()}
//                                         onClick={() => handleReplySubmit(comment.id)}
//                                       >
//                                         Répondre
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </DialogContent>
//                     </Dialog>
//                   </div>
                  
//                   <div className="space-y-6 mb-6">
//                     {/* Show only first 2 comments in the main view */}
//                     {comments.slice(0, 2).map(comment => (
//                       <div key={comment.id} className="flex gap-4">
//                         <Avatar className="h-10 w-10 flex-shrink-0 border">
//                           <Image
//                             src={comment.avatar || "/placeholder.svg"}
//                             alt={comment.user}
//                             width={50}
//                             height={50}
//                           />
//                         </Avatar>
//                         <div className="flex-1">
//                           <div className="bg-gray-50 p-4 rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                               <p className="font-medium">{comment.user}</p>
//                               <span className="text-xs text-gray-500">{comment.date}</span>
//                             </div>
//                             <p className="text-gray-700 text-sm">{comment.text}</p>
//                           </div>
//                           <div className="flex items-center mt-2 text-sm text-gray-500">
//                             <button className="flex items-center hover:text-rose-500 transition-colors">
//                               <Heart className="h-3 w-3 mr-1" /> {comment.likes}
//                             </button>
//                             <button 
//                               className="ml-4 hover:text-rose-500 transition-colors"
//                               onClick={() => setActiveCommentId(comment.id)}
//                             >
//                               Répondre
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
                  
//                   {/* Add Comment */}
//                   <div className="flex gap-4">
//                     <Avatar className="h-10 w-10 flex-shrink-0 border">
//                       <Image
//                         src="/placeholder.svg?height=50&width=50"
//                         alt="Votre avatar"
//                         width={50}
//                         height={50}
//                       />
//                     </Avatar>
//                     <div className="flex-1 relative">
//                       <Textarea
//                         placeholder="Ajouter un commentaire..."
//                         className="mb-2 resize-none pr-12"
//                         value={commentText}
//                         onChange={(e) => setCommentText(e.target.value)}
//                       />
//                       <button 
//                         className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${
//                           commentText.trim() ? 'text-rose-500 hover:bg-rose-100' : 'text-gray-300'
//                         }`}
//                         disabled={!commentText.trim()}
//                         onClick={handleCommentSubmit}
//                       >
//                         <Send className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Other Recipes */}
//               <h3 className="font-semibold text-xl mb-4">Autres recettes de la communauté</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {recipes.map(recipe => (
//                   <div key={recipe.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 group cursor-pointer hover:shadow-md transition-shadow">
//                     <div className="relative h-48">
//                       <Image
//                         src={recipe.image || "/placeholder.svg"}
//                         alt={recipe.title}
//                         fill
//                         className="object-cover transition-transform duration-500 group-hover:scale-105"
//                       />
//                     </div>
//                     <div className="p-4">
//                       <h3 className="text-lg font-medium mb-1 group-hover:text-rose-500 transition-colors">
//                         {recipe.title}
//                       </h3>
//                       <div className="flex justify-between text-sm text-gray-500 mb-2">
//                         <span>Par {recipe.chef}</span>
//                         <span className="flex items-center">
//                           <Clock className="h-3 w-3 mr-1" /> {recipe.time}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center text-sm text-gray-500">
//                           <span className="flex items-center mr-3">
//                             <Heart className="h-3 w-3 mr-1" /> {recipe.likes}
//                           </span>
//                           <span className="flex items-center">
//                             <MessageCircle className="h-3 w-3 mr-1" /> {recipe.comments}
//                           </span>
//                         </div>
//                         <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200">
//                           {recipe.level}
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>
            
//             <TabsContent value="discussions">
//               <div className="bg-gray-50 p-8 rounded-lg text-center">
//                 <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//                 <h3 className="text-xl font-medium mb-2">Discussions de la communauté</h3>
//                 <p className="text-gray-600 mb-4">
//                   Rejoignez les conversations sur vos sujets culinaires préférés
//                 </p>
//                 <Button className="bg-rose-500 hover:bg-rose-600 text-white">
//                   Voir les discussions
//                 </Button>
//               </div>
//             </TabsContent>
            
//             <TabsContent value="evenements">
//               <div className="bg-gray-50 p-8 rounded-lg text-center">
//                 <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//                 <h3 className="text-xl font-medium mb-2">Événements culinaires</h3>
//                 <p className="text-gray-600 mb-4">
//                   Découvrez les prochains événements et ateliers de cuisine
//                 </p>
//                 <Button className="bg-rose-500 hover:bg-rose-600 text-white">
//                   Voir les événements
//                 </Button>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="py-8 px-4 bg-white border-t border-gray-100">
//         <div className="container mx-auto max-w-6xl">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center space-x-2 mb-4 md:mb-0">
//               <ChefHat className="h-5 w-5 text-rose-500" />
//               <span className="font-medium">Cuisenio</span>
//             </div>
//             <div className="flex space-x-6">
//               {["Confidentialité", "Conditions", "Contact"].map((item) => (
//                 <Link key={item} to="#" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
//                   {item}
//                 </Link>
//               ))}
//             </div>
//             <div className="text-sm text-gray-500 mt-4 md:mt-0">
//               © {new Date().getFullYear()} Cuisenio. Tous droits réservés.
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }