'use client'
import { Button } from '@/components/shadcn/ui/button'

export default function DownloadPDFButton(props: { url: string }) {
  const { url } = props

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'download.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }
  const openPDF = () => {
    window.open(url, '_blank')
  }

  //   return <Button onClick={handleDownload}>PDF</Button>
  return <Button onClick={openPDF}>PDF</Button>
}
