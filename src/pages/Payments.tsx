import React, { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Landmark, Wallet } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PageHero } from '../components/features/PageHero';
import { MetricCard } from '../components/features/MetricCard';
import { StatusBadge } from '../components/features/StatusBadge';

type TransactionStatus = 'completed' | 'processing' | 'failed';
type PaymentAction = 'deposit' | 'withdraw' | 'transfer';

interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: string;
  status: TransactionStatus;
  type: PaymentAction;
}

const initialTransactions: Transaction[] = [
  { id: 'txn-1', sender: 'Nexus Wallet', receiver: 'Apex Ventures Escrow', amount: '$18,500', status: 'completed', type: 'transfer' },
  { id: 'txn-2', sender: 'First Digital Bank', receiver: 'Nexus Wallet', amount: '$42,000', status: 'processing', type: 'deposit' },
  { id: 'txn-3', sender: 'Nexus Wallet', receiver: 'Operations Reserve', amount: '$9,250', status: 'failed', type: 'withdraw' },
];

export const PaymentsPage: React.FC = () => {
  const [walletBalance, setWalletBalance] = useState(128450);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [action, setAction] = useState<PaymentAction>('deposit');
  const [amount, setAmount] = useState('');
  const [counterparty, setCounterparty] = useState('');

  const stats = useMemo(
    () => ({
      volume: transactions.length,
      processing: transactions.filter((transaction) => transaction.status === 'processing').length,
      completed: transactions.filter((transaction) => transaction.status === 'completed').length,
    }),
    [transactions]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!amount.trim() || !counterparty.trim()) return;

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) return;

    setTransactions((currentTransactions) => [
      {
        id: `txn-${currentTransactions.length + 1}`,
        sender: action === 'deposit' ? counterparty : 'Nexus Wallet',
        receiver: action === 'deposit' ? 'Nexus Wallet' : counterparty,
        amount: `$${numericAmount.toLocaleString()}`,
        status: 'processing',
        type: action,
      },
      ...currentTransactions,
    ]);

    if (action === 'deposit') {
      setWalletBalance((currentBalance) => currentBalance + numericAmount);
    } else {
      setWalletBalance((currentBalance) => currentBalance - numericAmount);
    }

    setAmount('');
    setCounterparty('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero title="Payment Dashboard" description="Monitor a mock wallet, review payment flow health, and stage deposit, withdrawal, and transfer actions for your demo." />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Wallet balance" value={`$${walletBalance.toLocaleString()}`} hint="Available demo funds" icon={<Wallet size={22} />} />
        <MetricCard label="Transactions" value={stats.volume.toString()} hint="Across all mock actions" icon={<Landmark size={22} />} accentClassName="bg-secondary-50 text-secondary-700" />
        <MetricCard label="Completed" value={stats.completed.toString()} hint={`${stats.processing} still processing`} icon={<ArrowUpRight size={22} />} accentClassName="bg-success-50 text-success-700" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr,1.5fr]">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Wallet actions</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant={action === 'deposit' ? 'primary' : 'outline'} onClick={() => setAction('deposit')}>Deposit</Button>
              <Button variant={action === 'withdraw' ? 'primary' : 'outline'} onClick={() => setAction('withdraw')}>Withdraw</Button>
              <Button variant={action === 'transfer' ? 'primary' : 'outline'} onClick={() => setAction('transfer')}>Transfer</Button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input fullWidth label="Amount" type="number" min="0" placeholder="25000" value={amount} onChange={(event) => setAmount(event.target.value)} />
              <Input
                fullWidth
                label={action === 'deposit' ? 'Funding source' : 'Recipient'}
                placeholder={action === 'deposit' ? 'First Digital Bank' : 'Apex Ventures Escrow'}
                value={counterparty}
                onChange={(event) => setCounterparty(event.target.value)}
              />
              <Button fullWidth type="submit">Confirm {action}</Button>
            </form>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              This panel is UI-only. Actions update local page state to simulate a realistic payments workflow.
            </div>
          </CardBody>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transaction activity</h2>
              <p className="text-sm text-gray-500">Recent fund movement across the demo wallet.</p>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.2em] text-gray-500">
                  <th className="pb-3 pr-6 font-medium">Type</th>
                  <th className="pb-3 pr-6 font-medium">Sender</th>
                  <th className="pb-3 pr-6 font-medium">Receiver</th>
                  <th className="pb-3 pr-6 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="text-sm text-gray-700">
                    <td className="py-4 pr-6">
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        {transaction.type === 'deposit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        <span className="capitalize">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-6">{transaction.sender}</td>
                    <td className="py-4 pr-6">{transaction.receiver}</td>
                    <td className="py-4 pr-6 font-semibold text-gray-900">{transaction.amount}</td>
                    <td className="py-4">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
