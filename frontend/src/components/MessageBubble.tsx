import React from 'react';
import { User, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { Message } from '../types/resource-allocation';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [showSources, setShowSources] = React.useState(false);
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 p-4 ${isUser ? 'bg-transparent' : 'bg-gray-800/50'}`}>
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-green-600'
        }`}>
          {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-gray-100 whitespace-pre-wrap break-words leading-7">
          {message.content}
        </div>

        {message.sourceDocuments && message.sourceDocuments.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-100 text-sm transition-colors"
            >
              {showSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {message.sourceDocuments.length} source{message.sourceDocuments.length !== 1 ? 's' : ''}
            </button>

            {showSources && (
              <div className="mt-3 space-y-3">
                {message.sourceDocuments.map((doc, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-gray-100 font-medium text-sm">
                        {doc.person_name || 'Unknown Person'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {doc.data_type}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                      <div>Age: {doc.age || 'N/A'}</div>
                      <div>Location: {doc.location || 'N/A'}</div>
                      <div>Job: {doc.job_title || 'N/A'}</div>
                      <div>Income: {doc.income_level || 'N/A'}</div>
                    </div>

                    <div className="text-gray-400 text-sm bg-gray-900 rounded p-2">
                      {doc.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-3 text-gray-400 text-xs">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;