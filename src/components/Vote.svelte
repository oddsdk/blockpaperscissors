<script lang="ts">
  import * as Beryx from '@zondax/beryx'
  import { ethers } from 'ethers'
	import { defaultEvmStores, contracts } from 'svelte-ethers-store'
  import { goto } from '$app/navigation'

	import { abi } from '$contracts/BlockPaperScissors.sol/BlockPaperScissors.json'
  import { CONTRACT_ADDRESS } from '$lib/network'
  import { addNotification } from '$lib/notifications'
  import { networkStore, sessionStore } from '$src/stores'
  import BlockIcon from '$components/icons/Block.svelte'
  import Divider from '$components/common/Divider.svelte'
  import PaperIcon from '$components/icons/Paper.svelte'
  import ScissorsIcon from '$components/icons/Scissors.svelte'

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
        },
        paper: {
          label: 'Green',
        },
        scissors: {
          label: 'Blue',
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

  // const client = new Beryx.Beryx.Filecoin({ network: 'hyperspace', jwt: 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImtleS1iZXJ5eC0wMDEiLCJ0eXAiOiJKV1QifQ.eyJyb2xlcyI6W10sImlzcyI6IlpvbmRheCIsImF1ZCI6WyJiZXJ5eCJdLCJleHAiOjE2NzkyNTA3MzUsImp0aSI6IkFuZHJldyBWaXZhc2gsYXZAYW5kcmV3dml2YXNoLmNvbSJ9.j1PzTYbWeZekFs16QIOunAdKSygwtijwtyYoPlLXsalgshzpkn5KkOyhiUcYBshgLICYcFFHQwJRbDLAyjAM7g' })
  console.log('$sessionStore', $sessionStore)
  // console.log('client', client)
  // client.data.getAccountInfo($sessionStore.address).then((res) => console.log('res', res))
  // defaultEvmStores.setProvider()

  // let contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wsProvider);

  // contract.on("*", (from, to, value, event) => {
  //   console.log("event: ", event);
  // });

  const handleSelectionClick = (s: string): void => {
    voteSelected = true
    selection = s
  }

	const handleVoteClick = async (): Promise<void> => {
		loading = true
		try {
			const paramInterface = new ethers.Interface(abi)

			await window.ethereum.request({
				method: 'eth_sendTransaction',
				params: [
					{
						to: CONTRACT_ADDRESS,
						from: $sessionStore.address,
						data: paramInterface.encodeFunctionData('castVote', [selection, 'artist', $networkStore.blockNumber]),
					},
				],
			})

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
  <a href="/{persona}" class="absolute right-0 -top-2 btn btn-primary btn-lg w-[82px] h-16 text-lg uppercase rounded-none text-[39px]">X</a>

  <h1 class="text-3xl pt-8 pb-10">
    {copyMap[persona].title.first}<br/>
    {copyMap[persona].title.second}<br/>
    {copyMap[persona].title.third}
  </h1>

  <Divider size="medium" />

  <div class="flex flex-col gap-11 pt-[53px] pb-[55px]">
    <button on:click={() => handleSelectionClick('block')} class="flex items-center space-x-[18px] text-xl uppercase">
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

    <button on:click={() => handleSelectionClick('paper')} class="flex items-center space-x-[18px] text-xl uppercase">
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

    <button on:click={() => handleSelectionClick('scissors')} class="flex items-center space-x-[18px] text-xl uppercase">
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
  </div>

  <button disabled={!voteSelected} on:click={handleVoteClick} class="btn btn-primary btn-lg w-full mb-4 text-lg uppercase rounded-none {loading ? 'loading' : ''}">
    {copyMap[persona].buttonLabel}
  </button>
</div>
