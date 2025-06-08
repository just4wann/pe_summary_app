export function formateDescription(value: string): string[] {
  return value.split('\n');
};

export function generateTimestamp(createdAt: string | Date): string[] {
  const date = new Date(createdAt);
  const formatDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
  });

  const time = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return [
    `${formatDate} at ${time}`,
    `${formatDate}`
  ];
    
};

export function isSameDate(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() && 
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();
}