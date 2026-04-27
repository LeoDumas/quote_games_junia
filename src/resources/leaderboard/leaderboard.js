import { supabase, isSupabaseConfigured } from '../../utils/supabase';

export const FLASH_DAILY_LIMIT = 5;

async function getRow(userId) {
    const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
    return data;
}

export async function loadLeaderboard() {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
        .from('leaderboard')
        .select('username, total_score')
        .order('total_score', { ascending: false })
        .gt('total_score', 0)
        .limit(10);

    if (error || !data) return [];
    return data.map((e) => ({ name: e.username, score: e.total_score }));
}

export async function pushLeaderboardScore({ name = 'Player', score, userId = null, gameType }) {
    if (!isSupabaseConfigured || score <= 0) return loadLeaderboard();

    const SCORE_COL = { flash: 'flash_score', express: 'express_score', typing: 'typing_score' };
    const col = SCORE_COL[gameType];
    if (!col || !userId) return loadLeaderboard();

    const username = String(name).trim() || 'Player';
    const delta = Math.round(score);
    const row = await getRow(userId);

    if (row) {
        await supabase
            .from('leaderboard')
            .update({ username, [col]: (row[col] ?? 0) + delta })
            .eq('user_id', userId);
    } else {
        await supabase
            .from('leaderboard')
            .insert({ user_id: userId, username, flash_score: 0, express_score: 0, typing_score: 0, [col]: delta });
    }

    return loadLeaderboard();
}

export async function getFlashPlaysLeft(userId) {
    if (!isSupabaseConfigured || !userId) return FLASH_DAILY_LIMIT;

    const row = await getRow(userId);
    if (!row) return FLASH_DAILY_LIMIT;

    const today = new Date().toISOString().split('T')[0];
    if (row.flash_last_play_date !== today) return FLASH_DAILY_LIMIT;

    return Math.max(0, FLASH_DAILY_LIMIT - (row.flash_plays_today ?? 0));
}

export async function recordFlashPlay(userId, username) {
    if (!isSupabaseConfigured || !userId) return;

    const today = new Date().toISOString().split('T')[0];
    const row = await getRow(userId);

    if (!row) {
        await supabase.from('leaderboard').insert({
            user_id: userId,
            username: String(username).trim() || 'Player',
            flash_plays_today: 1,
            flash_last_play_date: today,
        });
        return;
    }

    const isNewDay = row.flash_last_play_date !== today;
    await supabase.from('leaderboard').update({
        flash_plays_today: isNewDay ? 1 : (row.flash_plays_today ?? 0) + 1,
        flash_last_play_date: today,
    }).eq('user_id', userId);
}
