import { useNavigate } from "react-router-dom";
import { BookOutlined, RightOutlined, HeartOutlined } from "@ant-design/icons";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BookOutlined className="text-blue-500 dark:text-blue-400 text-4xl" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Manajemen Koleksi Buku
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Kelola koleksi buku Anda dengan mudah. Tambahkan, edit, dan organisasikan buku favorit Anda dengan kategori dan ulasan.
          </p>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <FeatureCard 
                icon={<BookFilled />} 
                title="Koleksi Buku"
                description="Simpan dan organisasikan semua buku favorit Anda dalam satu tempat"
              />
              <FeatureCard 
                icon={<TagFilled />} 
                title="Kategori"
                description="Buat kategori kustom untuk mengelompokkan buku berdasarkan genre atau tema"
              />
              <FeatureCard 
                icon={<StarFilled />} 
                title="Ulasan"
                description="Tambahkan ulasan pribadi untuk setiap buku dalam koleksi Anda"
              />
            </div>
            
            <button
              onClick={() => navigate("/books")}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center mx-auto"
            >
              AYO TELUSURI <RightOutlined className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center gap-1">
        Dibuat dengan <HeartOutlined className="text-red-500" /> oleh Winaldi
      </footer>
    </div>
  );
};

const BookFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
  </svg>
);

const TagFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39.92 3.31 0l4.801-4.801a2.25 2.25 0 000-3.182L12.18 3.327a3 3 0 00-2.12-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
  </svg>
);

const StarFilled = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-blue-500 dark:text-blue-400 mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
};

export default Home;