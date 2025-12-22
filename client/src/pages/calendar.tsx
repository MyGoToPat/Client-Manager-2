import { useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, Plus } from 'lucide-react';
import { Header } from '../components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { bookingsService } from '../services';
import type { Booking } from '../types';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

const statusColors: Record<Booking['status'], string> = {
  scheduled: 'bg-chart-1 text-white',
  completed: 'bg-chart-4 text-white',
  cancelled: 'bg-muted text-muted-foreground',
  no_show: 'bg-destructive text-white',
};

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Calendar" />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
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

          <Button data-testid="button-add-booking">
            <Plus className="w-4 h-4 mr-2" />
            Add Booking
          </Button>
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

                {weekDays.map((day, dayIndex) => (
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
                    </div>

                    <div className="relative">
                      {HOURS.map(hour => (
                        <div 
                          key={hour} 
                          className="h-[60px] border-b border-border hover:bg-muted/30 cursor-pointer"
                        />
                      ))}

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
                ))}
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

        <div className="flex items-center gap-4 text-sm">
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
            <span className="text-muted-foreground">Cancelled</span>
          </div>
        </div>
      </main>
    </div>
  );
}
