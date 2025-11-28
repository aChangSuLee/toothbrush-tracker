import React, { useState } from 'react';
import { Toothbrush } from '../types/toothbrush';

interface ToothbrushFormProps {
  toothbrush?: Toothbrush;
  onSubmit: (data: Toothbrush) => void;
}

const ToothbrushForm: React.FC<ToothbrushFormProps> = ({ toothbrush, onSubmit }) => {
  const [name, setName] = useState(toothbrush?.name || '');
  const [purchaseDate, setPurchaseDate] = useState(
    toothbrush?.purchaseDate.toISOString().split('T')[0] || ''
  );
  const [quantity, setQuantity] = useState(toothbrush?.quantity || 1);
  const [notes, setNotes] = useState(toothbrush?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const replacementDue = new Date(purchaseDate);
    replacementDue.setMonth(replacementDue.getMonth() + 3);
    onSubmit({
      id: toothbrush?.id || new Date().toISOString(),
      name,
      purchaseDate: new Date(purchaseDate),
      quantity,
      replacementDue,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">상품명</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">구매 날짜</label>
        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">수량</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          min="1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">메모</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
      >
        저장
      </button>
    </form>
  );
};

export default ToothbrushForm;
