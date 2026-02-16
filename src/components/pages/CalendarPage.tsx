import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { WeddingEvents } from '@/entities';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check, MapPin, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CalendarPage() {
  const [events, setEvents] = useState<WeddingEvents[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    eventTitle: '',
    eventDateTime: '',
    location: '',
    description: '',
    eventUrl: '',
    eventImage: 'https://static.wixstatic.com/media/8c86f3_278e1a4aafb7435d9702b120049ee797~mv2.png?originWidth=576&originHeight=448'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const result = await BaseCrudService.getAll<WeddingEvents>('weddingevents');
      const sortedEvents = result.items.sort((a, b) => {
        const dateA = a.eventDateTime ? new Date(a.eventDateTime).getTime() : 0;
        const dateB = b.eventDateTime ? new Date(b.eventDateTime).getTime() : 0;
        return dateA - dateB;
      });
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.eventTitle.trim() || !newEvent.eventDateTime) return;
    
    const eventToAdd = {
      _id: crypto.randomUUID(),
      eventTitle: newEvent.eventTitle,
      eventDateTime: newEvent.eventDateTime,
      location: newEvent.location || undefined,
      description: newEvent.description || undefined,
      eventUrl: newEvent.eventUrl || undefined,
      eventImage: newEvent.eventImage
    };

    const updatedEvents = [...events, eventToAdd].sort((a, b) => {
      const dateA = a.eventDateTime ? new Date(a.eventDateTime).getTime() : 0;
      const dateB = b.eventDateTime ? new Date(b.eventDateTime).getTime() : 0;
      return dateA - dateB;
    });
    
    setEvents(updatedEvents);
    setIsAddingEvent(false);
    setNewEvent({
      eventTitle: '',
      eventDateTime: '',
      location: '',
      description: '',
      eventUrl: '',
      eventImage: 'https://static.wixstatic.com/media/8c86f3_10747dc4a49d4b309219edbba5939868~mv2.png?originWidth=576&originHeight=448'
    });

    try {
      await BaseCrudService.create('weddingevents', eventToAdd);
    } catch (error) {
      loadEvents();
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setEvents(events.filter(e => e._id !== eventId));
    try {
      await BaseCrudService.delete('weddingevents', eventId);
    } catch (error) {
      loadEvents();
    }
  };

  const handleUpdateEvent = async (event: WeddingEvents) => {
    const updatedEvents = events.map(e => e._id === event._id ? event : e).sort((a, b) => {
      const dateA = a.eventDateTime ? new Date(a.eventDateTime).getTime() : 0;
      const dateB = b.eventDateTime ? new Date(b.eventDateTime).getTime() : 0;
      return dateA - dateB;
    });
    setEvents(updatedEvents);
    setEditingEventId(null);
    try {
      await BaseCrudService.update('weddingevents', event);
    } catch (error) {
      loadEvents();
    }
  };

  const upcomingEvents = events.filter(e => {
    if (!e.eventDateTime) return false;
    return new Date(e.eventDateTime) >= new Date();
  });

  const pastEvents = events.filter(e => {
    if (!e.eventDateTime) return false;
    return new Date(e.eventDateTime) < new Date();
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-16">
        <div className="mb-12">
          <h1 className="font-heading text-5xl md:text-6xl text-primary mb-4">
            Event Calendar
          </h1>
          <p className="font-paragraph text-lg text-primary/80">
            Schedule and manage all your wedding-related events
          </p>
        </div>

        {/* Add Event Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsAddingEvent(true)}
            className="px-6 py-2 bg-primary text-primary-foreground font-paragraph text-base hover:bg-primary/90 transition-colors duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Event
          </button>
        </div>

        {/* Add Event Form */}
        {isAddingEvent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary p-6 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Event title *"
                value={newEvent.eventTitle}
                onChange={(e) => setNewEvent({ ...newEvent, eventTitle: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="datetime-local"
                value={newEvent.eventDateTime}
                onChange={(e) => setNewEvent({ ...newEvent, eventDateTime: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="url"
                placeholder="Event URL"
                value={newEvent.eventUrl}
                onChange={(e) => setNewEvent({ ...newEvent, eventUrl: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
            </div>
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddEvent}
                className="px-6 py-2 bg-primary text-primary-foreground font-paragraph text-base hover:bg-primary/90 transition-colors duration-300"
              >
                Add Event
              </button>
              <button
                onClick={() => {
                  setIsAddingEvent(false);
                  setNewEvent({
                    eventTitle: '',
                    eventDateTime: '',
                    location: '',
                    description: '',
                    eventUrl: '',
                    eventImage: 'https://static.wixstatic.com/media/8c86f3_d087aa40077d4ff3ac9187336fe08eb0~mv2.png?originWidth=576&originHeight=448'
                  });
                }}
                className="px-6 py-2 border-2 border-buttonborder text-primary font-paragraph text-base hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Events List */}
        <div className="min-h-[400px]">
          {isLoading ? null : events.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-lg text-primary/60">
                No events yet. Add your first event to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {upcomingEvents.length > 0 && (
                <div>
                  <h2 className="font-heading text-3xl text-primary mb-6">Upcoming Events</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {upcomingEvents.map((event, index) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <EventCard
                          event={event}
                          isEditing={editingEventId === event._id}
                          onDelete={handleDeleteEvent}
                          onEdit={() => setEditingEventId(event._id)}
                          onCancelEdit={() => setEditingEventId(null)}
                          onUpdate={handleUpdateEvent}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {pastEvents.length > 0 && (
                <div>
                  <h2 className="font-heading text-3xl text-primary mb-6">Past Events</h2>
                  <div className="grid md:grid-cols-2 gap-6 opacity-60">
                    {pastEvents.map((event, index) => (
                      <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <EventCard
                          event={event}
                          isEditing={editingEventId === event._id}
                          onDelete={handleDeleteEvent}
                          onEdit={() => setEditingEventId(event._id)}
                          onCancelEdit={() => setEditingEventId(null)}
                          onUpdate={handleUpdateEvent}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function EventCard({
  event,
  isEditing,
  onDelete,
  onEdit,
  onCancelEdit,
  onUpdate
}: {
  event: WeddingEvents;
  isEditing: boolean;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (event: WeddingEvents) => void;
}) {
  const [editedEvent, setEditedEvent] = useState(event);

  if (isEditing) {
    return (
      <div className="bg-secondary p-6">
        <div className="space-y-4 mb-4">
          <input
            type="text"
            value={editedEvent.eventTitle || ''}
            onChange={(e) => setEditedEvent({ ...editedEvent, eventTitle: e.target.value })}
            className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <input
            type="datetime-local"
            value={editedEvent.eventDateTime ? format(new Date(editedEvent.eventDateTime), "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={(e) => setEditedEvent({ ...editedEvent, eventDateTime: e.target.value })}
            className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            value={editedEvent.location || ''}
            onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
            placeholder="Location"
            className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <input
            type="url"
            value={editedEvent.eventUrl || ''}
            onChange={(e) => setEditedEvent({ ...editedEvent, eventUrl: e.target.value })}
            placeholder="Event URL"
            className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <textarea
            value={editedEvent.description || ''}
            onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onUpdate(editedEvent)}
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
    <div className="bg-white overflow-hidden flex flex-col h-full">
      {event.eventImage && (
        <div className="w-full h-48 overflow-hidden">
          <Image
            src={event.eventImage}
            alt={event.eventTitle || 'Event image'}
            width={600}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-heading text-2xl text-primary mb-3">
          {event.eventTitle}
        </h3>
        
        {event.eventDateTime && (
          <div className="flex items-center gap-2 font-paragraph text-base text-primary mb-3">
            <CalendarIcon size={16} />
            {format(new Date(event.eventDateTime), 'MMMM dd, yyyy • h:mm a')}
          </div>
        )}
        
        {event.location && (
          <div className="flex items-center gap-2 font-paragraph text-base text-primary/70 mb-3">
            <MapPin size={16} />
            {event.location}
          </div>
        )}
        
        {event.description && (
          <p className="font-paragraph text-base text-primary/70 mb-4 flex-1">
            {event.description}
          </p>
        )}
        
        {event.eventUrl && (
          <a
            href={event.eventUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-paragraph text-sm text-linkcolor hover:text-primary transition-colors duration-300 mb-4"
          >
            <ExternalLink size={14} />
            Event Link
          </a>
        )}

        <div className="flex gap-2 pt-4 border-t border-primary/10">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 border-2 border-buttonborder text-primary font-paragraph text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <Edit2 size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete(event._id)}
            className="px-4 py-2 text-destructive hover:bg-destructive/10 transition-colors duration-300"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
