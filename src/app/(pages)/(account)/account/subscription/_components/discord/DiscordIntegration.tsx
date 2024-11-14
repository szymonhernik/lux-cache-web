'use client'

import { Button } from '@/components/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/shadcn/ui/dialog'

import { useState } from 'react'
import { initiateDiscordConnection } from '@/utils/actions/discord'
import { useToast } from '@/components/ui/Toasts/use-toast'
import { Badge } from '@/components/shadcn/ui/badge'
import clsx from 'clsx'
import { SubscriptionWithProduct } from '@/utils/types'

export default function DiscordIntegration({
  discordConnectionStatusResult,
  userId,
  subscription
}: {
  discordConnectionStatusResult: {
    status: boolean | null
    error: string | null
  } | null
  userId: string
  subscription: SubscriptionWithProduct | null
}) {
  if (!discordConnectionStatusResult) {
    return null // or some loading state
  }

  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConnect = async () => {
    try {
      const url = await initiateDiscordConnection()
      window.location.href = url
    } catch (error) {
      console.error('Error initiating Discord connection:', error)
      toast({
        title: 'Failed to initiate Discord connection',
        variant: 'destructive'
      })
    }
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleConfirmConnect = async () => {
    closeModal()
    await handleConnect()
  }

  return (
    <div>
      <div className="flex flex-row items-center gap-2 mb-4">
        <h2 className="text-lg font-bold">Discord Integration</h2>
        <Badge
          className={clsx(
            ' ',
            discordConnectionStatusResult.status
              ? 'bg-green-200 hover:bg-green-200'
              : ''
          )}
          variant={
            discordConnectionStatusResult.status ? 'default' : 'secondary'
          }
        >
          {discordConnectionStatusResult.status ? 'Connected' : 'Not Connected'}
        </Badge>
      </div>

      {!subscription ? (
        <p className="text-secondary-foreground text-sm">
          You need an active subscription to connect your Discord account.
          Please subscribe first.
        </p>
      ) : discordConnectionStatusResult.error ? (
        <div className="text-red-500">
          {discordConnectionStatusResult.error}
        </div>
      ) : discordConnectionStatusResult.status ? (
        <>
          {/* <Button
              onClick={handleUpdateDiscordRole}
              className="bg-[#5865F2] hover:bg-[#5865F2] hover:brightness-110"
              disabled={isUpdatingRole}
            >
              {isUpdatingRole ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Update Discord Role
            </Button> */}
          {/* <Button
              onClick={handleRemoveDiscordIntegration}
              // className="bg-[#5865F2] hover:bg-[#5865F2] hover:brightness-110"
              disabled={isUpdatingRole}
            >
              Remove Discord Integration
            </Button> */}

          <div className="rounded-md border p-4 mt-4 bg-secondary shadow-sm space-y-2">
            <p className="text-secondary-foreground text-xs ">
              Your Discord account is successfully connected. For any other
              questions or issues, please contact us at:{' '}
              <a href="mailto:support@luxcache.com" className="underline">
                support@luxcache.com
              </a>
            </p>
          </div>
        </>
      ) : (
        <>
          <Button
            onClick={openModal}
            className="bg-[#5865F2] hover:bg-[#5865F2] hover:brightness-110"
          >
            Connect Discord
          </Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Discord</DialogTitle>
                <DialogDescription className="text-primary-foreground space-y-4">
                  Connecting your Discord account allows us to:
                  <ul className="list-disc list-inside mt-2">
                    <li>Provide access to exclusive Discord channels</li>
                    <li>Sync your subscription status with Discord roles</li>
                    <li>
                      Offer seamless integration between our service and Discord
                    </li>
                  </ul>
                  <p>
                    Your Discord account will remain connected as long as your
                    subscription is active. If you wish to disconnect Discord
                    before canceling your subscription, please contact the site
                    administrator at:{' '}
                    <span className="underline">admin@luxcache.com</span>.
                  </p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmConnect}>
                  Confirm Connection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
