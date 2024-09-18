'use client'

import { Button } from '@/components/shadcn/ui/button'

import { useEffect, useState } from 'react'
import {
  disconnectDiscord,
  getDiscordConnectionStatus,
  initiateDiscordConnection
} from './actions'
import { useToast } from '@/components/ui/Toasts/use-toast'

export default function DiscordIntegration() {
  const [isConnected, setIsConnected] = useState(false)
  // const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // useEffect(() => {
  //   getDiscordConnectionStatus()
  //     .then(setIsConnected)
  //     .catch((error) => {
  //       console.error('Error fetching Discord connection status:', error)
  //       toast({
  //         title: 'Failed to fetch Discord status',
  //         variant: 'destructive'
  //       })
  //     })
  //     .finally(() => setIsLoading(false))
  // }, [toast])

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
      await disconnectDiscord()
      setIsConnected(false)
      toast({ title: 'Discord disconnected successfully' })
    } catch (error) {
      console.error('Error disconnecting Discord:', error)
      toast({ title: 'Failed to disconnect Discord', variant: 'destructive' })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Discord Integration</h2>
      {isConnected ? (
        <Button onClick={handleDisconnect}>Disconnect Discord</Button>
      ) : (
        <Button onClick={handleConnect}>Connect Discord</Button>
      )}
    </div>
  )
}
