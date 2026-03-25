import React, { useMemo, useState } from 'react';
import { KeyRound, ShieldCheck, UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageHero } from '../components/features/PageHero';
import { MetricCard } from '../components/features/MetricCard';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PasswordStrengthMeter } from '../components/security/PasswordStrengthMeter';
import { OtpInput } from '../components/security/OtpInput';

type DemoRole = 'investor' | 'entrepreneur';

const rolePanels: Record<DemoRole, { title: string; points: string[] }> = {
  investor: {
    title: 'Investor controls',
    points: [
      'Access portfolio-level payment approvals and diligence documents.',
      'Review startup meeting requests before committing partner time.',
      'Surface extra 2FA prompts for transfer and signing actions.',
    ],
  },
  entrepreneur: {
    title: 'Entrepreneur controls',
    points: [
      'Manage startup documents, investor chats, and outbound scheduling.',
      'Request payment withdrawals with verification checkpoints.',
      'Enable stronger password guidance before sharing the data room.',
    ],
  },
};

export const SecurityPage: React.FC = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [demoRole, setDemoRole] = useState<DemoRole>(user?.role ?? 'entrepreneur');
  const otpCode = useMemo(() => otp.join(''), [otp]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero title="Security Center" description="Stress-test onboarding UX with a stronger password signal, a 6-digit two-factor flow, and role-aware access panels." />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Active role" value={demoRole === 'investor' ? 'Investor' : 'Entrepreneur'} hint="Role-based demo surface" icon={<UserCog size={22} />} />
        <MetricCard label="2FA code" value={otpCode || '------'} hint="Six-digit verification preview" icon={<ShieldCheck size={22} />} accentClassName="bg-secondary-50 text-secondary-700" />
        <MetricCard label="Password input" value={password ? `${password.length} chars` : 'Empty'} hint="Scored with zxcvbn" icon={<KeyRound size={22} />} accentClassName="bg-accent-50 text-accent-700" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Credential health</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input fullWidth type="password" label="Create a stronger password" placeholder="Try a new password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <PasswordStrengthMeter password={password} />
            <Button variant="outline">Save security settings</Button>
          </CardBody>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Two-factor authentication</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-gray-500">Enter the six-digit code sent to the registered device.</p>
            <OtpInput value={otp} onChange={setOtp} />
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              Verification preview: <span className="font-semibold text-gray-900">{otpCode || 'Waiting for input'}</span>
            </div>
            <Button>Verify code</Button>
          </CardBody>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Role-based access panel</h2>
            <p className="text-sm text-gray-500">Switch roles to preview different security guidance.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant={demoRole === 'entrepreneur' ? 'primary' : 'outline'} onClick={() => setDemoRole('entrepreneur')}>Entrepreneur View</Button>
            <Button variant={demoRole === 'investor' ? 'primary' : 'outline'} onClick={() => setDemoRole('investor')}>Investor View</Button>
          </div>
        </CardHeader>
        <CardBody className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-primary-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">{rolePanels[demoRole].title}</p>
            <p className="mt-3 text-sm text-primary-900">Signed in as {user?.name ?? 'Demo User'} with {demoRole}-level access rules.</p>
          </div>
          {rolePanels[demoRole].points.map((point) => (
            <div key={point} className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-600">
              {point}
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};
