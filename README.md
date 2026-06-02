# mcp-riot-games

Riot Games API MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `account_by_riot_id` | Riot ID → account/puuid. |
| `account_by_puuid` | Account by puuid. |
| `summoner_by_puuid` | Summoner detail. |
| `match_ids_by_puuid` | Recent match ids. |
| `league_entries` | Ranked entries. |
| `champion_mastery` | Champion mastery. |
| `summoner_top_mastery` | Top N champion mastery. |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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
