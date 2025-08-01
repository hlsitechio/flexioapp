import { DashboardLayout } from '@/components/layout';
import { DashboardGrid } from '@/components/DashboardGrid';
import { useState } from 'react';

const Index = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <DashboardLayout title="Dashboard">
      <div className="m-0 p-0">
        <DashboardGrid editMode={editMode} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
