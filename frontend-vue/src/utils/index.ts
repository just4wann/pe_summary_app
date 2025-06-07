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