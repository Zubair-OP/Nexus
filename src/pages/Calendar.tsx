import React, { useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarDays, Clock3, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PageHero } from '../components/features/PageHero';
import { MetricCard } from '../components/features/MetricCard';
import { StatusBadge } from '../components/features/StatusBadge';

type MeetingStatus = 'pending' | 'accepted' | 'declined';

interface CalendarMeeting {
  id: string;
  title: string;
  start: string;
  end: string;
  status: MeetingStatus;
  attendee: string;
}

const initialMeetings: CalendarMeeting[] = [
  { id: 'meeting-1', title: 'Investor pitch rehearsal', start: '2026-03-24T10:00:00', end: '2026-03-24T11:00:00', status: 'pending', attendee: 'Ayesha Khan' },
  { id: 'meeting-2', title: 'Term sheet alignment', start: '2026-03-25T14:30:00', end: '2026-03-25T15:30:00', status: 'accepted', attendee: 'Nova Capital' },
  { id: 'meeting-3', title: 'Follow-up diligence call', start: '2026-03-27T09:00:00', end: '2026-03-27T09:45:00', status: 'declined', attendee: 'Horizon Partners' },
];

const statusClassMap: Record<MeetingStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  accepted: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  declined: 'border-rose-200 bg-rose-50 text-rose-700',
};

export const CalendarPage: React.FC = () => {
  const [meetings, setMeetings] = useState<CalendarMeeting[]>(initialMeetings);
  const [title, setTitle] = useState('');
  const [attendee, setAttendee] = useState('');
  const [date, setDate] = useState('2026-03-24');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [status, setStatus] = useState<MeetingStatus>('pending');

  const calendarEvents = useMemo(
    () =>
      meetings.map((meeting) => ({
        id: meeting.id,
        title: meeting.title,
        start: meeting.start,
        end: meeting.end,
        classNames: [statusClassMap[meeting.status]],
      })),
    [meetings]
  );

  const handleDateClick = (arg: DateClickArg) => {
    setDate(arg.dateStr.slice(0, 10));
  };

  const handleAddMeeting = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !attendee.trim()) return;

    setMeetings((currentMeetings) => [
      {
        id: `meeting-${currentMeetings.length + 1}`,
        title: title.trim(),
        attendee: attendee.trim(),
        start: `${date}T${startTime}:00`,
        end: `${date}T${endTime}:00`,
        status,
      },
      ...currentMeetings,
    ]);

    setTitle('');
    setAttendee('');
    setStatus('pending');
  };

  const stats = {
    total: meetings.length.toString(),
    upcoming: meetings.filter((meeting) => meeting.status !== 'declined').length.toString(),
    accepted: meetings.filter((meeting) => meeting.status === 'accepted').length.toString(),
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title="Calendar Scheduling"
        description="Coordinate investor meetings, due diligence sessions, and product walkthroughs in one shared scheduling surface."
        actions={
          <Button leftIcon={<Plus size={18} />} onClick={() => setTitle('Board sync')}>
            Quick Draft
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Meetings on deck" value={stats.total} hint="All scheduled sessions" icon={<CalendarDays size={22} />} />
        <MetricCard label="Upcoming" value={stats.upcoming} hint="Pending and accepted" icon={<Clock3 size={22} />} accentClassName="bg-secondary-50 text-secondary-700" />
        <MetricCard label="Accepted" value={stats.accepted} hint="Confirmed participants" icon={<CalendarDays size={22} />} accentClassName="bg-success-50 text-success-700" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr,1fr]">
        <Card className="overflow-hidden border border-gray-100 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-gray-900">Meeting calendar</h2>
              <p className="text-sm text-gray-500">Click a date to prefill the meeting form.</p>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-auto">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
              height="auto"
              events={calendarEvents}
              dateClick={handleDateClick}
            />
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Create meeting</h2>
            </CardHeader>
            <CardBody>
              <form className="space-y-4" onSubmit={handleAddMeeting}>
                <Input fullWidth label="Meeting title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Quarterly investor update" />
                <Input fullWidth label="Attendee" value={attendee} onChange={(event) => setAttendee(event.target.value)} placeholder="Blue Peak Ventures" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input fullWidth label="Date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value as MeetingStatus)}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 sm:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input fullWidth label="Start time" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
                  <Input fullWidth label="End time" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
                </div>
                <Button fullWidth type="submit">Add meeting</Button>
              </form>
            </CardBody>
          </Card>

          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Upcoming agenda</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{meeting.attendee}</p>
                    </div>
                    <StatusBadge status={meeting.status} />
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    {format(new Date(meeting.start), 'EEE, MMM d')} from {format(new Date(meeting.start), 'p')} to {format(new Date(meeting.end), 'p')}
                  </p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
