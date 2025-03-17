import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Camera, Trash2 } from "lucide-react"
import { useRecipe } from "../../hooks/useRecipe"
import { Label } from "@radix-ui/react-dropdown-menu"

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipeId: number | null
}

export function ImageUploadDialog({ open, onOpenChange, recipeId }: ImageUploadDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
const {addImageToRecipe} = useRecipe()
   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
  
        if (file.size > 9 * 1024 * 1024) {
          alert("L'image est trop volumineuse. Veuillez choisir une image de moins de 9 Mo.")
          return
        }
  
        setRecipeImage(file)
        setImagePreview(URL.createObjectURL(file))
      }
    }


const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const handleSubmit = async () => {
    if (!recipeId || !recipeImage) {
        onOpenChange(false)
        return
      }

      const formData = new FormData()
        formData.append("imageUrl", recipeImage)
      try {
        setIsUploading(true)
        await addImageToRecipe(recipeId, formData)
        onOpenChange(false)
      } catch (error) {
        console.error("Error uploading image:", error)
      } finally {
        setIsUploading(false)
      }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une image à votre recette</DialogTitle>
        </DialogHeader>

       <div className="mb-4">
                <Label className="block text-sm font-medium mb-2">
                  Image de la recette
                </Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    imagePreview ? "border-rose-200" : "border-gray-300"
                  }`}
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    id="recipe-image"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  {imagePreview ? (
                    <div className="relative h-48 w-full">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Aperçu de l'image"
                        className="object-cover rounded-md"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          setRecipeImage(null)
                          setImagePreview("")
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Cliquez pour ajouter une image</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG ou GIF • Max 5MB</p>
                    </div>
                  )}
                </div>
              </div>

        <DialogFooter className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Ignorer
          </Button>
          <Button className="bg-rose-500 hover:bg-rose-600 text-white" onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? "Envoi en cours..." : "Ajouter l'image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

