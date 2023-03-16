import type { OnboardAPI } from '@web3-onboard/core'
import Onboard from '@web3-onboard/core'
import injectedWalletsModule from '@web3-onboard/injected-wallets'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import ledgerWalletModule from '@web3-onboard/ledger'
// import trezorWalletModule from '@web3-onboard/trezor'
import walletConnectModule from '@web3-onboard/walletconnect'

const coinbase = coinbaseWalletModule({ darkMode: true })
const injected = injectedWalletsModule()
const ledger = ledgerWalletModule()
const walletConnect = walletConnectModule({
  version: 2,
  projectId: 'e0a88efdcd4eba50434eaa623195c84c'
  // connectFirstChainId: true,
  // qrcodeModalOptions: {
  //   mobileLinks: ['rainbow', 'metamask', 'trust', 'argent']
  // }
})

const wallets = [coinbase, injected, ledger, walletConnect]

const chains = [
  // {
  //   id: 314,
  //   token: 'FIL',
  //   label: 'Filecoin Mainnet',
  //   rpcUrl: 'https://api.node.glif.io/rpc/v1'
  // },
  {
    id: 3141,
    token: 'tFIL',
    label: 'Filecoin Hyperspace Testnet',
    rpcUrl: 'https://api.hyperspace.node.glif.io/rpc/v1'
  }
]

const appMetadata = {
  name: 'Block, Paper, Scissors',
  icon: `${window?.location?.href}/icon-small.svg`,
  logo: `${window?.location?.href}/icon.svg`,
  description:
    'A game of coordination or chaos based around the consensus mechanism of the FVM.',
  recommendedInjectedWallets: [
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
    { name: 'MetaMask', url: 'https://metamask.io' }
  ]
}

let onboard: OnboardAPI

if (!onboard) {
  onboard = Onboard({
    appMetadata,
    chains,
    theme: 'system',
    wallets,
  })
}


// console.log('onboard', onboard)

// const res = await onboard.connectWallet()
// console.log('res', res)

export default onboard as OnboardAPI
