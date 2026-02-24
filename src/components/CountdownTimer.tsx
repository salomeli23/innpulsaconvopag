import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
}

export function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
        <Clock size={16} />
        <span>Cerrada</span>
      </div>
    );
  }

  if (timeLeft.days === 0 && timeLeft.hours < 24) {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
        <Clock size={16} className="animate-pulse" />
        <span className="tabular-nums">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  if (timeLeft.days <= 2) {
    return (
      <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
        <Clock size={16} className="animate-pulse" />
        <span className="tabular-nums">
          {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
      <Clock size={16} />
      <span>{timeLeft.days} días restantes</span>
    </div>
  );
}
