import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <section className="py-12 flex-grow bg-white">
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
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
