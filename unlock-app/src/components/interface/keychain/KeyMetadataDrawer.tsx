import { Disclosure, Input } from '@unlock-protocol/ui'
import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useStorageService } from '~/utils/withStorageService'
import React from 'react'
import { useWalletService } from '~/utils/withWalletService'
import { useQuery } from '@tanstack/react-query'
import { Property } from '../locks/metadata/custom/AddProperty'
import { Level } from '../locks/metadata/custom/AddLevel'
import { Stat } from '../locks/metadata/custom/AddStat'
import { Transition, Dialog } from '@headlessui/react'
import { RiCloseLine as CloseIcon } from 'react-icons/ri'
import { ToastHelper } from '~/components/helpers/toast.helper'

interface MetadataProps {
  tokenId: string
  network: number
  lock: any
  account: string
}

interface MetadataDrawerProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  tokenId: string
  network: number
  lock: any
  account: string
}

const KeyMetadataPlaceholder: React.FC<unknown> = () => {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="w-[120px] h-[24px] bg-slate-200 animate-pulse"></div>
      <div className="w-full h-[30px] rounded-lg bg-slate-200 animate-pulse"></div>
      <div className="w-full h-[30px] rounded-lg bg-slate-200 animate-pulse"></div>
      <div className="w-full h-[30px] rounded-lg bg-slate-200 animate-pulse"></div>
      <div className="w-full h-[30px] rounded-lg bg-slate-200 animate-pulse"></div>
      <div className="flex">
        <div className="ml-auto w-[100px] h-[40px] bg-slate-200 animate-pulse rounded-full"></div>
      </div>
    </div>
  )
}

interface MetadataPropertiesProps {
  lockAddress: string
  network: number
  isLoading: boolean
}

const Header = ({ title }: any) => {
  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold text-brand-ui-primary">{title}</span>
    </div>
  )
}

const Link = ({ url, label }: any) => {
  return (
    <a
      className="text- text-brand-ui-primary"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {label}
    </a>
  )
}

const PublicLockProperties = ({
  lockAddress,
  network,
  isLoading,
}: MetadataPropertiesProps) => {
  const storageService = useStorageService()
  const { data } = useQuery<Record<string, any>>(
    ['lockMetadata', lockAddress, network],
    async () => {
      const response = await storageService.locksmith.lockMetadata(
        network,
        lockAddress
      )
      return response.data
    },
    {
      onError() {
        ToastHelper.error('Impossible to retrieve public NFT metadata.')
      },
      refetchInterval: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 2,
    }
  )

  const hasLinks =
    data?.external_url || data?.youtube_url || data?.animation_url

  const attributes: {
    value: string
    trait_type: string
    max_value?: number
    display_type?: string
  }[] = data?.attributes ?? []

  const propertyAttributes = attributes.filter(
    (item) => item.trait_type && item.value && !item?.max_value
  )

  const levelsAttributes = attributes?.filter(
    (item) =>
      item.trait_type && item.value && item.max_value && !item.display_type
  )

  const statsAttributes = attributes?.filter(
    (item) =>
      item.trait_type && item.value && item.max_value && item?.display_type
  )

  return (
    <div className="flex flex-col gap-6">
      {data?.attributes?.length > 0 && (
        <div className="flex flex-col gap-4">
          {propertyAttributes?.length > 0 && (
            <Disclosure label="Properties" isLoading={isLoading}>
              <div className="flex flex-wrap gap-6">
                {propertyAttributes?.map((item, index) => (
                  <Property {...item} key={index} />
                ))}
              </div>
            </Disclosure>
          )}
          {levelsAttributes?.length > 0 && (
            <Disclosure label="Levels" isLoading={isLoading}>
              <div className="flex flex-wrap gap-6">
                {levelsAttributes?.map((item, index) => (
                  <Level {...item} key={index} />
                ))}
              </div>
            </Disclosure>
          )}
          {statsAttributes?.length > 0 && (
            <Disclosure label="Stats" isLoading={isLoading}>
              <div className="flex flex-wrap gap-6">
                {statsAttributes?.map((item, index) => (
                  <Stat {...item} key={index} />
                ))}
              </div>
            </Disclosure>
          )}
          {hasLinks && (
            <Disclosure label="Links" isLoading={isLoading}>
              <div className="flex flex-col gap-2">
                {data?.external_url && (
                  <Link label="External URL" url={data?.external_url} />
                )}
                {data?.youtube_url && (
                  <Link label="Youtube URL" url={data?.youtube_url} />
                )}
                {data?.animation_url && (
                  <Link label="Animation URL" url={data?.animation_url} />
                )}
              </div>
            </Disclosure>
          )}
        </div>
      )}
    </div>
  )
}

const KeyMetadata: React.FC<MetadataProps> = ({
  tokenId,
  lock,
  network,
  account,
}) => {
  const [metadata, setMetadata] = useState<{ [key: string]: any }>()
  const [loading, setLoading] = useState(false)
  const storageService = useStorageService()
  const walletService = useWalletService()
  const { register } = useForm()

  useEffect(() => {
    const login = async () => {
      return await storageService.loginPrompt({
        walletService,
        address: account!,
        chainId: network!,
      })
    }
    const getData = async () => {
      setLoading(true)
      await login()
      const data = await storageService.getKeyMetadataValues({
        lockAddress: lock.address,
        keyId: parseInt(tokenId, 10),
        network,
      })
      setLoading(false)
      setMetadata({
        ...data?.userMetadata?.protected,
        ...data?.userMetadata?.public,
      })
    }
    getData()
  }, [
    account,
    tokenId,
    lock.address,
    lock.owner,
    network,
    storageService,
    walletService,
  ])

  const values = Object.entries(metadata ?? {})
  const hasValues = values?.length > 0

  return (
    <div className="max-w-screen-md mx-auto">
      <div className="flex flex-col gap-3 min-h-[300px] text-left">
        <span className="text-3xl font-semibold">
          {`${lock.name} - Metadata`}{' '}
        </span>
        <Disclosure isLoading={loading} label="Key metadata">
          {hasValues ? (
            <>
              <form action="">
                {values?.map(([key, value], index) => {
                  return (
                    <Input
                      label={key}
                      disabled={true}
                      key={index}
                      {...register(key, {
                        value,
                      })}
                    />
                  )
                })}
              </form>
            </>
          ) : (
            <div>There is no metadata associated with that key.</div>
          )}
        </Disclosure>
        <PublicLockProperties
          isLoading={loading}
          lockAddress={lock.address}
          network={network}
        />
        <Header />
      </div>
    </div>
  )
}

export function KeyMetadataDrawer({
  isOpen,
  setIsOpen,
  lock,
  tokenId,
  network,
  account,
}: MetadataDrawerProps) {
  const easeOutTransaction = {
    as: Fragment,
    enter: 'ease-in-out duration-300',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'ease-in-out duration-300',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0',
  }
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto"
        onClose={setIsOpen}
      >
        <div className="absolute inset-0 overflow-y-auto">
          <Transition.Child {...easeOutTransaction}>
            <Dialog.Overlay className="absolute inset-0 transition-opacity bg-gray-500 bg-opacity-50 backdrop-blur" />
          </Transition.Child>
          <div className="fixed inset-y-0 right-0 w-full">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-full h-screen p-6 overflow-y-auto bg-ui-secondary-100">
                <Transition.Child {...easeOutTransaction}>
                  <button
                    aria-label="close"
                    className="hover:fill-brand-ui-primary"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                  >
                    <CloseIcon className="fill-inherit" size={24} />
                  </button>
                </Transition.Child>
                <div className="mt-4 space-y-2">
                  <Dialog.Title className="text-xl font-medium text-gray-800"></Dialog.Title>
                  <Dialog.Description className="text-base text-gray-800"></Dialog.Description>
                </div>
                <div className="relative flex-1">
                  <KeyMetadata
                    account={account}
                    lock={lock}
                    tokenId={tokenId}
                    network={network}
                  />
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
