import { useAuth } from '~/contexts/AuthenticationContext'
import { CheckoutState, CheckoutSend, Mint } from './checkoutMachine'
import { PaywallConfig } from '~/unlockTypes'
import { Connected } from '../Connected'
import { Button, Icon } from '@unlock-protocol/ui'
import { useAuthenticateHandler } from '~/hooks/useAuthenticateHandler'
import mintingAnimation from '~/animations/minting.json'
import mintedAnimation from '~/animations/minted.json'
import Lottie from 'lottie-react'
import { RiExternalLinkLine as ExternalLinkIcon } from 'react-icons/ri'
import { useConfig } from '~/utils/withConfig'

interface Props {
  injectedProvider: unknown
  paywallConfig: PaywallConfig
  send: CheckoutSend
  onClose(): void
  state: CheckoutState
}

function AnimationContent({ status }: Mint) {
  switch (status) {
    case 'PROCESSING':
      return (
        <Lottie
          className="w-40 h-40"
          loop={true}
          animationData={mintingAnimation}
        />
      )
    case 'FINISHED':
      return (
        <Lottie
          className="w-40 h-40"
          loop={true}
          animationData={mintedAnimation}
        />
      )
    default:
      return null
  }
}

export function Minting({ injectedProvider, send, onClose, state }: Props) {
  const { account, deAuthenticate } = useAuth()
  const { authenticateWithProvider } = useAuthenticateHandler({
    injectedProvider,
  })
  const config = useConfig()
  const { mint, lock } = state.context
  const processing = mint?.status === 'PROCESSING'

  return (
    <div>
      <main className="p-6 overflow-auto h-64 sm:h-72">
        <div className="space-y-6 justify-center grid">
          <AnimationContent {...mint!} />
          <a
            href={config.networks[lock!.network].explorer.urls.transaction(
              mint?.transactionHash
            )}
            className="text-sm inline-flex items-center gap-2 text-brand-ui-primary hover:opacity-75"
          >
            See in block explorer <Icon icon={ExternalLinkIcon} size="small" />
          </a>
        </div>
      </main>
      <footer className="p-6 border-t grid items-center">
        <Connected
          account={account}
          onDisconnect={() => {
            deAuthenticate()
            send('DISCONNECT')
          }}
          onUnlockAccount={() => {
            send('UNLOCK_ACCOUNT')
          }}
          authenticateWithProvider={authenticateWithProvider}
        >
          <Button
            disabled={!account || processing}
            loading={processing}
            onClick={onClose}
            className="w-full"
          >
            {processing ? 'Minting your membership' : 'Return to site'}
          </Button>
        </Connected>
      </footer>
    </div>
  )
}
