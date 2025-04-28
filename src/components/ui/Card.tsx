export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
      {children}
    </div>
  );
};
