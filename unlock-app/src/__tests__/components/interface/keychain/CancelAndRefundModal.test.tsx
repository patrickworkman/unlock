import React from 'react'
import * as rtl from '@testing-library/react'
import { waitFor } from '@testing-library/react'
import { CancelAndRefundModal } from '../../../../components/interface/keychain/CancelAndRefundModal'
import { OwnedKey } from '../../../../components/interface/keychain/KeychainTypes'
import { WalletServiceContext } from '../../../../utils/withWalletService'

const accountAddress = '0xAaAdEED4c0B861cB36f4cE006a9C90BA2E43fdc2'
const aKey: OwnedKey = {
  id: '0x80bc6d2870bb72cb3e37b648c160da20733386f7-1',
  expiration: '132546546',
  keyId: '1',
  tokenURI:
    'https://locksmith.unlock-protocol.com/api/key/0x80bc6d2870bb72cb3e37b648c160da20733386f7/1',

  lock: {
    address: '0xf8112a74d38f56e404282c3c5071eaaed0c29b40',
    expirationDuration: '300',
    name: 'ERC20 paywall lock',
    tokenAddress: '0x0000000000000000000000000000000000000000',
    price: '50',
    owner: '0x455375453031ac5fd7cf0e42291f2d8e3df67f85',
  },
}
const dismiss: jest.Mock<any, any> = jest.fn()
const component: React.ReactElement<any> = (
  <CancelAndRefundModal
    active
    dismiss={dismiss}
    lock={aKey.lock}
    account={accountAddress}
  />
)

const componentInactive: React.ReactElement<any> = (
  <CancelAndRefundModal
    active
    dismiss={dismiss}
    lock={undefined}
    account={accountAddress}
  />
)

const render = () => {
  return rtl.render(component)
}

const renderInactive = () => {
  return rtl.render(componentInactive)
}

const mockWalletService = {
  getCancelAndRefundValueFor: jest.fn(),
}

describe('CancelAndRefundModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(React, 'useContext').mockImplementation((context) => {
      if (context === WalletServiceContext) {
        return mockWalletService
      }
    })
  })
  it('correctly render CancelAndRefund', () => {
    expect.assertions(1)
    const { container } = render()
    expect(container).toBeDefined()
  })

  it('should show error if lock is not passaed as prop', () => {
    expect.assertions(1)
    const { getByText } = renderInactive()
    const message = getByText('No lock selected')
    expect(message).toBeDefined()
  })

  it('should call dismiss when CancelAndRefund confirmed', async () => {
    expect.assertions(5)
    const { container } = render()

    expect(dismiss).toBeCalledTimes(0)
    const confirmButton = container.querySelector('button') as HTMLElement
    expect(confirmButton).toBeDefined()
    await waitFor(() => expect(confirmButton).not.toBeDisabled(), {
      timeout: 5000,
    })
    rtl.fireEvent.click(confirmButton)
    expect(dismiss).toBeCalledTimes(1)
  })
})
