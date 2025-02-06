export async function getNepaliDateData(year, month) {
  const normalizedMonth = String(Number(month))
  const url = `https://cdn.jsdelivr.net/gh/reezayn/nepali-calendar-data@main/${year}/${normalizedMonth}.json`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Data for year ${year} and month ${normalizedMonth} not found.`
    )
  }
  return await response.json()
}
