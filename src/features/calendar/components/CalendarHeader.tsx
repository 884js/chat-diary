import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

type CalendarHeaderProps = {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
};

export const CalendarHeader = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  const currentYearMonth = format(currentDate, 'yyyy年M月', { locale: ja });

  return (
    <div className="flex justify-between items-center mb-8">
      <Button
        onClick={onPreviousMonth}
        variant="outline"
        className="flex items-center gap-1 border-slate-200 text-slate-600 hover:bg-ivory-100 hover:text-slate-800 transition-colors"
      >
        <FiArrowLeft className="h-4 w-4" /> 前月
      </Button>
      <h2 className="text-2xl font-medium text-slate-800">
        {currentYearMonth}
      </h2>
      <Button
        onClick={onNextMonth}
        variant="outline"
        className="flex items-center gap-1 border-slate-200 text-slate-600 hover:bg-ivory-100 hover:text-slate-800 transition-colors"
      >
        次月 <FiArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
