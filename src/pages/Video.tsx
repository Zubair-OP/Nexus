import React, { useMemo, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, Phone, PhoneOff, ScreenShare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { PageHero } from '../components/features/PageHero';
import { MetricCard } from '../components/features/MetricCard';
import { Badge } from '../components/ui/Badge';

export const VideoPage: React.FC = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const callStatus = useMemo(() => {
    if (!isInCall) return 'Ready to connect';
    if (isMuted && !isCameraOn) return 'Voice-only privacy mode';
    if (isMuted) return 'Camera live, mic muted';
    if (!isCameraOn) return 'Audio call in progress';
    return 'Live strategy session';
  }, [isCameraOn, isInCall, isMuted]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title="Video Call Room"
        description="A polished mock interface for founder-investor calls, product walkthroughs, and due diligence conversations."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Session state" value={isInCall ? 'In Call' : 'Idle'} hint={callStatus} icon={<Phone size={22} />} />
        <MetricCard label="Microphone" value={isMuted ? 'Muted' : 'Live'} hint="Local device control" icon={isMuted ? <MicOff size={22} /> : <Mic size={22} />} accentClassName="bg-secondary-50 text-secondary-700" />
        <MetricCard label="Camera" value={isCameraOn ? 'On' : 'Off'} hint="Video feed preview" icon={isCameraOn ? <Camera size={22} /> : <CameraOff size={22} />} accentClassName="bg-accent-50 text-accent-700" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr,1fr]">
        <Card className="overflow-hidden border border-gray-100 shadow-sm">
          <CardHeader className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Live room</h2>
              <p className="text-sm text-gray-500">Mock video canvas for investor demo flows.</p>
            </div>
            <Badge variant={isInCall ? 'success' : 'gray'} rounded>
              {isInCall ? 'Connected' : 'Disconnected'}
            </Badge>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="relative flex min-h-[420px] items-center justify-center rounded-3xl bg-black px-6 py-10 text-white">
              <div className="absolute left-6 top-6 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">Demo feed</div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{isInCall ? 'Meeting room is live' : 'Waiting to start call'}</p>
                <p className="mt-3 text-sm text-white/70">
                  {isCameraOn ? 'Your mock camera feed would appear here.' : 'Camera is disabled. Audio-only mode enabled.'}
                </p>
              </div>
              <div className="absolute bottom-6 right-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Call note</p>
                <p className="mt-2 text-sm text-white/80">Series A partner review with live product walkthrough.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setIsInCall(true)} leftIcon={<Phone size={18} />} disabled={isInCall}>Start Call</Button>
              <Button variant="error" onClick={() => setIsInCall(false)} leftIcon={<PhoneOff size={18} />} disabled={!isInCall}>End Call</Button>
              <Button variant="outline" onClick={() => setIsMuted((current) => !current)} leftIcon={isMuted ? <MicOff size={18} /> : <Mic size={18} />}>
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
              <Button variant="outline" onClick={() => setIsCameraOn((current) => !current)} leftIcon={isCameraOn ? <Camera size={18} /> : <CameraOff size={18} />}>
                {isCameraOn ? 'Camera Off' : 'Camera On'}
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Room diagnostics</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">Host status</p>
                <p className="mt-2 text-sm text-gray-500">{callStatus}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">Participants</p>
                <p className="mt-2 text-sm text-gray-500">You, Apex Ventures, counsel observer</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">Screen sharing</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <ScreenShare size={16} />
                  Disabled in this mock flow
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Talking points</h2>
            </CardHeader>
            <CardBody className="space-y-3 text-sm text-gray-600">
              <p className="rounded-2xl bg-primary-50 p-4">Highlight runway, traction, and current fundraising milestones.</p>
              <p className="rounded-2xl bg-secondary-50 p-4">Prepare a short answer for customer retention and expansion revenue.</p>
              <p className="rounded-2xl bg-accent-50 p-4">Close with next-step clarity: data room access and partner meeting timeline.</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
