import client from './client';

const PUBLIC_BASE = '/api/v1/public/share';

export const createPublicShare = (data) => client.post('/api/v1/public-shares', data);
export const revokePublicShare = (data) => client.delete('/api/v1/public-shares', { data });

export const getPublicEntity = (entityType, token) =>
  client.get(`${PUBLIC_BASE}/${entityType}/${token}`).then((res) => res.data);

export const buildPublicShareUrl = (entityType, token) => {
  if (typeof window === 'undefined') return `/public/share/${entityType}/${token}`;
  return `${window.location.origin}/public/share/${entityType}/${token}`;
};
