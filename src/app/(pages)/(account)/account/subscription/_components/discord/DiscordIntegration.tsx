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

import { useEffect, useState } from 'react'
import {
  disconnectDiscord,
  getDiscordConnectionStatus,
  initiateDiscordConnection
} from './actions'
import { useToast } from '@/components/ui/Toasts/use-toast'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/shadcn/ui/badge'
import clsx from 'clsx'

export default function DiscordIntegration({
  discordConnectionStatusResult,
  userId
}: {
  discordConnectionStatusResult: {
    status: boolean | null
    error: string | null
  }
  userId: string
}) {
  // TODO: when stripe subscription updates
  // TODO: when discord account is removed by hand in discord
  const { toast } = useToast()
  const router = useRouter()
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

  const handleDisconnect = async () => {
    try {
      await disconnectDiscord(userId)
      router.refresh()
      toast({ title: 'Discord disconnected successfully' })
    } catch (error) {
      console.error('Error disconnecting Discord:', error)
      toast({ title: 'Failed to disconnect Discord', variant: 'destructive' })
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

      {discordConnectionStatusResult.error ? (
        <div className="text-red-500">
          {discordConnectionStatusResult.error}
        </div>
      ) : discordConnectionStatusResult.status ? (
        // <Button onClick={handleDisconnect}>Disconnect Discord</Button>
        <p className="text-secondary-foreground text-sm">
          Your Discord account will remain connected as long as your
          subscription is active. If you wish to disconnect Discord before
          canceling your subscription, please contact the site administrator at:{' '}
          <a href="mailto:admin@luxcache.com" className="underline">
            admin@luxcache.com
          </a>
          .
        </p>
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
