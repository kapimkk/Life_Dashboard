export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getPreviousDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return toISODate(date);
}

export function calculateStreak(doneDates: string[]) {
  if (doneDates.length === 0) return 0;

  const uniqueSorted = [...new Set(doneDates)].sort().reverse();
  let streak = 1;

  for (let index = 1; index < uniqueSorted.length; index += 1) {
    const expectedPrevious = getPreviousDate(uniqueSorted[index - 1]);
    if (uniqueSorted[index] !== expectedPrevious) break;
    streak += 1;
  }

  return streak;
}
