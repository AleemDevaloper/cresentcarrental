import { useState, useEffect, useCallback } from 'react';
import { getAiUsageStats } from '../api/ai';

export function useAiUsage(params = {}) {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (p) => {
        setLoading(true);
        try {
            const res = await getAiUsageStats(p || params);
            setStats(res.stats);
            setLogs(res.logs || []);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { stats, logs, loading, refresh: fetch };
}
