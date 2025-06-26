import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen pt-14">
      <Navbar />
      <HeroSection />
      <section id="features" className="py-12 flex-grow bg-white dark:bg-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-6">Features</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg shadow animate-fade-in">
              <h4 className="font-medium mb-2">Easy Upload</h4>
              <p>Drag and drop your files for quick analysis.</p>
            </div>
            <div className="p-4 rounded-lg shadow animate-fade-in delay-100">
              <h4 className="font-medium mb-2">Fast Results</h4>
              <p>Get instant feedback with our optimized API.</p>
            </div>
            <div className="p-4 rounded-lg shadow animate-fade-in delay-200">
              <h4 className="font-medium mb-2">Secure</h4>
              <p>Your uploads are kept private and deleted after processing.</p>
            </div>
            <div className="p-4 rounded-lg shadow animate-fade-in delay-300">
              <h4 className="font-medium mb-2">Face Highlighting</h4>
              <p>See detected faces outlined directly on your images.</p>
            </div>
            <div className="p-4 rounded-lg shadow animate-fade-in delay-300">
              <h4 className="font-medium mb-2">WAD Checks</h4>
              <p>Identify weapons, alcohol and drugs content instantly.</p>
            </div>
            <div className="p-4 rounded-lg shadow animate-fade-in delay-400">
              <h4 className="font-medium mb-2">Admin Dashboard</h4>
              <p>Monitor usage and manage users with ease.</p>
            </div>
            <div className="p-4 rounded-lg shadow animate-fade-in delay-500">
              <h4 className="font-medium mb-2">Dark Mode</h4>
              <p>Switch themes for a comfortable viewing experience.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-6">About Us</h3>
          <p className="max-w-2xl mx-auto">We leverage advanced AI services from Sightengine to detect manipulated content. Our mission is to help everyone stay safe from misinformation.</p>
        </div>
      </section>
      <section id="contact" className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-6">Contact</h3>
          <p>Reach us at <a href="mailto:support@example.com" className="text-indigo-600 underline">support@example.com</a></p>
        </div>
      </section>
      <section id="faq" className="py-12 bg-gray-50 dark:bg-gray-800 dark:text-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-semibold mb-6 text-center">FAQ</h3>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div>
              <h4 className="font-medium">Is my data stored?</h4>
              <p className="text-sm">Files are deleted after analysis and only results remain.</p>
            </div>
            <div>
              <h4 className="font-medium">How many analyses can I run?</h4>
              <p className="text-sm">Each account has a monthly quota adjustable by the admin.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
