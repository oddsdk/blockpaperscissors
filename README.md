# SLW RK'D

[![Built by FISSION](https://img.shields.io/badge/⌘-Built_by_FISSION-purple.svg)](https://fission.codes) [![Built by FISSION](https://img.shields.io/badge/webnative-v0.34.1-purple.svg)](https://github.com/fission-suite/webnative) [![Discord](https://img.shields.io/discord/478735028319158273.svg)](https://discord.gg/zAQBDEq) [![Discourse](https://img.shields.io/discourse/https/talk.fission.codes/topics)](https://talk.fission.codes)

## 🤔 What's SLW RK'D?

The world's Slowest Arcade™.

### Current Games:

**Block, Paper, Scissors**

Description:

A game of coordination or chaos based around the consensus mechanism of the [FVM](https://fvm.filecoin.io/). Currently, you will need to connect your wallet client to Filecoin's [Hyperspace Testnet](https://github.com/filecoin-project/testnet-hyperspace)(don't worry, Block, Paper, Scissors will prompt you to connect if you haven't already) then request some `tFIL` from the [faucet](https://hyperspace.yoga/#faucet).

Objective:

- Lead the network to its longest winning streak OR achieve your longest personal combo
  To keep the winning streak going, you are always voting on the next move the network makes and you want it to beat the previous move (eg. If the previous move was Paper, you want the network to play Scissors)
- To keep your personal combo going, you always want to vote with the clear majority. (eg. if 100 accounts participate in a move, and the majority of them chose Paper, your combo continues if you also chose Paper, but ends if you chose Block or Scissors)
- Why would anybody vote against the network streak continuing? I guess we’ll find out. Maybe you want to draw a specific picture on the grid, and that picture can’t be drawn without a bunch of streaks ending or stalemates occuring.

## 📦 WHAT'S IN THE BOX?!

### 🧱 Built with a modern web stack

The app template is built with modern web technologies:

- [SvelteKit](https://kit.svelte.dev/) (powered by [Vite](https://vitejs.dev/) under the hood)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

## 🚀 Getting Started

You can try out the template yourself [here](https://blockpaperscissors.fission.app/).

Ready? Let's go.

Prerequiste: ensure you are running Node 16.14 or greater, but _not_ Node 17 (18 is fine though!).

1. Clone the repository:

   ```shell
   git clone git@github.com:webnative-examples/slwrkd.git
   ```

2. Install the dependencies.

   ```shell
   npm install
   ```

3. Start the local development server.

   ```shell
   npm run dev
   ```

4. Navigate to `http://localhost:5178` in your web browser.
