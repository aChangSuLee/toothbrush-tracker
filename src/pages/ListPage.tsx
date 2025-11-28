// src/pages/ListPage.tsx
import React from 'react';
import ToothbrushList from '../components/ToothbrushList';

const ListPage: React.FC = () => {
  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">칫솔 목록</h1>
      <ToothbrushList />
    </div>
  );
};

export default ListPage;