import { useState, useMemo } from 'react';
import { useRoute, useLocation } from 'wouter';
import { format, startOfWeek, addDays, isSameDay, isToday, addWeeks, isBefore, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const mockMentor = {
  id: 'mentor-1',
  name: 'Coach Alex',
  specializations: ['Strength Training', 'Weight Loss', 'HIIT'],
  avatarUrl: '',
  bio: 'Certified personal trainer with 10+ years experience helping clients achieve their fitness goals.',
};

const mockAvailability = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
  { dayOfWeek: 5, startTime: '09:00', endTime: '14:00' },
];

const mockSettings = {
  defaultSessionLength: 60,
  bufferBetweenSessions: 15,
};

type BookingStep = 'select-date' | 'select-time' | 'enter-details' | 'confirmation';

export default function BookingPage() {
  const [matched, params] = useRoute('/book/:mentorSlug');
  const mentorSlug = params?.mentorSlug;
  
  const [step, setStep] = useState<BookingStep>('select-date');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getDayAvailability = (date: Date) => {
    const dayOfWeek = date.getDay();
    return mockAvailability.find(a => a.dayOfWeek === dayOfWeek);
  };

  const getAvailableSlots = useMemo(() => {
    if (!selectedDate) return [];
    
    const dayAvail = getDayAvailability(selectedDate);
    if (!dayAvail) return [];

    const slots: string[] = [];
    const startHour = parseInt(dayAvail.startTime.split(':')[0]);
    const endHour = parseInt(dayAvail.endTime.split(':')[0]);
    const sessionLength = mockSettings.defaultSessionLength;
    const buffer = mockSettings.bufferBetweenSessions;
    
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += sessionLength + buffer) {
        if (h + (m + sessionLength) / 60 <= endHour) {
          slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
      }
    }
    return slots;
  }, [selectedDate]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep('select-time');
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setStep('enter-details');
  };

  const handleSubmitBooking = () => {
    console.log('Booking submitted:', { selectedDate, selectedTime, name, email, notes });
    setStep('confirmation');
  };

  const formatTimeSlot = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m);
    return format(date, 'h:mm a');
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <span className="material-symbols-outlined text-6xl text-green-500 mx-auto mb-4">check_circle</span>
            <CardTitle>Booking Confirmed!</CardTitle>
            <CardDescription>
              Your session with {mockMentor.name} has been scheduled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-muted-foreground">calendar_month</span>
                <span>{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-muted-foreground">schedule</span>
                <span>{selectedTime && formatTimeSlot(selectedTime)} ({mockSettings.defaultSessionLength} minutes)</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              A confirmation email has been sent to {email}. You can add this event to your calendar.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => window.close()} data-testid="button-done">
              Done
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">{mockMentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{mockMentor.name}</h1>
                <p className="text-muted-foreground">{mockMentor.specializations.join(' | ')}</p>
                <p className="text-sm text-muted-foreground mt-1">{mockMentor.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {step === 'select-date' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Select a Date</CardTitle>
                      <CardDescription>Choose an available day for your session</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setCurrentWeek(addWeeks(currentWeek, -1))}
                        disabled={isBefore(weekStart, startOfDay(new Date()))}
                        data-testid="button-prev-week"
                      >
                        <span className="material-symbols-outlined text-base">chevron_left</span>
                      </Button>
                      <span className="text-sm font-medium min-w-[150px] text-center">
                        {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
                      </span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                        data-testid="button-next-week"
                      >
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, index) => {
                      const dayAvail = getDayAvailability(day);
                      const isPast = isBefore(day, startOfDay(new Date()));
                      const isAvailable = dayAvail && !isPast;

                      return (
                        <button
                          key={index}
                          disabled={!isAvailable}
                          onClick={() => isAvailable && handleSelectDate(day)}
                          className={cn(
                            'p-3 rounded-lg text-center transition-colors',
                            isAvailable 
                              ? 'hover:bg-primary/10 cursor-pointer border' 
                              : 'opacity-50 cursor-not-allowed bg-muted',
                            isToday(day) && 'ring-2 ring-primary',
                            isSameDay(day, selectedDate || new Date(0)) && 'bg-primary text-primary-foreground'
                          )}
                          data-testid={`button-select-date-${format(day, 'yyyy-MM-dd')}`}
                        >
                          <div className="text-xs text-muted-foreground">{format(day, 'EEE')}</div>
                          <div className="text-lg font-semibold">{format(day, 'd')}</div>
                          {isAvailable && (
                            <div className="text-xs text-muted-foreground mt-1">Available</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'select-time' && selectedDate && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Select a Time</CardTitle>
                      <CardDescription>
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')} - {mockSettings.defaultSessionLength} minute session
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setStep('select-date')} data-testid="button-change-date">
                      Change Date
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {getAvailableSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => handleSelectTime(time)}
                        data-testid={`button-select-time-${time}`}
                      >
                        {formatTimeSlot(time)}
                      </Button>
                    ))}
                  </div>
                  {getAvailableSlots.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No available slots for this day. Please select another date.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {step === 'enter-details' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Your Details</CardTitle>
                      <CardDescription>
                        {selectedDate && format(selectedDate, 'EEEE, MMMM d')} at {selectedTime && formatTimeSlot(selectedTime)}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setStep('select-time')} data-testid="button-change-time">
                      Change Time
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Anything you'd like your trainer to know before the session..."
                      rows={3}
                      data-testid="input-notes"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleSubmitBooking}
                    disabled={!name || !email}
                    data-testid="button-confirm-booking"
                  >
                    Confirm Booking
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-base text-muted-foreground">person</span>
                    <span>{mockMentor.name}</span>
                  </div>
                  {selectedDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-base text-muted-foreground">calendar_month</span>
                      <span>{format(selectedDate, 'EEE, MMM d, yyyy')}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-base text-muted-foreground">schedule</span>
                      <span>{formatTimeSlot(selectedTime)}</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Session Duration</span>
                    <span className="font-medium">{mockSettings.defaultSessionLength} min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
