import React, { useState } from 'react';

interface Props {
  value: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const walletTypes = ['Personal', 'Business', 'Both'];
const commChannels = ['WhatsApp', 'Telegram', 'Email', 'Phone'];

export default function WalletSetupStep({ value, onChange, onNext, onBack }: Props) {
  const [walletType, setWalletType] = useState(value.walletType || '');
  const [pin, setPin] = useState(value.pin || '');
  const [confirmPin, setConfirmPin] = useState(value.confirmPin || '');
  const [commChannel, setCommChannel] = useState(value.commChannel || '');
  const [agreed, setAgreed] = useState(!!value.agreed);

  const handleNext = () => {
    if (!walletType || !pin || !confirmPin || !commChannel || !agreed) {
      alert('All fields are required and you must agree to terms.');
      return;
    }
    if (pin !== confirmPin) {
      alert('PINs do not match.');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      alert('PIN must be 4 digits.');
      return;
    }
    onChange({ walletType, pin, commChannel, agreed });
    onNext();
  };

  return (
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleNext(); }}>
      <div>
        <label className="block font-medium">Preferred Communication Channel *</label>
        <select className="input" value={commChannel} onChange={e => setCommChannel(e.target.value)} required>
          <option value="">Select</option>
          {commChannels.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-medium">Wallet Type *</label>
        <select className="input" value={walletType} onChange={e => setWalletType(e.target.value)} required>
          <option value="">Select</option>
          {walletTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-medium">Wallet PIN *</label>
        <input className="input" type="password" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} required />
      </div>
      <div>
        <label className="block font-medium">Confirm PIN *</label>
        <input className="input" type="password" maxLength={4} value={confirmPin} onChange={e => setConfirmPin(e.target.value)} required />
      </div>
      <div>
        <label className="inline-flex items-center">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required />
          <span className="ml-2">I agree to the terms and conditions</span>
        </label>
      </div>
      <div className="flex justify-between">
        <button type="button" className="btn" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </form>
  );
}
