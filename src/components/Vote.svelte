<script lang="ts">
  import { dev } from '$app/environment'
  import { goto } from '$app/navigation'
  import { ethers } from 'ethers'
  import { fly } from 'svelte/transition'

	import { abi } from '$contracts/BlockPaperScissors.sol/BlockPaperScissors.json'
  import { CONTRACT_ADDRESS, fetchGameState } from '$lib/contract'
  import { switchChain } from '$lib/network'
  import { addNotification } from '$lib/notifications'
  import { contractStore, networkStore, sessionStore } from '$src/stores'
  import BlockIcon from '$components/icons/Block.svelte'
  import BlockMediumIcon from '$components/icons/BlockMedium.svelte'
  import Countdown from '$components/common/Countdown.svelte'
  import Divider from '$components/common/Divider.svelte'
  import PaperIcon from '$components/icons/Paper.svelte'
  import PaperMediumIcon from '$components/icons/PaperMedium.svelte'
  import ScissorsIcon from '$components/icons/Scissors.svelte'
  import ScissorsMediumIcon from '$components/icons/ScissorsMedium.svelte'

  export let persona: string

  let loading = false
  let selection: string
  let voteSelected = false

  let copyMap = {
    artist: {
      title: {
        first: 'What',
        second: 'Color',
        third: 'Pixel?',
      },
      selections: {
        block: {
          label: 'Red',
          description: 'aka Block',
        },
        paper: {
          label: 'Green',
          description: 'aka Paper',
        },
        scissors: {
          label: 'Blue',
          description: 'aka Scissors',
        }
      },
      buttonLabel: 'Suggest a color',
    },
    builder: {
      title: {
        first: 'Cast',
        second: 'Your',
        third: 'Vote',
      },
      selections: {
        block: {
          label: 'Block',
          description: 'For a draw',
        },
        paper: {
          label: 'Paper',
          description: 'For a win',
        },
        scissors: {
          label: 'Scissors',
          description: 'For a loss',
        }
      },
      buttonLabel: 'Submit your vote',
    },
    speculator: {
      title: {
        first: 'Place',
        second: 'Your',
        third: 'Bet',
      },
      selections: {
        block: {
          label: 'Block',
          description: 'Trending up',
        },
        paper: {
          label: 'Paper',
          description: 'Trending down',
        },
        scissors: {
          label: 'Scissors',
          description: 'Flat',
        }
      },
      buttonLabel: 'Place the bet',
    },
  }

  const handleSelectionClick = (s: string): void => {
    voteSelected = true
    selection = s
  }

	const handleVoteClick = async (): Promise<void> => {
		loading = true
		try {
      // const res = await fetch('https://api.zondax.ch/fil/data/v1/hyperspace/tipset/latest', {
      //   method: 'GET',
      //   headers: {
      //     Authorization: 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImtleS1iZXJ5eC0wMDEiLCJ0eXAiOiJKV1QifQ.eyJyb2xlcyI6W10sImlzcyI6IlpvbmRheCIsImF1ZCI6WyJiZXJ5eCJdLCJleHAiOjE2NzkyNTA3MzUsImp0aSI6IkFuZHJldyBWaXZhc2gsYXZAYW5kcmV3dml2YXNoLmNvbSJ9.j1PzTYbWeZekFs16QIOunAdKSygwtijwtyYoPlLXsalgshzpkn5KkOyhiUcYBshgLICYcFFHQwJRbDLAyjAM7g',
      //     "Content-Type": "application/json",
      //   },
      // })
      // const { height: blockHeight } = await res.json()
      // await window.ethereum.request({
      //   method: 'wallet_switchEthereumChain',
      //   params: [{ chainId: $networkStore.activeChainId }],
      // })
      // await switchChain()

			const paramInterface = new ethers.Interface(abi)

			const txHash = await window.ethereum.request({
				method: 'eth_sendTransaction',
				params: [
					{
						to: CONTRACT_ADDRESS,
						from: $sessionStore.address,
						data: paramInterface.encodeFunctionData('castVote', [selection, persona, $networkStore.blockHeight]),
					},
				],
			})

      // Poll for the tx receipt
      if (dev) {
        console.log(`Fetching txn receipt....`)
      }
      let receipt = null
      while (receipt === null) {
        try {
          receipt = await $contractStore.provider.getTransactionReceipt(txHash as string)

          if (receipt === null) {
            if (dev) {
              console.log('Checking for tx receipt...')
            }
            continue
          }

          if (dev) {
            console.log('Receipt fetched:', receipt)
          }
        } catch (e) {
          console.error(e)
          break
        }
      }

      // Force a refetch of the game state
      await fetchGameState()

      goto(`/${persona}`)
			addNotification('Good luck!', 'success')
		} catch (error) {
			addNotification('Vote failed', 'error')
			console.error(error)
		}
		loading = false
	}
</script>

<div class="relative">
  {#if loading}
    <button disabled class="absolute right-0 -top-2 btn btn-primary btn-lg w-[82px] h-16 text-lg uppercase rounded-none text-[39px]">X</button>
  {:else}
    <a href="/{persona}" class="absolute right-0 -top-2 btn btn-primary btn-lg w-[82px] h-16 text-lg uppercase rounded-none text-[39px]">X</a>
  {/if}

  <h1 class="text-3xl pt-8 pb-10">
    {copyMap[persona].title.first}<br/>
    {copyMap[persona].title.second}<br/>
    {copyMap[persona].title.third}
  </h1>

  <Divider size="medium" />

  <div class="flex flex-col gap-11 pt-[53px] {loading ? 'pb-4' : 'pb-[55px]'}">
    {#if loading}
      <div class="flex flex-col items-center justify-center h-[370px]">
        <div class="relative my-auto">
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fadeinout"><BlockMediumIcon /></div>
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fadeinout animation-delay-[150ms] opacity-0"><PaperMediumIcon /></div>
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fadeinout animation-delay-[300ms] opacity-0"><ScissorsMediumIcon /></div>
        </div>
        <p class="mt-auto text-2xl font-bold">Submitting...</p>
      </div>
    {:else}
      <button in:fly={{ x: -10, duration: 250 }} on:click={() => handleSelectionClick('block')} class="flex items-center space-x-[18px] text-xl uppercase">
        <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {selection === 'block' ? 'bg-base-content' : ''}"></span>
        <BlockIcon />
        {#if copyMap[persona].selections.block.description}
          <div class="flex flex-col items-start justify-center">
            <span class="text-red-500 font-bold">{copyMap[persona].selections.block.label}</span>
            <span class="text-lg font-bold">{copyMap[persona].selections.block.description}</span>
          </div>
        {:else}
          <span class="text-red-500 font-bold">{copyMap[persona].selections.block.label}</span>
        {/if}
      </button>

      <button in:fly={{ x: -10, delay: 20, duration: 250 }} on:click={() => handleSelectionClick('paper')} class="flex items-center space-x-[18px] text-xl uppercase">
        <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {selection === 'paper' ? 'bg-base-content' : ''}"></span>
        <PaperIcon />
        {#if copyMap[persona].selections.paper.description}
          <div class="flex flex-col items-start justify-center">
            <span class="text-green-500 font-bold">{copyMap[persona].selections.paper.label}</span>
            <span class="text-lg font-bold">{copyMap[persona].selections.paper.description}</span>
          </div>
        {:else}
          <span class="text-green-500 font-bold">{copyMap[persona].selections.paper.label}</span>
        {/if}
      </button>

      <button in:fly={{ x: -10, delay: 40, duration: 250 }} on:click={() => handleSelectionClick('scissors')} class="flex items-center space-x-[18px] text-xl uppercase">
        <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {selection === 'scissors' ? 'bg-base-content' : ''}"></span>
        <ScissorsIcon />
        {#if copyMap[persona].selections.scissors.description}
          <div class="flex flex-col items-start justify-center">
            <span class="text-blue-500 font-bold">{copyMap[persona].selections.scissors.label}</span>
            <span class="text-lg font-bold">{copyMap[persona].selections.scissors.description}</span>
          </div>
        {:else}
          <span class="text-blue-500 font-bold">{copyMap[persona].selections.scissors.label}</span>
        {/if}
      </button>
    {/if}
  </div>

  <button disabled={!voteSelected || loading} on:click={handleVoteClick} class="btn btn-primary btn-lg w-full mb-4 justify-between text-lg uppercase rounded-none">
    <span>{copyMap[persona].buttonLabel}</span> <Countdown />
  </button>
</div>
