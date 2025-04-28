import { FiArrowLeft } from 'react-icons/fi';
import Container from './Container';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({
  title = 'チャット日記（仮）',
  showBackButton = false,
  onBackClick,
}: HeaderProps) {
  return (
    <header className="bg-background border-b border-border py-4">
      <Container>
        <div className="flex items-center">
          {showBackButton && (
            <button
              type="button"
              onClick={onBackClick}
              className="mr-2 p-1 rounded-full hover:bg-secondary"
              aria-label="戻る"
            >
              <FiArrowLeft />
            </button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </Container>
    </header>
  );
}
