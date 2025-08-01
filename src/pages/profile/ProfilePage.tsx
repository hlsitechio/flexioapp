import { DashboardLayout } from '@/components/layout';
import { Profile } from './Profile';

export function ProfilePage() {
  return (
    <DashboardLayout 
      title="Profile" 
      description="Update your profile information and preferences"
    >
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid gap-6 md:grid-cols-1 max-w-2xl">
            <Profile />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}