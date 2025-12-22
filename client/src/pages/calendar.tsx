import { useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, Plus, Settings2, CalendarCheck, Ban } from 'lucide-react';
import { Header } from '../components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { bookingsService } from '../services';
import { mockAvailability, mockBookingSettings } from '../mocks/calendar.mock';
import type { Booking, Availability, BookingSettings } from '../types';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const statusColors: Record<Booking['status'], string> = {
  scheduled: 'bg-chart-1 text-white',
  completed: 'bg-chart-4 text-white',
  cancelled: 'bg-muted text-muted-foreground',
  no_show: 'bg-destructive text-white',
};

interface AvailabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availability: Availability[];
  onSave: (availability: Availability[]) => void;
}

function AvailabilityModal({ open, onOpenChange, availability, onSave }: AvailabilityModalProps) {
  const [editedAvailability, setEditedAvailability] = useState<Availability[]>(availability);

  useEffect(() => {
    setEditedAvailability(availability);
  }, [availability, open]);

  const getAvailabilityForDay = (day: number) => {
    return editedAvailability.filter(a => a.dayOfWeek === day && a.isActive);
  };

  const toggleDay = (day: number, enabled: boolean) => {
    if (enabled) {
      const newSlot: Availability = {
        id: `avail-new-${Date.now()}`,
        mentorId: 'mentor-1',
        dayOfWeek: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      };
      setEditedAvailability([...editedAvailability, newSlot]);
    } else {
      setEditedAvailability(editedAvailability.filter(a => a.dayOfWeek !== day));
    }
  };

  const addTimeSlot = (day: number) => {
    const newSlot: Availability = {
      id: `avail-new-${Date.now()}-${Math.random()}`,
      mentorId: 'mentor-1',
      dayOfWeek: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      startTime: '12:00',
      endTime: '17:00',
      isActive: true,
    };
    setEditedAvailability([...editedAvailability, newSlot]);
  };

  const removeTimeSlot = (slotId: string) => {
    setEditedAvailability(editedAvailability.filter(a => a.id !== slotId));
  };

  const updateTimeSlot = (slotId: string, field: 'startTime' | 'endTime', value: string) => {
    setEditedAvailability(editedAvailability.map(a => 
      a.id === slotId ? { ...a, [field]: value } : a
    ));
  };

  const handleSave = () => {
    onSave(editedAvailability);
    onOpenChange(false);
  };

  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 6; h <= 22; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        const label = format(new Date().setHours(h, m), 'h:mm a');
        options.push({ value: time, label });
      }
    }
    return options;
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Set Availability</DialogTitle>
          <DialogDescription>
            Configure your weekly availability for client bookings. Add multiple time slots per day.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-auto">
          {DAYS_OF_WEEK.map((dayName, index) => {
            const daySlots = getAvailabilityForDay(index);
            const isEnabled = daySlots.length > 0;

            return (
              <div key={dayName} className="p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox
                    checked={isEnabled}
                    onCheckedChange={(checked) => toggleDay(index, checked as boolean)}
                    data-testid={`checkbox-day-${index}`}
                  />
                  <span className="font-medium flex-1">{dayName}</span>
                  {isEnabled && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => addTimeSlot(index)}
                      data-testid={`button-add-slot-${index}`}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Slot
                    </Button>
                  )}
                </div>
                {isEnabled ? (
                  <div className="space-y-2 pl-8">
                    {daySlots.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-2">
                        <Select 
                          value={slot.startTime} 
                          onValueChange={(v) => updateTimeSlot(slot.id, 'startTime', v)}
                        >
                          <SelectTrigger className="w-[120px]" data-testid={`select-start-${slot.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-muted-foreground">to</span>
                        <Select 
                          value={slot.endTime} 
                          onValueChange={(v) => updateTimeSlot(slot.id, 'endTime', v)}
                        >
                          <SelectTrigger className="w-[120px]" data-testid={`select-end-${slot.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {daySlots.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeTimeSlot(slot.id)}
                            data-testid={`button-remove-slot-${slot.id}`}
                          >
                            <Ban className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground pl-8">Not available</span>
                )}
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-availability">
            Save Availability
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BookingSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: BookingSettings;
  onSave: (settings: BookingSettings) => void;
}

function BookingSettingsModal({ open, onOpenChange, settings, onSave }: BookingSettingsModalProps) {
  const [editedSettings, setEditedSettings] = useState<BookingSettings>(settings);

  useEffect(() => {
    setEditedSettings(settings);
  }, [settings, open]);

  const handleSave = () => {
    onSave(editedSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Booking Settings</DialogTitle>
          <DialogDescription>
            Configure how clients can book sessions with you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Session Length</Label>
              <Select
                value={editedSettings.defaultSessionLength.toString()}
                onValueChange={(v) => setEditedSettings({ ...editedSettings, defaultSessionLength: parseInt(v) })}
              >
                <SelectTrigger data-testid="select-session-length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Buffer Between Sessions</Label>
              <Select
                value={editedSettings.bufferBetweenSessions.toString()}
                onValueChange={(v) => setEditedSettings({ ...editedSettings, bufferBetweenSessions: parseInt(v) })}
              >
                <SelectTrigger data-testid="select-buffer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Notice</Label>
              <Select
                value={editedSettings.minimumNotice.toString()}
                onValueChange={(v) => setEditedSettings({ ...editedSettings, minimumNotice: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="72">72 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Max Advance Booking</Label>
              <Select
                value={editedSettings.maximumAdvanceBooking.toString()}
                onValueChange={(v) => setEditedSettings({ ...editedSettings, maximumAdvanceBooking: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="14">2 weeks</SelectItem>
                  <SelectItem value="30">1 month</SelectItem>
                  <SelectItem value="60">2 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-24h">Send 24h reminder</Label>
              <Switch
                id="reminder-24h"
                checked={editedSettings.sendReminder24h}
                onCheckedChange={(checked) => setEditedSettings({ ...editedSettings, sendReminder24h: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-1h">Send 1h reminder</Label>
              <Switch
                id="reminder-1h"
                checked={editedSettings.sendReminder1h}
                onCheckedChange={(checked) => setEditedSettings({ ...editedSettings, sendReminder1h: checked })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-settings">
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [availability, setAvailability] = useState<Availability[]>(mockAvailability);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>(mockBookingSettings);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingsService.getBookings('mentor-1');
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToPreviousWeek = () => setCurrentDate(addDays(currentDate, -7));
  const goToNextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const goToToday = () => setCurrentDate(new Date());

  const getBookingsForDay = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(new Date(booking.scheduledAt), date)
    );
  };

  const getBookingPosition = (booking: Booking) => {
    const bookingDate = new Date(booking.scheduledAt);
    const hour = bookingDate.getHours();
    const minutes = bookingDate.getMinutes();
    const top = ((hour - 8) * 60 + minutes);
    const height = booking.durationMinutes;
    return { top, height };
  };

  const getDayAvailability = (dayOfWeek: number) => {
    return availability.filter(a => a.dayOfWeek === dayOfWeek && a.isActive);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Calendar" />
      
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek} data-testid="button-prev-week">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek} data-testid="button-next-week">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={goToToday} data-testid="button-today">
              Today
            </Button>
            <h2 className="text-lg font-semibold ml-4">
              {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
            </h2>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAvailabilityModal(true)} data-testid="button-availability">
              <CalendarCheck className="w-4 h-4 mr-2" />
              Availability
            </Button>
            <Button variant="outline" onClick={() => setShowSettingsModal(true)} data-testid="button-settings">
              <Settings2 className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button data-testid="button-add-booking">
              <Plus className="w-4 h-4 mr-2" />
              Add Booking
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-[600px]" />
        ) : (
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <div className="grid grid-cols-8 min-w-[800px]">
                <div className="border-r border-border">
                  <div className="h-16 border-b border-border" />
                  {HOURS.map(hour => (
                    <div 
                      key={hour} 
                      className="h-[60px] border-b border-border px-2 py-1 text-xs text-muted-foreground"
                    >
                      {format(new Date().setHours(hour, 0), 'h a')}
                    </div>
                  ))}
                </div>

                {weekDays.map((day, dayIndex) => {
                  const dayOfWeek = day.getDay();
                  const dayAvailability = getDayAvailability(dayOfWeek === 0 ? 0 : dayOfWeek);
                  const hasAvailability = dayAvailability.length > 0;

                  return (
                    <div key={dayIndex} className={cn('border-r border-border last:border-r-0', isToday(day) && 'bg-primary/5')}>
                      <div className={cn(
                        'h-16 border-b border-border p-2 text-center',
                        isToday(day) && 'bg-primary/10'
                      )}>
                        <div className="text-xs text-muted-foreground uppercase">
                          {format(day, 'EEE')}
                        </div>
                        <div className={cn(
                          'text-lg font-semibold',
                          isToday(day) && 'text-primary'
                        )}>
                          {format(day, 'd')}
                        </div>
                        {!hasAvailability && (
                          <Badge variant="secondary" className="text-[10px] px-1">
                            <Ban className="w-2.5 h-2.5 mr-0.5" />
                            Off
                          </Badge>
                        )}
                      </div>

                      <div className="relative">
                        {HOURS.map(hour => {
                          const isAvailable = dayAvailability.some(a => {
                            const startHour = parseInt(a.startTime.split(':')[0]);
                            const endHour = parseInt(a.endTime.split(':')[0]);
                            return hour >= startHour && hour < endHour;
                          });

                          return (
                            <div 
                              key={hour} 
                              className={cn(
                                "h-[60px] border-b border-border cursor-pointer",
                                isAvailable ? "bg-chart-2/10 hover:bg-chart-2/20" : "bg-muted/30 hover:bg-muted/50"
                              )}
                            />
                          );
                        })}

                        {getBookingsForDay(day).map(booking => {
                          const { top, height } = getBookingPosition(booking);
                          return (
                            <div
                              key={booking.id}
                              className={cn(
                                'absolute left-1 right-1 rounded-md px-2 py-1 cursor-pointer overflow-hidden',
                                statusColors[booking.status]
                              )}
                              style={{
                                top: `${top}px`,
                                height: `${Math.max(height - 4, 24)}px`,
                              }}
                              onClick={() => setSelectedBooking(booking)}
                              data-testid={`booking-${booking.id}`}
                            >
                              <div className="text-xs font-medium truncate">
                                {booking.clientName}
                              </div>
                              {height >= 40 && (
                                <div className="text-xs opacity-80 truncate">
                                  {format(new Date(booking.scheduledAt), 'h:mm a')}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedBooking && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">{selectedBooking.clientName}</h3>
                    <Badge 
                      variant="secondary" 
                      className={cn('capitalize', statusColors[selectedBooking.status])}
                    >
                      {selectedBooking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {format(new Date(selectedBooking.scheduledAt), 'EEEE, MMMM d, yyyy')} at {format(new Date(selectedBooking.scheduledAt), 'h:mm a')}
                    <span className="mx-1">-</span>
                    {selectedBooking.durationMinutes} minutes
                  </div>
                  {selectedBooking.notes && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Notes:</strong> {selectedBooking.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                    Close
                  </Button>
                  {selectedBooking.status === 'scheduled' && (
                    <>
                      <Button variant="outline">Reschedule</Button>
                      <Button variant="destructive">Cancel</Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-chart-2/30" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-chart-1" />
            <span className="text-muted-foreground">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-chart-4" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive" />
            <span className="text-muted-foreground">No Show</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted" />
            <span className="text-muted-foreground">Cancelled/Unavailable</span>
          </div>
        </div>
      </main>

      <AvailabilityModal
        open={showAvailabilityModal}
        onOpenChange={setShowAvailabilityModal}
        availability={availability}
        onSave={setAvailability}
      />

      <BookingSettingsModal
        open={showSettingsModal}
        onOpenChange={setShowSettingsModal}
        settings={bookingSettings}
        onSave={setBookingSettings}
      />
    </div>
  );
}
