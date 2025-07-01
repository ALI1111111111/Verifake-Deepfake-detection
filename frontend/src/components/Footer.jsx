export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-4 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} Deepfake Detector. All rights reserved.</p>
    </footer>
  );
}
