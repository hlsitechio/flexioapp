import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Habit {
  id: string;
  name: string;
}

interface HabitLog {
  habit_id: string;
  completed_at: string;
}

export function HabitTrackerCollapsed() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);

  const loadData = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: habitsData } = await supabase
        .from('habits')
        .select('id, name')
        .eq('user_id', user.user.id)
        .eq('is_active', true);

      const { data: logsData } = await supabase
        .from('habit_logs')
        .select('habit_id, completed_at')
        .eq('user_id', user.user.id)
        .gte('completed_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

      setHabits(habitsData || []);
      setHabitLogs(logsData || []);
    } catch (error) {
      console.error('Error loading habit data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const completedToday = habits.filter(habit => 
    habitLogs.some(log => log.habit_id === habit.id)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-2 rounded-lg border bg-card text-card-foreground"
    >
      <div className="flex flex-col items-center space-y-1">
        <Target className="h-4 w-4 text-primary" />
        <div className="text-xs font-medium text-center">
          {completedToday}/{habits.length}
        </div>
        <div className="text-[10px] text-muted-foreground text-center">
          Today
        </div>
      </div>
    </motion.div>
  );
}