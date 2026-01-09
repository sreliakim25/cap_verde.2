import { supabase } from './supabase';

export interface LeaderboardEntry {
    id: number;
    name: string;
    score: number;
    created_at: string;
}

const TABLE_NAME = 'leaderboard';

export const leaderboardService = {
    /**
     * Get top N scores
     */
    getTopScores: async (limit = 10): Promise<LeaderboardEntry[]> => {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('score', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        return data as LeaderboardEntry[];
    },

    /**
     * Submit a new score
     */
    submitScore: async (name: string, score: number): Promise<boolean> => {
        if (!supabase) return false;

        // Basic validation
        if (!name || name.trim().length === 0) return false;

        const { error } = await supabase
            .from(TABLE_NAME)
            .insert([
                { name: name.trim().toUpperCase(), score: score }
            ]);

        if (error) {
            console.error('Error submitting score:', error);
            return false;
        }

        return true;
    }
};
