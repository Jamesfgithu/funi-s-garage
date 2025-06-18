'use client';
import { SafelistLink } from "@/types/safelist";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Plus, Loader2, ChevronDown, CheckCircle, Clock, Save, X } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { getUserSafelistLinks, addSafelistLink, updateLastSubmitted, calculateReadiness, deleteSafelistLink } from '@/lib/firebase/firestore';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Timestamp } from 'firebase/firestore';

const frequencyOptions = [
  { value: 0.25, label: 'Every 6 hours', displayValue: '6 hours' },
  { value: 0.5, label: 'Every 12 hours', displayValue: '12 hours' },
  { value: 1, label: 'Every 24 hours', displayValue: '24 hours' },
  { value: 2, label: 'Every 2 days', displayValue: '2 days' },
  { value: 3, label: 'Every 3 days', displayValue: '3 days' },
  { value: 4, label: 'Every 4 days', displayValue: '4 days' },
  { value: 5, label: 'Every 5 days', displayValue: '5 days' },
  { value: 6, label: 'Every 6 days', displayValue: '6 days' },
  { value: 7, label: 'Every 7 days', displayValue: '7 days' },
  { value: 'custom', label: 'Custom', displayValue: 'custom' }
];

// Parse custom frequency input like "5 hours" or "3 days"
function parseCustomFrequency(input: string) {
  const trimmed = input.trim().toLowerCase();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s+(hours?|days?)$/);
  
  if (!match) {
    return null; // Invalid format
  }
  
  const number = parseFloat(match[1]);
  const unit = match[2];
  
  if (unit.startsWith('hour')) {
    return number / 24; // Convert hours to days
  } else {
    return number; // Already in days
  }
}

// Format time remaining for display
function formatTimeRemaining(daysUntilReady: number) {
  if (daysUntilReady <= 0) return 'Ready Now';
  
  const hours = Math.floor(daysUntilReady / (1000 * 60 * 60));
  const minutes = Math.floor((daysUntilReady % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `Ready in ${hours}h ${minutes}m`;
  } else {
    return `Ready in ${minutes}m`;
  }
}

export default function SafelistManagementPage() {
  const [user, loading, error] = useAuthState(auth);
  const [links, setLinks] = useState<SafelistLink[]>([]);

const handleDeleteLink = async (linkId: string) => {
  if (!user) return;
  try {
    await deleteSafelistLink(user ? user.uid : "", linkId);
    setLinks(links.filter(link => link.id !== linkId));
    toast.success('Safelist link deleted successfully!');
  } catch (error) {
    console.error('Delete failed:', error);
    toast.error('Failed to delete safelist link');
  }
};
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkFrequency, setNewLinkFrequency] = useState(7);
  const [newLinkNotes, setNewLinkNotes] = useState('');
  const [customFrequency, setCustomFrequency] = useState('');
  const [customError, setCustomError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [editingLink, setEditingLink] = useState<SafelistLink | null>(null);
  const [editForm, setEditForm] = useState<Partial<SafelistLink>>({});
  const [editDropdownOpen, setEditDropdownOpen] = useState(false);
  const [editCustomFrequency, setEditCustomFrequency] = useState('');
  const [editCustomError, setEditCustomError] = useState('');
  const [editIsCustomSelected, setEditIsCustomSelected] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchLinks() {
      if (user) {
        setLoadingLinks(true);
        const userLinks = await getUserSafelistLinks(user.uid);
        setLinks(userLinks);
        setLoadingLinks(false);
      }
    }
    fetchLinks();
  }, [user]);

  function handleFrequencySelect(value: string) {
    if (value === 'custom') {
      setIsCustomSelected(true);
      setNewLinkFrequency(7); // Default fallback
    } else {
      setIsCustomSelected(false);
      setNewLinkFrequency(parseInt(value, 10));
      setCustomFrequency('');
      setCustomError('');
    }
    setDropdownOpen(false);
  }

  function handleEditFrequencySelect(value: string) {
    if (value === 'custom') {
      setEditIsCustomSelected(true);
      setEditForm({...editForm, frequency: parseInt(value, 10)});
    } else {
      setEditIsCustomSelected(false);
      setEditForm({...editForm, frequency: parseInt(value, 10)});
      setEditCustomFrequency('');
      setEditCustomError('');
    }
    setEditDropdownOpen(false);
  }

  function handleCustomFrequencyChange(value: string) {
    setCustomFrequency(value);
    setCustomError('');
    
    if (value.trim()) {
      const parsed = parseCustomFrequency(value);
      if (parsed !== null) {
        setNewLinkFrequency(parsed);
      } else {
        setCustomError('Format: "X hours" or "X days" (e.g., "6 hours", "3 days")');
      }
    }
  }

  function handleEditCustomFrequencyChange(value: string) {
    setEditCustomFrequency(value);
    setEditCustomError('');
    
    if (value.trim()) {
      const parsed = parseCustomFrequency(value);
      if (parsed !== null) {
        setEditForm({...editForm, frequency: parsed});
      } else {
        setEditCustomError('Format: "X hours" or "X days" (e.g., "6 hours", "3 days")');
      }
    }
  }

  async function handleAddLink() {
    if (!newLinkName || !newLinkUrl) return;
    
    if (isCustomSelected && !customFrequency.trim()) {
      setCustomError('Please enter a custom frequency');
      return;
    }
    
    if (isCustomSelected && customError) {
      return; // Don't submit if there's a validation error
    }

    const newLink = { isActive: true,
      name: newLinkName,
      url: newLinkUrl,
      category: 'default',
      frequency: newLinkFrequency,
      notes: newLinkNotes,
    };
    
    if (!user) return;
    const response = await addSafelistLink({ ...newLink, createdAt: new Date(), userId: user.uid }, user.uid);
    if (response.id && response.id) {
      setNewLinkName('');
      setNewLinkUrl('');
      setNewLinkFrequency(7);
      setNewLinkNotes('');
      setCustomFrequency('');
      setIsCustomSelected(false);
      setCustomError('');
    }
  }

  function handleLinkClick(link: SafelistLink) {
    if (editingLink?.id === link.id) {
      setEditingLink(null);
      setEditForm({});
      setEditIsCustomSelected(false);
      setEditCustomFrequency('');
      setEditCustomError('');
    } else {
      setEditingLink(link);
      setEditForm({
        name: link.name,
        url: link.url,
        frequency: link.frequency,
        notes: link.notes || ''
      });
      // Check if current frequency matches a preset option
      const matchingOption = frequencyOptions.find(opt => opt.value === link.frequency);
      setEditIsCustomSelected(!matchingOption);
      if (!matchingOption) {
        // Set custom frequency display
        if (link.frequency < 1) {
          setEditCustomFrequency(`${link.frequency * 24} hours`);
        } else {
          setEditCustomFrequency(`${link.frequency} days`);
        }
      }
    }
  }

  async function handleSaveEdit() {
    if (!editingLink || !user) return;
    
    if (editIsCustomSelected && !editCustomFrequency.trim()) {
      setEditCustomError('Please enter a custom frequency');
      return;
    }
    
    if (editIsCustomSelected && editCustomError) {
      return;
    }
    
    setSaving(true);
    try {
      const linkRef = doc(db, 'users', user.uid, 'safelistLinks', editingLink.id);
      await updateDoc(linkRef, {
        name: editForm.name,
        url: editForm.url,
        frequency: editForm.frequency,
        notes: editForm.notes,
        updatedAt: Timestamp.now()
      });

      // Update local state
      setLinks(links.map(link => 
        link.id === editingLink.id 
          ? { ...link, ...editForm, updatedAt: Timestamp.now() }
          : link
      ));

      setEditingLink(null);
      setEditForm({});
      setEditIsCustomSelected(false);
      setEditCustomFrequency('');
      setEditCustomError('');
    } catch (error) {
      console.error('Error updating link:', error);
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditingLink(null);
    setEditForm({});
    setEditIsCustomSelected(false);
    setEditCustomFrequency('');
    setEditCustomError('');
  }

  function getStatusInfo(link: SafelistLink) {
    const { status, daysUntilReady } = calculateReadiness(link ?? null);
    
    let statusColor = '';
    let statusIcon = null;
    let statusText = '';
    let pulseClass = '';

    switch (status) {
      case 'ready':
        statusColor = 'text-green-500';
        statusIcon = <CheckCircle className="h-4 w-4" />;
        statusText = 'Ready Now';
        pulseClass = 'animate-pulse';
        break;
      case 'soon':
        statusColor = 'text-amber-500';
        statusIcon = <Clock className="h-4 w-4" />;
        statusText = formatTimeRemaining(daysUntilReady);
        break;
      case 'waiting':
        statusColor = 'text-red-500';
        statusIcon = <Clock className="h-4 w-4" />;
        statusText = formatTimeRemaining(daysUntilReady);
        break;
    }

    return { statusColor, statusIcon, statusText, pulseClass };
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading safelist links...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to manage your safelist links.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const selectedFrequency = frequencyOptions.find(opt => opt.value === newLinkFrequency);
  const displayLabel = isCustomSelected ? `Custom: ${customFrequency || 'Enter frequency'}` : 
                      (selectedFrequency?.label || 'Every 7 days');

  // For edit form
  const editSelectedFrequency = frequencyOptions.find(opt => opt.value === editForm.frequency);
  const editDisplayLabel = editIsCustomSelected ? `Custom: ${editCustomFrequency || 'Enter frequency'}` : 
                          (editSelectedFrequency?.label || 'Every 7 days');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Safelist Manager</h1>
          <p className="text-muted-foreground mt-2">
            Streamline Your Links
          </p>
        </div>
        <Shield className="h-8 w-8 text-primary" />
      </div>

      {/* Add New Link Form - Enhanced with Gold Hover Border */}
      <Card className="transition-all duration-200 hover:border-primary hover:shadow-md">
        <CardHeader>
          <CardTitle>Add New Safelist Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* First Row: Name and URL */}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Link Name"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                className="flex-1 p-2 border rounded bg-background text-foreground"
              />
              <input
                type="url"
                placeholder="Link URL"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="flex-1 p-2 border rounded bg-background text-foreground"
              />
            </div>

            {/* Second Row: Frequency and Notes */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Enhanced Frequency Dropdown */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full p-2 border rounded bg-background text-foreground flex items-center justify-between hover:bg-muted"
                >
                  <span className="truncate">{displayLabel}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0 ml-2" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                    {frequencyOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleFrequencySelect(option.value.toString())}
                        className="w-full p-2 text-left hover:bg-muted text-foreground border-b border-border last:border-b-0"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes Field */}
              <input
                type="text"
                placeholder="Notes (e.g., credits remaining, list quality)"
                value={newLinkNotes}
                onChange={(e) => setNewLinkNotes(e.target.value)}
                className="flex-1 p-2 border rounded bg-background text-foreground"
              />
            </div>

            {/* Custom Frequency Input (shows when Custom is selected) */}
            {isCustomSelected && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter custom frequency (e.g., '6 hours', '10 days')"
                  value={customFrequency}
                  onChange={(e) => handleCustomFrequencyChange(e.target.value)}
                  className={`w-full p-2 border rounded bg-background text-foreground ${
                    customError ? 'border-red-500' : ''
                  }`}
                />
                {customError && (
                  <p className="text-sm text-red-500">{customError}</p>
                )}
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={handleAddLink}
              disabled={isCustomSelected && (!!customError || !customFrequency.trim())}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Link
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Links List */}
      {loadingLinks ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading links...</span>
        </div>
      ) : links.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Safelist Links Found</CardTitle>
            <CardDescription>Add your first link above to get started with safelist management.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {links.map((link) => {
                <button onClick={() => handleDeleteLink(link.id)} className="text-red-600 hover:text-red-800 ml-2">Delete</button>
            const { statusColor, statusIcon, statusText, pulseClass } = getStatusInfo(link);
            const isEditing = editingLink?.id === link.id;
            
            return (
              <Card 
                key={link.id}
                className="cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-md"
                onClick={() => !isEditing && handleLinkClick(link)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{link.name}</CardTitle>
                        <div className={`flex items-center gap-1 ${statusColor} ${pulseClass}`}>
                          {statusIcon}
                          <span className="text-sm font-medium">{statusText}</span>
                        </div>
                      </div>
                      <CardDescription className="mt-1">{link.url}</CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          Mail every {link.frequency < 1 ? `${link.frequency * 24} hours` : `${link.frequency} days`}
                        </span>
                        {link.notes && (
                          <span className="italic">Notes: {link.notes}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Full Inline Editing with Compact Dropdown */}
                  {isEditing && (
                    <div className="mt-4 p-4 bg-muted rounded-lg space-y-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Edit Link</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                          >
                            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                          >
                            <X className="h-3 w-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full p-2 border rounded bg-background text-foreground text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">URL</label>
                          <input
                            type="url"
                            value={editForm.url || ''}
                            onChange={(e) => setEditForm({...editForm, url: e.target.value})}
                            className="w-full p-2 border rounded bg-background text-foreground text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Frequency</label>
                          <div className="relative">
                           <button
                              type="button"
                              onClick={() => setEditDropdownOpen(!editDropdownOpen)}
                              className="w-full p-2 border rounded bg-background text-foreground flex items-center justify-between hover:bg-muted text-sm"
                            >
                              <span className="truncate text-xs">{editDisplayLabel}</span>
                              <ChevronDown className="h-3 w-3 flex-shrink-0 ml-2" />
                            </button>
                            
                            {editDropdownOpen && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded shadow-lg z-20 max-h-48 overflow-y-auto">
                                {frequencyOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleEditFrequencySelect(option.value.toString())}
                                    className="w-full p-2 text-left hover:bg-muted text-foreground border-b border-border last:border-b-0 text-xs"
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Custom Frequency Input for Edit */}
                          {editIsCustomSelected && (
                            <div className="mt-2">
                              <input
                                type="text"
                                placeholder="e.g., '6 hours', '10 days'"
                                value={editCustomFrequency}
                                onChange={(e) => handleEditCustomFrequencyChange(e.target.value)}
                                className={`w-full p-2 border rounded bg-background text-foreground text-sm ${
                                  editCustomError ? 'border-red-500' : ''
                                }`}
                              />
                              {editCustomError && (
                                <p className="text-xs text-red-500 mt-1">{editCustomError}</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Notes</label>
                          <input
                            type="text"
                            value={editForm.notes || ''}
                            onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                            className="w-full p-2 border rounded bg-background text-foreground text-sm"
                            placeholder="Credits, quality notes, etc."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteLink(link.id)}
                  className="mt-2"
                >
                  Delete
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { toast } from 'sonner';

// In your addSafelistLink success handler:
toast('Safelist link added successfully!');
