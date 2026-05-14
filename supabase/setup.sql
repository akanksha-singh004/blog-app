-- 1. Create Tables
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  role text check (role in ('admin','writer','reader')) default 'writer',
  avatar_url text,
  bio text,
  website text,
  twitter_handle text,
  age integer,
  gender text,
  email_notifications boolean default true,
  created_at timestamptz default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  author uuid references profiles(id) on delete cascade,
  title text not null,
  slug text unique not null,
  markdown text not null,
  excerpt text,
  image_url text,
  published boolean default false,
  is_public boolean default true,
  views integer default 0,
  likes integer default 0,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;

-- 3. RLS Policies

-- Profiles: Public can read, users can update their own
create policy "Profiles are public" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Posts: Public can read published, authors can manage own
create policy "Public can read published posts" on posts
  for select using (published = true);

create policy "Authors can manage their own posts" on posts
  for all using (auth.uid() = author);

-- Comments: Public can read, authenticated users can write, owners can delete
create policy "Comments are public" on comments for select using (true);

create policy "Authenticated users can comment" on comments
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own comments" on comments
  for delete using (auth.uid() = user_id);

-- 4. Automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
