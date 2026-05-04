const BASE_URL = 'http://localhost:8080/api';

export const sendEvent = async (eventData) => {
  const response = await fetch(`${BASE_URL}/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) throw new Error('Failed to send event');
  return response.text();
};

export const getSurge = async (zone) => {
  const response = await fetch(`${BASE_URL}/surge/${zone}`);
  if (!response.ok) throw new Error('Failed to fetch surge');
  return response.json();
};

export const getAllSurges = async () => {
  const zones = ['HIGH', 'MEDIUM', 'LOW'];
  const results = await Promise.all(zones.map((z) => getSurge(z)));
  return { HIGH: results[0], MEDIUM: results[1], LOW: results[2] };
};