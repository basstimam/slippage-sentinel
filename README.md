# Slippage Sentinel

An x402-enabled agent that estimates safe slippage tolerance for swap routes.

## Inputs
- token_in
- token_out
- amount_in
- route_hint

## Outputs
- min_safe_slip_bps
- pool_depths
- recent_trade_size_p95
- volatility_index

## Example Request
curl -X POST http://localhost:8787/entrypoints/getSafeSlippage/invoke \
-H "Content-Type: application/json" \
-d '{"input":{"token_in":"0x4200...","token_out":"0x2f2...","amount_in":10,"route_hint":"base"}}'

## Endpoint
https://slippage-sentinel.vercel.app/.well-known/agent.json
