import React, { useState } from 'react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 등록 로직을 여기에 추가하세요
    console.log('등록된 정보:', { name, purchaseDate, quantity, notes });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">칫솔 등록</h1>
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
          등록
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
