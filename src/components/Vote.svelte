<script lang="ts">
  import { sendTransaction, prepareSendTransaction } from '@wagmi/core'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { ethers } from 'ethers'
  import { fly } from 'svelte/transition'

	import { abi } from '$contracts/BlockPaperScissors.sol/BlockPaperScissors.json'
  import { CONTRACT_ADDRESS, votingInstructionsMap, fetchGameState } from '$lib/contract'
  import { APPROVED_NETWORKS, switchChain } from '$lib/network'
  import { addNotification } from '$lib/notifications'
  import { contractStore, networkStore, sessionStore } from '$src/stores'
  import BlockIcon from '$components/icons/Block.svelte'
  import Countdown from '$components/common/Countdown.svelte'
  import Divider from '$components/common/Divider.svelte'
  import InContextLoader from '$components/common/InContextLoader.svelte'
  import PaperIcon from '$components/icons/Paper.svelte'
  import ScissorsIcon from '$components/icons/Scissors.svelte'

  let loading = false
  let selection: string = 'block'
  let voteSelected = true

  console.log('$previousMove', $contractStore?.previousWinner?.result)
  let votingInstructions = votingInstructionsMap($contractStore?.previousWinner?.result)

  const copyMap = {
    block: {
      label: 'Block',
      description: votingInstructions.block,
    },
    paper: {
      label: 'Paper',
      description: votingInstructions.paper,
    },
    scissors: {
      label: 'Scissors',
      description: votingInstructions.scissors,
    },
    buttonLabel: 'Submit your vote',
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

      const { chainId } = await $contractStore?.provider?.getNetwork()
      if (!!chainId && chainId !== APPROVED_NETWORKS[1]) {
        addNotification('Please switch to the Filecoin Hyperspace testnet', 'error')
        loading = false
        return
      }

			const paramInterface = new ethers.utils.Interface(abi)

      const blockHeight = $networkStore.blockHeight
      const txConfig = await prepareSendTransaction({
        to: CONTRACT_ADDRESS,
        from: $sessionStore.address.toLowerCase(),
        data: paramInterface.encodeFunctionData('castVote', [selection, blockHeight]),
      })

      const { hash } = await sendTransaction(txConfig)

      networkStore.update((state) => ({
        ...state,
        pendingTransaction: {
          blockHeight,
          choice: selection,
          txHash: hash,
        }
      }))

			// const txHash = await $contractStore.provider.send({
			// 	method: 'eth_sendTransaction',
			// 	params: [
			// 		{
			// 			to: CONTRACT_ADDRESS,
			// 			from: $sessionStore.address.toLowerCase(),
			// 			data: paramInterface.encodeFunctionData('castVote', [selection, $networkStore.blockHeight]),
      //       // chainId: 1,
			// 		},
			// 	],
			// })

      // Force a refetch of the game state
      await fetchGameState()

      goto(`/${$page.params.team}/play`)
			// addNotification('Good luck!', 'success')
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
    <a href="/{$page.params.team}/play" class="absolute right-0 -top-2 btn btn-primary !text-yellow-500 btn-lg w-[82px] h-16 text-lg uppercase rounded-none text-[39px]">X</a>
  {/if}

  <h1 class="text-3xl pt-8 pb-10 uppercase">
    Cast<br/>
    Your<br/>
    Vote
  </h1>

  <Divider size="medium" />

  <div class="flex flex-col gap-11 pt-[53px] {loading ? 'pb-4' : 'pb-[55px]'}">
    {#if loading}
      <InContextLoader heightClass="h-[370px]" />
    {:else}
      <button in:fly={{ x: -10, duration: 250 }} on:click={() => handleSelectionClick('block')} class="flex items-center space-x-[18px] text-xl uppercase">
        <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {selection === 'block' ? 'bg-base-content' : ''}"></span>
        <BlockIcon />
        {#if copyMap.block.description}
          <div class="flex flex-col items-start justify-center">
            <span class="text-red-500 font-bold">{copyMap.block.label}</span>
            <span class="text-lg font-bold">{copyMap.block.description}</span>
          </div>
        {:else}
          <span class="text-red-500 font-bold">{copyMap.block.label}</span>
        {/if}
      </button>

      <button in:fly={{ x: -10, delay: 20, duration: 250 }} on:click={() => handleSelectionClick('paper')} class="flex items-center space-x-[18px] text-xl uppercase">
        <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {selection === 'paper' ? 'bg-base-content' : ''}"></span>
        <PaperIcon />
        {#if copyMap.paper.description}
          <div class="flex flex-col items-start justify-center">
            <span class="text-green-500 font-bold">{copyMap.paper.label}</span>
            <span class="text-lg font-bold">{copyMap.paper.description}</span>
          </div>
        {:else}
          <span class="text-green-500 font-bold">{copyMap.paper.label}</span>
        {/if}
      </button>

      <button in:fly={{ x: -10, delay: 40, duration: 250 }} on:click={() => handleSelectionClick('scissors')} class="flex items-center space-x-[18px] text-xl uppercase">
        <span class="w-6 h-6 rounded-full border-base-content border-[5px] transition-colors ease-in-out {selection === 'scissors' ? 'bg-base-content' : ''}"></span>
        <ScissorsIcon />
        {#if copyMap.scissors.description}
          <div class="flex flex-col items-start justify-center">
            <span class="text-blue-500 font-bold">{copyMap.scissors.label}</span>
            <span class="text-lg font-bold">{copyMap.scissors.description}</span>
          </div>
        {:else}
          <span class="text-blue-500 font-bold">{copyMap.scissors.label}</span>
        {/if}
      </button>
    {/if}
  </div>

  <button disabled={!voteSelected || loading} on:click={handleVoteClick} class="btn btn-primary btn-lg w-full mb-4 !text-yellow-500 justify-between text-lg uppercase rounded-none">
    {#if loading}
      <span>SUBMITTING...</span> <img src={`${window.location.origin}/clock.svg`} class="" alt="submitting" />
    {:else}
      <span>{copyMap.buttonLabel}</span> <Countdown />
    {/if}
  </button>
</div>
