import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Toothbrush } from '../types/toothbrush';

const ToothbrushList: React.FC = () => {
  const [toothbrushes, setToothbrushes] = useState<Toothbrush[]>([]);

  useEffect(() => {
    // 여기에 데이터 로딩 로직을 추가하세요
    // 예: API 호출 또는 localStorage에서 데이터 가져오기
    const fetchToothbrushes = async () => {
      // 예시 데이터
      const exampleToothbrushes: Toothbrush[] = [
        {
          id: '1',
          name: 'Example Toothbrush 1',
          purchaseDate: new Date(),
          quantity: 1,
          replacementDue: new Date(),
          notes: 'Example notes 1',
        },
        {
          id: '2',
          name: 'Example Toothbrush 2',
          purchaseDate: new Date(),
          quantity: 2,
          replacementDue: new Date(),
          notes: 'Example notes 2',
        },
      ];
      setToothbrushes(exampleToothbrushes);
    };

    fetchToothbrushes();
  }, []);

  return (
    <div>
      {toothbrushes.length === 0 ? (
        <p>등록된 칫솔이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {toothbrushes.map((toothbrush) => (
            <li key={toothbrush.id} className="border p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-bold text-black">{toothbrush.name}</h2>
              <p className="text-black">구매 날짜: {toothbrush.purchaseDate.toDateString()}</p>
              <p className="text-black">수량: {toothbrush.quantity}</p>
              <p className="text-black">교체 예정일: {toothbrush.replacementDue.toDateString()}</p>
              <Link to={`/detail/${toothbrush.id}`} className="text-blue-500 hover:underline">
                상세 보기
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToothbrushList;
