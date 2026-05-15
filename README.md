# AgentCo HQ — React App

A React + Vite + Tailwind app to run all 40 AI agents across 4 product pipelines, with Supabase sync.

## Quick start

```bash
# Install dependencies
npm install

# Create your .env file
cp .env.example .env

# Add your Supabase credentials to .env
# VITE_SUPABASE_URL=https://xxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...

# Run dev server
npm run dev
```

## Supabase setup (one time)

1. Go to [supabase.com](https://supabase.com) → create a free project
2. Go to **SQL Editor** and run:

```sql
create table agent_outputs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  agent_id text not null,
  agent_name text not null,
  content text not null,
  updated_at timestamptz default now(),
  unique(user_id, agent_id)
);
alter table agent_outputs enable row level security;
create policy "Users own their outputs" on agent_outputs
  for all using (auth.uid() = user_id);
```

3. Go to **Project Settings → API** → copy Project URL and anon key into `.env`
4. Restart the dev server

## Deploy for free

### Netlify
```bash
npm run build
# Drag the dist/ folder to app.netlify.com/drop
```

Or connect your GitHub repo — Netlify auto-deploys on every push.
Set environment variables in: Site Settings → Environment Variables

### Vercel
```bash
npx vercel
```
Set environment variables in the Vercel dashboard.

### Cloudflare Pages
Connect GitHub repo → Build command: `npm run build` → Output: `dist`

## Project structure

```
src/
  data/
    agents.js          # All 40 agent definitions + system prompts
  lib/
    supabase.js        # Supabase client init
    useAuth.js         # Auth hook (sign in/up/out)
    useOutputs.js      # Output storage (local + Supabase)
    useChat.js         # Multi-turn conversation hook
  components/
    TopBar.jsx         # API key input + auth status
    Sidebar.jsx        # Agent list with pipeline filter
    ContextBar.jsx     # Load previous agent outputs as context
    ChatArea.jsx       # Message rendering
    InputBar.jsx       # Text input + send/pass buttons
    OutputsPanel.jsx   # Saved outputs list
    AuthModal.jsx      # Sign in / sign up modal
    ApiKeyModal.jsx    # Anthropic key entry modal
  App.jsx              # Main layout + state
  main.jsx             # Entry point
  index.css            # Tailwind + global styles
```

## Customising agents

Edit `src/data/agents.js` — each agent is an object with:
- `id` — unique slug
- `name` — display name
- `dept` — department (used for sidebar grouping)
- `pipeline` — `build | market | sell | retain | all`
- `emoji` — icon
- `color` — dot color in sidebar
- `inputs` — array of agent IDs whose output this agent needs
- `prompt` — the system prompt
