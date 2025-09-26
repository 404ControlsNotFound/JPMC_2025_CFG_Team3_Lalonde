import React, { useState } from 'react';
import { Settings, Plus, Minus } from 'lucide-react';
import { ResourceAllocationRequest } from '../types';

interface ResourceAllocationFormProps {
  onSubmit: (request: ResourceAllocationRequest) => void;
  isLoading: boolean;
}

const ResourceAllocationForm: React.FC<ResourceAllocationFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ResourceAllocationRequest>({
    resource_name: '',
    available_quantity: 1,
    resource_description: '',
    eligibility_criteria: '',
    priority_weights: {
      recent_recipients: 0.3,
      need_level: 0.7,
    },
    additional_filters: {},
  });

  const [newWeightKey, setNewWeightKey] = useState('');
  const [newWeightValue, setNewWeightValue] = useState(0);
  const [newFilterKey, setNewFilterKey] = useState('');
  const [newFilterValue, setNewFilterValue] = useState('');

  const handleInputChange = (field: keyof ResourceAllocationRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWeightChange = (key: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      priority_weights: { ...prev.priority_weights, [key]: value }
    }));
  };

  const addWeight = () => {
    if (newWeightKey && newWeightValue >= 0 && newWeightValue <= 1) {
      handleWeightChange(newWeightKey, newWeightValue);
      setNewWeightKey('');
      setNewWeightValue(0);
    }
  };

  const removeWeight = (key: string) => {
    const weights = { ...formData.priority_weights };
    delete weights[key];
    setFormData(prev => ({ ...prev, priority_weights: weights }));
  };

  const addFilter = () => {
    if (newFilterKey && newFilterValue) {
      setFormData(prev => ({
        ...prev,
        additional_filters: { ...prev.additional_filters, [newFilterKey]: newFilterValue }
      }));
      setNewFilterKey('');
      setNewFilterValue('');
    }
  };

  const removeFilter = (key: string) => {
    const filters = { ...formData.additional_filters };
    delete filters[key];
    setFormData(prev => ({ ...prev, additional_filters: filters }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-80 bg-sidebar-bg h-full flex flex-col border-r border-border-gray">
      <div className="p-4 border-b border-border-gray">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-text-secondary" />
          <h2 className="text-text-primary font-semibold">Resource Allocation</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-text-primary text-sm font-medium">Basic Information</h3>

            <div>
              <label className="block text-text-secondary text-xs mb-1">Resource Name</label>
              <input
                type="text"
                value={formData.resource_name}
                onChange={(e) => handleInputChange('resource_name', e.target.value)}
                className="w-full bg-input-bg border border-border-gray rounded px-3 py-2 text-text-primary text-sm"
                placeholder="e.g., Emergency Food Assistance"
                required
              />
            </div>

            <div>
              <label className="block text-text-secondary text-xs mb-1">Available Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.available_quantity}
                onChange={(e) => handleInputChange('available_quantity', parseInt(e.target.value))}
                className="w-full bg-input-bg border border-border-gray rounded px-3 py-2 text-text-primary text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-text-secondary text-xs mb-1">Description</label>
              <textarea
                value={formData.resource_description}
                onChange={(e) => handleInputChange('resource_description', e.target.value)}
                className="w-full bg-input-bg border border-border-gray rounded px-3 py-2 text-text-primary text-sm h-20 resize-none"
                placeholder="Describe what this resource provides..."
                required
              />
            </div>

            <div>
              <label className="block text-text-secondary text-xs mb-1">Eligibility Criteria</label>
              <textarea
                value={formData.eligibility_criteria}
                onChange={(e) => handleInputChange('eligibility_criteria', e.target.value)}
                className="w-full bg-input-bg border border-border-gray rounded px-3 py-2 text-text-primary text-sm h-20 resize-none"
                placeholder="Who is eligible for this resource?"
                required
              />
            </div>
          </div>

          {/* Priority Weights */}
          <div className="space-y-3">
            <h3 className="text-text-primary text-sm font-medium">Priority Weights</h3>

            {Object.entries(formData.priority_weights).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-text-secondary text-xs mb-1">
                    {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value}
                    onChange={(e) => handleWeightChange(key, parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-text-secondary text-xs mt-1">{(value * 100).toFixed(0)}%</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeWeight(key)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <input
                type="text"
                value={newWeightKey}
                onChange={(e) => setNewWeightKey(e.target.value)}
                className="flex-1 bg-input-bg border border-border-gray rounded px-2 py-1 text-text-primary text-xs"
                placeholder="Weight name"
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={newWeightValue}
                onChange={(e) => setNewWeightValue(parseFloat(e.target.value))}
                className="w-16 bg-input-bg border border-border-gray rounded px-2 py-1 text-text-primary text-xs"
              />
              <button
                type="button"
                onClick={addWeight}
                className="text-green-400 hover:text-green-300 p-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="space-y-3">
            <h3 className="text-text-primary text-sm font-medium">Additional Filters</h3>

            {Object.entries(formData.additional_filters || {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-text-secondary text-xs">{key}: {String(value)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFilter(key)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <input
                type="text"
                value={newFilterKey}
                onChange={(e) => setNewFilterKey(e.target.value)}
                className="flex-1 bg-input-bg border border-border-gray rounded px-2 py-1 text-text-primary text-xs"
                placeholder="Filter name"
              />
              <input
                type="text"
                value={newFilterValue}
                onChange={(e) => setNewFilterValue(e.target.value)}
                className="flex-1 bg-input-bg border border-border-gray rounded px-2 py-1 text-text-primary text-xs"
                placeholder="Filter value"
              />
              <button
                type="button"
                onClick={addFilter}
                className="text-green-400 hover:text-green-300 p-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !formData.resource_name || !formData.resource_description}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded text-sm font-medium transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Generate Recommendations'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResourceAllocationForm;