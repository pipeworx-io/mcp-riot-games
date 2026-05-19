interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Riot Games API MCP.
 */


const UA = 'pipeworx-mcp-riot-games/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'account_by_riot_id',
    description: 'Riot ID → account/puuid.',
    inputSchema: {
      type: 'object',
      properties: { region: { type: 'string', description: 'americas | europe | asia' }, game_name: { type: 'string' }, tag_line: { type: 'string' } },
      required: ['region', 'game_name', 'tag_line'],
    },
  },
  {
    name: 'account_by_puuid',
    description: 'Account by puuid.',
    inputSchema: { type: 'object', properties: { region: { type: 'string' }, puuid: { type: 'string' } }, required: ['region', 'puuid'] },
  },
  {
    name: 'summoner_by_puuid',
    description: 'Summoner detail.',
    inputSchema: { type: 'object', properties: { platform: { type: 'string' }, puuid: { type: 'string' } }, required: ['platform', 'puuid'] },
  },
  {
    name: 'match_ids_by_puuid',
    description: 'Recent match ids.',
    inputSchema: {
      type: 'object',
      properties: {
        region: { type: 'string' },
        puuid: { type: 'string' },
        start: { type: 'number' },
        count: { type: 'number' },
        queue: { type: 'number' },
        type: { type: 'string' },
        startTime: { type: 'number' },
        endTime: { type: 'number' },
      },
      required: ['region', 'puuid'],
    },
  },
  { name: 'match', description: 'Match detail.', inputSchema: { type: 'object', properties: { region: { type: 'string' }, match_id: { type: 'string' } }, required: ['region', 'match_id'] } },
  { name: 'match_timeline', description: 'Match timeline.', inputSchema: { type: 'object', properties: { region: { type: 'string' }, match_id: { type: 'string' } }, required: ['region', 'match_id'] } },
  {
    name: 'league_entries',
    description: 'Ranked entries.',
    inputSchema: {
      type: 'object',
      properties: { platform: { type: 'string' }, queue: { type: 'string' }, tier: { type: 'string' }, division: { type: 'string' }, page: { type: 'number' } },
      required: ['platform', 'queue', 'tier', 'division'],
    },
  },
  { name: 'champion_rotations', description: 'Free champion rotation.', inputSchema: { type: 'object', properties: { platform: { type: 'string' } }, required: ['platform'] } },
  {
    name: 'champion_mastery',
    description: 'Champion mastery.',
    inputSchema: { type: 'object', properties: { platform: { type: 'string' }, puuid: { type: 'string' } }, required: ['platform', 'puuid'] },
  },
  {
    name: 'summoner_top_mastery',
    description: 'Top N champion mastery.',
    inputSchema: { type: 'object', properties: { platform: { type: 'string' }, puuid: { type: 'string' }, count: { type: 'number' } }, required: ['platform', 'puuid'] },
  },
  { name: 'status', description: 'Platform status.', inputSchema: { type: 'object', properties: { platform: { type: 'string' } }, required: ['platform'] } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Riot Games requires an API key. Set PLATFORM_RIOT_KEY or pass ?_apiKey=… (free dev key at https://developer.riotgames.com).');
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  const get = async (host: string, path: string, params?: URLSearchParams) => {
    const url = `https://${host}.api.riotgames.com${path}${params && [...params].length ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA, 'X-Riot-Token': apiKey } });
    if (res.status === 401 || res.status === 403) throw new Error('Riot: invalid API key.');
    if (res.status === 404) throw new Error('Riot: 404 — not found.');
    if (res.status === 429) throw new Error('Riot: 429 rate limit.');
    if (!res.ok) throw new Error(`Riot: ${res.status}`);
    return res.json();
  };
  switch (name) {
    case 'account_by_riot_id':
      return get(reqStr('region', '"americas"'), `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(reqStr('game_name', '"Faker"'))}/${encodeURIComponent(reqStr('tag_line', '"KR1"'))}`);
    case 'account_by_puuid':
      return get(reqStr('region', '"americas"'), `/riot/account/v1/accounts/by-puuid/${encodeURIComponent(reqStr('puuid', '"<puuid>"'))}`);
    case 'summoner_by_puuid':
      return get(reqStr('platform', '"na1"'), `/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(reqStr('puuid', '"<puuid>"'))}`);
    case 'match_ids_by_puuid': {
      const p = new URLSearchParams();
      for (const k of ['start', 'count', 'queue', 'type', 'startTime', 'endTime']) if (args[k] != null) p.set(k, String(args[k]));
      return get(reqStr('region', '"americas"'), `/lol/match/v5/matches/by-puuid/${encodeURIComponent(reqStr('puuid', '"<puuid>"'))}/ids`, p);
    }
    case 'match':
      return get(reqStr('region', '"americas"'), `/lol/match/v5/matches/${encodeURIComponent(reqStr('match_id', '"NA1_<id>"'))}`);
    case 'match_timeline':
      return get(reqStr('region', '"americas"'), `/lol/match/v5/matches/${encodeURIComponent(reqStr('match_id', '"NA1_<id>"'))}/timeline`);
    case 'league_entries': {
      const p = new URLSearchParams();
      if (args.page) p.set('page', String(args.page));
      return get(
        reqStr('platform', '"na1"'),
        `/lol/league/v4/entries/${encodeURIComponent(reqStr('queue', '"RANKED_SOLO_5x5"'))}/${encodeURIComponent(reqStr('tier', '"DIAMOND"'))}/${encodeURIComponent(reqStr('division', '"I"'))}`,
        p,
      );
    }
    case 'champion_rotations':
      return get(reqStr('platform', '"na1"'), '/lol/platform/v3/champion-rotations');
    case 'champion_mastery':
      return get(reqStr('platform', '"na1"'), `/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(reqStr('puuid', '"<puuid>"'))}`);
    case 'summoner_top_mastery': {
      const count = args.count != null ? Number(args.count) : 3;
      return get(reqStr('platform', '"na1"'), `/lol/champion-mastery/v4/champion-masteries/by-puuid/${encodeURIComponent(reqStr('puuid', '"<puuid>"'))}/top?count=${count}`);
    }
    case 'status':
      return get(reqStr('platform', '"na1"'), '/lol/status/v4/platform-data');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
