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

        // Sanitização do nome: só letras/números, máx. 10 caracteres, maiúsculas
        const cleanName = (name || '')
            .trim()
            .toUpperCase()
            .replace(/[^A-Z0-9 ]/g, '')
            .slice(0, 10)
            .trim();

        if (cleanName.length === 0) return false;

        // Validação do score: inteiro, não-negativo e dentro de um teto plausível
        const cleanScore = Math.floor(score);
        if (!Number.isFinite(cleanScore) || cleanScore < 0 || cleanScore > 1000000) return false;

        const { error } = await supabase
            .from(TABLE_NAME)
            .insert([
                { name: cleanName, score: cleanScore }
            ]);

        if (error) {
            console.error('Error submitting score:', error);
            return false;
        }

        return true;
    }
};
