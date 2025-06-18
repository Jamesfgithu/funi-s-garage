'use client';
import { SafelistLink } from "@/types/safelist";
import { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from "@/app/components/ui/button";
import { Shield, Plus, Loader2, ChevronDown, CheckCircle, Clock, Save, X } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/lib/firebase/config';
import { getUserSafelistLinks, addSafelistLink, deleteSafelistLink } from '@/app/lib/firebase/firestore';
import { updateDoc, doc, Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';

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

function parseCustomFrequency(input: string) {
  const trimmed = input.trim().toLowerCase();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s+(hours?|days?)$/);
  if (!match) return null;
  const number = parseFloat(match[1]);
  const unit = match[2];
  return unit.startsWith('hour') ? number / 24 : number;
}

function formatTimeRemaining(msUntilReady: number) {
  if (msUntilReady <= 0) return 'Ready Now';
  const totalMinutes = Math.floor(msUntilReady / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `Ready in ${hours}h ${minutes}m`;
  return `Ready in ${minutes}m`;
}

function calculateReadiness(link: SafelistLink) {
    if (!link?.lastSubmitted) {
      return { status: 'ready', daysUntilReady: 0 };
    }
    const lastSubmittedTime = (link.lastSubmitted as any).toDate().getTime();
    const frequencyMs = link.frequency * 24 * 60 * 60 * 1000;
    const readyTime = lastSubmittedTime + frequencyMs;
    const now = Date.now();
    const timeLeft = readyTime - now;

    if (timeLeft <= 0) {
      return { status: 'ready', daysUntilReady: 0 };
    }
    const oneHour = 60 * 60 * 1000;
    if (timeLeft < oneHour) {
      return { status: 'soon', daysUntilReady: timeLeft };
    }
    return { status: 'waiting', daysUntilReady: timeLeft };
}

export default function SafelistManagementPage() {
  const [user, loading] = useAuthState(auth);
  const [links, setLinks] = useState<SafelistLink[]>([]);
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
    if (user) {
      setLoadingLinks(true);
      getUserSafelistLinks(user.uid).then((userLinks: SafelistLink[]) => {
        setLinks(userLinks);
        setLoadingLinks(false);
      });
    } else if (!loading) {
        setLoadingLinks(false);
    }
  }, [user, loading]);

  const handleDelete = async (linkId: string) => {
    if (!user) return;
    try {
      await deleteSafelistLink(user.uid, linkId);
      setLinks(links.filter(link => link.id !== linkId));
      toast.success('Safelist link deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete safelist link');
    }
  };

  function handleFrequencySelect(value: string) {
    if (value === 'custom') {
      setIsCustomSelected(true);
      setNewLinkFrequency(7);
    } else {
      setIsCustomSelected(false);
      setNewLinkFrequency(parseFloat(value));
      setCustomFrequency('');
      setCustomError('');
    }
    setDropdownOpen(false);
  }

  function handleEditFrequencySelect(value: string) {
    const isCustom = value === 'custom';
    setEditIsCustomSelected(isCustom);
    if (!isCustom) {
      setEditForm({...editForm, frequency: parseFloat(value)});
      setEditCustomFrequency('');
      setEditCustomError('');
    }
    setEditDropdownOpen(false);
  }

  function handleCustomFrequencyChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setCustomFrequency(value);
    const parsed = parseCustomFrequency(value);
    if (parsed !== null) {
      setNewLinkFrequency(parsed);
      setCustomError('');
    } else {
      setCustomError('Format: "X hours" or "X days"');
    }
  }

  function handleEditCustomFrequencyChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEditCustomFrequency(value);
    const parsed = parseCustomFrequency(value);
    if (parsed !== null) {
      setEditForm({...editForm, frequency: parsed});
      setEditCustomError('');
    } else {
      setEditCustomError('Format: "X hours" or "X days"');
    }
  }

  async function handleAddLink() {
    if (!user || !newLinkName || !newLinkUrl) return;
    if (isCustomSelected && (!!customError || !customFrequency.trim())) return;

    const newLinkData = {
      isActive: true,
      name: newLinkName,
      url: newLinkUrl,
      category: 'default',
      frequency: newLinkFrequency,
      notes: newLinkNotes,
      createdAt: Timestamp.now(),
      userId: user.uid,
    };
    
    const response = await addSafelistLink(newLinkData as any, user.uid);
    if (response.id) {
      setLinks([...links, { ...newLinkData, id: response.id, lastSubmitted: null, updatedAt: null }]);
      setNewLinkName('');
      setNewLinkUrl('');
      setNewLinkFrequency(7);
      setNewLinkNotes('');
      setCustomFrequency('');
      setIsCustomSelected(false);
      toast.success('Safelist link added successfully!');
    }
  }

  function handleLinkClick(link: SafelistLink) {
    if (editingLink?.id === link.id) {
      setEditingLink(null);
    } else {
      setEditingLink(link);
      setEditForm({ ...link });
      const matchingOption = frequencyOptions.find(opt => opt.value === link.frequency);
      setEditIsCustomSelected(!matchingOption);
      if (!matchingOption && link.frequency) {
        setEditCustomFrequency(link.frequency < 1 ? `${link.frequency * 24} hours` : `${link.frequency} days`);
      } else {
        setEditCustomFrequency('');
      }
    }
  }

  async function handleSaveEdit() {
    if (!editingLink || !user || !editForm) return;
    if (editIsCustomSelected && (!!editCustomError || !editCustomFrequency.trim())) return;
    
    setSaving(true);
    try {
      const linkRef = doc(db, 'users', user.uid, 'safelistLinks', editingLink.id);
      const updatedData = { ...editForm, updatedAt: Timestamp.now() };
      await updateDoc(linkRef, updatedData as any);
      setLinks(links.map(l => l.id === editingLink.id ? { ...l, ...updatedData } : l));
      setEditingLink(null);
      toast.success('Link updated successfully!');
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update link.');
    } finally {
      setSaving(false);
    }
  }

  function getStatusInfo(link: SafelistLink) {
    const { status, daysUntilReady } = calculateReadiness(link);
    let statusColor = '', statusIcon = null, statusText = '', pulseClass = '';
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

  if (loading || loadingLinks) return <div className="container mx-auto p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Please log in.</CardTitle></CardHeader></Card></div>;

  const selectedFrequency = frequencyOptions.find(opt => opt.value === newLinkFrequency);
  const displayLabel = isCustomSelected ? `Custom: ${customFrequency || 'Enter...'}` : (selectedFrequency?.label || 'Every 7 days');
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Safelist Manager</h1>
          <p className="text-muted-foreground mt-2">Streamline Your Links</p>
        </div>
        <Shield className="h-8 w-8 text-primary" />
      </div>

      <Card className="hover:border-primary">
        <CardHeader><CardTitle>Add New Safelist Link</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input type="text" placeholder="Link Name" value={newLinkName} onChange={(e) => setNewLinkName(e.target.value)} className="flex-1 p-2 border rounded bg-background" />
              <input type="url" placeholder="Link URL" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} className="flex-1 p-2 border rounded bg-background" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full justify-between hover:bg-muted">
                  <span className="truncate">{displayLabel}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {dropdownOpen && (
                  <div className="absolute top-full w-full mt-1 bg-card border rounded shadow-lg z-10">
                    {frequencyOptions.map((option) => (
                      <button key={option.value} type="button" onClick={() => handleFrequencySelect(String(option.value))} className="w-full p-2 text-left hover:bg-muted border-b last:border-b-0">
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input type="text" placeholder="Notes (optional)" value={newLinkNotes} onChange={(e) => setNewLinkNotes(e.target.value)} className="flex-1 p-2 border rounded bg-background" />
            </div>
            {isCustomSelected && (
              <div>
                <input type="text" placeholder="e.g., '6 hours'" value={customFrequency} onChange={handleCustomFrequencyChange} className={`w-full p-2 border rounded ${customError ? 'border-red-500' : ''}`} />
                {customError && <p className="text-sm text-red-500">{customError}</p>}
              </div>
            )}
            <Button onClick={handleAddLink} disabled={isCustomSelected && (!!customError || !customFrequency.trim())}>
              <Plus className="mr-2 h-4 w-4" /> Add Link
            </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {links.map((link) => {
          const { statusColor, statusIcon, statusText, pulseClass } = getStatusInfo(link);
          const isEditing = editingLink?.id === link.id;
          const editSelectedFrequency = frequencyOptions.find(opt => opt.value === editForm.frequency);
          const editDisplayLabel = editIsCustomSelected ? `Custom: ${editCustomFrequency || 'Enter...'}` : (editSelectedFrequency?.label || '...');
          return (
            <Card key={link.id} className="transition-all hover:border-primary">
              <CardHeader onClick={() => handleLinkClick(link)} className="cursor-pointer">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">{link.name}</CardTitle>
                            <div className={`flex items-center gap-1 text-sm font-medium ${statusColor} ${pulseClass}`}>
                                {statusIcon} {statusText}
                            </div>
                        </div>
                        <CardDescription className="mt-1">{link.url}</CardDescription>
                    </div>
                    <Button variant="destructive" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(link.id); }}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
              </CardHeader>
              {isEditing && (
                <CardContent className="pt-0 space-y-4">
                  <div className="p-4 bg-muted rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded text-sm" placeholder="Name"/>
                          <input type="url" value={editForm.url || ''} onChange={(e) => setEditForm({...editForm, url: e.target.value})} className="w-full p-2 border rounded text-sm" placeholder="URL"/>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                           <Button type="button" onClick={() => setEditDropdownOpen(!editDropdownOpen)} className="w-full justify-between text-sm">
                              <span className="truncate">{editDisplayLabel}</span><ChevronDown className="h-4 w-4" />
                           </Button>
                           {editDropdownOpen && (
                              <div className="absolute w-full mt-1 bg-card border rounded shadow-lg z-20">
                                {frequencyOptions.map(o => <button key={o.value} type="button" onClick={() => handleEditFrequencySelect(String(o.value))} className="w-full p-2 text-left text-sm hover:bg-muted">{o.label}</button>)}
                              </div>
                            )}
                        </div>
                        <input type="text" value={editForm.notes || ''} onChange={(e) => setEditForm({...editForm, notes: e.target.value})} className="w-full p-2 border rounded text-sm" placeholder="Notes"/>
                      </div>
                      {editIsCustomSelected && (
                        <div>
                          <input type="text" value={editCustomFrequency} onChange={handleEditCustomFrequencyChange} className={`w-full p-2 border rounded text-sm ${editCustomError ? 'border-red-500' : ''}`} placeholder="e.g., '6 hours'"/>
                          {editCustomError && <p className="text-xs text-red-500 mt-1">{editCustomError}</p>}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} disabled={saving} size="sm">
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                        </Button>
                      </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
