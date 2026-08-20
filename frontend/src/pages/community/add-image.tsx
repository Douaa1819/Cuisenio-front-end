import { useEffect, useRef, useState } from "react"
import { Camera, Trash2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { useNotification } from "../../context/NotificationContext"
import { useRecipe } from "../../hooks/useRecipe"
import { validateImageFile } from "../../utils/validation"

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipePublicId: string | null
}

export function ImageUploadDialog({ open, onOpenChange, recipePublicId }: ImageUploadDialogProps) {
  const { addImageToRecipe } = useRecipe()
  const { success, error: notifyError } = useNotification()

  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [recipeImage, setRecipeImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Revoke object URL on unmount or when preview changes to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      notifyError("Image invalide", validationError)
      e.target.value = ""
      return
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setRecipeImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setRecipeImage(null)
    setImagePreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleClose = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setRecipeImage(null)
    setImagePreview("")
    onOpenChange(false)
  }

  const handleSubmit = async () => {
    if (!recipePublicId || !recipeImage) {
      handleClose()
      return
    }
    const formData = new FormData()
    formData.append("imageUrl", recipeImage)
    try {
      setIsUploading(true)
      await addImageToRecipe(recipePublicId, formData)
      success("Image ajoutée", "L'image a été associée à votre recette.")
      handleClose()
    } catch {
      notifyError("Erreur d'upload", "L'envoi de l'image a échoué. Veuillez réessayer.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une image à votre recette</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <p className="block text-sm font-medium text-gray-700 mb-2">Image de la recette</p>
          <div
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
              imagePreview ? "border-primary/30" : "border-gray-200"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <div className="relative h-48 w-full">
                <img src={imagePreview} alt="Aperçu" className="h-full w-full object-cover rounded-lg" />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="py-8">
                <Camera className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Cliquez pour sélectionner une image</p>
                <p className="text-xs text-gray-400 mt-1">JPEG · PNG · WebP · GIF — max 5 Mo</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Annuler
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleSubmit}
            disabled={isUploading || !recipeImage}
          >
            {isUploading ? "Envoi en cours..." : "Ajouter l'image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
