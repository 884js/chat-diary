import type { SettingSection } from '../types';

export function SectionHeader({ title, description }: SettingSection) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
