# @pipeworx/riot-games

[Riot Games API](https://developer.riotgames.com/) MCP — League of Legends + TFT + Valorant + LoR public data. Free dev key (24h, 100 req / 2 min); apply for permanent key for production.

## Auth

- Platform: `PLATFORM_RIOT_KEY`. BYO: `?_apiKey=…`.

## Tools (LoL)

- `account_by_riot_id(region, game_name, tag_line)` — riot ID → puuid (region = `americas` | `europe` | `asia`)
- `account_by_puuid(region, puuid)` — account by puuid
- `summoner_by_puuid(platform, puuid)` — summoner detail (platform = `na1` | `euw1` | …)
- `summoner_by_name(platform, name)` — _deprecated, use riot-id flow_
- `match_ids_by_puuid(region, puuid, start?, count?, queue?, type?, startTime?, endTime?)` — recent match ids
- `match(region, match_id)` — match detail
- `match_timeline(region, match_id)` — match timeline
- `league_entries(platform, queue, tier, division, page?)` — ranked entries
- `champion_rotations(platform)` — free champion rotation
- `champion_mastery(platform, puuid)` — champion mastery
- `summoner_top_mastery(platform, puuid, count?)` — top N mastery
- `status(platform)` — platform status

## Data source

`https://<region|platform>.api.riotgames.com`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "riot-games": {
      "url": "https://gateway.pipeworx.io/riot-games/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1422+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Riot Games data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
