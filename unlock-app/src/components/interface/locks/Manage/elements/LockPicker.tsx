import networks from '@unlock-protocol/networks'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { addressMinify } from '~/utils/strings'
import { SubgraphService } from '@unlock-protocol/unlock-js'
import { Button, Input, Select } from '@unlock-protocol/ui'
import Link from 'next/link'
import { useConfig } from '~/utils/withConfig'
import { useAuth } from '~/contexts/AuthenticationContext'

interface LockPickerProps {
  owner: string
  onChange: (lockAddress?: string, network?: number | string) => void
}

interface LockImageProps {
  lockAddress: string
}

const SelectPlaceholder = () => {
  return (
    <span className="w-full h-8 rounded-lg animate-pulse bg-slate-200"></span>
  )
}

const LockImage = ({ lockAddress }: LockImageProps) => {
  const config = useConfig()
  const lockImage = `${config.services.storage.host}/lock/${lockAddress}/icon`

  return (
    <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-200 rounded-full">
      <img
        src={lockImage}
        alt={lockAddress}
        className="object-cover w-full h-full bg-center"
      />
    </div>
  )
}

export const LockPicker = ({ owner, onChange }: LockPickerProps) => {
  const { network: connectedNetwork } = useAuth()
  const [lockAddress, setLockAddress] = useState<any>(undefined)
  const [network, setNetwork] = useState<any>(connectedNetwork!)
  const [showCustomLockAddress, setShowCustomLockAddress] = useState(false)
  const [customLockAddress, setCustomLockAddress] = useState('')

  const getLocksByNetwork = async () => {
    if (!network) return null

    const service = new SubgraphService()
    return (
      (await service.locks(
        {
          first: 1000,
          where: {
            lockManagers_contains: [owner!],
          },
        },
        {
          networks: [`${network!}`],
        }
      )) ?? []
    )
  }

  const { isLoading: isLoadingLocksByNetwork, data: locksByNetwork = [] } =
    useQuery([network, owner, connectedNetwork], async () =>
      getLocksByNetwork()
    )

  const networkHasLocks = (locksByNetwork ?? [])?.length > 0
  const networksOptions = Object.entries(networks).map(
    ([id, { name: label }]: [string, any]) => ({
      label,
      value: id,
    })
  )

  const locksOptions: any = locksByNetwork?.map(({ address, name }: any) => {
    const disabled = Object.keys(locksByNetwork)?.find(
      (lockAddress: string) =>
        lockAddress?.toLowerCase() === address?.toLowerCase()
    )
    return {
      prepend: <LockImage lockAddress={address} />,
      label: `${name}`,
      value: address,
      append: addressMinify(address),
      disabled,
    }
  })

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(lockAddress, network)
    }
  }, [lockAddress, network, onChange])

  return (
    <div className="flex flex-col w-full gap-2">
      <Select
        label="Network"
        options={networksOptions}
        size="small"
        defaultValue={connectedNetwork}
        onChange={setNetwork}
      />
      {isLoadingLocksByNetwork ? (
        <SelectPlaceholder />
      ) : (
        <>
          {showCustomLockAddress ? (
            <Input
              label="Custom address"
              size="small"
              onChange={(e) => setCustomLockAddress(e?.target?.value ?? '')}
            />
          ) : (
            <>
              {networkHasLocks ? (
                <Select
                  label="Lock"
                  options={locksOptions}
                  size="small"
                  onChange={setLockAddress}
                />
              ) : (
                network && (
                  <span className="text-base">
                    You have not deployed locks on this network yet.{' '}
                    <Link className="underline" href="/locks/create">
                      Deploy one now
                    </Link>
                    .
                  </span>
                )
              )}
            </>
          )}
        </>
      )}
      <div className="flex justify-end gap-3">
        <Button
          onClick={() => setShowCustomLockAddress(!showCustomLockAddress)}
          variant="outlined-primary"
          size="tiny"
        >
          {showCustomLockAddress ? 'Select from list' : 'Add custom address'}
        </Button>
        {showCustomLockAddress && (
          <Button
            onClick={() => setLockAddress(customLockAddress)}
            size="tiny"
            disabled={customLockAddress?.length === 0}
          >
            Confirm
          </Button>
        )}
      </div>
    </div>
  )
}
