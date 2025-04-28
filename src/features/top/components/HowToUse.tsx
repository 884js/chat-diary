import { FiInfo, FiMessageSquare, FiSettings } from 'react-icons/fi';

export const HowToUse = () => {
  return (
    <div className="">
      <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-8">
        チャット日記（仮）の機能と使い方
      </h2>

      {/* 基本的な使い方 */}
      <div className="mb-10">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiInfo className="mr-2 text-indigo-600" /> 基本的な使い方
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-indigo-500">
            <div className="text-indigo-600 font-bold text-lg mb-2">01</div>
            <h4 className="text-gray-800 font-bold text-lg mb-2">ログイン</h4>
            <p className="text-gray-600 text-sm">
              X（Twitter）アカウントで簡単にログインできます
              <br />
              ※本名や電話番号などの個人情報は一切取得しません
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-indigo-500">
            <div className="text-indigo-600 font-bold text-lg mb-2">02</div>
            <h4 className="text-gray-800 font-bold text-lg mb-2">日記を作成</h4>
            <p className="text-gray-600 text-sm">日記を作成します。</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-indigo-500">
            <div className="text-indigo-600 font-bold text-lg mb-2">03</div>
            <h4 className="text-gray-800 font-bold text-lg mb-2">日記を探す</h4>
            <p className="text-gray-600 text-sm">日記を探す</p>
          </div>
        </div>
      </div>

      {/* 主要機能の紹介 */}
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiSettings className="mr-2 text-indigo-600" /> 便利な機能
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <FiMessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <h4 className="text-gray-800 font-bold">チャット日記（仮）</h4>
            </div>
            <p className="text-gray-600 text-sm">チャット日記（仮）</p>
          </div>
        </div>
      </div>
    </div>
  );
};
