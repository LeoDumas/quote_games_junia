create table public.leaderboard (
  user_id              uuid    primary key references auth.users(id) on delete cascade,
  username             text    not null,
  flash_score          integer not null default 0,
  express_score        integer not null default 0,
  typing_score         integer not null default 0,
  total_score          integer generated always as (flash_score + express_score + typing_score) stored,
  flash_plays_today    integer not null default 0,
  flash_last_play_date date
);

alter table public.leaderboard enable row level security;

-- Anyone can read the leaderboard
create policy "Anyone can read leaderboard"
  on public.leaderboard for select
  using (true);

-- Authenticated users can create their own row
create policy "Users can insert own row"
  on public.leaderboard for insert
  with check (auth.uid() = user_id);

-- Authenticated users can update only their own row
create policy "Users can update own row"
  on public.leaderboard for update
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Fast sort on total score for leaderboard queries
create index leaderboard_total_score_idx on public.leaderboard (total_score desc);
