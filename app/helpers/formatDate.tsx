const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return "Невідома дата"
  return new Date(dateStr).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default formatDate
