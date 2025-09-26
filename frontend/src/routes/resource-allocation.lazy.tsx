import { createLazyFileRoute } from '@tanstack/react-router'
import ChatInterface from '../components/ChatInterface'

export const Route = createLazyFileRoute('/resource-allocation')({
  component: ResourceAllocation,
})

function ResourceAllocation() {
  return (
    <div className="h-full bg-gray-900">
      <ChatInterface />
    </div>
  )
}