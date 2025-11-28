// src/pages/DetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ToothbrushForm from '../components/ToothbrushForm';
import { Toothbrush } from '../types/toothbrush';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [toothbrush, setToothbrush] = useState<Toothbrush | null>(null);

  useEffect(() => {
    // 여기에 데이터 로딩 로직을 추가하세요
    // 예: API 호출 또는 localStorage에서 데이터 가져오기
    const fetchToothbrush = async () => {
      // 예시 데이터
      const exampleToothbrush: Toothbrush = {
        id: '1',
        name: 'Example Toothbrush',
        purchaseDate: new Date(),
        quantity: 1,
        replacementDue: new Date(),
        notes: 'Example notes',
      };
      setToothbrush(exampleToothbrush);
    };

    fetchToothbrush();
  }, [id]);

  if (!toothbrush) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">칫솔 상세 정보</h1>
      <ToothbrushForm 
        toothbrush={toothbrush} 
        onSubmit={(updatedToothbrush) => {
          // 업데이트된 칫솔 정보를 처리하는 로직을 여기에 추가하세요
          console.log('업데이트된 칫솔 정보:', updatedToothbrush);
        }} 
      />
    </div>
  );
};

export default DetailPage;