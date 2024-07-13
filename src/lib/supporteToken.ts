export const supportedToken = [
  { ticker: 'ETH', name: 'Ethereum' },
  { ticker: 'SOL', name: 'Solana' },
  { ticker: 'BNB', name: 'Binance Coin' },
  { ticker: 'USDT', name: 'Tether', chains: 'BNB' },
  { ticker: 'USDT', name: 'Tether', chains: 'ETH' },
]

export const coins = supportedToken.map((indx) => {
  return indx.ticker
})
