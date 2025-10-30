# Slippage Sentinel - Docker Deployment

## Prerequisites

- Docker and Docker Compose installed
- `.env` file configured with required environment variables

## Quick Start

### 1. Build and Run with Docker Compose

```bash
docker-compose up -d
```

### 2. Build and Run with Docker only

```bash
# Build the image
docker build -t slippage-sentinel .

# Run the container
docker run -d \
  --name slippage-sentinel \
  -p 8787:8787 \
  --env-file .env \
  slippage-sentinel
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PRIVATE_KEY=your_private_key_here
PAY_TO=0x892e4feed0128f11d486fd451aff4a78171c8748
FACILITATOR_URL=https://facilitator.daydreams.systems
DEFAULT_PRICE=0.02
NETWORK=base
PORT=8787
DEX_SCREENER_BASE_URL=https://api.dexscreener.com
GECKO_TERMINAL_BASE_URL=https://api.geckoterminal.com
```

## Verify Deployment

Once running, verify the agent is accessible:

```bash
# Check health
curl http://localhost:8787/.well-known/agent.json

# Test the endpoint (requires payment via x402)
curl -X POST http://localhost:8787/entrypoints/getSafeSlippage/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "token_in": "0x4200000000000000000000000000000000000006",
      "token_out": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "amount_in": 10,
      "route_hint": "base"
    }
  }'
```

## Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop the service
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Check container status
docker-compose ps
```

## Production Deployment

For production deployment:

1. Use a reverse proxy (nginx, Caddy) with SSL/TLS
2. Set up domain DNS to point to your server
3. Configure proper firewall rules
4. Use Docker secrets or environment management for sensitive data
5. Enable container resource limits

Example with resource limits in `docker-compose.yml`:

```yaml
services:
  slippage-sentinel:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Troubleshooting

### Container won't start
- Check logs: `docker-compose logs`
- Verify `.env` file exists and has correct values
- Ensure port 8787 is not already in use

### Health check failing
- Verify the agent is running: `docker exec slippage-sentinel ps aux`
- Check if port is accessible: `curl http://localhost:8787/.well-known/agent.json`

### Payment errors
- Verify PRIVATE_KEY has sufficient USDC balance
- Check FACILITATOR_URL is accessible
- Ensure PAY_TO address is correct
