import React from 'react';

interface Props {
  value: any;
  onBack: () => void;
}

export default function ReviewSubmitStep({ value, onBack }: Props) {
  const handleSubmit = () => {
    // TODO: Submit to backend
    alert('Submitted!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Review Your Details</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
      <div className="flex justify-between">
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
