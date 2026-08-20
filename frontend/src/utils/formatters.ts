export const formatDate = (dateString: string): string => {
  if (!dateString) return ""

  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatCookingTime = (preparationTime: number, cookingTime?: number): string => {
  const totalTime = preparationTime + (cookingTime || 0)
  return `${totalTime} min`
}

