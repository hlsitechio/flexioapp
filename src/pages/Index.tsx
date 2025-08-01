import { DashboardLayout } from '@/components/layout';
import { DashboardGrid } from '@/components/DashboardGrid';
import { useState } from 'react';

const Index = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6">
        <DashboardGrid editMode={editMode} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
