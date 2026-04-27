import { supabase, isSupabaseConfigured } from './supabase';

export async function fetchUserBestScores(userId) {
    if (!isSupabaseConfigured || !userId) return {};

    const { data } = await supabase
        .from('leaderboard')
        .select('flash_score, express_score, typing_score')
        .eq('user_id', userId)
        .maybeSingle();

    if (!data) return {};
    return {
        flash:   data.flash_score   ?? 0,
        express: data.express_score ?? 0,
        typing:  data.typing_score  ?? 0,
    };
}
