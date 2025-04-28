type Props = {
  size?: 'sm' | 'md' | 'lg';
};

export const Logo = ({ size = 'md' }: Props) => {
  const sizeClass = {
    sm: 'text-xl lg:text-2xl',
    md: 'text-4xl lg:text-5xl',
    lg: 'text-5xl lg:text-7xl',
  };

  return (
    <h1
      className={`font-medium font-mplus bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 ${sizeClass[size]}`}
    >
      <div className="flex items-center gap-2 justify-center">
        チャット日記（仮）
      </div>
    </h1>
  );
};
