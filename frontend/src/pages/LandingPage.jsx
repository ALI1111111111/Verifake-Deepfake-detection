
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen pt-14">
      <Navbar />
      <HeroSection />
      <section id="features" className="py-12 flex-grow bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-semibold mb-6">Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
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
            <div className="p-4 rounded-lg shadow animate-fade-in delay-400">
              <h4 className="font-medium mb-2">WAD Checks</h4>
              <p>Identify weapons, alcohol and drugs content instantly.</p>
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
      <Footer />
    </div>
  );
}
