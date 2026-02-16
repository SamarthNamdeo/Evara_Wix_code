import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { GuestList } from '@/entities';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check, UserPlus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GuestListPage() {
  const [guests, setGuests] = useState<GuestList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [newGuest, setNewGuest] = useState({
    guestName: '',
    rsvpStatus: 'Pending',
    dietaryRestrictions: '',
    hasPlusOne: false,
    plusOneName: ''
  });

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      const result = await BaseCrudService.getAll<GuestList>('guestlist');
      setGuests(result.items);
    } catch (error) {
      console.error('Error loading guests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGuest = async () => {
    if (!newGuest.guestName.trim()) return;
    
    const guestToAdd = {
      _id: crypto.randomUUID(),
      guestName: newGuest.guestName,
      rsvpStatus: newGuest.rsvpStatus,
      dietaryRestrictions: newGuest.dietaryRestrictions || undefined,
      hasPlusOne: newGuest.hasPlusOne,
      plusOneName: newGuest.plusOneName || undefined
    };

    setGuests([guestToAdd, ...guests]);
    setIsAddingGuest(false);
    setNewGuest({ guestName: '', rsvpStatus: 'Pending', dietaryRestrictions: '', hasPlusOne: false, plusOneName: '' });

    try {
      await BaseCrudService.create('guestlist', guestToAdd);
    } catch (error) {
      loadGuests();
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    setGuests(guests.filter(g => g._id !== guestId));
    try {
      await BaseCrudService.delete('guestlist', guestId);
    } catch (error) {
      loadGuests();
    }
  };

  const handleUpdateGuest = async (guest: GuestList) => {
    setGuests(guests.map(g => g._id === guest._id ? guest : g));
    setEditingGuestId(null);
    try {
      await BaseCrudService.update('guestlist', guest);
    } catch (error) {
      loadGuests();
    }
  };

  const filteredGuests = guests.filter(guest => {
    if (filter === 'all') return true;
    return guest.rsvpStatus?.toLowerCase() === filter;
  });

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvpStatus?.toLowerCase() === 'confirmed').length,
    pending: guests.filter(g => g.rsvpStatus?.toLowerCase() === 'pending').length,
    declined: guests.filter(g => g.rsvpStatus?.toLowerCase() === 'declined').length,
    plusOnes: guests.filter(g => g.hasPlusOne).length
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-16">
        <div className="mb-12">
          <h1 className="font-heading text-5xl md:text-6xl text-primary mb-4">
            Guest List
          </h1>
          <p className="font-paragraph text-lg text-primary/80">
            Manage your wedding guests and track RSVPs
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-secondary p-6 text-center">
            <div className="font-heading text-3xl text-primary mb-1">{stats.total}</div>
            <div className="font-paragraph text-sm text-primary/70">Total Guests</div>
          </div>
          <div className="bg-white p-6 text-center">
            <div className="font-heading text-3xl text-primary mb-1">{stats.confirmed}</div>
            <div className="font-paragraph text-sm text-primary/70">Confirmed</div>
          </div>
          <div className="bg-white p-6 text-center">
            <div className="font-heading text-3xl text-primary mb-1">{stats.pending}</div>
            <div className="font-paragraph text-sm text-primary/70">Pending</div>
          </div>
          <div className="bg-white p-6 text-center">
            <div className="font-heading text-3xl text-primary mb-1">{stats.declined}</div>
            <div className="font-paragraph text-sm text-primary/70">Declined</div>
          </div>
          <div className="bg-secondary p-6 text-center">
            <div className="font-heading text-3xl text-primary mb-1">{stats.plusOnes}</div>
            <div className="font-paragraph text-sm text-primary/70">Plus Ones</div>
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 font-paragraph text-base transition-colors duration-300 ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              All Guests
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-6 py-2 font-paragraph text-base transition-colors duration-300 ${
                filter === 'confirmed'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 font-paragraph text-base transition-colors duration-300 ${
                filter === 'pending'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('declined')}
              className={`px-6 py-2 font-paragraph text-base transition-colors duration-300 ${
                filter === 'declined'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              Declined
            </button>
          </div>
          
          <button
            onClick={() => setIsAddingGuest(true)}
            className="px-6 py-2 bg-primary text-primary-foreground font-paragraph text-base hover:bg-primary/90 transition-colors duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Guest
          </button>
        </div>

        {/* Add Guest Form */}
        {isAddingGuest && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary p-6 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Guest name *"
                value={newGuest.guestName}
                onChange={(e) => setNewGuest({ ...newGuest, guestName: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <select
                value={newGuest.rsvpStatus}
                onChange={(e) => setNewGuest({ ...newGuest, rsvpStatus: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Declined">Declined</option>
              </select>
              <input
                type="text"
                placeholder="Dietary restrictions"
                value={newGuest.dietaryRestrictions}
                onChange={(e) => setNewGuest({ ...newGuest, dietaryRestrictions: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Plus one name"
                value={newGuest.plusOneName}
                onChange={(e) => setNewGuest({ ...newGuest, plusOneName: e.target.value, hasPlusOne: !!e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddGuest}
                className="px-6 py-2 bg-primary text-primary-foreground font-paragraph text-base hover:bg-primary/90 transition-colors duration-300"
              >
                Add Guest
              </button>
              <button
                onClick={() => {
                  setIsAddingGuest(false);
                  setNewGuest({ guestName: '', rsvpStatus: 'Pending', dietaryRestrictions: '', hasPlusOne: false, plusOneName: '' });
                }}
                className="px-6 py-2 border-2 border-buttonborder text-primary font-paragraph text-base hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Guests List */}
        <div className="min-h-[400px]">
          {isLoading ? null : filteredGuests.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-lg text-primary/60">
                {filter === 'all' ? 'No guests yet. Add your first guest to get started!' : `No ${filter} guests.`}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredGuests.map((guest, index) => (
                <motion.div
                  key={guest._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <GuestItem
                    guest={guest}
                    isEditing={editingGuestId === guest._id}
                    onDelete={handleDeleteGuest}
                    onEdit={() => setEditingGuestId(guest._id)}
                    onCancelEdit={() => setEditingGuestId(null)}
                    onUpdate={handleUpdateGuest}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function GuestItem({
  guest,
  isEditing,
  onDelete,
  onEdit,
  onCancelEdit,
  onUpdate
}: {
  guest: GuestList;
  isEditing: boolean;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (guest: GuestList) => void;
}) {
  const [editedGuest, setEditedGuest] = useState(guest);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-secondary';
      case 'declined':
        return 'bg-destructive/10';
      default:
        return 'bg-white';
    }
  };

  if (isEditing) {
    return (
      <div className="bg-secondary p-6">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={editedGuest.guestName || ''}
            onChange={(e) => setEditedGuest({ ...editedGuest, guestName: e.target.value })}
            className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <select
            value={editedGuest.rsvpStatus || 'Pending'}
            onChange={(e) => setEditedGuest({ ...editedGuest, rsvpStatus: e.target.value })}
            className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Declined">Declined</option>
          </select>
          <input
            type="text"
            value={editedGuest.dietaryRestrictions || ''}
            onChange={(e) => setEditedGuest({ ...editedGuest, dietaryRestrictions: e.target.value })}
            placeholder="Dietary restrictions"
            className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            value={editedGuest.plusOneName || ''}
            onChange={(e) => setEditedGuest({ ...editedGuest, plusOneName: e.target.value, hasPlusOne: !!e.target.value })}
            placeholder="Plus one name"
            className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onUpdate(editedGuest)}
            className="px-4 py-2 bg-primary text-primary-foreground font-paragraph text-sm hover:bg-primary/90 transition-colors duration-300 flex items-center gap-2"
          >
            <Check size={16} />
            Save
          </button>
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 border-2 border-buttonborder text-primary font-paragraph text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getStatusColor(guest.rsvpStatus)} p-6 flex items-start justify-between gap-4`}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-heading text-xl text-primary">
            {guest.guestName}
          </h3>
          <span className={`px-3 py-1 text-xs font-paragraph ${
            guest.rsvpStatus?.toLowerCase() === 'confirmed' 
              ? 'bg-primary text-primary-foreground' 
              : guest.rsvpStatus?.toLowerCase() === 'declined'
              ? 'bg-destructive text-destructiveforeground'
              : 'bg-background text-primary'
          }`}>
            {guest.rsvpStatus}
          </span>
        </div>
        
        <div className="space-y-1 font-paragraph text-sm text-primary/70">
          {guest.dietaryRestrictions && (
            <p>Dietary: {guest.dietaryRestrictions}</p>
          )}
          {guest.hasPlusOne && guest.plusOneName && (
            <p className="flex items-center gap-2">
              <UserPlus size={14} />
              Plus One: {guest.plusOneName}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-primary hover:bg-secondary transition-colors duration-300"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(guest._id)}
          className="p-2 text-destructive hover:bg-secondary transition-colors duration-300"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
