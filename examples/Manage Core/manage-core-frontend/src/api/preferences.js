import client from './client';

export const getPreferences = () => client.get('/api/v1/user/preferences');
export const updatePreferences = (preferences) => client.patch('/api/v1/user/preferences', { preferences });
